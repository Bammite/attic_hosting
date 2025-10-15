const http = require('http');
const app = require('./app');
const { testConnection } = require('./backend/config/db');
const { initializeSocket } = require('./socketServer');

// Création du serveur HTTP à partir de l'application Express
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

// --- Initialisation des services ---

// 1. Initialiser Socket.IO et l'attacher au serveur HTTP
const io = initializeSocket(server);

// 2. Rendre `io` accessible dans toute l'application (notamment les contrôleurs)
app.set('io', io);

// --- Démarrage du serveur ---
async function startServer() {
    // 1. Tester la connexion à la base de données
    await testConnection();

    // 2. Démarrer le serveur pour écouter les requêtes
    server.listen(PORT, () => {
        console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
}

startServer();