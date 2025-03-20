import { Router } from "express";
import dbController from "../controllers/dbController";

const dbRouter = Router();

dbRouter.post("/", dbController.importDb); // import csv (toggle) and json (tom)
dbRouter.get("/", dbController.exportDb);
dbRouter.get("/seed", dbController.seedDb);

export default dbRouter;
