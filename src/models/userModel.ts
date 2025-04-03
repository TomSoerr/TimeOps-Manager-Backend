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
