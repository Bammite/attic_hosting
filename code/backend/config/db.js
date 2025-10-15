const mysql = require('mysql2/promise');
require('dotenv').config(); // Charge les variables d'environnement

// REMPLACEZ AVEC VOS PROPRES INFORMATIONS DE CONNEXION
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Utiliser un "pool" de connexions est une meilleure pratique pour la production
const pool = mysql.createPool(dbConfig);

async function testConnection() {
    try {
        await pool.query('SELECT 1');
        console.log('✅ Connecté à la base de données MySQL.');
    } catch (error) {
        console.error('❌ Erreur de connexion à la base de données:', error);
        process.exit(1); // Arrêter l'application si la connexion échoue
    }
}

module.exports = { pool, testConnection };