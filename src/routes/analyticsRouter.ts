import { Router } from "express";
import analyticsController from "../controllers/analyticsController";

const analyticsRouter = Router();

// Tags Management
analyticsRouter.get("/", analyticsController.getAnalytics);
analyticsRouter.get("/", analyticsController.getAnalyticsPdf);

export default analyticsRouter;
