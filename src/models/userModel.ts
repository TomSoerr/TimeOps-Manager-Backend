import prisma from '../client';

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
