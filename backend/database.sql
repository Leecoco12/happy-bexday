-- Création de la base de données
CREATE DATABASE birthday_app;

-- Connexion à la base de données
\c birthday_app;

-- Table pour stocker les informations des photos
CREATE TABLE birthday_photos (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    description TEXT,
    file_size INTEGER,
    mime_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour stocker les images en base64 (alternative)
CREATE TABLE birthday_photos_base64 (
    id SERIAL PRIMARY KEY,
    image_data TEXT NOT NULL, -- Base64
    description TEXT,
    file_size INTEGER,
    mime_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_birthday_photos_created_at ON birthday_photos(created_at);
CREATE INDEX idx_birthday_photos_base64_created_at ON birthday_photos_base64(created_at);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_birthday_photos_updated_at 
    BEFORE UPDATE ON birthday_photos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_birthday_photos_base64_updated_at 
    BEFORE UPDATE ON birthday_photos_base64 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
