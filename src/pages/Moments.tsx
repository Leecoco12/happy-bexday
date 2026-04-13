import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from './Moments.module.css';

const moments = [
  {
    id: 1,
    image: '/src/assets/images/recontre.png',
    title: 'Notre première rencontre',
    text: 'Je me souviens encore de ce jour comme si c\'était hier. Ton sourire illuminait la pièce, et dans ce moment, j\'ai su que quelque chose de spécial commençait entre nous. Le temps s\'est arrêté, et il ne restait que toi et moi.',
    layout: 'left'
  },
  {
    id: 2,
    image: '/src/assets/images/image.png',
    title: 'Les promenades infinies',
    text: 'Nos heures passées à marcher main dans la main, parlant de tout et de rien. Chaque pas était une promesse, chaque silence rempli de mots non-dits mais ressentis. Ces moments simples sont devenus mes trésors les plus précieux.',
    layout: 'right'
  },
  {
    id: 3,
    image: '/src/assets/images/rire.png',
    title: 'Les rires partagés',
    text: 'Rien ne me rend plus heureux que d\'entendre ton rire. C\'est une mélodie qui apaise mon âme, une musique qui danse dans mon cœur. Dans ces moments de joie pure, je trouve le sens de tout ce qui est beau dans la vie.',
    layout: 'left'
  },
  {
    id: 4,
    image: '/src/assets/images/regard.png',
    title: 'Les regards complices',
    text: 'Ces moments où aucun mot n\'est nécessaire, où nos yeux se rencontrent et tout est dit. Dans ces silences partagés, je trouve une connexion plus profonde que mille conversations. C\'est notre langage secret, notre intimité sacrée.',
    layout: 'right'
  }
];

export function Moments() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
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

        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Our best moment ✨
        </motion.h1>

        <div className={styles.momentsList}>
          {moments.map((moment, index) => (
            <motion.div
              key={moment.id}
              className={`${styles.momentItem} ${styles[moment.layout]}`}
              initial={{ opacity: 0, x: moment.layout === 'left' ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                delay: index * 0.2 + 0.4, 
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              <div className={styles.textSection}>
                <h2 className={styles.momentTitle}>{moment.title}</h2>
                <p className={styles.momentText}>{moment.text}</p>
              </div>
              <div className={styles.imageSection}>
                <img
                  src={moment.image}
                  alt={moment.title}
                  className={styles.momentImage}
                  loading="lazy"
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className={styles.ending}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <p className={styles.endingText}>
            Chaque moment passé avec toi est un cadeau précieux. 
            Ces souvenirs sont les pierres qui construisent notre château d'amour, 
            et j'ai hâte de continuer à écrire notre histoire ensemble.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
