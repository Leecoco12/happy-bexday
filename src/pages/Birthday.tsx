import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
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
  {
    src: 'https://images.unsplash.com/photo-1508930156681-71bcb3897ab0?w=900&auto=format&fit=crop&q=70',
    alt: 'Douceurs sur une assiette',
  },
  {
    src: 'https://images.unsplash.com/photo-1549068106-bd2428e21116?w=900&auto=format&fit=crop&q=70',
    alt: 'Gâteau d\'anniversaire',
  },
  {
    src: 'https://images.unsplash.com/photo-1513245593221-3b5b5d0c7294?w=900&auto=format&fit=crop&q=70',
    alt: 'Célébration joyeuse',
  },
  {
    src: 'https://images.unsplash.com/photo-1515226321776-1ee2a3e999a7?w=900&auto=format&fit=crop&q=70',
    alt: 'Moment de bonheur',
  },
];

export function Birthday() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

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

        <div className={styles.gallery}>
          {birthdayImages.map((image, index) => (
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
              src={birthdayImages[selectedImage].src}
              alt={birthdayImages[selectedImage].alt}
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
    </div>
  );
}
