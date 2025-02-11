import mongoose from 'mongoose';

const connect = async () => {
    if (mongoose.connections[0].readyState) {
        console.log("Déjà connecté à MongoDB");
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            dbName: 'Z',
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("On est connecté à MongoDB ");
    } catch (error) {
        console.error("Problème de connexion:", error.message);
        throw new Error("Échec de connexion à la base de données");
    }
};


let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = connect();
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (e) {
        cached.promise = null;
        throw e;
    }
}