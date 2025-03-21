import { Router } from 'express';
import dbController from '../controllers/dbController';

/**
 * The `dbRouter` handles routes related to database operations,
 * including importing, exporting, and seeding the database.
 *
 * @category Routers
 */
const dbRouter = Router();

dbRouter.post('/', dbController.importDb); // import csv (toggle) and json (tom)
dbRouter.get('/', dbController.exportDb);
dbRouter.get('/seed', dbController.seedDb);

export default dbRouter;
