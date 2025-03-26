import prisma from '../client';
import { Color } from '@prisma/client';

/**
 * Retrieves the user ID associated with the provided API token.
 *
 * @param apiToken - The API token of the user
 */
export async function getUserIdFromToken(
  apiToken: string,
): Promise<number | null> {
  const user = await prisma.user.findUnique({
    where: { apiToken },
    select: { id: true },
  });
  return user?.id || null;
}

/**
 * Creates a new entry for the specified user.
 *
 * @param userId - The ID of the user creating the entry.
 * @param entryData - The data for the new entry.
 * @returns The created entry.
 */
export async function createEntryForUser(
  userId: number,
  entryData: {
    name: string;
    startTimeUtc: number;
    endTimeUtc: number;
    tagId: number;
  },
) {
  return await prisma.entry.create({
    data: {
      ...entryData,
      userId,
    },
  });
}

/**
 * Retrieves all entries for the specified user.
 *
 * @param userId - The ID of the user whose entries are to be fetched.
 * @returns A list of entries for the user.
 */
export async function getEntriesForUser(userId: number) {
  return await prisma.entry.findMany({
    where: { userId },
    orderBy: { startTimeUtc: 'desc' },
  });
}

/**
 * Retrieves all tags for the specified user.
 *
 * @param userId - The ID of the user whose tags are to be fetched.
 * @returns A list of tags for the user.
 */
export async function getTagsForUser(userId: number) {
  return await prisma.tag.findMany({
    where: { userId },
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
 * Updates an existing entry for the specified user.
 * Only allows updating entries that belong to the user.
 *
 * @param userId - The ID of the user updating the entry.
 * @param entryId - The ID of the entry to update.
 * @param entryData - The updated data for the entry.
 * @returns The updated entry or null if the entry doesn't exist or doesn't belong to the user.
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
  // First check if the entry exists and belongs to the user
  const entry = await prisma.entry.findFirst({
    where: {
      id: entryId,
      userId: userId,
    },
  });

  if (!entry) {
    return false;
  }

  // Update the entry
  await prisma.entry.update({
    where: {
      id: entryId,
    },
    data: entryData,
  });

  return true;
}

/**
 * Creates a new tag for the specified user.
 *
 * @param userId - The ID of the user creating the tag.
 * @param tagData - The data for the new tag.
 * @returns The created tag.
 */
export async function createTagForUser(
  userId: number,
  tagData: {
    name: string;
    color?: Color;
  },
) {
  return await prisma.tag.create({
    data: {
      ...tagData,
      userId,
    },
  });
}

/**
 * Updates an existing tag for the specified user.
 * Only allows updating tags that belong to the user.
 *
 * @param userId - The ID of the user updating the tag.
 * @param tagId - The ID of the tag to update.
 * @param tagData - The updated data for the tag.
 * @returns The updated tag or null if the tag doesn't exist or doesn't belong to the user.
 */
export async function updateTagForUser(
  userId: number,
  tagId: number,
  tagData: {
    name?: string;
    color?: Color;
  },
) {
  // First check if the tag exists and belongs to the user
  const tag = await prisma.tag.findFirst({
    where: {
      id: tagId,
      userId: userId,
    },
  });

  if (!tag) {
    return null;
  }

  // Update the tag
  return await prisma.tag.update({
    where: {
      id: tagId,
    },
    data: tagData,
  });
}
