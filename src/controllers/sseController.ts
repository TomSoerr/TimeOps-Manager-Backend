import expressAsyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import prisma from '../client'; // Import Prisma client

const clients: Map<number, Response[]> = new Map();

const sseController = {
  sse: expressAsyncHandler(async (req: Request, res: Response) => {
    const apiToken = req.headers.authorization?.split(' ')[1];
    if (!apiToken) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Find the userId based on the apiToken
    const userId = await getUserIdFromToken(apiToken); // Updated to use async
    if (!userId) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Add the response to the clients map
    if (!clients.has(userId)) {
      clients.set(userId, []);
    }
    clients.get(userId)?.push(res);

    // Handle client disconnect
    req.on('close', () => {
      const userClients = clients.get(userId) || [];
      clients.set(
        userId,
        userClients.filter((client) => client !== res),
      );
    });
  }),

  triggerEventForUser(userId: number): void {
    const userClients = clients.get(userId);
    if (userClients) {
      userClients.forEach((client) => {
        client.write(`event: data-update\n`);
        client.write(`data: {}\n\n`); // Send an empty payload
      });
    }
  },
};

/**
 * Retrieves the user ID associated with the provided API token.
 *
 * @category Helpers
 */
async function getUserIdFromToken(apiToken: string): Promise<number | null> {
  const user = await prisma.user.findUnique({
    where: { apiToken },
    select: { id: true },
  });
  return user?.id || null;
}

export default sseController;
