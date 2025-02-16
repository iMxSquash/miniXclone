import { NextResponse } from "next/server";
import connect from "../../../../../libs/mongodb";
import Tweet from "../../../../../models/tweet.model";

export async function GET(req, { params }) {
    try {
        await connect();
        const { id } = await params;

        const tweet = await Tweet.findById(id)
            .populate('author')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'name avatar'
                }
            });

        if (!tweet) {
            return NextResponse.json({ error: "Tweet not found" }, { status: 404 });
        }

        // Si le tweet est une réponse à un autre tweet, récupérer le tweet parent
        if (tweet.replyTo) {
            const parentTweet = await Tweet.findById(tweet.replyTo)
                .populate('author')
                .select('content author createdAt');
            tweet._doc.parentTweet = parentTweet;
        }

        return NextResponse.json({
            success: true,
            tweet: tweet
        });
    } catch (error) {
        console.error("Error fetching tweet:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
