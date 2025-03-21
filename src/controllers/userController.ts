import expressAsyncHandler from 'express-async-handler';
import crypto from 'crypto';
import prisma from '../client';

/**
 * Controller for managing users.
 *
 * @category Controllers
 */
const userController = {
  /**
   * Create a new user.
   *
   * @param req - The Express request object.
   * @param res - The Express response object.
   *

   */
  newUser: expressAsyncHandler(async (req, res) => {
    // Generate a unique API token
    const apiToken = crypto.randomBytes(32).toString('hex');

    // Create a new user in the database
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

    console.log('new user created');
  }),
};

export default userController;
