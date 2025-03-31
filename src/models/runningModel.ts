import prisma from '../client';

/**
 * Get the currently running entry for a user
 *
 * @param userId - The ID of the user
 * @returns The running entry or null if there isn't one
 */
export async function getRunningEntryForUser(userId: number) {
  return await prisma.runningEntry.findUnique({
    where: { userId },
  });
}

/**
 * Start a new running entry for a user
 * If the user already has a running entry, it will be replaced
 *
 * @param userId - The ID of the user
 * @param entryData - The data for the new running entry
 * @returns The created running entry
 */
export async function startRunningEntryForUser(
  userId: number,
  entryData: {
    name: string;
    startTimeUtc: number;
    tagId: number;
  },
) {
  // First delete any existing running entry for this user
  await prisma.runningEntry.deleteMany({
    where: { userId },
  });

  // Then create the new running entry
  return await prisma.runningEntry.create({
    data: {
      ...entryData,
      userId,
    },
    include: { tag: true },
  });
}

/**
 * Delete the running entry for a user without creating a completed entry
 *
 * @param userId - The ID of the user
 * @returns True if an entry was deleted, false if no entry existed
 */
export async function deleteRunningEntryForUser(
  userId: number,
): Promise<boolean> {
  const result = await prisma.runningEntry.deleteMany({
    where: { userId },
  });

  return result.count > 0;
}
