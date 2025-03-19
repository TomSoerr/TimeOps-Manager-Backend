import express, { Router, RequestHandler, ErrorRequestHandler } from "express";
import apiRouter from "./routes/apiRouter";
import errorController from "./controllers/errorController";

const app = express();

app.use("/api/v1", apiRouter);

app.use(errorController.notFound);
app.use(errorController.handleError);

const PORT = process.env.PORT || 5173;

app.listen(PORT, () => {
  console.log(`App started on port: ${PORT}!`);
});
