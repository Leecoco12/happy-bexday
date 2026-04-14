// Service pour communiquer avec le backend PostgreSQL

const API_BASE_URL = 'http://localhost:3001/api';

export interface PhotoData {
  id: string;
  src: string;
  alt: string;
  timestamp: string;
  originalName?: string;
}

export class PostgresService {
  // Récupérer toutes les photos
  static async getAllPhotos(): Promise<PhotoData[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/photos`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des photos');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur getAllPhotos:', error);
      return [];
    }
  }

  // Ajouter une photo (fichier)
  static async uploadPhoto(file: File, description: string): Promise<PhotoData> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('description', description);

      const response = await fetch(`${API_BASE_URL}/photos`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload de la photo');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur uploadPhoto:', error);
      throw error;
    }
  }

  // Ajouter une photo (base64)
  static async uploadPhotoBase64(imageData: string, description: string, mimeType: string, fileSize: number): Promise<PhotoData> {
    try {
      const response = await fetch(`${API_BASE_URL}/photos/base64`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData,
          description,
          mimeType,
          fileSize
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload de la photo base64');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur uploadPhotoBase64:', error);
      throw error;
    }
  }

  // Supprimer une photo
  static async deletePhoto(photoId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/photos/${photoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la photo');
      }
    } catch (error) {
      console.error('Erreur deletePhoto:', error);
      throw error;
    }
  }

  // Alternative: Récupérer les photos en base64
  static async getAllPhotosBase64(): Promise<PhotoData[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/photos/base64`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des photos base64');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur getAllPhotosBase64:', error);
      return [];
    }
  }
}
