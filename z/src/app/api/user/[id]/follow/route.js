import connect from "../../../../../../libs/mongodb";
import User from "../../../../../../models/user.model";
import { NextResponse } from "next/server";
import mongoose from 'mongoose';

export async function PUT(req, { params }) {
    const { id } = await params; // id de l'utilisateur à suivre
    const { userId } = await req.json(); // id de l'utilisateur connecté

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    if (id === userId) {
        return NextResponse.json({ error: "You cannot follow yourself" }, { status: 400 });
    }

    try {
        await connect();

        const userToFollow = await User.findById(id);
        const currentUser = await User.findById(userId);

        if (!userToFollow || !currentUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Convertir id et userId en ObjectId
        const userIdObject = new mongoose.Types.ObjectId(userId);
        const idObject = new mongoose.Types.ObjectId(id);

        // vérifier si l'utilisateur suit déjà la personne
        const isFollowing = currentUser.following.includes(idObject);

        if (isFollowing) {
            // unfollow
            await User.findByIdAndUpdate(userIdObject, { $pull: { following: idObject } });
            await User.findByIdAndUpdate(idObject, { $pull: { followers: userIdObject } });

            return NextResponse.json({ success: true, message: "Unfollowed" });
        } else {
            // follow
            await User.findByIdAndUpdate(userIdObject, { $push: { following: idObject } });
            await User.findByIdAndUpdate(idObject, { $push: { followers: userIdObject } });

            return NextResponse.json({ success: true, message: "Followed" });
        }
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
