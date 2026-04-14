// Service pour communiquer avec Supabase (PostgreSQL en ligne)

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mfpvfdrymuuycyyjgcae.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_CDzJYRLW8T2j8xccrA86DA_HYjACwHy';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface PhotoData {
  id: string;
  src: string;
  alt: string;
  timestamp: string;
  original_name?: string;
  originalName?: string;
}

export class SupabaseService {
  // Récupérer toutes les photos
  static async getAllPhotos(): Promise<PhotoData[]> {
    try {
      console.log('Chargement des photos depuis Supabase...');
      const { data, error } = await supabase
        .from('birthday_photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }

      console.log('Données reçues:', data);
      
      const photos = data.map((photo: any) => {
        console.log('Photo traitée:', photo);
        console.log('ID:', photo.id);
        console.log('Image data:', photo.image_data ? 'présent' : 'absent');
        console.log('Description:', photo.description);
        console.log('Created at:', photo.created_at);
        
        return {
          id: photo.id.toString(),
          src: photo.image_data || photo.image_url || '',
          alt: photo.description || 'Sans description',
          timestamp: photo.created_at,
          originalName: photo.original_name || 'photo.jpg'
        };
      });

      console.log('Photos formatées:', photos);
      return photos;
    } catch (error) {
      console.error('Erreur getAllPhotos complète:', error);
      return [];
    }
  }

  // Ajouter une photo (base64)
  static async uploadPhoto(imageData: string, description: string, originalName?: string): Promise<PhotoData> {
    try {
      const { data, error } = await supabase
        .from('birthday_photos')
        .insert([
          {
            image_data: imageData,
            description,
            original_name: originalName || 'photo.jpg',
            file_size: Math.round(imageData.length * 0.75), // Approximation
            mime_type: 'image/jpeg'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id.toString(),
        src: data.image_data,
        alt: data.description || '',
        timestamp: data.created_at,
        originalName: data.original_name
      };
    } catch (error) {
      console.error('Erreur uploadPhoto:', error);
      throw error;
    }
  }

  // Ajouter une photo avec upload de fichier
  static async uploadPhotoFile(file: File, description: string): Promise<PhotoData> {
    try {
      // Upload du fichier dans Supabase Storage
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('birthday-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Obtenir l'URL publique
      const { data: publicUrlData } = supabase.storage
        .from('birthday-photos')
        .getPublicUrl(fileName);

      // Sauvegarder les métadonnées dans la base de données
      const { data, error } = await supabase
        .from('birthday_photos')
        .insert([
          {
            image_url: publicUrlData.publicUrl,
            description,
            original_name: file.name,
            file_size: file.size,
            mime_type: file.type,
            storage_path: fileName
          }
        ])
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id.toString(),
        src: data.image_url,
        alt: data.description || '',
        timestamp: data.created_at,
        originalName: data.original_name
      };
    } catch (error) {
      console.error('Erreur uploadPhotoFile:', error);
      throw error;
    }
  }

  // Supprimer une photo
  static async deletePhoto(photoId: string): Promise<void> {
    try {
      // Récupérer les infos de la photo
      const { data: photo, error: fetchError } = await supabase
        .from('birthday_photos')
        .select('storage_path, image_data')
        .eq('id', photoId)
        .single();

      if (fetchError) throw fetchError;

      // Si c'est un fichier dans Storage, le supprimer
      if (photo.storage_path) {
        const { error: deleteError } = await supabase.storage
          .from('birthday-photos')
          .remove([photo.storage_path]);

        if (deleteError) throw deleteError;
      }

      // Supprimer l'entrée de la base de données
      const { error } = await supabase
        .from('birthday_photos')
        .delete()
        .eq('id', photoId);

      if (error) throw error;
    } catch (error) {
      console.error('Erreur deletePhoto:', error);
      throw error;
    }
  }
}
