import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import styles from './Envelope.module.css';

// Simple envelope component with text on it
export function SimpleEnvelope({ open, onOpen, disabled }: { open: boolean; onOpen: () => void; disabled?: boolean }) {
  const [isOpening, setIsOpening] = useState(false);

  const handleEnvelopeClick = () => {
    if (!disabled && !open && !isOpening) {
      setIsOpening(true);
      setTimeout(() => {
        onOpen();
      }, 1500); // Wait for opening animation to complete
    }
  };

  return (
    <div className={styles.simpleEnvelopeContainer}>
      <AnimatePresence mode="wait">
        {!isOpening ? (
          <motion.div
            key="closed"
            className={styles.envelopeButton}
            onClick={handleEnvelopeClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            exit={{ 
              scale: 1.2, 
              opacity: 0, 
              transition: { duration: 0.8 }
            }}
          >
            <div className={styles.envelopeBody}>
              <div className={styles.envelopeFlap} />
              <div className={styles.envelopeSeal}>
                <div className={styles.sealCircle} />
              </div>
              {/* Text on envelope */}
              <div className={styles.envelopeText}>
                <p className={styles.textLine}>J'ai un message pour toi 💌</p>
                <p className={styles.textLine}>Clique sur l'enveloppe pour voir le message</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="opening"
            className={styles.envelopeOpeningAnimation}
            initial={{ scale: 1, opacity: 1 }}
            animate={{ 
              scale: [1, 1.1, 0.9],
              opacity: [1, 0.8, 0.6],
            }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          >
            <div className={styles.openingEnvelope}>
              <motion.div
                className={styles.envelopeFlapOpening}
                initial={{ rotateX: 0 }}
                animate={{ rotateX: -180 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
              <motion.div
                className={styles.envelopeBodyOpening}
                initial={{ opacity: 1 }}
                animate={{ opacity: 0.4 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Main envelope component (now uses SimpleEnvelope)
export function Envelope({ open, onOpen, disabled }: { open: boolean; onOpen: () => void; disabled?: boolean }) {
  return <SimpleEnvelope open={open} onOpen={onOpen} disabled={disabled} />;
}
