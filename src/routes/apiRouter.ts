import { Router } from "express";
import express from "express";
import entriesRouter from "./entriesRouter";
import tagsRouter from "./tagsRouter";
import analyticsRouter from "./analyticsRouter";
import dbRouter from "./dbRouter";

const apiRouter = Router();

// Parse JSON body in requests
apiRouter.use(express.json());

// Mount sub-routers
apiRouter.use("/entries", entriesRouter);
apiRouter.use("/tags", tagsRouter);
apiRouter.use("/analytics", analyticsRouter);
apiRouter.use("/db", dbRouter);

export default apiRouter;
