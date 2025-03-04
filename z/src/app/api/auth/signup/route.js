import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import connect from '../../../../../libs/mongodb';
import User from '../../../../../models/user.model';

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        await connect();

        // vérifier si l'email est déjà pris
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return new Response(JSON.stringify({ error: 'Email already in use' }), { status: 400 });
        }

        // hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // insérer le nouvel utilisateur dans la base de données
        const newUser = { _id: new ObjectId(), name, email, password: hashedPassword };
        const result = await User.insertOne(newUser);

        // retourner le token JWT à l'utilisateur
        return new Response(JSON.stringify({ mess: "user created !" }), { status: 201 });
    }
    catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
