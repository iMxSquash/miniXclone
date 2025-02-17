"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function withAuth(Component) {
    return function WithAuth(props) {
        const router = useRouter();
        const [user, setUser] = useState(null);

        useEffect(() => {
            fetch("/api/auth/me", { credentials: "include" })
                .then((res) => res.json())
                .then((data) => {
                    if (!data.user) {
                        router.push("/login");
                    } else {
                        setUser(data.user);
                    }
                })
                .catch(() => router.push("/login"));
        }, []);

        return (
            user ? <Component {...props} /> : null
        );
    };
}
