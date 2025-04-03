import expressAsyncHandler from 'express-async-handler';
import crypto from 'crypto';
import prisma from '../client';

/**
 * Controller for managing users.
 *
 * This controller provides endpoints for user-related operations,
 * such as creating a new user.
 *
 * @category Controllers
 */
const userController = {
  /**
   * Create a new user.
   *
   * This function generates a unique API token for the user, creates a new user
   * in the database, and assigns a default "No Project" tag to the user.
   *
   * @param req - The Express request object.
   * @param res - The Express response object.
   *
   * @returns A JSON response containing the created user's ID and API token.
   */
  newUser: expressAsyncHandler(async (req, res) => {
    // Generate a unique API token
    const apiToken = crypto.randomBytes(32).toString('hex');

    // Create the user in the database with a default "No Project" tag
    const user = await prisma.user.create({
      data: {
        apiToken,
        tags: {
          create: {
            name: 'No Project',
            color: 'slate',
          },
        },
      },
    });

    // Return the created user and API token
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        apiToken: user.apiToken,
      },
    });

    // Log the creation of a new user (useful for debugging)
    console.log('New user created');
  }),
};

export default userController;
