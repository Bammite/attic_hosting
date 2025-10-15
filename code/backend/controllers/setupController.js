const { pool } = require('../config/db');

// Le script SQL complet pour initialiser la base de données.
// L'ajout de "IF NOT EXISTS" rend le script idempotent (exécutable plusieurs fois sans erreur).
const setupSQL = `
-- 1. Table pour les utilisateurs de la plateforme
CREATE TABLE IF NOT EXISTS \`users\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`username\` VARCHAR(100) NOT NULL UNIQUE,
    \`email\` VARCHAR(255) NOT NULL UNIQUE,
    \`password_hash\` VARCHAR(255) NOT NULL,
    \`role\` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    \`developpeur\` BOOLEAN NOT NULL DEFAULT FALSE,
    \`etudiant\` BOOLEAN NOT NULL DEFAULT FALSE,
    \`creer_par\` INT(11) NULL,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Table pour définir les services principaux et auxiliaires
CREATE TABLE IF NOT EXISTS \`services\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`name\` VARCHAR(255) NOT NULL UNIQUE,
    \`logo_url\` VARCHAR(255),
    \`type\` ENUM('majeur', 'auxiliaire') NOT NULL,
    \`is_available\` BOOLEAN NOT NULL DEFAULT TRUE,
    \`is_free\` BOOLEAN NOT NULL DEFAULT FALSE,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Table pour les descriptions marketing des services
CREATE TABLE IF NOT EXISTS \`service_descriptions\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`service_id\` INT NOT NULL UNIQUE,
    \`hero_description\` TEXT,
    \`hero_image_url\` VARCHAR(255),
    \`hero_video_url\` VARCHAR(255),
    \`details_1\` TEXT,
    \`details_2\` TEXT,
    \`promo_video_url\` VARCHAR(255),
    FOREIGN KEY (\`service_id\`) REFERENCES \`services\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Table pour définir les différents forfaits (plans) pour chaque service
CREATE TABLE IF NOT EXISTS \`service_plans\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`service_id\` INT NOT NULL,
    \`name\` VARCHAR(100) NOT NULL,
    \`price\` DECIMAL(10, 2) NOT NULL,
    \`features\` JSON,
    \`promo_discount_1\` DECIMAL(5, 2) COMMENT 'Ex: 10.00 pour 10%',
    \`promo_discount_2\` DECIMAL(5, 2),
    \`promo_discount_3\` DECIMAL(5, 2),
    UNIQUE(\`service_id\`, \`name\`),
    FOREIGN KEY (\`service_id\`) REFERENCES \`services\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Table pour lier les utilisateurs à leurs abonnements (modifiée)
CREATE TABLE IF NOT EXISTS \`user_subscriptions\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`user_id\` INT NOT NULL,
    \`plan_id\` INT NOT NULL,
    \`start_date\` TIMESTAMP NOT NULL,
    \`end_date\` TIMESTAMP NOT NULL,
    \`status\` ENUM('active', 'canceled', 'expired') NOT NULL DEFAULT 'active',
    INDEX \`idx_user_id\` (\`user_id\`),
    INDEX \`idx_plan_id\` (\`plan_id\`),
    FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
    FOREIGN KEY (\`plan_id\`) REFERENCES \`service_plans\`(\`id\`) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 6. Table pour stocker la structure des formulaires
CREATE TABLE IF NOT EXISTS \`forms\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`user_id\` INT NOT NULL,
    \`title\` VARCHAR(255) NOT NULL,
    \`structure\` JSON NOT NULL,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX \`idx_user_id\` (\`user_id\`),
    FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Table pour collecter les réponses des formulaires
CREATE TABLE IF NOT EXISTS \`form_responses\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`form_id\` INT NOT NULL,
    \`data\` JSON NOT NULL,
    \`submitted_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX \`idx_form_id\` (\`form_id\`),
    FOREIGN KEY (\`form_id\`) REFERENCES \`forms\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Table pour stocker les templates d'email
CREATE TABLE IF NOT EXISTS \`email_templates\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`user_id\` INT NOT NULL,
    \`name\` VARCHAR(255) NOT NULL,
    \`subject\` VARCHAR(255) NOT NULL,
    \`body_html\` LONGTEXT,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX \`idx_user_id\` (\`user_id\`),
    FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. Table pour l'historique des communications (emails & SMS)
CREATE TABLE IF NOT EXISTS \`communication_logs\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`user_id\` INT NOT NULL,
    \`type\` ENUM('email', 'sms') NOT NULL,
    \`recipient\` VARCHAR(255) NOT NULL,
    \`status\` ENUM('sent', 'failed', 'pending') NOT NULL DEFAULT 'pending',
    \`sent_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    \`error_message\` TEXT,
    INDEX \`idx_user_id\` (\`user_id\`),
    INDEX \`idx_type_status\` (\`type\`, \`status\`),
    FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. Table pour stocker les contacts des utilisateurs
-- (Ancienne table remplacée par une structure plus flexible)
DROP TABLE IF EXISTS \`contacts\`;
CREATE TABLE IF NOT EXISTS \`contacts\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`user_id\` INT NOT NULL,
    \`name\` VARCHAR(255) NOT NULL,
    \`description\` TEXT,
    \`category\` ENUM('entreprise', 'particulier') DEFAULT 'particulier',
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Nouvelle table pour les détails de contact (emails, téléphones)
CREATE TABLE IF NOT EXISTS \`contact_details\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`contact_id\` INT NOT NULL,
    \`type\` ENUM('email', 'phone') NOT NULL,
    \`value\` VARCHAR(255) NOT NULL,
    FOREIGN KEY (\`contact_id\`) REFERENCES \`contacts\`(\`id\`) ON DELETE CASCADE,
    UNIQUE KEY \`unique_contact_detail\` (\`contact_id\`, \`type\`, \`value\`)
) ENGINE=InnoDB;

-- Nouvelle table pour les champs personnalisés des contacts
CREATE TABLE IF NOT EXISTS \`contact_custom_fields\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`contact_id\` INT NOT NULL,
    \`field_key\` VARCHAR(100) NOT NULL,
    \`field_value\` VARCHAR(255) NOT NULL,
    FOREIGN KEY (\`contact_id\`) REFERENCES \`contacts\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 11. Table pour stocker les configurations des expéditeurs d'email
CREATE TABLE IF NOT EXISTS \`email_senders\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`user_id\` INT NOT NULL,
    \`email_address\` VARCHAR(255) NOT NULL,
    \`provider_name\` VARCHAR(100) NOT NULL COMMENT 'Nom personnalisé, ex: Mon Compte Gmail',
    \`smtp_host\` VARCHAR(255) NOT NULL,
    \`smtp_port\` INT NOT NULL,
    \`smtp_user\` VARCHAR(255) NOT NULL,
    \`smtp_pass_encrypted\` TEXT NOT NULL COMMENT 'Mot de passe SMTP chiffré',
    \`smtp_secure\` BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'True pour SSL/TLS',
    \`is_default\` BOOLEAN NOT NULL DEFAULT FALSE,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
    UNIQUE KEY \`unique_user_email_sender\` (\`user_id\`, \`email_address\`)
) ENGINE=InnoDB;
`;

const initializeDatabase = async (req, res, next) => {
    try {
        // Sépare le script en commandes individuelles
        const statements = setupSQL.split(';').filter(s => s.trim().length > 0);

        // Exécute chaque commande
        for (const statement of statements) {
            await pool.query(statement);
        }

        res.status(200).json({ message: '✅ Base de données initialisée avec succès. Les tables ont été créées ou existaient déjà.' });
    } catch (error) {
        // Transmet l'erreur au gestionnaire central
        next(error);
    }
};

module.exports = {
    initializeDatabase
};
