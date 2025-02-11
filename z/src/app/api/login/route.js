import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from "../../../service/api/mongodb";

export async function POST(req) {
  const { email, password } = await req.json();

  // Vérifier si l'utilisateur existe
  const db = await connectToDatabase();
  const user = await db.collection('users').findOne({ email });
  
  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 400 });
  }

  // Comparer le mot de passe
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return new Response(JSON.stringify({ error: 'Invalid password' }), { status: 400 });
  }

  // Générer un token JWT
  const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, { expiresIn: '1d' });

  // Retourner le token JWT à l'utilisateur
  return new Response(JSON.stringify({ token }), { status: 200 });
}
