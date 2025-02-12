"use client";

import Link from "next/link";
import { URL } from './utils/constant/utls';
import withAuth from "./components/withAuth";
import { useEffect, useState } from "react";

const Home = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
      fetch("/api/auth/me")
        .then((res) => res.json())
        .then((data) => setUser(data.user || null))
        .catch(() => setUser(null));
    }, []);

    return (
      <>
        <div className="bg-blue-600">
          <p>{user ? `Bienvenue, ${user.name} !` : "Non connecté"}</p>

        {user && (
          <div>
            <h2>Informations utilisateur :</h2>
            <ul>
              {Object.entries(user).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}</strong>: {value?.toString()}
                </li>
              ))}
            </ul>
          </div>
        )}
          <h1>Welcome to my blog</h1>
          <p>Découvrez nos derniers articles</p>
        </div>
      </>
    );
  };

  export default withAuth(Home);