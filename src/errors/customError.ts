/**
 * Base class for custom errors in the application.
 *
 * @category Errors
 */
export default class CustomError extends Error {
  /**
   * The HTTP status code associated with the error.
   */
  public statusCode: number;

  /**
   * Creates a new CustomError.
   * @param message The error message.
   * @param statusCode The HTTP status code.
   */
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}
