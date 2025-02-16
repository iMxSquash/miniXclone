import { NextResponse } from "next/server";
import connect from "../../../../../../libs/mongodb";
import Tweet from "../../../../../../models/tweet.model";

export async function POST(req, { params }) {
    try {
        await connect();
        const { id } = params;
        const { userId, content } = await req.json();

        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        const parentTweet = await Tweet.findById(id);
        if (!parentTweet) {
            return NextResponse.json({ error: "Tweet not found" }, { status: 404 });
        }

        const reply = await Tweet.create({
            author: userId,
            content,
        });

        await Tweet.findByIdAndUpdate(id, { $push: { replies: reply._id } });

        return NextResponse.json({ success: true, reply }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
