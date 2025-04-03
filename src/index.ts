/**
 * # TimeOps Manager Backend
 *
 * Time tracking REST API built with Express.js and TypeScript.
 *
 * ## Features
 * - Entry management (create, read, update)
 * - Tag management
 * - Running entry tracking
 * - Analytics
 * - Database export/import
 * - Server-Sent Events for real-time updates
 *
 * @packageDocumentation
 */

/**
 * @category App
 */
export { default as app } from './app';

/**
 * @category Database
 */
export { default as client } from './client';

/**
 * @category Controllers
 */
export { default as entriesController } from './controllers/entriesController';
export { default as tagsController } from './controllers/tagsController';
export { default as analyticsController } from './controllers/analyticsController';
export { default as dbController } from './controllers/dbController';
export { default as userController } from './controllers/userController';
export { default as sseController } from './controllers/sseController';
export { default as errorController } from './controllers/errorController';

/**
 * @category Routers
 */
export { default as apiRouter } from './routes/apiRouter';
export { default as entriesRouter } from './routes/entriesRouter';
export { default as tagsRouter } from './routes/tagsRouter';
export { default as analyticsRouter } from './routes/analyticsRouter';
export { default as dbRouter } from './routes/dbRouter';
export { default as userRouter } from './routes/userRouter';
export { default as sseRouter } from './routes/sseRouter';

/**
 * @category Middleware
 */
export { default as validateEntry } from './middleware/entryValidator';
export { default as validateRunningEntry } from './middleware/runningEntryValidator';
export { default as validateTag } from './middleware/tagValidator';
export { default as authMiddleware } from './middleware/authMiddleware';

/**
 * @category Models
 */
export * from './models/userModel';
export * from './models/entryModel';
export * from './models/tagModel';
export * from './models/runningModel';
export * from './models/dbModel';
export * from './models/analyticsModel';

/**
 * @category Errors
 */
export { default as CustomError } from './errors/customError';
export { default as InternalError } from './errors/internalError';
export { default as NotFoundError } from './errors/notFoundError';
