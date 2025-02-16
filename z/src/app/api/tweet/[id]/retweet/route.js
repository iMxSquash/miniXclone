import { NextResponse } from "next/server";
import connect from "../../../../../../libs/mongodb";
import Tweet from "../../../../../../models/tweet.model";

export async function PUT(req, { params }) {
    try {
        await connect();
        const { id } = params;
        const { userId } = await req.json();

        const tweet = await Tweet.findById(id);
        if (!tweet) return NextResponse.json({ error: "Tweet not found" }, { status: 404 });

        const hasRetweeted = tweet.retweets.includes(userId);
        if (hasRetweeted) {
            await Tweet.findByIdAndUpdate(id, { $pull: { retweets: userId } });
        } else {
            await Tweet.findByIdAndUpdate(id, { $push: { retweets: userId } });
        }

        return NextResponse.json({ success: true, message: hasRetweeted ? "Unretweeted" : "Retweeted" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
