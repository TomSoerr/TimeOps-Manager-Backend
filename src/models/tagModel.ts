import prisma from '../client';
import { Color } from '@prisma/client';

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
