import mongoose from "mongoose";

const TweetSchema = new mongoose.Schema(
    {
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true },
        tags: [{ type: String }],
        mediaFiles: [{ type: String }],
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tweet" }],
        comments: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                text: { type: String, required: true },
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

const Tweet = mongoose.models.Tweet || mongoose.model("Tweet", TweetSchema);
export default Tweet;
