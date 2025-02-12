import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export const loginUser = async (email, password) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("data", data);
    console.log("cookies 1", document.cookies);

    if (data.email) {
        redirect('/');
    } else {
        console.log(data.error); // Gérer l'erreur
    }
};

export const logoutUser = () => {
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    redirect('/login');
};

export const registerUser = async (name, email, password) => {
    const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (data.token) {
        redirect('/');
    } else {
        console.log(data.error); // Gérer l'erreur
    }
};

export function getUserFromToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET); // Vérifie et extrait les données du token
    } catch (error) {
      return null;
    }
  }