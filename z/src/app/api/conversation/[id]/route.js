import { NextResponse } from "next/server";
import connect from "../../../../../libs/mongodb";
import Conversation from "../../../../../models/conversation.model";
import Message from "../../../../../models/message.model";

export async function GET(request, { params }) {
    try {
        await connect();

        const conversationId = await params.id;

        // récupérer la conversation avec les participants
        const conversation = await Conversation.findById(conversationId)
            .populate("participants", "name avatar")
            .populate("lastMessage");

        if (!conversation) {
            return NextResponse.json(
                { error: "Conversation not found" },
                { status: 404 }
            );
        }

        // récupérer tous les messages de la conversation
        const messages = await Message.find({ conversationId })
            .populate("sender", "name avatar")
            .sort({ createdAt: 1 });

        return NextResponse.json({
            conversation,
            messages
        });
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
