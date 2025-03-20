import { Router } from "express";
import entriesController from "../controllers/entriesController";
import validateEntry from "../validators/entryValidator";

const entriesRouter = Router();

// Entries Management
entriesRouter.get("/", entriesController.getEntries);
entriesRouter.post("/", validateEntry, entriesController.createEntry);
entriesRouter.put("/:id", validateEntry, entriesController.updateEntry);

// Running Entry
entriesRouter.get("/running", entriesController.getRunningEntry);
entriesRouter.post("/running", entriesController.startRunningEntry);
entriesRouter.put("/running", entriesController.endRunningEntry);
entriesRouter.get("/running/nfc", entriesController.getNfcPage);

export default entriesRouter;
