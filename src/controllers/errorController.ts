import { RequestHandler, ErrorRequestHandler } from 'express';
import CustomError from '../errors/customError';
import NotFoundError from '../errors/notFoundError';

/**
 * Controller for handling errors.
 *
 * @category Controllers
 */
const errorController = {
  /**
   * Middleware to handle 404 Not Found errors.
   *
   
   */
  notFound: ((req, res) => {
    throw new NotFoundError('Resource not found');
  }) as RequestHandler,

  /**
   * Middleware to handle application errors.
   *
   
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
