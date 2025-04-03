import { Router } from 'express';
import entriesController from '../controllers/entriesController';
import validateEntry from '../middleware/entryValidator';
import validateRunningEntry from '../middleware/runningEntryValidator';
import runningEntriesController from '../controllers/runningEntriesController';

/**
 * The `entriesRouter` handles all routes related to time entries.
 * It defines endpoints for retrieving, creating, and updating entries,
 * as well as managing the currently running entry.
 *
 * @category Routers
 */
const entriesRouter = Router();

/**
 * GET /api/v1/entries
 *
 * Retrieves all time entries for the authenticated user.
 * The entries are limited to the last 3 months and sorted in descending order.
 */
entriesRouter.get('/', entriesController.getEntries);

/**
 * POST /api/v1/entries
 *
 * Creates a new time entry for the authenticated user.
 * The request body is validated to ensure proper formatting and data integrity.
 */
entriesRouter.post('/', validateEntry, entriesController.createEntry);

/**
 * PUT /api/v1/entries/:id
 *
 * Updates an existing time entry for the authenticated user.
 * The request body is validated, and overlapping entries are checked.
 */
entriesRouter.put('/:id', validateEntry, entriesController.updateEntry);

/**
 * DELETE /api/v1/entries
 *
 * Deletes all time entries for the authenticated user.
 * This operation removes all entries and triggers an SSE event.
 */
entriesRouter.delete('/', entriesController.deleteAllEntries);

/**
 * GET /api/v1/entries/running
 *
 * Retrieves the currently running entry for the authenticated user.
 * If no running entry exists, a message indicating so is returned.
 */
entriesRouter.get('/running', runningEntriesController.getRunningEntry);

/**
 * POST /api/v1/entries/running
 *
 * Starts a new running entry for the authenticated user.
 * The request body is validated, and any existing running entry is replaced.
 */
entriesRouter.post(
  '/running',
  validateRunningEntry,
  runningEntriesController.startRunningEntry,
);

/**
 * DELETE /api/v1/entries/running
 *
 * Deletes the currently running entry for the authenticated user.
 * This operation does not create a completed entry.
 */
entriesRouter.delete('/running', runningEntriesController.deleteRunningEntry);

export default entriesRouter;
