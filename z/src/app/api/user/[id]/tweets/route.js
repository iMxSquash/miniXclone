import { NextResponse } from "next/server";
import connect from "../../../../../../libs/mongodb";
import Tweet from "../../../../../../models/tweet.model";

export async function GET(req, { params }) {
    try {
        await connect();
        const { id } = await params;

        const tweets = await Tweet.find({ author: id })
            .populate('author')
            .sort({ createdAt: -1 });

        const replies = await Tweet.find({
            replies: { $in: [id] },
            author: { $ne: id }
        }).populate('author').sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            tweets,
            replies
        });
    } catch (error) {
        console.error("Error fetching user tweets:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
