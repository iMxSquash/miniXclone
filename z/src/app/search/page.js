"use client";

import Link from "next/link";
import { URL } from '../utils/constant/utls';
import withAuth from "../components/withAuth";

const Search = () => {

    return (
        <>
            <div className="bg-blue-600">
                <p>Search work</p>
            </div>
        </>
    );
}

export default withAuth(Search);