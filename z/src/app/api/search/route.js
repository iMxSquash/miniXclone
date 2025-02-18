import { NextResponse } from "next/server";
import connectMongoDB from "../../../../libs/mongodb";
import User from "../../../../models/user.model";
import Tweet from "../../../../models/tweet.model";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query) {
            return NextResponse.json({ users: [], tweets: [] });
        }

        await connectMongoDB();

        // recherche des utilisateurs
        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        }).select('_id name email avatar');

        // recherche des tweets
        const tweets = await Tweet.find({
            content: { $regex: query, $options: 'i' }
        })
            .populate('author', '_id name avatar')
            .sort({ createdAt: -1 });

        return NextResponse.json({
            users,
            tweets
        });

    } catch (error) {
        console.error('Erreur de recherche:', error);
        return NextResponse.json(
            { error: "Erreur lors de la recherche" },
            { status: 500 }
        );
    }
}
