export async function PUT(req, { params }) {
    try {
        await connect();
        const { tweetId } = params;
        const { userId } = await req.json();

        const tweet = await Tweet.findById(tweetId);
        if (!tweet) return NextResponse.json({ error: "Tweet not found" }, { status: 404 });

        const hasRetweeted = tweet.retweets.includes(userId);
        if (hasRetweeted) {
            await Tweet.findByIdAndUpdate(tweetId, { $pull: { retweets: userId } });
        } else {
            await Tweet.findByIdAndUpdate(tweetId, { $push: { retweets: userId } });
        }

        return NextResponse.json({ success: true, message: hasRetweeted ? "Unretweeted" : "Retweeted" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
