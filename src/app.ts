import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import apiRouter from './routes/apiRouter';
import https from 'https';
import fs from 'fs';
import cors from 'cors';
import errorController from './controllers/errorController';

/**
 * The main Express application instance. The instance mounts the `apiRouter`.
 *
 * This file sets up the Express app, configures middleware, and starts an HTTPS server.
 *
 * @category App
 */
const app = express();

/**
 * Middleware to allow private network access.
 *
 * This middleware sets the `Access-Control-Allow-Private-Network` header
 * to allow access from private networks.
 */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Private-Network', 'true');
  next();
});

/**
 * Middleware to enable CORS (Cross-Origin Resource Sharing).
 *
 * This configuration allows requests from specific origins and enables
 * credentials (e.g., cookies) to be sent with requests.
 */
app.use(
  cors({
    origin: ['https://192.168.178.43:5173', 'https://tomsoerr.github.io'],
    credentials: true,
  }),
);

/**
 * Mount the main API router.
 *
 * All API routes are prefixed with `/api/v1`.
 */
app.use('/api/v1', apiRouter);

/**
 * Middleware to handle 404 Not Found errors.
 *
 * This middleware is triggered when no matching route is found.
 */
app.use(errorController.notFound);

/**
 * Middleware to handle application errors.
 *
 * This middleware catches errors thrown in the application and sends
 * a JSON response with the error details.
 */
app.use(errorController.handleError);

/**
 * HTTPS server options.
 *
 * These options include the SSL key and certificate required to start
 * the HTTPS server.
 */
const httpsOptions = {
  key: fs.readFileSync('./192.168.178.43-key.pem'), // Path to your key file
  cert: fs.readFileSync('./192.168.178.43.pem'), // Path to your certificate file
};

/**
 * The port on which the server will listen.
 *
 * Defaults to 3000 if the `PORT` environment variable is not set.
 */
const PORT = process.env.PORT || 3000;

/**
 * Start the HTTPS server.
 *
 * The server listens on the specified port and logs a message when it starts.
 */
https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`HTTPS server started on port: ${PORT}!`);
});

// app.listen(PORT, () => {
//   console.log(`App started on port: ${PORT}!`);
// });

export default app;
