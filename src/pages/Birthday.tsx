import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import styles from './Birthday.module.css';

const birthdayImages = [
  {
    src: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=900&auto=format&fit=crop&q=70',
    alt: 'Bougies et lumière douce',
  },
  {
    src: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=900&auto=format&fit=crop&q=70',
    alt: 'Petites lumières',
  },
];

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
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [pendingPhoto, setPendingPhoto] = useState<CapturedPhoto | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const savedPhotos = localStorage.getItem('birthdayPhotos');
    if (savedPhotos) {
      setCapturedPhotos(JSON.parse(savedPhotos));
    }
  }, []);

  useEffect(() => {
    if (capturedPhotos.length > 0) {
      localStorage.setItem('birthdayPhotos', JSON.stringify(capturedPhotos));
    }
  }, [capturedPhotos]);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const startCamera = async () => {
    try {
      console.log('Démarrage de la caméra...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false 
      });
      console.log('Caméra démarrée avec succès:', mediaStream);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        console.log('Video source set');
      }
      setIsCameraOpen(true);
    } catch (error) {
      console.error('Erreur d\'accès à la caméra:', error);
      if (error.name === 'NotAllowedError') {
        alert('Vous avez refusé l\'accès à la caméra. Veuillez autoriser la caméra dans les paramètres du navigateur.');
      } else if (error.name === 'NotFoundError') {
        alert('Aucune caméra trouvée sur cet appareil.');
      } else {
        alert('Impossible d\'accéder à la caméra: ' + error.message);
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const photoData = canvas.toDataURL('image/jpeg');
        const newPhoto: CapturedPhoto = {
          id: Date.now().toString(),
          src: photoData,
          alt: `Photo prise le ${new Date().toLocaleString()}`,
          timestamp: new Date()
        };
        
        setPendingPhoto(newPhoto);
        setShowConfirmDialog(true);
      }
    }
  };

  const deletePhoto = (photoId: string) => {
    setCapturedPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  const confirmPhoto = () => {
    if (pendingPhoto) {
      console.log('Confirmation de la photo:', pendingPhoto);
      setCapturedPhotos(prev => {
        console.log('Photos avant ajout:', prev);
        const newPhotos = [pendingPhoto, ...prev];
        console.log('Photos après ajout:', newPhotos);
        return newPhotos;
      });
      setPendingPhoto(null);
      setShowConfirmDialog(false);
    }
  };

  const rejectPhoto = () => {
    setPendingPhoto(null);
    setShowConfirmDialog(false);
  };

  const allImages = [...capturedPhotos, ...birthdayImages];
  console.log('Images dans la galerie:', allImages);
  console.log('Photos capturées:', capturedPhotos);
  
  // Vérifier si les photos capturées ont une source valide
  capturedPhotos.forEach((photo, index) => {
    console.log(`Photo ${index} - src:`, photo.src?.substring(0, 50) + '...');
    console.log(`Photo ${index} - src length:`, photo.src?.length);
  });

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

        <h1 className={styles.title}>Your 25th Birthday 🎉</h1>

        <motion.div
          className={styles.cameraSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            className={styles.cameraButton}
            onClick={isCameraOpen ? stopCamera : startCamera}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isCameraOpen ? '📷 Fermer la caméra' : '📸 Prendre une photo'}
          </motion.button>
          
          {capturedPhotos.length > 0 && (
            <div className={styles.photoCount}>
              {capturedPhotos.length} photo{capturedPhotos.length > 1 ? 's' : ''} capturée{capturedPhotos.length > 1 ? 's' : ''}
            </div>
          )}
        </motion.div>

        {isCameraOpen && (
          <motion.div
            className={styles.cameraContainer}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={styles.video}
            />
            <canvas ref={canvasRef} className={styles.canvas} />
            <div className={styles.cameraControls}>
              <motion.button
                className={styles.captureButton}
                onClick={capturePhoto}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                📸
              </motion.button>
              <motion.button
                className={styles.cancelButton}
                onClick={stopCamera}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ✖
              </motion.button>
            </div>
          </motion.div>
        )}

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
                onError={(e) => {
                  console.error('Erreur de chargement de l\'image:', image.src?.substring(0, 50) + '...');
                  console.error('Type d\'image:', typeof image.src);
                  console.error('Image complète:', image);
                }}
                onLoad={(e) => {
                  console.log('Image chargée avec succès:', image.alt);
                }}
              />
              <div className={styles.overlay}>
                <span className={styles.overlayText}>{image.alt}</span>
                {(image as CapturedPhoto).id && (
                  <button
                    className={styles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePhoto((image as CapturedPhoto).id);
                    }}
                  >
                    🗑️
                  </button>
                )}
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

      {showConfirmDialog && pendingPhoto && (
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
            <h3 className={styles.confirmTitle}>Mettre cette photo en ligne ?</h3>
            <div className={styles.confirmPreview}>
              <img 
                src={pendingPhoto.src} 
                alt="Photo capturée" 
                className={styles.confirmImage}
              />
            </div>
            <p className={styles.confirmText}>
              Voulez-vous ajouter cette photo à la galerie de l'anniversaire ?
            </p>
            <div className={styles.confirmButtons}>
              <motion.button
                className={styles.confirmButton}
                onClick={confirmPhoto}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Oui, ajouter
              </motion.button>
              <motion.button
                className={styles.rejectButton}
                onClick={rejectPhoto}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Non, annuler
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
