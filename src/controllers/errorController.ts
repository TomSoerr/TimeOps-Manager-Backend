import { RequestHandler, ErrorRequestHandler } from 'express';
import CustomError from '../errors/customError';
import NotFoundError from '../errors/notFoundError';

/**
 * Controller for handling errors.
 *
 * This controller provides middleware for handling 404 Not Found errors
 * and general application errors. It ensures consistent error responses
 * and logs errors for debugging purposes.
 *
 * @category Controllers
 */
const errorController = {
  /**
   * Middleware to handle 404 Not Found errors.
   *
   * This middleware is triggered when no matching route is found.
   * It throws a `NotFoundError` to indicate that the requested resource
   * could not be found.
   *
   * @param req - The Express request object.
   * @param res - The Express response object.
   */
  notFound: ((req, res) => {
    throw new NotFoundError('Resource not found');
  }) as RequestHandler,

  /**
   * Middleware to handle application errors.
   *
   * This middleware catches errors thrown in the application and sends
   * a JSON response with the error details. If the error is an instance
   * of `CustomError`, its status code is used; otherwise, a 500 Internal
   * Server Error is returned. In development mode, the stack trace is
   * included in the response for debugging purposes.
   *
   * @param err - The error object.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @param next - The next middleware function.
   */
  handleError: (async (err, req, res, next) => {
    console.error(err);

    const statusCode = err instanceof CustomError ? err.statusCode : 500;

    res.status(statusCode).json({
      status: 'error',
      statusCode,
      message: err.message || 'Internal server error',
      // Only include stack trace in development
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }) as ErrorRequestHandler,
};

export default errorController;
