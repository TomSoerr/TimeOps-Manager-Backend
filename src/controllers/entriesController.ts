import expressAsyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import {
  createEntryForUser,
  updateEntryForUser,
  deleteAllEntriesForUser,
  getEntriesForUser,
} from '../models/userModel';
import {
  getRunningEntryForUser,
  startRunningEntryForUser,
  deleteRunningEntryForUser,
} from '../models/runningModel';

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
      res
        .status(400)
        .json({ message: 'Error creating entry', errors: errors.array() });
      return;
    }

    const userId = req.userId; // Retrieved from the auth middleware
    const { name, startTimeUtc, endTimeUtc, tagId } = req.body;

    // TODO implement check if entry overlap
    // errorData.errors?.[0]?.msg

    if (
      await createEntryForUser(userId, {
        name,
        startTimeUtc,
        endTimeUtc,
        tagId,
      })
    ) {
      res.status(400).json({
        message: 'Overlapping with over entries',
        errors: [{ msg: 'overlapping with other entries' }],
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

    if (
      await updateEntryForUser(userId, entryId, {
        name,
        startTimeUtc,
        endTimeUtc,
        tagId,
      })
    ) {
      res.status(400).json({
        message: 'Overlapping with over entries or invalid id',
        errors: [{ msg: 'overlapping with other entries or invalid id' }],
      });
      return;
    }

    res.status(200).json({ message: 'Entry updated' });

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
    const userId = req.userId;
    const runningEntry = await getRunningEntryForUser(userId);

    if (!runningEntry) {
      res
        .status(200)
        .json({ message: 'No running entry found', runningEntry: null });
      return;
    }

    res.status(200).json({
      message: 'Running entry fetched successfully',
      runningEntry,
    });
  }),

  /**
   * Start a new running entry.
   *
   * @param req - The Express request object.
   * @param res - The Express response object.
   */
  startRunningEntry: expressAsyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        message: 'Error starting running entry',
        errors: errors.array(),
      });
      return;
    }

    const userId = req.userId;
    const { name, startTimeUtc, tagId } = req.body;

    const runningEntry = await startRunningEntryForUser(userId, {
      name,
      startTimeUtc,
      tagId,
    });

    res.status(201).json({
      message: 'Running entry started',
      runningEntry,
    });

    // Notify clients of the change
    sseController.triggerEventForUser(userId);
  }),

  /**
   * Delete the currently running entry without completing it.
   *
   * @param req - The Express request object.
   * @param res - The Express response object.
   */
  deleteRunningEntry: expressAsyncHandler(async (req, res) => {
    const userId = req.userId;
    const deleted = await deleteRunningEntryForUser(userId);

    if (!deleted) {
      res.status(404).json({ message: 'No running entry found' });
      return;
    }

    res.status(200).json({ message: 'Running entry deleted successfully' });

    // Notify clients of the change
    sseController.triggerEventForUser(userId);
  }),

  deleteAllEntries: expressAsyncHandler(async (req, res) => {
    const userId = req.userId;
    await deleteAllEntriesForUser(userId);

    sseController.triggerEventForUser(userId);
  }),
};

export default entriesController;
