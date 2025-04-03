import expressAsyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import {
  getRunningEntryForUser,
  startRunningEntryForUser,
  deleteRunningEntryForUser,
} from '../models/runningModel';
import sseController from './sseController';

/**
 * Controller for managing running entries.
 *
 * This controller provides endpoints for managing the currently running entry,
 * including starting, retrieving, and deleting running entries.
 *
 * @category Controllers
 */
const runningEntriesController = {
  /**
   * Get the currently running entry, if available.
   *
   * This function retrieves the currently running entry for the authenticated user.
   * If no running entry exists, it returns a message indicating so.
   *
   * @param req - The Express request object. Assumes `userId` is set by the authentication middleware.
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
   * This function validates the request body and starts a new running entry
   * for the authenticated user. If a running entry already exists, it is replaced.
   *
   * @param req - The Express request object. Assumes `userId` is set by the authentication middleware.
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
   * This function deletes the currently running entry for the authenticated user
   * without creating a completed entry.
   *
   * @param req - The Express request object. Assumes `userId` is set by the authentication middleware.
   * @param res - The Express response object.
   */
  deleteRunningEntry: expressAsyncHandler(async (req, res) => {
    const userId = req.userId;
    const deleted = await deleteRunningEntryForUser(userId);

    if (!deleted) {
      res
        .status(200)
        .json({ message: 'No running entry found', count: deleted });
      return;
    }

    res
      .status(200)
      .json({ message: 'Running entry deleted successfully', count: deleted });

    // Notify clients of the change
    sseController.triggerEventForUser(userId);
  }),
};

export default runningEntriesController;
