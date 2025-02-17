import { NextResponse } from "next/server";
import connect from "../../../../../../libs/mongodb";
import Tweet from "../../../../../../models/tweet.model";
import User from "../../../../../../models/user.model";

// Pour les retweets/republications
export async function PUT(req, { params }) {
    try {
        await connect();
        const { id } = await params;
        const { userId } = await req.json();

        const tweet = await Tweet.findById(id);
        if (!tweet) return NextResponse.json({ error: "Tweet not found" }, { status: 404 });

        if (tweet.author.toString() === userId) {
            return NextResponse.json({
                error: "Vous ne pouvez pas republier votre propre tweet"
            }, { status: 400 });
        }

        const hasReplied = tweet.replies?.includes(userId);

        if (hasReplied) {
            await Promise.all([
                Tweet.findByIdAndUpdate(id, { $pull: { replies: userId } }),
                User.findByIdAndUpdate(userId, { $pull: { retweets: id } })
            ]);
        } else {
            await Promise.all([
                Tweet.findByIdAndUpdate(id, { $push: { replies: userId } }),
                User.findByIdAndUpdate(userId, { $push: { retweets: id } })
            ]);
        }

        const updatedTweet = await Tweet.findById(id).populate('author');

        return NextResponse.json({
            success: true,
            message: hasReplied ? "Republication supprimée" : "Tweet republié",
            tweet: updatedTweet
        });
    } catch (error) {
        console.error("Reply error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Pour les commentaires
export async function POST(req, { params }) {
    try {
        await connect();
        const { id } = await params;
        const { userId, content, mediaFiles } = await req.json();

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
            mediaFiles: mediaFiles || [], // Ajout des mediaFiles
            replyTo: id
        });

        await Tweet.findByIdAndUpdate(id, { $push: { comments: comment._id } });

        const populatedComment = await comment.populate('author');

        return NextResponse.json({
            success: true,
            comment: populatedComment
        }, { status: 201 });
    } catch (error) {
        console.error("Comment error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Pour supprimer un commentaire
export async function DELETE(req, { params }) {
    try {
        await connect();
        const { id } = await params;
        const { userId, commentId } = await req.json();

        const tweet = await Tweet.findById(id);
        if (!tweet) {
            return NextResponse.json({ error: "Tweet non trouvé" }, { status: 404 });
        }

        // Vérifier si l'utilisateur est l'auteur du commentaire
        const comment = await Tweet.findById(commentId);
        if (!comment || comment.author.toString() !== userId) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
        }

        await Promise.all([
            Tweet.findByIdAndUpdate(id, { $pull: { comments: commentId } }),
            Tweet.findByIdAndDelete(commentId)
        ]);

        return NextResponse.json({
            success: true,
            message: "Commentaire supprimé"
        });
    } catch (error) {
        console.error("Delete comment error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
