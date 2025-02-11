import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req) {
  // Récupérer le token depuis les cookies (ou localStorage côté client)
  const token = req.cookies.get('authToken');

  // Si le token n'existe pas, rediriger vers la page de connexion
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Vérifier le token
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.next();
  } catch (error) {
    // Si le token est invalide ou expiré, rediriger vers la page de connexion
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Spécifie les pages ou routes protégées
export const config = {
  matcher: ['/profile/*', '/tweet/*', '/messages/*', '/search', '/user/*'], // Liste des routes protégées
};
