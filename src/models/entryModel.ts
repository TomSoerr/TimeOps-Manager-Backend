import prisma from '../client';
import { SECONDS_PER_MONTH } from './analyticsModel';

/**
 * Retrieves all entries for the specified user.
 *
 * @param userId - The ID of the user whose entries are to be fetched.
 * @returns A list of entries for the user.
 */
export async function getEntriesForUser(userId: number) {
  const cutOff = Date.now() / 1000 - SECONDS_PER_MONTH * 3; // limit to 3 months
  return await prisma.entry.findMany({
    where: {
      userId,
      startTimeUtc: { gte: cutOff },
    },
    orderBy: { startTimeUtc: 'desc' },
  });
}

/**
 * Deletes all entries for the specified user.
 *
 * @param userId - The ID of the user whose entries are to be deleted.
 */
export async function deleteAllEntriesForUser(userId: number): Promise<void> {
  await prisma.entry.deleteMany({
    where: { userId },
  });
}

/**
 * Creates a new entry for the specified user.
 *
 * @param userId - The ID of the user creating the entry.
 * @param entryData - The data for the new entry.
 * @returns A boolean indicating whether the entry overlaps with existing entries.
 */
export async function createEntryForUser(
  userId: number,
  entryData: {
    name: string;
    startTimeUtc: number;
    endTimeUtc: number;
    tagId: number;
  },
): Promise<boolean> {
  // Check for overlapping entries
  const overlap = await findOverlappingEntry(
    userId,
    entryData.startTimeUtc,
    entryData.endTimeUtc,
  );

  if (overlap) {
    return true;
  }

  // No overlaps found, create the entry
  await prisma.entry.create({
    data: {
      ...entryData,
      userId,
    },
  });

  return false;
}

/**
 * Updates an existing entry for the specified user.
 * Only allows updating entries that belong to the user.
 *
 * @param userId - The ID of the user updating the entry.
 * @param entryId - The ID of the entry to update.
 * @param entryData - The updated data for the entry.
 * @returns A boolean indicating whether the update overlaps with existing entries.
 */
export async function updateEntryForUser(
  userId: number,
  entryId: number,
  entryData: {
    name?: string;
    startTimeUtc?: number;
    endTimeUtc?: number;
    tagId?: number;
  },
): Promise<boolean> {
  const existingEntry = await prisma.entry.findFirst({
    where: {
      id: entryId,
      userId: userId,
    },
  });

  if (!existingEntry) {
    return true;
  }

  // If updating time fields, check for overlaps
  if (
    entryData.startTimeUtc !== undefined ||
    entryData.endTimeUtc !== undefined
  ) {
    const startTimeUtc = entryData.startTimeUtc ?? existingEntry.startTimeUtc;
    const endTimeUtc = entryData.endTimeUtc ?? existingEntry.endTimeUtc;

    const overlap = await findOverlappingEntry(
      userId,
      startTimeUtc,
      endTimeUtc,
      entryId, // Exclude the current entry from the overlap check
    );

    if (overlap) {
      return true;
    }
  }

  // No overlaps found, update the entry
  await prisma.entry.update({
    where: { id: entryId },
    data: entryData,
  });

  return false;
}

/**
 * Checks if a proposed time entry overlaps with any existing entries for the user.
 *
 * @param userId - The ID of the user.
 * @param startTimeUtc - The start time of the proposed entry.
 * @param endTimeUtc - The end time of the proposed entry.
 * @param excludeEntryId - Optional entry ID to exclude from checking (for updates).
 * @returns The overlapping entry if found, null otherwise.
 */
export async function findOverlappingEntry(
  userId: number,
  startTimeUtc: number,
  endTimeUtc: number,
  excludeEntryId?: number,
) {
  // Find any entries where:
  // 1. Entry's start time is between the new entry's start and end times, OR
  // 2. Entry's end time is between the new entry's start and end times, OR
  // 3. New entry is completely contained within an existing entry
  return await prisma.entry.findFirst({
    where: {
      userId,
      id: excludeEntryId ? { not: excludeEntryId } : undefined,
      OR: [
        // Entry start time falls within the new time range
        { startTimeUtc: { gte: startTimeUtc, lt: endTimeUtc } },
        // Entry end time falls within the new time range
        { endTimeUtc: { gt: startTimeUtc, lte: endTimeUtc } },
        // New entry is contained within the existing entry
        {
          AND: [
            { startTimeUtc: { lte: startTimeUtc } },
            { endTimeUtc: { gte: endTimeUtc } },
          ],
        },
      ],
    },
  });
}
