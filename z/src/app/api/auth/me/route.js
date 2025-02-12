import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import connect from '../../../../../libs/mongodb';
import User from "../../../../../models/user.model";

export async function GET(req) {
    try {
        await connect();

        // lire le token dans les cookies
        const token = (await cookies()).get("authToken")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // vérifier et décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // récupérer l'utilisateur dans la base de données en retirant le mot de passe
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}
