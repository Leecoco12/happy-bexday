import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import styles from './Countdown.module.css';

interface CountdownProps {
  onComplete: () => void;
}

export function Countdown({ onComplete }: CountdownProps) {
  const [countdown, setCountdown] = useState(10);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  }, [countdown, onComplete]);

  return (
    <motion.div
      className={styles.countdownContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8 }}
    >
      {/* Ballons flottants */}
      <div className={styles.ballons}>
        <span className={styles.ballon} style={{ left: '10%', animationDelay: '0s' }}>🎈</span>
        <span className={styles.ballon} style={{ left: '25%', animationDelay: '1s' }}>🎈</span>
        <span className={styles.ballon} style={{ left: '75%', animationDelay: '2s' }}>🎈</span>
        <span className={styles.ballon} style={{ left: '90%', animationDelay: '3s' }}>🎈</span>
      </div>

      {/* Cadeaux */}
      <div className={styles.gifts}>
        <span className={styles.gift} style={{ bottom: '10%', left: '15%' }}>🎁</span>
        <span className={styles.gift} style={{ bottom: '15%', right: '20%' }}>🎀</span>
        <span className={styles.gift} style={{ bottom: '5%', left: '70%' }}>🎁</span>
      </div>

      {/* Bougies */}
      <div className={styles.candles}>
        <span className={styles.candle} style={{ top: '20%', right: '10%' }}>🕯️</span>
        <span className={styles.candle} style={{ top: '25%', left: '8%' }}>🎂</span>
        <span className={styles.candle} style={{ top: '15%', right: '15%' }}>✨</span>
      </div>

      <div className={styles.countdownContent}>
        {!isComplete ? (
          <>
            <motion.h1
              className={styles.countdownTitle}
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              🎉 Ta surprise d'anniversaire arrive ! 🎂
            </motion.h1>

            <motion.p
              className={styles.countdownSubtitle}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Prépare-toi pour un moment magique rempli d'amour et de joie...
              <br />
              Quelque chose d'extraordinaire a été préparé juste pour toi 💝
            </motion.p>

            <motion.div
              className={styles.countdownNumber}
              key={countdown}
              initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 1.5, opacity: 0, rotate: 180 }}
              transition={{ duration: 0.5, type: 'spring', damping: 10 }}
            >
              {countdown}
            </motion.div>

            <motion.div
              className={styles.surpriseText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <span className={styles.emoji}>🌟</span>
              <span className={styles.emoji} style={{ animationDelay: '0.2s' }}>💫</span>
              <span className={styles.emoji} style={{ animationDelay: '0.4s' }}>⭐</span>
              <span className={styles.emoji} style={{ animationDelay: '0.6s' }}>✨</span>
            </motion.div>
          </>
        ) : (
          <motion.div
            className={styles.completeMessage}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <div className={styles.celebrationText}>
              🎊 Joyeux Anniversaire ! 🎊
              <br />
              <span className={styles.subCelebrationText}>Ta surprise est prête !</span>
            </div>
            <motion.div
              className={styles.loadingDots}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
            >
              🎁 Magie en cours... 🎀
            </motion.div>
          </motion.div>
        )}

        {/* Confettis supplémentaires */}
        <div className={styles.confetti}>
          <span className={styles.confettiPiece} style={{ left: '10%', animationDelay: '0s' }}>🎊</span>
          <span className={styles.confettiPiece} style={{ left: '30%', animationDelay: '0.5s' }}>🎉</span>
          <span className={styles.confettiPiece} style={{ left: '50%', animationDelay: '1s' }}>🎈</span>
          <span className={styles.confettiPiece} style={{ left: '70%', animationDelay: '1.5s' }}>🎁</span>
          <span className={styles.confettiPiece} style={{ left: '90%', animationDelay: '2s' }}>🎂</span>
        </div>
      </div>
    </motion.div>
  );
}
