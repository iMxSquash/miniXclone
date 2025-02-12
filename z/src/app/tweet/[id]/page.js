"use client";

import Link from "next/link";
import { URL } from '../../utils/constant/utls';
import withAuth from "@/app/components/withAuth";

const TweetId = () => {

    return (
        <>
            <div className="bg-blue-600">
                <p>TweetId work</p>
            </div>
        </>
    );
}

export default withAuth(TweetId);