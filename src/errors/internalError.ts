import CustomError from "./customError";

export default class InternalError extends CustomError {
  constructor(message: string) {
    super(message, 500);
  }
}
