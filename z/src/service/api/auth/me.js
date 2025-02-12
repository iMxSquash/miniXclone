import jwt from "jsonwebtoken";
import { parse } from "cookie";

export default function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Méthode non autorisée" });
    }

    // 🔥 Récupérer les cookies
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(401).json({ message: "Token invalide" });
    }
}
