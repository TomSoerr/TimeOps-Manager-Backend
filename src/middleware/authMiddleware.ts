import { Request, Response, NextFunction } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { getUserIdFromToken } from '../models/userModel';

/**
 * Extend the Express Request interface to include custom properties.
 *
 * This extension adds a `userId` property to the `Request` object,
 * which is used to store the authenticated user's ID.
 */
declare module 'express-serve-static-core' {
  interface Request {
    /**
     * The ID of the authenticated user.
     */
    userId: number;
  }
}

/**
 * Middleware to authenticate users based on the API token.
 *
 * This middleware checks the `Authorization` header for a valid API token,
 * retrieves the associated user ID, and attaches it to the `Request` object.
 * If the token is invalid or missing, it responds with a 401 Unauthorized error.
 * The `/user` route is excluded from authentication to allow user creation.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function.
 */
const authMiddleware = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Skip authentication for the user creation route
    if (req.path.startsWith('/user')) {
      return next();
    }

    // Extract the API token from the Authorization header
    const apiToken = req.headers.authorization?.split(' ')[1];
    if (!apiToken) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Retrieve the user ID associated with the API token
    const userId = await getUserIdFromToken(apiToken);
    if (!userId) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    // Attach the userId to the request object for downstream use
    req.userId = userId;

    // Proceed to the next middleware or route handler
    next();
  },
);

export default authMiddleware;
