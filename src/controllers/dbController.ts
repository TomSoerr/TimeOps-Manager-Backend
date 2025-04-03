import expressAsyncHandler from 'express-async-handler';
import { parseCSV } from '../models/dbModel';
import { processImportData } from '../models/dbModel';
import { exportEntriesForUser } from '../models/dbModel';

/**
 * Controller for managing database operations.
 *
 * This controller provides endpoints for importing and exporting database data.
 * It supports importing data from JSON or CSV files and exporting data in JSON format.
 *
 * @category Controllers
 */
const dbController = {
  /**
   * Import data from a CSV or JSON file into the database.
   *
   * This function validates the uploaded file, parses its content, and processes
   * the data to create database entries. It supports both JSON and CSV formats.
   *
   * @param req - The Express request object. Assumes `userId` is set by the authentication middleware.
   * @param res - The Express response object.
   *
   * @returns A JSON response indicating the success or failure of the import operation.
   */
  importDb: expressAsyncHandler(async (req, res) => {
    // Check if a file was uploaded
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    try {
      // Read the file content
      const fileContent = req.file.buffer.toString();

      // Extract and validate the UTC offset from the request headers
      const utcOffsetHeader = req.headers['x-utc-offset'];
      const utcOffset =
        utcOffsetHeader ? parseInt(utcOffsetHeader.toString(), 10) : 0;

      if (isNaN(utcOffset)) {
        res.status(400).json({
          message: 'Invalid UTC offset provided in X-UTC-Offset header',
        });
        return;
      }

      // Parse the file content based on its MIME type
      let parsedData;
      if (req.file.mimetype === 'application/json') {
        parsedData = JSON.parse(fileContent);
      } else if (req.file.mimetype === 'text/csv') {
        parsedData = await parseCSV(fileContent, utcOffset);
      } else {
        res.status(400).json({
          message: 'Unsupported file type. Please upload JSON or CSV.',
        });
        return;
      }

      // Process the parsed data and import it into the database
      await processImportData(req.userId, parsedData);

      // Respond with success
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
   * Export database entries to a JSON file.
   *
   * This function retrieves all entries for the authenticated user and exports
   * them in JSON format. The exported file is sent as a downloadable attachment.
   *
   * @param req - The Express request object. Assumes `userId` is set by the authentication middleware.
   * @param res - The Express response object.
   *
   * @returns A JSON file containing the exported entries or an error message.
   */
  exportDb: expressAsyncHandler(async (req, res) => {
    try {
      // Retrieve the user ID from the request
      const userId = req.userId;

      // Determine the export format (default to JSON)
      const format = req.query.format?.toString()?.toLowerCase() || 'json';

      // Fetch the entries for the user
      const entriesData = await exportEntriesForUser(userId);

      // Handle the case where no entries are found
      if (entriesData.length === 0) {
        res.status(404).json({
          message: 'No entries found to export',
        });
        return;
      }

      // Export the data in the requested format
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
