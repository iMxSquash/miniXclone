import { NextResponse } from "next/server";
import connect from "../../../../../libs/mongodb";
import User from "../../../../../models/user.model";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q");

        if (!query) {
            return NextResponse.json([]);
        }

        await connect();

        const users = await User.find({
            name: { $regex: query, $options: "i" }
        }).select("name avatar");

        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
