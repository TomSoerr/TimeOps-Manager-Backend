import { Router } from 'express';
import dbController from '../controllers/dbController';
import multer from 'multer';

/**
 * The `dbRouter` handles routes related to database operations,
 * including importing, exporting, and seeding the database.
 *
 * @category Routers
 */
const dbRouter = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

dbRouter.post('/', upload.single('file'), dbController.importDb);
dbRouter.get('/', dbController.exportDb);

export default dbRouter;
