// Service pour communiquer avec ImgBB (stockage d'images gratuit et illimité)

export interface PhotoData {
  id: string;
  src: string;
  alt: string;
  timestamp: Date;
  originalName?: string;
  delete_url?: string;
  display_url?: string;
  url?: string;
}

export interface ImgBBResponse {
  data: {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    width: string;
    height: string;
    size: string;
    time: string;
    expiration: string;
    image: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    thumb: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    medium: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    delete_url: string;
  };
  success: boolean;
  status: number;
}

export class ImgBBService {
  private static readonly API_KEY = '31ae40778f308fee096a3a34b8115e44'; // Clé API ImgBB v1
  private static readonly STORAGE_KEY = 'birthday_images_laro';
  private static readonly REMOTE_MANIFEST_URL = '/imgbb-images.json';
  
    
  // Upload une image
  static async uploadImage(file: File | string, description: string): Promise<PhotoData> {
    try {
      if (!(file instanceof File)) {
        throw new Error('Le paramètre file doit être un objet File');
      }
      
      console.log('Upload ImgBB:', file.name, 'Taille:', file.size, 'Type:', file.type);
      
      // Upload vers ImgBB avec le fichier directement
      const formData = new FormData();
      formData.append('image', file);
      formData.append('name', description); // Utiliser la description comme nom de fichier
      
      console.log('Envoi vers ImgBB API v1...');
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${this.API_KEY}`, {
        method: 'POST',
        body: formData,
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      console.log('Réponse ImgBB status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erreur ImgBB response:', errorText);
        throw new Error(`Erreur upload ImgBB: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Upload ImgBB réussi:', result);
      console.log('URL brute:', result.data.url);
      console.log('Display URL:', result.data.display_url);
      console.log('Image URL:', result.data.image?.url);
      
      // Créer l'objet image - prioriser l'URL d'affichage publique
      const imageUrl = result.data.display_url || result.data.image?.url || result.data.url;
      console.log('URL finale utilisée:', imageUrl);
      
      const imageData: PhotoData = {
        id: result.data.id,
        // La source affichée doit venir de la réponse d'upload ImgBB.
        src: imageUrl,
        alt: description,
        timestamp: new Date(),
        originalName: file.name,
        delete_url: result.data.delete_url, // Stocker l'URL de suppression
        display_url: result.data.display_url,
        url: result.data.url
      };
      
      // Sauvegarder dans localStorage
      this.saveToLocalStorage(imageData);
      
      return imageData;
    } catch (error) {
      console.error('Erreur upload ImgBB:', error);
      throw error;
    }
  }
  
  // Récupérer toutes les images
  static async getAllImages(): Promise<PhotoData[]> {
    try {
      console.log('Chargement des images depuis localStorage...');

      const savedImages = localStorage.getItem(this.STORAGE_KEY);
      const localImages = savedImages ? JSON.parse(savedImages) : [];
      console.log('Images locales brutes chargées:', localImages.length);

      // Fallback distant optionnel (fichier statique) pour précharger des images ImgBB déjà existantes
      // sans dépendre du navigateur qui a fait l'upload initial.
      let remoteManifestImages: any[] = [];
      try {
        const remoteResponse = await fetch(this.REMOTE_MANIFEST_URL, { cache: 'no-store' });
        if (remoteResponse.ok) {
          const remotePayload = await remoteResponse.json();
          if (Array.isArray(remotePayload)) {
            remoteManifestImages = remotePayload;
            console.log('Images distantes chargées:', remoteManifestImages.length);
          }
        }
      } catch (remoteError) {
        console.warn('Manifest distant indisponible:', remoteError);
      }

      // Prioriser les images issues des uploads locaux (réponse upload ImgBB)
      // pour éviter qu'une ancienne URL du manifest écrase la plus récente.
      const mergedRawImages = [...localImages, ...remoteManifestImages];

      // Normaliser différents formats d'objets image (anciennes structures incluses).
      const mappedImages: Array<PhotoData | null> = mergedRawImages
        .map((img: any) => {
          const rawSrc =
            img?.display_url ||
            img?.src ||
            img?.url ||
            img?.image?.url ||
            img?.data?.display_url ||
            img?.data?.url ||
            img?.data?.image?.url;

          const isValidUrl =
            typeof rawSrc === 'string' &&
            rawSrc.length > 0 &&
            !rawSrc.startsWith('data:') &&
            /^https?:\/\//.test(rawSrc);

          if (!isValidUrl) {
            console.log('Filtrage image invalide:', img?.originalName || img?.name || 'Sans nom');
            return null;
          }

          return {
            id: img?.id || rawSrc,
            src: rawSrc,
            alt: img?.alt || img?.description || img?.title || 'Photo',
            timestamp: img?.timestamp ? new Date(img.timestamp) : new Date(),
            originalName: img?.originalName || img?.name,
            delete_url: img?.delete_url,
            display_url: img?.display_url || img?.data?.display_url,
            url: img?.url || img?.data?.url
          };
        });

      const normalizedImages: PhotoData[] = mappedImages.filter(
        (img): img is PhotoData => img !== null
      );

      // Dédupliquer sur l'ID puis sur l'URL pour éviter les doublons local + distant.
      const uniqueById = new Map<string, PhotoData>();
      normalizedImages.forEach((img) => {
        if (!uniqueById.has(img.id)) {
          uniqueById.set(img.id, img);
        }
      });

      const uniqueBySrc = new Map<string, PhotoData>();
      Array.from(uniqueById.values()).forEach((img) => {
        if (!uniqueBySrc.has(img.src)) {
          uniqueBySrc.set(img.src, img);
        }
      });

      const finalImages = Array.from(uniqueBySrc.values()).sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
      );

      console.log('Images valides après fusion/filtrage:', finalImages.length);

      // Conserver localement la liste normalisée pour les prochains chargements.
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(finalImages));

      return finalImages;
    } catch (error) {
      console.error('Erreur chargement images:', error);
      return [];
    }
  }
  
  // Supprimer une image
  static async deleteImage(imageId: string): Promise<void> {
    try {
      console.log('Suppression ImgBB:', imageId);
      
      // Supprimer de ImgBB - utiliser l'URL de suppression fournie dans la réponse d'upload
      // D'abord récupérer l'URL de suppression depuis localStorage
      const savedImages = localStorage.getItem(this.STORAGE_KEY);
      if (savedImages) {
        const images = JSON.parse(savedImages);
        const imageToDelete = images.find((img: any) => img.id === imageId);
        if (imageToDelete && imageToDelete.delete_url) {
          const response = await fetch(imageToDelete.delete_url, {
            method: 'GET'
          });
          
          if (!response.ok) {
            console.warn('Impossible de supprimer de ImgBB, suppression locale uniquement');
          }
        }
      }
      
      // Supprimer du localStorage
      this.removeFromLocalStorage(imageId);
      
      console.log('Suppression réussie');
    } catch (error) {
      console.error('Erreur suppression ImgBB:', error);
      throw error;
    }
  }
  
  // Sauvegarder dans localStorage
  private static saveToLocalStorage(imageData: PhotoData): void {
    try {
      const savedImages = localStorage.getItem(this.STORAGE_KEY);
      const images = savedImages ? JSON.parse(savedImages) : [];

      // Upsert par id pour toujours garder la dernière URL issue de l'upload.
      const withoutCurrent = images.filter((img: any) => img.id !== imageData.id);

      // Ajouter au début (plus récent d'abord)
      withoutCurrent.unshift(imageData);
      
      // Limiter à 100 images pour éviter la surcharge
      const limitedImages = withoutCurrent.slice(0, 100);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limitedImages));
      console.log('Image sauvegardée dans localStorage:', imageData.originalName);
    } catch (error) {
      console.error('Erreur sauvegarde localStorage:', error);
    }
  }
  
  // Supprimer du localStorage
  private static removeFromLocalStorage(imageId: string): void {
    try {
      const savedImages = localStorage.getItem(this.STORAGE_KEY);
      if (!savedImages) return;
      
      const images = JSON.parse(savedImages);
      const filteredImages = images.filter((img: any) => img.id !== imageId);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredImages));
      console.log('Image supprimée du localStorage:', imageId);
    } catch (error) {
      console.error('Erreur suppression localStorage:', error);
    }
  }
}
