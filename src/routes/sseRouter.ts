import { Router } from 'express';
import sseController from '../controllers/sseController';

/**
 * The `sseRouter` handles routes for Server-Sent Events (SSE).
 *
 * This router provides an endpoint for establishing an SSE connection,
 * allowing clients to receive real-time updates from the server.
 *
 * @category Routers
 */
const sseRouter = Router();

/**
 * GET /api/v1/events
 *
 * Establishes an SSE connection for the authenticated user.
 * This endpoint allows the client to receive real-time updates
 * via Server-Sent Events.
 */
sseRouter.get('/', sseController.sse);

export default sseRouter;
