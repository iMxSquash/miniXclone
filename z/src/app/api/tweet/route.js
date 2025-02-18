import connect from "../../../../libs/mongodb";
import Tweet from "../../../../models/tweet.model";
import User from "../../../../models/user.model";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
    try {
        await connect();
        const formData = await req.formData();
        const userId = formData.get("userId");
        const content = formData.get("content");
        const mediaFiles = JSON.parse(formData.get("mediaFiles") || "[]");

        if (!userId || !content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const newTweet = await Tweet.create({
            author: userId,
            content,
            mediaFiles,
            tags: [],
        });

        return NextResponse.json({ success: true, tweet: newTweet }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        await connect();
        const tweets = await Tweet.find()
            .populate("author", "name avatar")
            .populate("replies")
            .sort({ createdAt: -1 }); // trier par date décroissante

        return NextResponse.json({ tweets }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}