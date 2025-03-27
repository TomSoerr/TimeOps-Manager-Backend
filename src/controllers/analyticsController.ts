import expressAsyncHandler from 'express-async-handler';
import { getAnalyticsData } from '../models/analyticsModel';

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
    // Get UTC offset (in minutes) from header
    const utcOffsetHeader = req.headers['x-utc-offset'];
    const utcOffset =
      utcOffsetHeader ? parseInt(utcOffsetHeader.toString(), 10) : 0;
    if (isNaN(utcOffset)) {
      res.status(400).json({
        message: 'Invalid UTC offset provided in X-UTC-Offset header',
      });
      return;
    }

    // Assume userId is set from authentication middleware
    const userId = req.userId;
    console.log('before calculation');
    const analytics = await getAnalyticsData(userId, utcOffset);
    console.log('after calculation');
    res.json(analytics);
  }),
};

export default dbController;
