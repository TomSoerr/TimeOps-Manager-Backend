import { Router } from 'express';
import sseController from '../controllers/sseController';

/**
 * The `sseRouter` handles routes for Server-Sent Events (SSE).
 * It provides an endpoint for establishing an SSE connection.
 *
 * @category Routers
 */
const sseRouter = Router();

sseRouter.get('/', sseController.sse);

export default sseRouter;
