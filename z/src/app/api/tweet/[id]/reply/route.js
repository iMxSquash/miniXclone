export async function POST(req, { params }) {
    try {
        await connect();
        const { tweetId } = params;
        const { userId, content } = await req.json();

        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        const parentTweet = await Tweet.findById(tweetId);
        if (!parentTweet) {
            return NextResponse.json({ error: "Tweet not found" }, { status: 404 });
        }

        const reply = await Tweet.create({
            author: userId,
            content,
        });

        await Tweet.findByIdAndUpdate(tweetId, { $push: { replies: reply._id } });

        return NextResponse.json({ success: true, reply }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
