import expressAsyncHandler from 'express-async-handler';
import { Request, Response } from 'express';

/**
 * A map to store active Server-Sent Events (SSE) clients.
 * The key is the user ID, and the value is an array of active `Response` objects for that user.
 */
const clients: Map<number, Response[]> = new Map();

/**
 * Controller for handling Server-Sent Events (SSE) connections and events.
 *
 * This controller provides methods to establish SSE connections and trigger events
 * for specific users. It ensures that active clients are managed efficiently and
 * disconnected clients are cleaned up.
 */
const sseController = {
  /**
   * Handles the establishment of an SSE connection for a client.
   *
   * This method authenticates the client using the provided API token, sets up the SSE headers,
   * and adds the client's response object to the active clients map. It also handles client
   * disconnection by removing the response object from the map.
   *
   * @param req - The HTTP request object. Assumes `userId` is set by the authentication middleware.
   * @param res - The HTTP response object.
   */
  sse: expressAsyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId;

    // Set headers required for establishing an SSE connection
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.write('\n'); // Required for the onopen handler in the client

    // Add the client's response object to the active clients map
    if (!clients.has(userId)) {
      console.log(`userId ${userId} added a client`);
      clients.set(userId, []);
    }
    clients.get(userId)?.push(res);

    // Handle client disconnection and clean up the response object
    req.on('close', () => {
      const userClients = clients.get(userId) || [];
      clients.set(
        userId,
        userClients.filter((client) => client !== res),
      );
    });
  }),

  /**
   * Triggers an SSE event for a specific user.
   *
   * This method sends an `event: data-update` message to all active SSE clients
   * associated with the specified user ID. If no clients are connected for the user,
   * the method does nothing.
   *
   * @param userId - The ID of the user for whom the event should be triggered.
   */
  triggerEventForUser(userId: number): void {
    console.info('SSE event triggered');

    const userClients = clients.get(userId);
    if (userClients) {
      userClients.forEach((client) => {
        client.write(`event: data-update\ndata: {}\n\n`);
      });
    }
  },
};

export default sseController;
