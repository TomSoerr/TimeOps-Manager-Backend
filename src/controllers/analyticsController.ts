import expressAsyncHandler from 'express-async-handler';
import InternalError from '../errors/internalError';

/**
 * Controller for managing analytics.
 *
 * @category Controllers
 */
const dbController = {
  /**
   * Get analytics data as JSON.
   *
   * @param req - The Express request object.
   * @param res - The Express response object.
   *
   
   */
  getAnalytics: expressAsyncHandler(async (req, res) => {
    res.json({ message: 'Imported CSV/JSON to DB' });
  }),

  /**
   * Get analytics data as a PDF report.
   *
   * @param req - The Express request object.
   * @param res - The Express response object.
   *
   
   */
  getAnalyticsPdf: expressAsyncHandler(async (req, res) => {
    try {
      const pdfPath = '/path/to/your/generated/report.pdf';

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="analytics-report.pdf"',
      );

      res.sendFile(pdfPath, { root: process.cwd() });
    } catch (error) {
      throw new InternalError(`Error generating PDF: ${error}`);
    }
  }),
};

export default dbController;
