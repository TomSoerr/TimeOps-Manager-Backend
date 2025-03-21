import CustomError from './customError';

/**
 * Represents a "Not Found" error (HTTP 404).
 * @category Errors
 */
export default class NotFoundError extends CustomError {
  /**
   * Creates a new NotFoundError.
   * @param message The error message.
   */
  constructor(message: string) {
    super(message, 404);
  }
}
