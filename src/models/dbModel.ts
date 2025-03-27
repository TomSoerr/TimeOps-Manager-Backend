import csv from 'csv-parser';
import { Readable } from 'stream';
import prisma from '../client';
import { Color } from '@prisma/client';
import { findOverlappingEntry } from './userModel';

export interface ImportData {
  name: string;
  startTimeUtc: number;
  endTimeUtc: number;
  tag: {
    name: string;
    color: string;
  };
}

/**
 * Parse CSV content into structured data
 *
 * @param content - The CSV content as a string
 * @param timezoneOffset - The timezone offset in minutes
 * @returns Parsed entries with tag information
 */
export async function parseCSV(
  content: string,
  timezoneOffset: number,
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    const stream = Readable.from(content);

    stream
      .pipe(csv())
      .on('data', (data) => {
        // Extract project name as tag name
        const tagName = data['Project'] || 'No Project';

        const name = data['Description'] || 'No Description';

        const startDate = data['Start date'];
        const startTime = data['Start time'];
        const endDate = data['End date'];
        const endTime = data['End time'];

        const startTimeUtc = dateTimeToUtcTimestamp(
          startDate,
          startTime,
          timezoneOffset,
        );
        const endTimeUtc = dateTimeToUtcTimestamp(
          endDate,
          endTime,
          timezoneOffset,
        );

        if (startTimeUtc && endTimeUtc) {
          results.push({
            name,
            startTimeUtc,
            endTimeUtc,
            tag: {
              name: tagName,
              color: 'slate',
            },
          });
        }
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error: any) => {
        reject(error);
      });
  });
}

/**
 * Convert date and time strings to UTC timestamp
 *
 * @param dateStr - Date string in YYYY-MM-DD format
 * @param timeStr - Time string in HH:MM:SS format
 * @param timezoneOffset - The timezone offset in seconds
 * @returns UTC timestamp in seconds
 */
function dateTimeToUtcTimestamp(
  dateStr: string,
  timeStr: string,
  timezoneOffset: number,
): number | null {
  if (!dateStr || !timeStr) return null;

  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);

    // create date in UTC because exported Toggle date is in current timezone
    const date = new Date(
      Date.UTC(year, month - 1, day, hours, minutes, seconds),
    );

    // then remove the clients time zone
    return Math.floor(date.getTime() / 1000) + timezoneOffset;
  } catch (error) {
    console.error('Error parsing date/time:', error);
    return null;
  }
}

/**
 * Process the imported data by creating tags and entries
 *
 * @param userId - The ID of the user importing the data
 * @param data - The parsed import data
 * @returns Summary of the import operation
 */
export async function processImportData(userId: number, data: ImportData[]) {
  const tagMap = new Map<string, number>(); // Map to track tag names to IDs
  const createdTags: any[] = [];
  const createdEntries: any[] = [];
  const errors: string[] = [];

  try {
    const existingTags = await prisma.tag.findMany({
      where: {
        userId: userId,
      },
    });

    for (const tag of existingTags) {
      tagMap.set(tag.name, tag.id);
    }

    const uniqueTags = new Map<string, string>();
    for (const item of data) {
      if (item.tag && item.tag.name) {
        uniqueTags.set(item.tag.name, item.tag.color);
      }
    }

    for (const [tagName, color] of uniqueTags.entries()) {
      try {
        if (tagMap.has(tagName)) {
          continue;
        }

        const newTag = await prisma.tag.create({
          data: {
            name: tagName,
            color: color as Color,
            userId: userId,
          },
        });

        createdTags.push(newTag);
        tagMap.set(tagName, newTag.id);
      } catch (error: any) {
        console.error(`Error creating tag ${tagName}:`, error);
        errors.push(`Failed to create tag: ${tagName} - ${error.message}`);
      }
    }

    for (const item of data) {
      try {
        const tagName = item.tag?.name || 'No Project';
        const tagId = tagMap.get(tagName);

        if (!tagId) {
          errors.push(`No tag ID found for: ${tagName}`);
          continue;
        }

        const overlap = await findOverlappingEntry(
          userId,
          item.startTimeUtc,
          item.endTimeUtc,
        );

        if (overlap) {
          errors.push(
            `Entry "${item.name}" overlaps with existing entry "${overlap.name}" (${new Date(overlap.startTimeUtc * 1000).toLocaleString()} - ${new Date(overlap.endTimeUtc * 1000).toLocaleString()})`,
          );
          continue;
        }

        const entry = await prisma.entry.create({
          data: {
            name: item.name,
            startTimeUtc: item.startTimeUtc,
            endTimeUtc: item.endTimeUtc,
            tagId: tagId,
            userId: userId,
          },
        });

        createdEntries.push(entry);
      } catch (error: any) {
        console.error(`Error creating entry "${item.name}":`, error);
        errors.push(
          `Failed to create entry: "${item.name}" - ${error.message}`,
        );
      }
    }

    return {
      tagsCreated: createdTags.length,
      entriesCreated: createdEntries.length,
      errors: errors.length > 0 ? errors : null,
    };
  } catch (error: any) {
    console.error('Error processing import data:', error);
    throw new Error(`Import processing failed: ${error.message}`);
  }
}

/**
 * Export all entries for a user in the ImportData format
 *
 * @param userId - The ID of the user whose entries to export
 * @returns An array of entries formatted as ImportData
 */
export async function exportEntriesForUser(
  userId: number,
): Promise<ImportData[]> {
  try {
    const entries = await prisma.entry.findMany({
      where: {
        userId,
      },
      include: {
        tag: true, // Include the related tag
      },
      orderBy: {
        startTimeUtc: 'asc',
      },
    });

    const exportData: ImportData[] = entries.map((entry) => ({
      name: entry.name,
      startTimeUtc: entry.startTimeUtc,
      endTimeUtc: entry.endTimeUtc,
      tag: {
        name: entry.tag.name,
        color: entry.tag.color,
      },
    }));

    return exportData;
  } catch (error: any) {
    console.error('Error exporting entries:', error);
    throw new Error(`Export failed: ${error.message}`);
  }
}
