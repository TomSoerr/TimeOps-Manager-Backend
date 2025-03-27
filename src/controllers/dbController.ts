import expressAsyncHandler from 'express-async-handler';
import { parseCSV } from '../models/dbModel';
import { processImportData } from '../models/dbModel';
import { exportEntriesForUser } from '../models/dbModel';

/**
 * Controller for managing database operations.
 *
 * @category Controllers
 */
const dbController = {
  /**
   * Import CSV or JSON file to the database.
   *
   * @param req - The Express request object.
   * @param res - The Express response object.
   *
   */
  importDb: expressAsyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    try {
      const fileContent = req.file.buffer.toString();

      const utcOffsetHeader = req.headers['x-utc-offset'];
      const utcOffset =
        utcOffsetHeader ? parseInt(utcOffsetHeader.toString(), 10) : 0;

      if (isNaN(utcOffset)) {
        res.status(400).json({
          message: 'Invalid UTC offset provided in X-UTC-Offset header',
        });
        return;
      }

      let parsedData;
      if (req.file.mimetype === 'application/json') {
        parsedData = JSON.parse(fileContent);
      } else if (req.file.mimetype === 'text/csv') {
        // Use a CSV parser library or your own logic to parse CSV
        parsedData = await parseCSV(fileContent, utcOffset);
      } else {
        res.status(400).json({
          message: 'Unsupported file type. Please upload JSON or CSV.',
        });
        return;
      }

      await processImportData(req.userId, parsedData);

      res.status(200).json({
        message: 'Database import successful',
        entriesImported: parsedData.length,
      });
    } catch (error) {
      console.error('Error importing database:', error);
      res.status(500).json({
        message: 'Error importing database',
      });
    }
  }),

  /**
   * Export the database to JSON.
   *
   * @param req - The Express request object.
   * @param res - The Express response object.
   *
   */
  exportDb: expressAsyncHandler(async (req, res) => {
    try {
      const userId = req.userId;

      const format = req.query.format?.toString()?.toLowerCase() || 'json';

      const entriesData = await exportEntriesForUser(userId);

      if (entriesData.length === 0) {
        res.status(404).json({
          message: 'No entries found to export',
        });
        return;
      }

      if (format === 'json') {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="timeops-export-${new Date().toISOString().slice(0, 10)}.json"`,
        );

        res.json(entriesData);
      } else {
        res.status(400).json({
          message: `Unsupported export format: ${format}. Supported formats: json`,
        });
      }
    } catch (error: any) {
      console.error('Error exporting database:', error);
      res.status(500).json({
        message: 'Error exporting database',
        error: error.message,
      });
    }
  }),
};

export default dbController;
