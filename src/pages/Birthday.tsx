import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import styles from './Birthday.module.css';
import { ImgBBService } from '../services/imgbbService';
import carteImage from '../assets/images/Carte.png';
import bouquetImage from '../assets/images/bouquet.png';
import bouquetImage2 from '../assets/images/bouq.png';
import cadeauImage from '../assets/images/Cadeau.png';
import laroImage from '../assets/images/Laro.png';
import plageImage from '../assets/images/Plage.png';
import './loading-styles.css';

interface CapturedPhoto {
  id: string;
  src: string;
  alt: string;
  timestamp: Date;
  delete_url?: string;
  file?: File;
  isStatic?: boolean;
}

export function Birthday() {
  const staticPhotos: CapturedPhoto[] = [
    {
      id: 'static-carte',
      src: carteImage,
      alt: 'Carte anniversaire',
      timestamp: new Date('2026-04-15T00:00:00.000Z'),
      isStatic: true
    },
    {
      id: 'static-bouquet',
      src: bouquetImage,
      alt: 'Bouquet de fleurs',
      timestamp: new Date('2026-04-15T00:00:00.000Z'),
      isStatic: true
    },
    {
      id: 'static-bouquet',
      src: bouquetImage2,
      alt: 'Bouquet de fleurs 2',
      timestamp: new Date('2026-04-15T00:00:00.000Z'),
      isStatic: true
    },
    {
      id: 'static-cadeau',
      src: cadeauImage,
      alt: 'Cadeau',
      timestamp: new Date('2026-04-15T00:00:00.000Z'),
      isStatic: true
    },
    {
      id: 'static-laro',
      src: laroImage,
      alt: 'Laro',
      timestamp: new Date('2026-04-15T00:00:00.000Z'),
      isStatic: true
    },
    {
      id: 'static-plage',
      src: plageImage,
      alt: 'Plage',
      timestamp: new Date('2026-04-15T00:00:00.000Z'),
      isStatic: true
    },
  ];

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

  // Charger les images depuis localStorage au démarrage
  useEffect(() => {
    console.log('Démarrage du chargement depuis localStorage...');
    
    const loadImages = async () => {
      try {
        // Charger depuis localStorage
        console.log('Chargement depuis localStorage...');
        const images = await ImgBBService.getAllImages();
        console.log('Images reçues:', images?.length || 0);
        
        if (images && images.length > 0) {
          setCapturedPhotos(images);
          console.log('Images formatées:', images.length);
        } else {
          console.log('Aucune image trouvée');
          setCapturedPhotos([]);
        }
      } catch (error) {
        console.error('Erreur chargement images:', error);
        setCapturedPhotos([]);
      } finally {
        setIsLoading(false);
        console.log('Chargement terminé');
      }
    };

    // Démarrer le chargement immédiatement
    loadImages();
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
          timestamp: new Date(),
          file: file // Stocker le File object pour l'upload
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
      console.log('Début de la suppression:', photoId);
      await ImgBBService.deleteImage(photoId);
      console.log('Suppression réussie');
      
      // Supprimer localement pour une réponse instantanée
      setCapturedPhotos(prev => prev.filter(photo => photo.id !== photoId));
      
    } catch (error) {
      console.error('Erreur suppression photo:', error);
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
        console.log('Début de l\'upload vers ImgBB...');
        
        // Upload vers ImgBB
        if (!pendingPhoto.file) {
          throw new Error('Aucun fichier à uploader');
        }
        const uploadedPhoto = await ImgBBService.uploadImage(pendingPhoto.file, imageDescription.trim());
        
        // Ajouter immédiatement à l'état local
        setCapturedPhotos(prev => [uploadedPhoto, ...prev]);
        setPendingPhoto(null);
        setShowDescriptionDialog(false);
        setImageDescription('');
        
        console.log('Upload terminé avec succès');
        
        // Forcer le rafraîchissement après un court délai
        setTimeout(async () => {
          try {
            const images = await ImgBBService.getAllImages();
            setCapturedPhotos(images);
            console.log('Rafraîchissement automatique après upload:', images.length);
          } catch (error) {
            console.error('Erreur rafraîchissement automatique:', error);
          }
        }, 1000);
        
      } catch (error) {
        console.error('Erreur upload:', error);
        // Fallback local
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
        console.log('Upload terminé');
      }
    }
  };

  const cancelDescription = () => {
    setPendingPhoto(null);
    setShowDescriptionDialog(false);
    setImageDescription('');
  };


  const allImages = [...staticPhotos, ...capturedPhotos];

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
            <div className={styles.descriptionText}>
              <div className={styles.loadingSpinner}>
                <span>Chargement de vos photos...</span>
                <div className={styles.spinner}></div>
              </div>
            </div>
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
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <span className={styles.loadingSpinner}></span>
                Upload en cours...
              </>
            ) : (
              'Ajouter une photo'
            )}
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
          {allImages.map((image, index) => {
            console.log(`Image ${index}:`, image.src, 'Alt:', image.alt);
            return (
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
                onLoad={() => console.log(`Image ${index} chargée avec succès`)}
                onError={(e) => {
                  console.error(`Erreur chargement image ${index}:`, image.src);
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
                }}
              />
              <div className={styles.overlay}>
                <span className={styles.overlayText}>{image.alt}</span>
                {!image.isStatic && (
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
                )}
              </div>
            </motion.div>
            );
          })}
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
