"use client";

import Link from "next/link";
import withAuth from "./components/withAuth";
import TweetList from "./components/tweetList";
import AddTweet from "./components/addTweet";

const Home = () => {
  return (
    <>
      <div className="flex flex-col w-full h-[100dvh] overflow-y-auto">
        <AddTweet />
        <TweetList />
      </div>
    </>
  );
};

export default withAuth(Home);