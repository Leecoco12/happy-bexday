import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from './Dreams.module.css';
import voyagerImage from '../assets/images/voyager.jpg';
import maisonImage from '../assets/images/maison.jpg';
import creationImage from '../assets/images/creation.jpg';
import main1Image from '../assets/images/main1.jpg';

const dreams = [
  {
    id: 1,
    image: voyagerImage,
    title: 'Voyager ensemble',
    text: 'Je rêve de découvrir le monde à tes côtés. Chaque ville, chaque paysage, chaque aventure serait plus belle parce que tu seras là. Des rues de Paris aux plages des Maldives, chaque moment serait une page de notre livre d\'amour.',
    layout: 'left'
  },
  {
    id: 2,
    image: maisonImage,
    title: 'Notre petit nid douillet',
    text: 'Je rêve de notre maison, remplie de rires, de chaleur et d\'amour. Un endroit où chaque coin raconte notre histoire, où chaque matin commence avec ton sourire et chaque soirée s\'achève dans tes bras.',
    layout: 'right'
  },
  {
    id: 3,
    image: creationImage,
    title: 'Créer ensemble',
    text: 'Je rêve de construire quelque chose de beau avec toi. Que ce soit une famille, un projet, ou simplement une vie remplie de bonheur partagé. Je vois notre futur comme une toile vierge, prête à être peinte avec les couleurs de notre amour.',
    layout: 'left'
  },
  {
    id: 4,
    image: main1Image,
    title: 'Grandir main dans la main',
    text: 'Je rêve de vieillir à tes côtés, de voir nos cheveux blanchir ensemble, de partager chaque saison de la vie. Je veux être là pour toi dans les joies comme dans les épreuves, ton roc, ton refuge, ton éternel compagnon.',
    layout: 'right'
  }
];

export function Dreams() {
  const navigate = useNavigate();

  return (
    <div className={styles.dreamyContainer}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.button
          className={styles.backButton}
          onClick={() => navigate('/special')}
          whileHover={{ x: -5, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Retour
        </motion.button>

        <motion.div
          className={styles.headerSection}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <motion.h1 
            className={styles.title}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Our Dreams ✨
          </motion.h1>
          
          <motion.div 
            className={styles.decorativeLine}
            initial={{ width: 0 }}
            animate={{ width: '100px' }}
            transition={{ delay: 0.6, duration: 0.8 }}
          />
          
          <motion.div 
            className={styles.subtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            Les plus belles histoires commencent par un rêve 💫
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.introduction}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.div 
            className={styles.introIcon}
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity
            }}
          >
            🌙
          </motion.div>
          
          <p className={styles.introText}>
            Dans mes rêves les plus fous et les plus doux, tu es toujours là. 
            Voici quelques-unes des visions qui illuminent mes nuits et qui, je l'espère, deviendront notre réalité.
          </p>
        </motion.div>

        <div className={styles.dreamsList}>
          {dreams.map((dream, index) => (
            <motion.div
              key={dream.id}
              className={`${styles.dreamItem} ${styles[dream.layout]}`}
              initial={{ opacity: 0, x: dream.layout === 'left' ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                delay: index * 0.15 + 0.8, 
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              <div className={styles.textSection}>
                <motion.div 
                  className={styles.dreamNumber}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.15 + 1.0, duration: 0.6 }}
                >
                  {String(index + 1).padStart(2, '0')}
                </motion.div>
                
                <h2 className={styles.dreamTitle}>{dream.title}</h2>
                <p className={styles.dreamText}>{dream.text}</p>
                
                <motion.div 
                  className={styles.dreamDecor}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: index * 0.15 + 1.2, duration: 0.6 }}
                >
                  {dream.layout === 'left' ? '💫' : '🌟'}
                </motion.div>
              </div>
              
              <motion.div 
                className={styles.imageSection}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  delay: index * 0.15 + 1.0, 
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                <img
                  src={dream.image}
                  alt={dream.title}
                  className={styles.dreamImage}
                  loading="lazy"
                />
                <motion.div 
                  className={styles.imageOverlay}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 1.3, duration: 0.6 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className={styles.conclusion}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <motion.div 
            className={styles.conclusionDecor}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
          >
            💖
          </motion.div>
          
          <div className={styles.conclusionContent}>
            <h3 className={styles.conclusionTitle}>Le plus beau rêve</h3>
            <p className={styles.conclusionText}>
              Mais de tous mes rêves, le plus précieux est celui que je vis déjà : t'aimer. 
              Chaque jour avec toi est plus beau que n'importe quelle vision nocturne. 
              Tu es mon rêve éveillé, ma réalité la plus merveilleuse.
            </p>
            <motion.p 
              className={styles.signature}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ 
                duration: 3,
                repeat: Infinity
              }}
            >
              Pour toujours et à jamais, ton éternel rêveur amoureux 💫
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
