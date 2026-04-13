import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from './Special.module.css';

export function Special() {
  const navigate = useNavigate();

  const cards = [
    { 
      id: 'birthday', 
      title: '25th Birthday', 
      icon: '🎂', 
      message: 'Célébrons ce moment magique',
      color: '#d4a574',
      stamp: '💌'
    },
    { 
      id: 'song', 
      title: 'Video for you', 
      icon: '🎵', 
      message: 'Une mélodie qui vient du cœur',
      color: '#8b5a3c',
      stamp: '🎼'
    },
    { 
      id: 'moments', 
      title: 'Our Best Moment', 
      icon: '💕', 
      message: 'Les souvenirs qui nous unissent',
      color: '#a0522d',
      stamp: '📜'
    },
    { 
      id: 'dreams', 
      title: 'Our Dreams', 
      icon: '✨', 
      message: 'Ensemble vers l\'infini',
      color: '#6b4423',
      stamp: '🌟'
    }
  ];

  return (
    <div className={styles.vintageContainer}>
      <motion.div
        className={styles.postalCard}
        initial={{ opacity: 0, rotateY: -180 }}
        animate={{ opacity: 1, rotateY: 0 }}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Header de la carte postale */}
        <div className={styles.cardHeader}>
          <motion.div 
            className={styles.vintageStamp}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            🎂
          </motion.div>
          
          <motion.div 
            className={styles.postmark}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className={styles.postmarkLines}></div>
          </motion.div>
          
          <motion.h1 
            className={styles.vintageTitle}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Happy Birthday
          </motion.h1>
          
          <motion.div 
            className={styles.vintageDate}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            Célébration Spéciale • 2025
          </motion.div>
        </div>

        {/* Corps de la carte avec les 4 cartes de visite */}
        <div className={styles.cardsContainer}>
          <motion.div 
            className={styles.vintageDecor}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 1.0, duration: 0.8 }}
          >
            ✉
          </motion.div>

          <div className={styles.visitCardsGrid}>
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                className={styles.visitCard}
                style={{ '--card-color': card.color } as React.CSSProperties}
                initial={{ opacity: 0, scale: 0.8, rotateZ: -15 }}
                animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateZ: 2,
                  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)'
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ 
                  delay: index * 0.2 + 0.8, 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 150,
                  damping: 12
                }}
                onClick={() => navigate(`/${card.id}`)}
              >
                {/* Coin de la carte */}
                <div className={styles.cardCorner}>
                  <div className={styles.cornerDecoration}></div>
                </div>
                
                {/* Timbre de la carte */}
                <motion.div 
                  className={styles.cardStamp}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.2 + 1.2, duration: 0.6 }}
                >
                  {card.stamp}
                </motion.div>
                
                {/* Contenu de la carte */}
                <div className={styles.cardContent}>
                  <motion.div 
                    className={styles.cardIcon}
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.8
                    }}
                  >
                    {card.icon}
                  </motion.div>
                  
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.cardMessage}>{card.message}</p>
                </div>
                
                {/* Bordure décorative */}
                <div className={styles.cardBorder}></div>
                
                {/* Effet de vieillissement */}
                <div className={styles.vintageEffect}></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer de la carte postale */}
        <motion.div 
          className={styles.cardFooter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <div className={styles.signatureLine}>
            <motion.div 
              className={styles.signatureText}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ 
                duration: 2.5,
                repeat: Infinity
              }}
            >
              Avec tout mon amour ✨
            </motion.div>
          </div>
          
          <motion.button
            className={styles.vintageBackButton}
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Retour à l'accueil
          </motion.button>
        </motion.div>

        {/* Décorations vintage */}
        <motion.div 
          className={styles.vintageOrnament}
          style={{ top: '10%', left: '5%' }}
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 0.4, scale: 1, rotate: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
        >
          🌹
        </motion.div>
        
        <motion.div 
          className={styles.vintageOrnament}
          style={{ top: '15%', right: '8%' }}
          initial={{ opacity: 0, scale: 0, rotate: 180 }}
          animate={{ opacity: 0.3, scale: 1, rotate: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          🕊️
        </motion.div>
        
        <motion.div 
          className={styles.vintageOrnament}
          style={{ bottom: '20%', left: '7%' }}
          initial={{ opacity: 0, scale: 0, rotate: -90 }}
          animate={{ opacity: 0.35, scale: 1, rotate: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          💐
        </motion.div>
      </motion.div>
    </div>
  );
}
