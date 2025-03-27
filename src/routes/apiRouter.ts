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
 * Mounts the following sub-routers:
 * - entries
 * - tags
 * - db
 * - user
 * - events
 *
 * The API router itself is mounted to `/api/v1`
 *
 * @category Routers
 */
const apiRouter: Router = Router();

// Parse JSON body for all routes EXCEPT /db
apiRouter.use((req, res, next) => {
  // Skip JSON parsing for the /db route
  if (req.path.startsWith('/db')) {
    return next();
  }
  express.json()(req, res, next);
});

// Apply authentication middleware
apiRouter.use(authMiddleware);

// Mount sub-routers
apiRouter.use('/entries', entriesRouter);
apiRouter.use('/tags', tagsRouter);
apiRouter.use('/analytics', analyticsRouter);
apiRouter.use('/db', dbRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/events', sseRouter);

export default apiRouter;
