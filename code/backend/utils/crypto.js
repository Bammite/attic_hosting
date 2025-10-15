const crypto = require('crypto');

// IMPORTANT : Ces valeurs doivent provenir de variables d'environnement en production.
const ENCRYPTION_KEY = process.env.SMTP_ENCRYPTION_KEY || 'abcdefghijklmnopqrstuvwxzy012345'; // Doit faire 32 caractères
const IV_LENGTH = 16; // Pour AES, c'est toujours 16

function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
   try {
       const textParts = text.split(':');
       const iv = Buffer.from(textParts.shift(), 'hex');
       const encryptedText = Buffer.from(textParts.join(':'), 'hex');
       const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
       let decrypted = decipher.update(encryptedText);
       decrypted = Buffer.concat([decrypted, decipher.final()]);
       return decrypted.toString();
   } catch (error) {
       console.error("Erreur de déchiffrement:", error);
       throw new Error("Impossible de déchiffrer le mot de passe SMTP.");
   }
}

module.exports = { encrypt, decrypt };