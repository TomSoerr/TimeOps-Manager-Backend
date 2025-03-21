import { PrismaClient } from '@prisma/client';

/**
 * Singleton instance of the Prisma Client.
 *
 * This instance is used throughout the application to interact with the database.
 *
 * @module Database
 * @category Utilities
 */
const prisma = new PrismaClient();

export default prisma;
