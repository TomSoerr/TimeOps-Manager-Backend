import { Router } from "express";
import entriesController from "../controllers/entriesController";

const entriesRouter = Router();

// Entries Management
entriesRouter.get("/", entriesController.getEntries);
entriesRouter.post("/", entriesController.createEntry);
entriesRouter.put("/:id", entriesController.updateEntry);

// Running Entry
entriesRouter.get("/running", entriesController.getRunningEntry);
entriesRouter.post("/running", entriesController.startRunningEntry);
entriesRouter.put("/running", entriesController.endRunningEntry);
entriesRouter.get("/running/nfc", entriesController.getNfcPage);

export default entriesRouter;
