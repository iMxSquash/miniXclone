import jwt from 'jsonwebtoken';

export async function GET(req) {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // L'utilisateur est authentifié, tu peux maintenant utiliser `decoded` (contenant l'id et l'email de l'utilisateur)
    return new Response(JSON.stringify({ message: 'Protected data', userId: decoded.id }), { status: 200 });
  } catch (error) {
    return new Response('Invalid token', { status: 401 });
  }
}
