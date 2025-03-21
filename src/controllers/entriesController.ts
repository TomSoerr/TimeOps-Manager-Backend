import expressAsyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import { createEntryForUser } from '../models/userModel';
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
    res.json({ message: 'Get entries for last 3 months' });
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

    const { name, startTimeUtc, endTimeUtc, tagId } = req.body;
    const userId = req.userId; // Retrieved from the auth middleware

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    try {
      const newEntry = await createEntryForUser(userId, {
        name,
        startTimeUtc,
        endTimeUtc,
        tagId,
      });

      // Trigger an SSE event to notify all clients of the user
      sseController.triggerEventForUser(userId);

      res.status(201).json({ message: 'Entry created', entry: newEntry });
    } catch (error) {
      res.status(500).json({ message: 'Error creating entry', error });
    }
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
        .json({ message: `Error updating entry ${req.params?.id}`, errors });
      return;
    }

    const { id } = req.params;
    res.json({ message: `Entry ${id} updated` });
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

  /**
   * Serve the NFC webpage.
   *
   * @param req - The Express request object.
   * @param res - The Express response object.
   */
  getNfcPage: expressAsyncHandler(async (req, res) => {
    res.send('NFC Page HTML');
  }),
};

export default entriesController;
