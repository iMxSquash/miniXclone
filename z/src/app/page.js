"use client";

import Link from "next/link";
import { URL } from './utils/constant/utls';
import withAuth from "./components/withAuth";

const Home = () => {

  return (
    <>
      <div className="bg-blue-600">
        <h1>Welcome to my blog</h1>
        <p>Découvrez nos derniers articles</p>
      </div>
    </>
  );
};

export default withAuth(Home);