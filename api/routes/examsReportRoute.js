import { Router } from "express";
import Exam from "../models/quiz/examModel.js";
import Report from "../models/quiz/examReportModel.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = Router();

// Add exam attempt
router.post("/add-exam-attempt", verifyToken, async (req, res) => {
  try {
    const newReport = new Report(req.body);
    await newReport.save();
    res.send({
      message: "Report added successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// Get all attempts
router.post("/get-all-attempts", async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("exam")
      .populate("user")
      .sort({ createdAt: -1 });
    res.send({
      message: "All reports fetched successfully",
      success: true,
      data: reports,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// Get all reports by user
router.post("/get-attempts-by-user", verifyToken, async (req, res) => {
  try {
    const reports = await Report.find({ user: req.body.userId })
      .populate("exam")
      .sort({ createdAt: -1 });
    res.send({
      message: "All reports fetched successfully",
      success: true,
      data: reports,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

export default router;
