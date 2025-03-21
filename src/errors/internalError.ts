import CustomError from './customError';

/**
 * Represents an internal server error (HTTP 500).
 * @category Errors
 */
export default class InternalError extends CustomError {
  /**
   * Creates a new InternalError.
   * @param message The error message.
   */
  constructor(message: string) {
    super(message, 500);
  }
}
