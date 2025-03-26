import expressAsyncHandler from 'express-async-handler';
import {
  getTagsForUser,
  createTagForUser,
  updateTagForUser,
} from '../models/userModel';
import { validationResult } from 'express-validator';
import sseController from './sseController';

/**
 * Controller for managing tags.
 *
 * @category Controllers
 */
const tagsController = {
  /**
   * Get all tags.
   *
   * @param req - The Express request object.
   * @param res - The Express response object.
   *
   */
  getTags: expressAsyncHandler(async (req, res) => {
    const tags = await getTagsForUser(req.userId);
    res.status(200).json({ message: 'Tags fetched successfully', tags });
  }),

  /**
   * Create a new tag.
   *
   * @param req - The Express request object.
   * @param res - The Express response object.
   *
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
   * Update a tag.
   *
   * @param req - The Express request object.
   * @param res - The Express response object.
   *
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
