const express = require('express');
const { Pool } = require('pg');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuration PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'birthday_app',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Créer le dossier uploads s'il n'existe pas
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuration Multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers image sont autorisés'), false);
    }
  }
});

// Routes API

// GET - Récupérer toutes les photos
app.get('/api/photos', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, filename, original_name, description, file_size, mime_type, created_at FROM birthday_photos ORDER BY created_at DESC'
    );
    
    const photos = result.rows.map(photo => ({
      id: photo.id.toString(),
      src: `${req.protocol}://${req.get('host')}/uploads/${photo.filename}`,
      alt: photo.description || '',
      timestamp: photo.created_at,
      originalName: photo.original_name
    }));
    
    res.json(photos);
  } catch (error) {
    console.error('Erreur récupération photos:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST - Ajouter une nouvelle photo
app.post('/api/photos', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier image fourni' });
    }

    const { description } = req.body;
    
    const result = await pool.query(
      'INSERT INTO birthday_photos (filename, original_name, description, file_size, mime_type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.file.filename, req.file.originalname, description, req.file.size, req.file.mimetype]
    );

    const newPhoto = {
      id: result.rows[0].id.toString(),
      src: `${req.protocol}://${req.get('host')}/uploads/${result.rows[0].filename}`,
      alt: description || '',
      timestamp: result.rows[0].created_at,
      originalName: result.rows[0].original_name
    };

    res.status(201).json(newPhoto);
  } catch (error) {
    console.error('Erreur ajout photo:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE - Supprimer une photo
app.delete('/api/photos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Récupérer le nom du fichier avant de supprimer
    const photoResult = await pool.query('SELECT filename FROM birthday_photos WHERE id = $1', [id]);
    
    if (photoResult.rows.length === 0) {
      return res.status(404).json({ error: 'Photo non trouvée' });
    }

    const filename = photoResult.rows[0].filename;
    
    // Supprimer de la base de données
    await pool.query('DELETE FROM birthday_photos WHERE id = $1', [id]);
    
    // Supprimer le fichier physique
    const filePath = path.join(__dirname, 'uploads', filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: 'Photo supprimée avec succès' });
  } catch (error) {
    console.error('Erreur suppression photo:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Alternative: POST pour les images en base64
app.post('/api/photos/base64', async (req, res) => {
  try {
    const { imageData, description, mimeType, fileSize } = req.body;
    
    if (!imageData) {
      return res.status(400).json({ error: 'Aucune image fournie' });
    }

    const result = await pool.query(
      'INSERT INTO birthday_photos_base64 (image_data, description, file_size, mime_type) VALUES ($1, $2, $3, $4) RETURNING *',
      [imageData, description, fileSize, mimeType]
    );

    const newPhoto = {
      id: result.rows[0].id.toString(),
      src: imageData, // Base64 directement
      alt: description || '',
      timestamp: result.rows[0].created_at
    };

    res.status(201).json(newPhoto);
  } catch (error) {
    console.error('Erreur ajout photo base64:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET - Récupérer les photos en base64
app.get('/api/photos/base64', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, image_data, description, created_at FROM birthday_photos_base64 ORDER BY created_at DESC'
    );
    
    const photos = result.rows.map(photo => ({
      id: photo.id.toString(),
      src: photo.image_data, // Base64
      alt: photo.description || '',
      timestamp: photo.created_at
    }));
    
    res.json(photos);
  } catch (error) {
    console.error('Erreur récupération photos base64:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});

// Test de connexion à la base de données
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erreur de connexion à PostgreSQL:', err);
  } else {
    console.log('Connecté à PostgreSQL avec succès');
  }
});
