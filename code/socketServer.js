const { Server } = require("socket.io");

function initializeSocket(server) {
    const io = new Server(server, {
        // Options de configuration si nécessaire, par exemple pour CORS
        // cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] }
    });

    io.on('connection', (socket) => {
        console.log('🔌 Un utilisateur est connecté:', socket.id);

        socket.on('disconnect', () => {
            console.log(' déconnecté:', socket.id);
        });
    });

    return io; 
}

module.exports = { initializeSocket };