import expressAsyncHandler from 'express-async-handler';
import { getAnalyticsData } from '../models/analyticsModel';

/**
 * Controller for managing analytics-related operations.
 *
 * This controller provides endpoints for retrieving analytics data
 * such as daily, weekly, and monthly summaries, as well as tag-based summaries.
 *
 * @category Controllers
 */
const analyticsController = {
  /**
   * Retrieves analytics data for the authenticated user.
   *
   * This function extracts the UTC offset from the request headers,
   * validates it, and fetches analytics data for the user. The analytics
   * data includes summaries of time entries grouped by day, week, month,
   * and tags.
   *
   * @param req - The Express request object. Assumes `userId` is set by the authentication middleware.
   * @param res - The Express response object.
   *
   * @returns A JSON response containing the analytics data or an error message.
   */
  getAnalytics: expressAsyncHandler(async (req, res) => {
    // Extract UTC offset (in minutes) from the request header
    const utcOffsetHeader = req.headers['x-utc-offset'];
    const utcOffset =
      utcOffsetHeader ? parseInt(utcOffsetHeader.toString(), 10) : 0;

    // Validate the UTC offset
    if (isNaN(utcOffset)) {
      res.status(400).json({
        message: 'Invalid UTC offset provided in X-UTC-Offset header',
      });
      return;
    }

    // Assume `userId` is set by the authentication middleware
    const userId = req.userId;

    const analytics = await getAnalyticsData(userId, utcOffset);

    // Respond with the analytics data
    res.json(analytics);
  }),
};

export default analyticsController;
