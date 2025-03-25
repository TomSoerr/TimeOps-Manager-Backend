import expressAsyncHandler from 'express-async-handler';
import { getTagsForUser } from '../models/userModel';

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
    res.status(201).json({ message: 'Tag created' });
  }),

  /**
   * Update a tag.
   *
   * @param req - The Express request object.
   * @param res - The Express response object.
   *
   
   */
  updateTag: expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    res.json({ message: `Tag ${id} updated` });
  }),
};

export default tagsController;
