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
 * @category Utilities
 */
export { default as app } from './app';

export { default as client } from './client';

export { default as entriesController } from './controllers/entriesController';
export { default as tagsController } from './controllers/tagsController';
export { default as analyticsController } from './controllers/analyticsController';
export { default as dbController } from './controllers/dbController';
export { default as userController } from './controllers/userController';
export { default as sseController } from './controllers/sseController';
export { default as errorController } from './controllers/errorController';

export { default as apiRouter } from './routes/apiRouter';
export { default as entriesRouter } from './routes/entriesRouter';
export { default as tagsRouter } from './routes/tagsRouter';
export { default as analyticsRouter } from './routes/analyticsRouter';
export { default as dbRouter } from './routes/dbRouter';
export { default as userRouter } from './routes/userRouter';
export { default as sseRouter } from './routes/sseRouter';

export { default as validateEntry } from './validators/entryValidator';

export { default as CustomError } from './errors/customError';
export { default as InternalError } from './errors/internalError';
export { default as NotFoundError } from './errors/notFoundError';
