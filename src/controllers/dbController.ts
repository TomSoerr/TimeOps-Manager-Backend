import expressAsyncHandler from "express-async-handler";

const dbController = {
  // Import CSV or JSON file to database
  importDb: expressAsyncHandler(async (req, res) => {
    res.json({ message: "Imported CSV/JSON to DB" });
  }),

  // Export Database to JSON
  exportDb: expressAsyncHandler(async (req, res) => {
    res.json({ message: "Database" });
  }),

  // Seed database with sample data
  seedDb: expressAsyncHandler(async (req, res) => {
    res.json({ message: "Database" });
  }),
};

export default dbController;
