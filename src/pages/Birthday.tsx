import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import styles from './Birthday.module.css';
import { SupabaseService } from '../services/supabaseService';
import { supabase } from '../services/supabaseService';
import './loading-styles.css';

interface CapturedPhoto {
  id: string;
  src: string;
  alt: string;
  timestamp: Date;
}

export function Birthday() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [pendingPhoto, setPendingPhoto] = useState<CapturedPhoto | null>(null);
  const [showDescriptionDialog, setShowDescriptionDialog] = useState(false);
  const [imageDescription, setImageDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tester la connexion et charger les photos depuis Supabase au démarrage
  useEffect(() => {
    console.log('Démarrage du chargement des photos...');
    console.log('Test de connexion à Supabase...');
    
    // Test de connexion simple
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from('birthday_photos').select('count');
        if (error) {
          console.error('Erreur de connexion à Supabase:', error);
          return false;
        } else {
          console.log('Connexion Supabase réussie !');
          console.log('Nombre de photos dans la base:', data);
          return true;
        }
      } catch (e) {
        console.error('Erreur test connexion:', e);
        return false;
      }
    };
    
    const loadPhotos = async () => {
      // D'abord tester la connexion
      const isConnected = await testConnection();
      if (!isConnected) {
        console.log('Connexion échouée, utilisation du fallback localStorage');
        setIsLoading(false);
        return;
      }
      
      try {
        console.log('Appel à SupabaseService.getAllPhotos()');
        const photos = await SupabaseService.getAllPhotos();
        console.log('Photos reçues de Supabase:', photos);
        
        if (photos && photos.length > 0) {
          const formattedPhotos = photos.map((photo: any) => ({
            id: photo.id,
            src: photo.src,
            alt: photo.alt,
            timestamp: new Date(photo.timestamp)
          }));
          console.log('Photos formatées:', formattedPhotos);
          setCapturedPhotos(formattedPhotos);
        } else {
          console.log('Aucune photo trouvée dans Supabase');
          setCapturedPhotos([]);
        }
      } catch (error) {
        console.error('Erreur chargement photos Supabase:', error);
        console.log('Tentative de fallback avec localStorage...');
        // Fallback: utiliser localStorage
        const savedPhotos = localStorage.getItem('birthdayPhotos');
        if (savedPhotos) {
          try {
            const parsedPhotos = JSON.parse(savedPhotos);
            setCapturedPhotos(parsedPhotos);
            console.log('Photos chargées depuis localStorage:', parsedPhotos.length);
          } catch (e) {
            console.error('Erreur parsing localStorage:', e);
            setCapturedPhotos([]);
          }
        } else {
          console.log('Aucune photo dans localStorage');
          setCapturedPhotos([]);
        }
      } finally {
        setIsLoading(false);
        console.log('Chargement terminé, isLoading = false');
      }
    };

    loadPhotos();
  }, []);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        const newPhoto: CapturedPhoto = {
          id: Date.now().toString(),
          src: imageData,
          alt: '',
          timestamp: new Date()
        };
        
        setPendingPhoto(newPhoto);
        setShowDescriptionDialog(true);
      };
      reader.readAsDataURL(file);
    }
    
    // Reset input value to allow selecting the same file again
    if (event.target) {
      event.target.value = '';
    }
  };

  const deletePhoto = async (photoId: string) => {
    setIsDeleting(photoId);
    try {
      console.log('Début de la suppression de la photo:', photoId);
      await SupabaseService.deletePhoto(photoId);
      console.log('Suppression réussie, rechargement de toutes les photos...');
      
      // Recharger toutes les photos depuis Supabase pour s'assurer d'avoir tout
      const allPhotos = await SupabaseService.getAllPhotos();
      const formattedPhotos = allPhotos.map((photo: any) => ({
        id: photo.id,
        src: photo.src,
        alt: photo.alt,
        timestamp: new Date(photo.timestamp)
      }));
      
      console.log('Toutes les photos rechargées après suppression:', formattedPhotos.length);
      setCapturedPhotos(formattedPhotos);
    } catch (error) {
      console.error('Erreur suppression photo Supabase:', error);
      // Fallback: supprimer seulement localement
      setCapturedPhotos(prev => prev.filter(photo => photo.id !== photoId));
    } finally {
      setIsDeleting(null);
      console.log('Suppression terminée, isDeleting = null');
    }
  };

  const confirmDescription = async () => {
    if (pendingPhoto && imageDescription.trim()) {
      setIsUploading(true);
      try {
        console.log('Début de l\'upload de la photo...');
        // Utiliser l'upload base64 plus simple
        await SupabaseService.uploadPhoto(
          pendingPhoto.src, 
          imageDescription.trim(),
          'photo.jpg'
        );
        
        console.log('Upload réussi, rechargement de toutes les photos...');
        
        // Recharger toutes les photos depuis Supabase pour s'assurer d'avoir tout
        const allPhotos = await SupabaseService.getAllPhotos();
        const formattedPhotos = allPhotos.map((photo: any) => ({
          id: photo.id,
          src: photo.src,
          alt: photo.alt,
          timestamp: new Date(photo.timestamp)
        }));
        
        console.log('Toutes les photos rechargées:', formattedPhotos.length);
        setCapturedPhotos(formattedPhotos);
        setPendingPhoto(null);
        setShowDescriptionDialog(false);
        setImageDescription('');
      } catch (error) {
        console.error('Erreur upload photo Supabase:', error);
        // Fallback: utiliser le localStorage
        const photoWithDescription: CapturedPhoto = {
          ...pendingPhoto,
          alt: imageDescription.trim()
        };
        
        setCapturedPhotos(prev => [photoWithDescription, ...prev]);
        setPendingPhoto(null);
        setShowDescriptionDialog(false);
        setImageDescription('');
      } finally {
        setIsUploading(false);
        console.log('Upload terminé, isUploading = false');
      }
    }
  };

  const cancelDescription = () => {
    setPendingPhoto(null);
    setShowDescriptionDialog(false);
    setImageDescription('');
  };


  const allImages = capturedPhotos;

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.button
          className={styles.backButton}
          onClick={() => navigate('/special')}
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Retour
        </motion.button>

        <h1 className={styles.title}>Votre Galerie d'Anniversaire &#x1f389;</h1>

        {isLoading ? (
          <motion.div
            className={styles.descriptionSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className={styles.descriptionText}>
              <div className={styles.loadingSpinner}>
                <span>Chargement de vos photos...</span>
                <div className={styles.spinner}></div>
              </div>
            </p>
          </motion.div>
        ) : capturedPhotos.length === 0 ? (
          <motion.div
            className={styles.descriptionSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className={styles.descriptionText}>
              Commencez à créer votre galerie de souvenirs ! Ajoutez vos photos 
              et décrivez chaque moment précieux de cette journée spéciale.
            </p>
          </motion.div>
        ) : null}

        <motion.div
          className={styles.cameraSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            className={styles.cameraButton}
            onClick={openFileSelector}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ajouter une photo
          </motion.button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          
          {capturedPhotos.length > 0 && (
            <div className={styles.photoCount}>
              {capturedPhotos.length} photo{capturedPhotos.length > 1 ? 's' : ''} ajoutée{capturedPhotos.length > 1 ? 's' : ''}
            </div>
          )}
        </motion.div>


        <div className={styles.gallery}>
          {allImages.map((image, index) => (
            <motion.div
              key={index}
              className={styles.imageContainer}
              onClick={() => openLightbox(index)}
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.1, 
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className={styles.image}
                loading="lazy"
              />
              <div className={styles.overlay}>
                <span className={styles.overlayText}>{image.alt}</span>
                <button
                    className={styles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      const photoId = (image as CapturedPhoto).id;
                      if (photoId) {
                        deletePhoto(photoId);
                      } else {
                        console.error('Pas d\'ID pour cette photo:', image);
                      }
                    }}
                    disabled={isDeleting === (image as CapturedPhoto).id}
                    style={{ 
                      opacity: isDeleting === (image as CapturedPhoto).id ? 0.5 : 1,
                      cursor: isDeleting === (image as CapturedPhoto).id ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isDeleting === (image as CapturedPhoto).id ? '...' : '🗑️'}
                  </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {selectedImage !== null && (
        <motion.div
          className={styles.lightbox}
          onClick={closeLightbox}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={allImages[selectedImage].src}
              alt={allImages[selectedImage].alt}
              className={styles.lightboxImage}
            />
            <motion.button
              className={styles.closeButton}
              onClick={closeLightbox}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {showDescriptionDialog && pendingPhoto && (
        <motion.div
          className={styles.confirmDialog}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className={styles.confirmDialogContent}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className={styles.confirmTitle}>Décrire cette photo</h3>
            <div className={styles.confirmPreview}>
              <img 
                src={pendingPhoto.src} 
                alt="Photo sélectionnée" 
                className={styles.confirmImage}
              />
            </div>
            <div className={styles.descriptionInput}>
              <textarea
                value={imageDescription}
                onChange={(e) => setImageDescription(e.target.value)}
                placeholder="Décrivez ce moment spécial..."
                className={styles.descriptionTextarea}
                maxLength={200}
              />
              <div className={styles.characterCount}>
                {imageDescription.length}/200
              </div>
            </div>
            <div className={styles.confirmButtons}>
              <motion.button
                className={styles.confirmButton}
                onClick={confirmDescription}
                disabled={!imageDescription.trim() || isUploading}
                whileHover={{ scale: imageDescription.trim() && !isUploading ? 1.05 : 1 }}
                whileTap={{ scale: imageDescription.trim() && !isUploading ? 0.95 : 1 }}
              >
                {isUploading ? 'Ajout en cours...' : 'Ajouter la photo'}
              </motion.button>
              <motion.button
                className={styles.rejectButton}
                onClick={cancelDescription}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Annuler
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
