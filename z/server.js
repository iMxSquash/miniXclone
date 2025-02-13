const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("Nouvelle connexion:", socket.id);

    socket.on("message", (msg) => {
        console.log("Message reçu:", msg);
        io.emit("message", msg); // Réémet à tous les clients
    });

    socket.on("disconnect", () => {
        console.log("Utilisateur déconnecté:", socket.id);
    });
});

httpServer.listen(3001, () => {
    console.log("Socket.IO Server lancé sur http://localhost:3001");
});
