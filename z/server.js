const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("🟢 Nouvelle connexion:", socket.id);

    // Gestion des tweets
    socket.on("newTweet", (tweet) => {
        console.log("📝 Tweet reçu du client:", socket.id);
        io.emit("newTweet", tweet);
    });

    // Gestion des messages en temps réel
    socket.on("newMessage", (message) => {
        console.log("💬 Message reçu:", message);
        io.emit("newMessage", message);
    });

    // Gestion des commentaires en temps réel
    socket.on("newComment", (comment) => {
        console.log("💭 Nouveau commentaire reçu:", comment);
        io.emit("newComment", comment);
    });

    // Ajouter la gestion des likes
    socket.on("like", (data) => {
        console.log("❤️ Like reçu:", data);
        io.emit("likeUpdate", data);
    });

    socket.on("disconnect", () => {
        console.log("🔴 Client déconnecté:", socket.id);
    });
});

httpServer.listen(3001);
