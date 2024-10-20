import SupportMessage from "../models/SupportMessage.js";

// Create a new support message
export const createSupportMessage = async (req, res) => {
    const { userName, message } = req.body;

    try {
        const newMessage = new SupportMessage({ userName, message });
        await newMessage.save();
        res.status(201).json({ success: true, newMessage });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating support message", error: error.message });
    }
};

// Get all support messages (Support view)
export const getAllSupportMessages = async (req, res) => {
    try {
        const messages = await SupportMessage.find({});
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching messages", error: error.message });
    }
};

// Get a specific conversation by ID
export const getSupportMessageById = async (req, res) => {
    const { id } = req.params;
    try {
        const message = await SupportMessage.findById(id);
        if (!message) return res.status(404).json({ success: false, message: "Message not found" });

        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching message", error: error.message });
    }
};

// Add a reply to a conversation
export const addReplyToSupportMessage = async (req, res) => {
    const { id } = req.params;
    const { sender, message } = req.body;

    try {
        const supportMessage = await SupportMessage.findById(id);
        if (!supportMessage) return res.status(404).json({ success: false, message: "Support message not found" });

        supportMessage.replies.push({ sender, message });
        await supportMessage.save();

        res.status(200).json({ success: true, supportMessage });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error replying to message", error: error.message });
    }
};

// Delete a support message
export const deleteSupportMessage = async (req, res) => {
    const { id } = req.params;

    try {
        const supportMessage = await SupportMessage.findByIdAndDelete(id);
        if (!supportMessage) return res.status(404).json({ success: false, message: "Support message not found" });

        res.status(200).json({ success: true, message: "Support message deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting message", error: error.message });
    }
};
