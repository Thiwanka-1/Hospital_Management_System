import express from "express";
import {
    createSupportMessage,
    getAllSupportMessages,
    getSupportMessageById,
    addReplyToSupportMessage,
    deleteSupportMessage
} from "../controllers/supportController.js";

const router = express.Router();

router.post("/", createSupportMessage); // Create message
router.get("/", getAllSupportMessages); // Get all messages (support)
router.get("/:id", getSupportMessageById); // Get conversation by ID
router.post("/:id/reply", addReplyToSupportMessage); // Add reply to conversation
router.delete("/:id", deleteSupportMessage); // Delete conversation

export default router;
