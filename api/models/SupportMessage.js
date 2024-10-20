import mongoose from "mongoose";

const ReplySchema = new mongoose.Schema({
    sender: { type: String, enum: ["user", "support"], required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const SupportMessageSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    replies: [ReplySchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const SupportMessage = mongoose.model("SupportMessage", SupportMessageSchema);
export default SupportMessage;
