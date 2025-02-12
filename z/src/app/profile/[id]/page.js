"use client";

import Link from "next/link";
import { URL } from '../../utils/constant/utls';
import withAuth from "@/app/components/withAuth";

const ProfileId = () => {
  return (
    <>
      <div className="bg-blue-600">
      <p>ProfileId work</p>
      </div>
    </>
  );
}

export default withAuth(ProfileId);