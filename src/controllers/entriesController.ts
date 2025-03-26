import expressAsyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import {
  createEntryForUser,
  updateEntryForUser,
  deleteAllEntriesForUser,
  getEntriesForUser,
} from '../models/userModel';
import sseController from './sseController';

/**
 * Controller for managing entries.
 *
 * @category Controllers
 */
const entriesController = {
  /**
   * Get entries for the last 3 months.
   *
   * @param req - The Express request object.
   * @param res - The Express response object.
   */
  getEntries: expressAsyncHandler(async (req, res) => {
    const entries = await getEntriesForUser(req.userId);
    res.status(200).json({ message: 'Entries fetched successfully', entries });
  }),

  /**
   * Create a new entry.
   *
   * @param req - The Express request object.
   * @param res - The Express response object.
   */
  createEntry: expressAsyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: 'Error creating entry', errors });
      return;
    }

    const userId = req.userId; // Retrieved from the auth middleware
    const { name, startTimeUtc, endTimeUtc, tagId } = req.body;

    // TODO implement check if entry overlap
    // errorData.errors?.errors?.[0]?.msg

    await createEntryForUser(userId, {
      name,
      startTimeUtc,
      endTimeUtc,
      tagId,
    });

    res.status(201).json({ message: 'Entry created' });

    // Trigger an SSE event to notify all clients of the user
    sseController.triggerEventForUser(userId);
  }),

  /**
   * Update an entry.
   *
   * @param req - The Express request object.
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

    // TODO implement check if entry overlap
    // errorData.errors?.errors?.[0]?.msg

    const updatedEntry = await updateEntryForUser(userId, entryId, {
      name,
      startTimeUtc,
      endTimeUtc,
      tagId,
    });

    if (!updatedEntry) {
      res.status(404).json({
        message: 'Entry not found or you do not have permission to update it',
      });
      return;
    }

    res.status(200).json({ message: 'Entry updated', entry: updatedEntry });

    // Trigger an SSE event to notify all clients of the user
    sseController.triggerEventForUser(userId);
  }),

  /**
   * Get the currently running entry, if available.
   *
   * @param req - The Express request object.
   * @param res - The Express response object.
   */
  getRunningEntry: expressAsyncHandler(async (req, res) => {
    res.json({ message: 'Get running entry' });
  }),

  /**
   * Start a new running entry.
   *
   * @param req - The Express request object.
   * @param res - The Express response object.
   */
  startRunningEntry: expressAsyncHandler(async (req, res) => {
    res.status(201).json({ message: 'Running entry started' });
  }),

  /**
   * End the currently running entry.
   *
   * @param req - The Express request object.
   * @param res - The Express response object.
   */
  endRunningEntry: expressAsyncHandler(async (req, res) => {
    res.json({ message: 'Running entry ended' });
  }),

  deleteAllEntries: expressAsyncHandler(async (req, res) => {
    const userId = req.userId;
    await deleteAllEntriesForUser(userId);

    sseController.triggerEventForUser(userId);
  }),
};

export default entriesController;
