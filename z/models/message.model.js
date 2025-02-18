import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String },
    mediaFiles: [{ type: String }],
}, {
    timestamps: true
});

const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);
export default Message;
