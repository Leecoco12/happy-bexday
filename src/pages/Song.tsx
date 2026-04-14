import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from './Song.module.css';
import videoAnimation from '../assets/videos/animation_D.mp4';
 
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
          <h1 className={styles.title}>Video for you video</h1>
 
          <div className={styles.videoContainer}>
            <video
              className={styles.video}
              src={videoAnimation}
              title="A special video for you"
              controls
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
 
          <motion.div
            className={styles.message}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <p className={styles.romanticText}>
              Cette vidéo est la poésie de notre amour, écrite depuis ce jour à l'université où mon regard a trouvé le tien, 
              jusqu'à ce premier rendez-vous où nos glaces ont fondé sous le soleil de nos premières confidences. 
              Nous avons tissé notre amitié, puis nos cieux se sont ouverts quand nous avons avoué nos sentiments, 
              traversant ensemble les orages qui nous ont forgés, dansant sous les étoiles de nos plus beaux moments. 
              Aujourd'hui, je contemple notre voyage avec un coeur reconnaissant, sachant que notre mélodie continue, 
              pour aujourd'hui, pour demain, et pour l'éternité.
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