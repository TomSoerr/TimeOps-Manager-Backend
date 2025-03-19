import CustomError from "./customError";

export default class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, 404);
  }
}
