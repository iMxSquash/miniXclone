export async function PUT(req, { params }) {
    try {
        await connect();
        const { tweetId } = params;
        const { userId } = await req.json();

        const tweet = await Tweet.findById(tweetId);
        if (!tweet) return NextResponse.json({ error: "Tweet not found" }, { status: 404 });

        const hasLiked = tweet.likes.includes(userId);
        if (hasLiked) {
            await Tweet.findByIdAndUpdate(tweetId, { $pull: { likes: userId } });
        } else {
            await Tweet.findByIdAndUpdate(tweetId, { $push: { likes: userId } });
        }

        return NextResponse.json({ success: true, message: hasLiked ? "Unliked" : "Liked" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
