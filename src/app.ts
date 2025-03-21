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
 * @category App
 */
const app = express();

app.use(
  cors({
    origin: 'https://192.168.178.43:5173', // Allow requests from your frontend's origin
    credentials: true, // Allow cookies and credentials
  }),
);

app.use('/api/v1', apiRouter);

app.use(errorController.notFound);
app.use(errorController.handleError);

const httpsOptions = {
  key: fs.readFileSync('./192.168.178.43-key.pem'), // Path to your key file
  cert: fs.readFileSync('./192.168.178.43.pem'), // Path to your certificate file
};

const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`App started on port: ${PORT}!`);
// });

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`HTTPS server started on port: ${PORT}!`);
});

export default app;
