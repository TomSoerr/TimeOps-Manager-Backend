import { Router } from 'express';
import dbController from '../controllers/dbController';
import multer from 'multer';

/**
 * The `dbRouter` handles routes related to database operations,
 * including importing, exporting, and seeding the database.
 *
 * This router provides endpoints for uploading files (e.g., CSV or JSON)
 * to import data into the database and exporting data for backup or analysis.
 *
 * @category Routers
 */
const dbRouter = Router();

/**
 * Middleware for handling file uploads.
 *
 * This middleware uses `multer` to process uploaded files in memory.
 * It limits the file size to 5 MB.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

/**
 * POST /api/v1/db
 *
 * Endpoint for importing data into the database.
 * This route accepts a file upload (CSV or JSON) and processes the data
 * to create database entries.
 */
dbRouter.post('/', upload.single('file'), dbController.importDb);

/**
 * GET /api/v1/db
 *
 * Endpoint for exporting data from the database.
 * This route retrieves all entries for the authenticated user and
 * exports them in JSON format.
 */
dbRouter.get('/', dbController.exportDb);

export default dbRouter;
