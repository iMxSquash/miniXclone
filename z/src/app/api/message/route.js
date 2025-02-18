import { NextResponse } from "next/server";
import connect from "../../../../libs/mongodb";
import Message from "../../../../models/message.model";
import Conversation from "../../../../models/conversation.model";

export async function POST(request) {
    try {
        const body = await request.json();
        await connect();

        const newMessage = await Message.create(body);

        // mise à jour du dernier message de la conversation
        await Conversation.findByIdAndUpdate(
            body.conversationId,
            { lastMessage: newMessage._id },
            { new: true }
        );

        const populatedMessage = await Message.findById(newMessage._id)
            .populate("sender", "name avatar");

        return NextResponse.json(populatedMessage);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
