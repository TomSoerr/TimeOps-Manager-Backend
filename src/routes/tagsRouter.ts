import { Router } from "express";
import tagsController from "../controllers/tagsController";

const tagsRouter = Router();

// Tags Management
tagsRouter.get("/", tagsController.getTags);
tagsRouter.post("/", tagsController.createTag);
tagsRouter.put("/:id", tagsController.updateTag);

export default tagsRouter;
