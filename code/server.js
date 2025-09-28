const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 5000;

// --- Configuration de la base de données MySQL ---
// REMPLACEZ AVEC VOS PROPRES INFORMATIONS DE CONNEXION
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'mysql/22/09/2002',
    database: 'form_builder_db'
};

// Créez la table `forms` dans votre base de données avec cette commande SQL :
// CREATE TABLE forms (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   structure JSON NOT NULL,
//   last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );

let dbConnection;

async function connectToDatabase() {
    try {
        dbConnection = await mysql.createConnection(dbConfig);
        console.log('✅ Connecté à la base de données MySQL.');
    } catch (error) {
        console.error('❌ Erreur de connexion à la base de données:', error);
        process.exit(1); // Arrêter l'application si la connexion échoue
    }
}

// --- Middleware ---
app.use(express.json()); // Pour parser le JSON des requêtes
app.use(express.static(path.join(__dirname, 'public'))); // Servir les fichiers statiques (HTML, CSS, JS)

// --- Routes API ---

// GET : Récupérer la dernière structure de formulaire
app.get('/api/form', async (req, res) => {
    try {
        const [rows] = await dbConnection.execute('SELECT structure FROM forms ORDER BY id DESC LIMIT 1');
        if (rows.length > 0) {
            res.json(rows[0].structure);
        } else {
            res.json({ fields: [] }); // Renvoyer un formulaire vide s'il n'y en a pas
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du formulaire:', error);
        res.status(500).send('Erreur serveur');
    }
});

// POST : Sauvegarder une nouvelle structure de formulaire
app.post('/api/form', async (req, res) => {
    const { fields } = req.body;
    if (!fields) {
        return res.status(400).send('La structure des champs est manquante.');
    }

    try {
        const formStructure = JSON.stringify({ fields });
        await dbConnection.execute('INSERT INTO forms (structure) VALUES (?)', [formStructure]);
        
        // Envoyer la mise à jour à tous les clients connectés en temps réel
        io.emit('form-updated', { fields });

        res.status(201).json({ message: 'Formulaire sauvegardé avec succès !' });
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du formulaire:', error);
        res.status(500).send('Erreur serveur');
    }
});

// --- Socket.IO pour le temps réel ---
io.on('connection', (socket) => {
    console.log('🔌 Un utilisateur est connecté:', socket.id);

    socket.on('disconnect', () => {
        console.log(' déconnecté:', socket.id);
    });
});

// --- Démarrage du serveur ---
async function startServer() {
    await connectToDatabase();
    server.listen(PORT, () => {
        console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
}

startServer();