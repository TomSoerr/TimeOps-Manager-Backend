import { Router } from 'express';
import userController from '../controllers/userController';

/**
 * The `userRouter` handles routes related to user management.
 *
 * This router provides an endpoint for creating a new user. The user creation
 * process generates a unique API token and assigns a default "No Project" tag
 * to the user.
 *
 * @category Routers
 */
const userRouter = Router();

/**
 * GET /api/v1/user
 *
 * Creates a new user.
 * This endpoint generates a unique API token for the user and assigns
 * a default "No Project" tag. The response includes the user's ID and API token.
 */
userRouter.get('/', userController.newUser);

export default userRouter;
