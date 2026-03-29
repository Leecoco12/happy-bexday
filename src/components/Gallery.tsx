import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from './Gallery.module.css';

export function Gallery() {
  const navigate = useNavigate();

  return (
    <motion.section
      className={styles.romanticSection}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.button
        className={styles.romanticButton}
        onClick={() => navigate('/special')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Spécialement pour toi 💖
      </motion.button>
    </motion.section>
  );
}
