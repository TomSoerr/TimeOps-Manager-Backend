import { Router } from 'express';
import userController from '../controllers/userController';

/**
 * The `userRouter` handles routes related to user management.
 * It provides a endpoint for user creation via a token.
 *
 * @category Routers
 */
const userRouter = Router();

userRouter.get('/', userController.newUser);

export default userRouter;
