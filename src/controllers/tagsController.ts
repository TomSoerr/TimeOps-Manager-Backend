import expressAsyncHandler from "express-async-handler";

const tagsController = {
  // Get all tags
  getTags: expressAsyncHandler(async (req, res) => {
    res.json({ message: "Get all tags" });
  }),

  // Create a new tag
  createTag: expressAsyncHandler(async (req, res) => {
    res.status(201).json({ message: "Tag created" });
  }),

  // Update a tag
  updateTag: expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    res.json({ message: `Tag ${id} updated` });
  }),
};

export default tagsController;
