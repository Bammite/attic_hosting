const { Server } = require("socket.io");

let io;

function initializeSocket(server) {
    io = new Server(server);

    io.on('connection', (socket) => {
        console.log('🔌 Un utilisateur est connecté:', socket.id);

        socket.on('disconnect', () => {
            console.log(' déconnecté:', socket.id);
        });
    });

    return io;
}

module.exports = { initializeSocket };