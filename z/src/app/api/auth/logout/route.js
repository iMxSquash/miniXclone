import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
    // supprimer le cookie 'authToken'
    (await cookies()).delete("authToken", { path: "/" });

    // retourner une réponse de succès
    return NextResponse.json({ message: "Déconnexion réussie" }, { status: 200 });
}
