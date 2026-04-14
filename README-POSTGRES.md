# Configuration PostgreSQL pour l'application d'anniversaire

## Architecture
- **Frontend** : React/Vite (port 5173)
- **Backend** : Node.js/Express (port 3001)
- **Base de données** : PostgreSQL

## Installation et configuration

### 1. Installer PostgreSQL
```bash
# macOS avec Homebrew
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# Télécharger depuis https://www.postgresql.org/download/windows/
```

### 2. Créer la base de données
```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE birthday_app;

# Quitter psql
\q
```

### 3. Importer le schéma
```bash
# Depuis le dossier backend
psql -U postgres -d birthday_app -f database.sql
```

### 4. Configurer le backend
```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Éditer .env avec vos informations
nano .env
```

### 5. Démarrer le backend
```bash
# Développement (avec nodemon)
npm run dev

# Production
npm start
```

### 6. Démarrer le frontend
```bash
# Depuis le dossier racine
npm run dev
```

## Configuration .env
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=birthday_app
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
PORT=3001
FRONTEND_URL=http://localhost:5173
```

## Fonctionnalités

### API Endpoints

#### GET /api/photos
Récupère toutes les photos
```json
[
  {
    "id": "1",
    "src": "http://localhost:3001/uploads/photo-123456789.jpg",
    "alt": "Description de la photo",
    "timestamp": "2024-01-01T12:00:00Z"
  }
]
```

#### POST /api/photos
Ajoute une nouvelle photo (multipart/form-data)
- `image`: Fichier image
- `description`: Texte de description

#### POST /api/photos/base64
Ajoute une photo en base64
```json
{
  "imageData": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA...",
  "description": "Description",
  "mimeType": "image/jpeg",
  "fileSize": 1234567
}
```

#### DELETE /api/photos/:id
Supprime une photo

### Base de données

#### Table birthday_photos
- `id`: Serial (Primary Key)
- `filename`: Nom du fichier stocké
- `original_name`: Nom original du fichier
- `description`: Texte de description
- `file_size`: Taille en octets
- `mime_type`: Type MIME
- `created_at`: Date de création
- `updated_at`: Date de modification

#### Table birthday_photos_base64 (alternative)
- `id`: Serial (Primary Key)
- `image_data`: Image en base64
- `description`: Texte de description
- `file_size`: Taille en octets
- `mime_type`: Type MIME
- `created_at`: Date de création
- `updated_at`: Date de modification

## Déploiement

### Option 1: Heroku
1. Créer une app Heroku
2. Ajouter l'add-on PostgreSQL
3. Déployer le backend
4. Configurer les variables d'environnement

### Option 2: Railway
1. Connecter votre repo GitHub
2. Ajouter le service PostgreSQL
3. Configurer les variables d'environnement

### Option 3: VPS (DigitalOcean, etc.)
1. Installer PostgreSQL
2. Configurer Nginx comme reverse proxy
3. Déployer le backend avec PM2
4. Configurer SSL

## Avantages de PostgreSQL

- **Performance**: Excellent pour les requêtes complexes
- **Fiabilité**: Très stable et robuste
- **Scalabilité**: Gère bien les grosses quantités de données
- **Sécurité**: Contrôle d'accès granulaire
- **Open Source**: Gratuit et communautaire

## Limites

- Nécessite un serveur dédié
- Configuration plus complexe que Firebase
- Maintenance requise

## Alternative: Base64

Pour éviter de gérer les fichiers physiques, vous pouvez utiliser l'endpoint `/api/photos/base64` qui stocke les images directement dans la base de données en format base64.

**Attention**: Cette méthode utilise plus d'espace de stockage mais simplifie la gestion des fichiers.
