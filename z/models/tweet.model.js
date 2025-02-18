import mongoose from "mongoose";

const TweetSchema = new mongoose.Schema(
    {
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String },
        tags: [{ type: String }],
        mediaFiles: [{ type: String }],
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // pour les retweets/republications
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tweet" }],
        replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "Tweet", default: null }, // tweet parent si c'est un commentaire
    },
    { timestamps: true }
);

const Tweet = mongoose.models.Tweet || mongoose.model("Tweet", TweetSchema);
export default Tweet;
