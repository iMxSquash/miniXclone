"use client";

import Link from "next/link";
import withAuth from "./components/withAuth";
import TweetList from "./components/tweetList";
import AddTweet from "./components/addTweet";

const Home = () => {
  return (
    <>
      <div className="bg-blue-600">
        <h1>Welcome to my blog</h1>
        <p>Découvrez nos derniers articles</p>
        <AddTweet />
        <TweetList />
      </div>
    </>
  );
};

export default withAuth(Home);