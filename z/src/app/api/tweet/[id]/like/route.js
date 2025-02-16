import { NextResponse } from "next/server";
import connect from "../../../../../../libs/mongodb";
import Tweet from "../../../../../../models/tweet.model";

export async function PUT(req, { params }) {
    try {
        await connect();
        const { id } = await params;
        const { userId } = await req.json();

        const tweet = await Tweet.findById(id);
        if (!tweet) return NextResponse.json({ error: "Tweet not found" }, { status: 404 });

        const hasLiked = tweet.likes.includes(userId);
        if (hasLiked) {
            await Tweet.findByIdAndUpdate(id, { $pull: { likes: userId } });
        } else {
            await Tweet.findByIdAndUpdate(id, { $push: { likes: userId } });
        }

        return NextResponse.json({ success: true, message: hasLiked ? "Unliked" : "Liked" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
