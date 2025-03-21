import { Router } from 'express';
import analyticsController from '../controllers/analyticsController';

/**
 * The `analyticsRouter` handles routes related to analytics data.
 * It provides endpoints for retrieving analytics and generating analytics PDFs.
 *
 * @category Routers
 */
const analyticsRouter = Router();

analyticsRouter.get('/', analyticsController.getAnalytics);
analyticsRouter.get('/', analyticsController.getAnalyticsPdf);

export default analyticsRouter;
