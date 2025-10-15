const express = require('express');
const path = require('path');
const apiRoutes = require('./backend/routes/indexRoute'); // Le routeur principal
const { errorHandler } = require('./errorHandler');

// Initialisation de l'application Express
const app = express();

// --- Middleware ---
app.use(express.json()); // Pour parser le JSON des requêtes
app.use(express.static(path.join(__dirname, 'public'))); // Servir les fichiers statiques (HTML, CSS, JS)

// --- Routes de l'API ---
// Toutes les requêtes vers /api/* seront gérées par notre routeur principal
app.use('/api', apiRoutes);

// --- Gestionnaire d'erreurs ---
// Ce middleware doit être le dernier à être ajouté.
app.use(errorHandler);

// Exporter l'application pour qu'elle soit utilisée par le serveur
module.exports = app;
 