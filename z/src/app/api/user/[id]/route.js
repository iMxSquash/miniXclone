import { NextResponse } from "next/server";
import connect from '../../../../../libs/mongodb';
import User from "../../../../../models/user.model";

export async function GET(req, { params }) {
    try {
        await connect();

        // récupérer l'utilisateur dans la base de données en retirant le mot de passe
        const { id } = await params;
        const user = await User.findById(id).select("-password");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}