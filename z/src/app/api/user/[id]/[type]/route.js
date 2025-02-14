import connect from "../../../../../../libs/mongodb";
import User from "../../../../../../models/user.model";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req, { params }) {
    await connect();
    const { id, type } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    if (type !== "followers" && type !== "following") {
        return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
    }

    const user = await User.findById(id).populate({
        path: type,  // dynamique : "followers" ou "following"
        select: "name avatar _id",
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ [type]: user[type] });
}
