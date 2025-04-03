import { Router } from 'express';
import analyticsController from '../controllers/analyticsController';

/**
 * The `analyticsRouter` handles routes related to analytics data.
 *
 * This router provides endpoints for retrieving analytics data, such as
 * daily, weekly, and monthly summaries, as well as tag-based summaries.
 *
 * @category Routers
 */
const analyticsRouter = Router();

/**
 * GET /api/v1/analytics
 *
 * Retrieves analytics data for the authenticated user.
 * The analytics data includes summaries of time entries grouped by day,
 * week, month, and tags.
 */
analyticsRouter.get('/', analyticsController.getAnalytics);

export default analyticsRouter;
