import { Request, Response, NextFunction } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { getUserIdFromToken } from '../models/userModel';

/**
 * Extend the Express Request interface to include custom properties.
 */
declare module 'express-serve-static-core' {
  interface Request {
    userId: number;
  }
}

/**
 * Middleware to authenticate users based on the API token.
 * Skips authentication for user generation route
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function.
 */
const authMiddleware = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api/v1/user')) {
      return next(); // Skip authentication for user generation route
    }

    const apiToken = req.headers.authorization?.split(' ')[1];
    if (!apiToken) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const userId = await getUserIdFromToken(apiToken);
    if (!userId) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    // Attach the userId to the request object for downstream use
    req.userId = userId;

    next();
  },
);

export default authMiddleware;
