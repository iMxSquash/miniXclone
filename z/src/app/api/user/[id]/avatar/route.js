import { connectDB } from "@/libs/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
    const { id } = params;
    const { avatar } = await req.json();

    try {
        await connectDB();
        await User.findByIdAndUpdate(id, { avatar });

        return NextResponse.json({ success: true, avatar }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
