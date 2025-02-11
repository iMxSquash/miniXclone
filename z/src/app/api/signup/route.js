import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from "../../../service/api/mongodb";

export async function POST(req) {
  const { email, password } = await req.json();

  // Vérifier si l'email est déjà pris
  const db = await connectToDatabase();
  const existingUser = await db.collection('users').findOne({ email });
  
  if (existingUser) {
    return new Response(JSON.stringify({ error: 'Email already in use' }), { status: 400 });
  }

  // Hacher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insérer le nouvel utilisateur dans la base de données
  const newUser = { email, password: hashedPassword };
  const result = await db.collection('users').insertOne(newUser);

  // Générer un token JWT
  const token = jwt.sign({ id: result.insertedId, email }, process.env.JWT_SECRET, { expiresIn: '1d' });

  // Retourner le token JWT à l'utilisateur
  return new Response(JSON.stringify({ token }), { status: 201 });
}
