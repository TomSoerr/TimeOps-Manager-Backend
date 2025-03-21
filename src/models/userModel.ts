import prisma from '../client';

/**
 * Retrieves the user ID associated with the provided API token.
 *
 * @category Helpers
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
