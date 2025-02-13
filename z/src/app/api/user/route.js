import { NextResponse } from "next/server";
import connect from '../../../../libs/mongodb';
import User from "../../../../models/user.model";

export async function GET(req) {
    try {
        await connect();

        // récupérer l'utilisateur dans la base de données en retirant le mot de passe
        const user = await User.find().select("-password");

        if (!user || user.length === 0) {
            return NextResponse.json({ user: [] }, { status: 200 });
        }

        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}