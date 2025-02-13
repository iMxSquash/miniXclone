import { NextResponse } from "next/server";
import connect from '../../../../../libs/mongodb';
import User from "../../../../../models/user.model";

export async function GET(req, { params }) {
    try {
        await connect();

        // récupérer l'utilisateur dans la base de données en retirant le mot de passe
        const { id } = await params;
        console.log(`GET request for user ID: ${id}`);
        const user = await User.findById(id).select("-password");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        await connect();

        const { id } = await params;
        console.log(`PUT request for user ID: ${id}`);
        if (!id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const { name, avatar, banner, bio, location } = await req.json();

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        user.name = name || user.name;
        user.avatar = avatar || user.avatar;
        user.banner = banner || user.banner;
        user.bio = bio || user.bio;
        user.location = location || user.location;

        await user.save();

        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}