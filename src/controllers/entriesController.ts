import expressAsyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import {
  createEntryForUser,
  updateEntryForUser,
  deleteAllEntriesForUser,
  getEntriesForUser,
} from '../models/entryModel';
import sseController from './sseController';

/**
 * Controller for managing entries.
 *
 * This controller provides endpoints for managing time entries, including
 * creating, updating, deleting, and retrieving entries.
 *
 * @category Controllers
 */
const entriesController = {
  /**
   * Get entries for the last 3 months.
   *
   * This function retrieves all time entries for the authenticated user
   * within the last 3 months. The entries are sorted in descending order
   * by their start time.
   *
   * @param req - The Express request object. Assumes `userId` is set by the authentication middleware.
   * @param res - The Express response object.
   */
  getEntries: expressAsyncHandler(async (req, res) => {
    const entries = await getEntriesForUser(req.userId);
    res.status(200).json({ message: 'Entries fetched successfully', entries });
  }),

  /**
   * Create a new entry.
   *
   * This function validates the request body, checks for overlapping entries,
   * and creates a new time entry for the authenticated user.
   *
   * @param req - The Express request object. Assumes `userId` is set by the authentication middleware.
   * @param res - The Express response object.
   */
  createEntry: expressAsyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(400)
        .json({ message: 'Error creating entry', errors: errors.array() });
      return;
    }

    const userId = req.userId;
    const { name, startTimeUtc, endTimeUtc, tagId } = req.body;

    if (
      await createEntryForUser(userId, {
        name,
        startTimeUtc,
        endTimeUtc,
        tagId,
      })
    ) {
      res.status(400).json({
        message: 'Overlapping with other entries',
        errors: [{ msg: 'Overlapping with other entries' }],
      });
      return;
    }

    res.status(201).json({ message: 'Entry created' });

    // Trigger an SSE event to notify all clients of the user
    sseController.triggerEventForUser(userId);
  }),

  /**
   * Update an entry.
   *
   * This function validates the request body, checks for overlapping entries,
   * and updates an existing time entry for the authenticated user.
   *
   * @param req - The Express request object. Assumes `userId` is set by the authentication middleware.
   * @param res - The Express response object.
   */
  updateEntry: expressAsyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(400)
        .json({ message: 'Error updating entry', errors: errors.array() });
      return;
    }

    const userId = req.userId;
    const entryId = parseInt(req.params.id, 10);

    if (isNaN(entryId)) {
      res.status(400).json({ message: 'Invalid entry ID' });
      return;
    }

    const { name, startTimeUtc, endTimeUtc, tagId } = req.body;

    if (
      await updateEntryForUser(userId, entryId, {
        name,
        startTimeUtc,
        endTimeUtc,
        tagId,
      })
    ) {
      res.status(400).json({
        message: 'Overlapping with other entries or invalid ID',
        errors: [{ msg: 'Overlapping with other entries or invalid ID' }],
      });
      return;
    }

    res.status(200).json({ message: 'Entry updated' });

    // Trigger an SSE event to notify all clients of the user
    sseController.triggerEventForUser(userId);
  }),

  /**
   * Delete all entries for the authenticated user.
   *
   * This function deletes all time entries for the authenticated user.
   * It also triggers an SSE event to notify clients of the change.
   *
   * @param req - The Express request object. Assumes `userId` is set by the authentication middleware.
   * @param res - The Express response object.
   */
  deleteAllEntries: expressAsyncHandler(async (req, res) => {
    const userId = req.userId;
    await deleteAllEntriesForUser(userId);

    sseController.triggerEventForUser(userId);
  }),
};

export default entriesController;
