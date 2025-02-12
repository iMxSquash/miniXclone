"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function withAuth(Component) {
    return function WithAuth(props) {
        useEffect(() => {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("authToken="))
                ?.split("=")[1];

            if (!token) {
                redirect("/login");
            }
        }, []);

        return <Component {...props} />;
    };
}
