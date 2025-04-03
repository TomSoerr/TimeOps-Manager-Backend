import expressAsyncHandler from 'express-async-handler';
import {
  getTagsForUser,
  createTagForUser,
  updateTagForUser,
} from '../models/tagModel';
import { validationResult } from 'express-validator';
import sseController from './sseController';

/**
 * Controller for managing tags.
 *
 * This controller provides endpoints for managing tags, including
 * retrieving, creating, and updating tags for the authenticated user.
 *
 * @category Controllers
 */
const tagsController = {
  /**
   * Get all tags for the authenticated user.
   *
   * This function retrieves all tags associated with the authenticated user.
   *
   * @param req - The Express request object. Assumes `userId` is set by the authentication middleware.
   * @param res - The Express response object.
   */
  getTags: expressAsyncHandler(async (req, res) => {
    const tags = await getTagsForUser(req.userId);
    res.status(200).json({ message: 'Tags fetched successfully', tags });
  }),

  /**
   * Create a new tag for the authenticated user.
   *
   * This function validates the request body and creates a new tag
   * for the authenticated user. If validation fails, it returns an error.
   *
   * @param req - The Express request object. Assumes `userId` is set by the authentication middleware.
   * @param res - The Express response object.
   */
  createTag: expressAsyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(400)
        .json({ message: 'Error creating tag', errors: errors.array() });
      return;
    }

    const userId = req.userId;
    const { name, color } = req.body;

    const newTag = await createTagForUser(userId, { name, color });

    res.status(201).json({
      message: 'Tag created successfully',
      tag: newTag,
    });

    // Trigger an SSE event to notify all clients of the user
    sseController.triggerEventForUser(userId);
  }),

  /**
   * Update an existing tag for the authenticated user.
   *
   * This function validates the request body and updates an existing tag
   * for the authenticated user. If the tag does not exist or the user does
   * not have permission to update it, an error is returned.
   *
   * @param req - The Express request object. Assumes `userId` is set by the authentication middleware.
   * @param res - The Express response object.
   */
  updateTag: expressAsyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(400)
        .json({ message: 'Error updating tag', errors: errors.array() });
      return;
    }

    const userId = req.userId;
    const tagId = parseInt(req.params.id, 10);

    if (isNaN(tagId)) {
      res.status(400).json({ message: 'Invalid tag ID' });
      return;
    }

    const { name, color } = req.body;

    const updatedTag = await updateTagForUser(userId, tagId, { name, color });

    if (!updatedTag) {
      res.status(404).json({
        message: 'Tag not found or you do not have permission to update it',
      });
      return;
    }

    res.status(200).json({
      message: 'Tag updated successfully',
      tag: updatedTag,
    });

    // Trigger an SSE event to notify all clients of the user
    sseController.triggerEventForUser(userId);
  }),
};

export default tagsController;
