import expressAsyncHandler from "express-async-handler";
import InternalError from "../errors/internalError";

const dbController = {
  // Create report as JSON
  getAnalytics: expressAsyncHandler(async (req, res) => {
    res.json({ message: "Imported CSV/JSON to DB" });
  }),

  // Create report as PDF
  getAnalyticsPdf: expressAsyncHandler(async (req, res) => {
    try {
      const pdfPath = "/path/to/your/generated/report.pdf";

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="analytics-report.pdf"',
      );

      res.sendFile(pdfPath, { root: process.cwd() });
    } catch (error) {
      throw new InternalError(`Error generating PDF: ${error}`);
    }
  }),
};

export default dbController;
