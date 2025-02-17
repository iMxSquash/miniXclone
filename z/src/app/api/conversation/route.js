import { NextResponse } from "next/server";
import connect from "../../../../libs/mongodb";
import Conversation from "../../../../models/conversation.model";
import Message from "../../../../models/message.model"; // Ajout de l'import du modèle Message

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    try {
        await connect();
        // Assure-toi que le modèle Message est chargé avant d'utiliser populate
        await Message.createIndexes(); // Cette ligne force le chargement du modèle

        const conversations = await Conversation.find({ participants: userId })
            .populate("participants", "name avatar")
            .populate({
                path: "lastMessage",
                model: "Message" // Spécifie explicitement le modèle
            })
            .sort({ updatedAt: -1 });

        return NextResponse.json(conversations);
    } catch (error) {
        console.error("Error in GET /api/conversation:", error);
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
