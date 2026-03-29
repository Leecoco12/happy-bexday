import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import '../assets/styles/components.css';
import { Confetti } from '../components/Confetti';
import { Envelope } from '../components/Envelope';
import type { GalleryItem } from '../components/Gallery';
import { Gallery } from '../components/Gallery';
import { Message, MessageStatic } from '../components/Message';
import { ParticleBackground } from '../components/ParticleBackground';
import styles from './Home.module.css';

// Animated birthday greeting component
const BirthdayGreeting = () => {
  const text = "Joyeux anniversaire mon amour";
  const words = text.split(' ');

  return (
    <motion.h1 
      className={styles.birthdayGreeting}
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.2, duration: 0.6 }}
          style={{ display: 'inline-block', marginRight: '0.3em' }}
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
};

const MESSAGE_LINES = [
  'En ce jour si spécial, je voulais t’écrire quelque chose de vrai.',
  'Tu apportes une douceur discrète à ceux qui t’entourent — ce rire, cette présence, ces petits gestes qui comptent plus qu’on ne le dit.',
  'Que cette nouvelle année t’offre le calme d’un foyer, des joies imprévues, et une affection qui ne vacille pas quand tout va trop vite autour de toi.',
  'Joyeux anniversaire mon amour. Tu combs énormément pour moi. 💌',
];

const GALLERY_ITEMS: GalleryItem[] = [
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
];

type Phase = 'intro' | 'letter' | 'memories';

export function Home() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [confettiActive, setConfettiActive] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);

  const goToWishes = useCallback(() => {
    if (phase !== 'intro') return;
    setEnvelopeOpen(true);
    setPhase('letter');
  }, [phase]);

  const handleMessageComplete = useCallback(() => {
    window.setTimeout(() => {
      setPhase('memories');
      setConfettiActive(true);
      window.setTimeout(() => setConfettiActive(false), 4200);
    }, 500);
  }, []);

  const replay = useCallback(() => {
    setPhase('intro');
    setConfettiActive(false);
    setEnvelopeOpen(false);
  }, []);

  return (
    <div className="home-shell">
      <ParticleBackground />
      <Confetti active={confettiActive} />

      <main className={styles.main}>
        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div
              key="intro"
              className={styles.contentFlow}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
              transition={{ duration: 0.55 }}
            >
              <div className={styles.introBlock}>
                <BirthdayGreeting />
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 1.5,
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }}
                >
                  <Envelope 
                    open={envelopeOpen} 
                    onOpen={goToWishes}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}

          {(phase === 'letter' || phase === 'memories') && (
            <motion.div
              key="content"
              className={styles.contentFlow}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              {phase === 'letter' && (
                <Message
                  lines={MESSAGE_LINES}
                  onComplete={handleMessageComplete}
                />
              )}

              {phase === 'memories' && (
                <>
                  <MessageStatic lines={MESSAGE_LINES} />
                  <Gallery items={GALLERY_ITEMS} />
                  <div className={styles.replayRow}>
                    <button
                      type="button"
                      className={styles.replay}
                      onClick={replay}
                    >
                      Revoir l’expérience
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
