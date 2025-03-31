import { Router } from 'express';
import entriesController from '../controllers/entriesController';
import validateEntry from '../middleware/entryValidator';
import validateRunningEntry from '../middleware/runningEntryValidator';

/**
 * The `entriesRouter` handles all routes related to time entries.
 * It defines endpoints for retrieving, creating, and updating entries,
 * as well as managing the currently running entry.
 *
 * @category Routers
 */
const entriesRouter = Router();

// Entries Management
entriesRouter.get('/', entriesController.getEntries);
entriesRouter.post('/', validateEntry, entriesController.createEntry);
entriesRouter.put('/:id', validateEntry, entriesController.updateEntry);
entriesRouter.delete('/', entriesController.deleteAllEntries);

// Running Entry
entriesRouter.get('/running', entriesController.getRunningEntry);
entriesRouter.post(
  '/running',
  validateRunningEntry,
  entriesController.startRunningEntry,
);
entriesRouter.delete('/running', entriesController.deleteRunningEntry);

export default entriesRouter;
