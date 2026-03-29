import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from './Song.module.css';
 
export function Song() {
  const navigate = useNavigate();
 
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
 
        <motion.div
          className={styles.videoSection}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className={styles.title}>Song for you 🎵</h1>
 
          <div className={styles.videoContainer}>
            <iframe
              className={styles.video}
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Ordinary - A special song for you"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
 
          <motion.div
            className={styles.message}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <p className={styles.romanticText}>
              Cette chanson me fait penser à toi chaque fois que je l'écoute. 
              Les paroles, la mélodie, tout me rappelle les moments spéciaux 
              que nous partageons. C'est notre chanson, notre mélodie d'amour. 
              Je t'aime plus que les mots ne peuvent l'exprimer. 💕
            </p>
            <p className={styles.signature}>
              — Pour toujours, ton amour
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}