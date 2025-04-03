import prisma from '../client';

/**
 * Retrieves the currently running entry for a user.
 *
 * This function fetches the running entry associated with the specified user.
 * If no running entry exists, it returns `null`.
 *
 * @param userId - The ID of the user.
 * @returns The running entry or `null` if there isn't one.
 */
export async function getRunningEntryForUser(userId: number) {
  return await prisma.runningEntry.findUnique({
    where: { userId },
  });
}

/**
 * Starts a new running entry for a user.
 *
 * This function deletes any existing running entry for the user and creates
 * a new one with the provided data. The new running entry is associated with
 * the specified user.
 *
 * @param userId - The ID of the user.
 * @param entryData - The data for the new running entry.
 * @returns The created running entry.
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
 * Deletes the running entry for a user without creating a completed entry.
 *
 * This function removes the running entry associated with the specified user
 * from the database. It does not create a completed entry.
 *
 * @param userId - The ID of the user.
 * @returns The number of deleted items (0 or 1).
 */
export async function deleteRunningEntryForUser(
  userId: number,
): Promise<number> {
  const result = await prisma.runningEntry.deleteMany({
    where: { userId },
  });

  return result.count;
}
