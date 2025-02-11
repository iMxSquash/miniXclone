"use client";

import { useEffect } from "react";
import { cookies } from 'next/headers';

export default function withAuth(Component) {
    return function WithAuth(props) {
        useEffect(() => {
            if (!cookies.get('access_token')) {
                window.location.href = "/login";
            }
        }, []);

        return <Component {...props} />;
    };
}