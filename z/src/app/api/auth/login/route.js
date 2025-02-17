import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connect from '../../../../../libs/mongodb';
import User from '../../../../../models/user.model';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';


export async function POST(req) {
    try {
        const { email, password } = await req.json();

        await connect();

        // vérifier si l'utilisateur existe
        const user = await User.findOne({ email });

        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 400 });
        }

        // comparer le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return new Response(JSON.stringify({ error: 'Invalid password' }), { status: 400 });
        }

        // générer un token JWT
        const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // stocke le token dans un cookie sécurisé
        cookies().set({
            name: 'authToken',
            value: token,
            httpOnly: true,
            path: '/',
            maxAge: 86400,
        });

        console.log("cookies 2", cookies().get('authToken'));

        // supprime le mot de passe de la réponse
        const { password: _, ...userData } = user._doc;
        console.log("userdata", userData);


        return NextResponse.json(userData, { status: 200 });
    }
    catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
