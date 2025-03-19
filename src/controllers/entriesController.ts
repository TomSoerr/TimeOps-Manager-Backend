import expressAsyncHandler from "express-async-handler";
import NotFoundError from "../errors/notFoundError";

const entriesController = {
  // Get entries for last 3 months
  getEntries: expressAsyncHandler(async (req, res) => {
    res.json({ message: "Get entries for last 3 months" });
  }),

  // Create a new entry
  createEntry: expressAsyncHandler(async (req, res) => {
    // Implementation here
    res.status(201).json({ message: "Entry created" });
  }),

  // Update an entry
  updateEntry: expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    res.json({ message: `Entry ${id} updated` });
  }),

  // Get running entry if available
  getRunningEntry: expressAsyncHandler(async (req, res) => {
    res.json({ message: "Get running entry" });
  }),

  // Start running entry
  startRunningEntry: expressAsyncHandler(async (req, res) => {
    res.status(201).json({ message: "Running entry started" });
  }),

  // End running entry
  endRunningEntry: expressAsyncHandler(async (req, res) => {
    res.json({ message: "Running entry ended" });
  }),

  // NFC webpage
  getNfcPage: expressAsyncHandler(async (req, res) => {
    res.send("NFC Page HTML");
  }),
};

export default entriesController;
