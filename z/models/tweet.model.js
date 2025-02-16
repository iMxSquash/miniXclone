import mongoose from "mongoose";

const TweetSchema = new mongoose.Schema(
    {
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true },
        tags: [{ type: String }],
        mediaFiles: [{ type: String }],
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Pour les likes
        replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Pour les retweets/republications
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tweet" }], // Pour les commentaires
        replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "Tweet", default: null }, // Tweet parent si c'est un commentaire
    },
    { timestamps: true }
);

const Tweet = mongoose.models.Tweet || mongoose.model("Tweet", TweetSchema);
export default Tweet;
