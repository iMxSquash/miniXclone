import { NextResponse } from "next/server";
import connect from "../../../../libs/mongodb";
import Conversation from "../../../../models/conversation.model";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    try {
        await connect();
        const conversations = await Conversation.find({ participants: userId })
            .populate("participants", "name avatar")
            .populate("lastMessage")
            .sort({ updatedAt: -1 });

        return NextResponse.json(conversations);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        await connect();

        const newConversation = await Conversation.create({
            participants: body.participants
        });

        const populatedConversation = await Conversation.findById(newConversation._id)
            .populate("participants", "name avatar");

        return NextResponse.json(populatedConversation);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
