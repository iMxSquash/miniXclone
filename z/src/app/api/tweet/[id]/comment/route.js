import { NextResponse } from "next/server";
import connect from "../../../../../../libs/mongodb";
import Tweet from "../../../../../../models/tweet.model";

export async function POST(req, { params }) {
    try {
        await connect();
        const { id } = params;
        const { userId, content } = await req.json();

        if (!content) {
            return NextResponse.json({ error: "Le contenu est requis" }, { status: 400 });
        }

        const parentTweet = await Tweet.findById(id);
        if (!parentTweet) {
            return NextResponse.json({ error: "Tweet non trouvé" }, { status: 404 });
        }

        const comment = await Tweet.create({
            author: userId,
            content,
            replyTo: id
        });

        await Tweet.findByIdAndUpdate(id, { $push: { comments: comment._id } });

        const populatedComment = await comment.populate('author');

        return NextResponse.json({
            success: true,
            comment: populatedComment
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
