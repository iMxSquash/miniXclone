"use client";

import Link from "next/link";
import withAuth from "./components/hook/withAuth";
import TweetList from "./components/tweet/tweetList";
import AddTweet from "./components/tweet/addTweet";

const Home = () => {
  return (
    <>
      <div className="flex flex-col w-full">
        <AddTweet />
        <TweetList />
      </div>
    </>
  );
};

export default withAuth(Home);