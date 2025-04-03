import { Router } from 'express';
import express from 'express';
import authMiddleware from '../middleware/authMiddleware';
import entriesRouter from './entriesRouter';
import tagsRouter from './tagsRouter';
import analyticsRouter from './analyticsRouter';
import dbRouter from './dbRouter';
import userRouter from './userRouter';
import sseRouter from './sseRouter';

/**
 * Main API router for the application.
 *
 * This router serves as the entry point for all API routes. It mounts
 * sub-routers for different features, such as entries, tags, analytics,
 * database operations, user management, and Server-Sent Events (SSE).
 *
 * The API router itself is mounted to `/api/v1`.
 *
 * @category Routers
 */
const apiRouter: Router = Router();

/**
 * Middleware to parse JSON bodies for all routes except `/db`.
 *
 * The `/db` route is excluded because it handles file uploads, which
 * require a different parsing mechanism (e.g., `multer`).
 */
apiRouter.use((req, res, next) => {
  if (req.path.startsWith('/db')) {
    return next();
  }
  express.json()(req, res, next);
});

/**
 * Middleware to apply authentication to all routes.
 *
 * This middleware ensures that only authenticated users can access
 * the API routes. The authentication logic is handled by the
 * `authMiddleware`.
 */
apiRouter.use(authMiddleware);

/**
 * Mount sub-routers for different features.
 *
 * - `/entries`: Routes for managing time entries.
 * - `/tags`: Routes for managing tags.
 * - `/analytics`: Routes for retrieving analytics data.
 * - `/db`: Routes for database import/export operations.
 * - `/user`: Routes for user management.
 * - `/events`: Routes for Server-Sent Events (SSE).
 */
apiRouter.use('/entries', entriesRouter);
apiRouter.use('/tags', tagsRouter);
apiRouter.use('/analytics', analyticsRouter);
apiRouter.use('/db', dbRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/events', sseRouter);

export default apiRouter;
