import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useRef, useState } from 'react';
import '../assets/styles/components.css';
import { Confetti } from '../components/Confetti';
import type { GalleryItem } from '../components/Gallery';
import { Gallery } from '../components/Gallery';
import { Message, MessageStatic } from '../components/Message';
import { ParticleBackground } from '../components/ParticleBackground';
import { useTheme } from '../context/ThemeContext';
import styles from './Home.module.css';

/** Add `public/music.mp3` for gentle background music (optional). */
const MUSIC_SRC = '/music.mp3';

const MESSAGE_LINES = [
  'En ce jour si spécial, je voulais t’écrire quelque chose de vrai.',
  'Tu apportes une douceur discrète à ceux qui t’entourent — ce rire, cette présence, ces petits gestes qui comptent plus qu’on ne le dit.',
  'Que cette nouvelle année t’offre le calme d’un foyer, des joies imprévues, et une affection qui ne vacille pas quand tout va trop vite autour de toi.',
  'Joyeux anniversaire. Tu combs énormément pour moi. 💌',
];

const GALLERY_ITEMS: GalleryItem[] = [
  {
    src: 'https://images.unsplash.com/photo-1518199266791-5375a82890b5?w=900&auto=format&fit=crop&q=70',
    alt: 'Fleurs pastel',
  },
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
  const { theme, toggleTheme } = useTheme();
  const [phase, setPhase] = useState<Phase>('intro');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const syncPlayingState = useCallback(() => {
    setIsMusicPlaying(!audioRef.current?.paused);
  }, []);

  const toggleMusic = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.volume = 0.35;
      void el.play().then(() => setIsMusicPlaying(true), syncPlayingState);
    } else {
      el.pause();
      setIsMusicPlaying(false);
    }
  }, [syncPlayingState]);

  const goToWishes = useCallback(() => {
    if (phase !== 'intro') return;
    window.setTimeout(() => {
      const el = audioRef.current;
      if (!el) return;
      el.volume = 0.35;
      void el.play().then(() => setIsMusicPlaying(true), () => setIsMusicPlaying(false));
    }, 120);
    window.setTimeout(() => setPhase('letter'), 380);
  }, [phase]);

  const handleMessageComplete = useCallback(() => {
    window.setTimeout(() => {
      setPhase('memories');
      setConfettiActive(true);
      window.setTimeout(() => setConfettiActive(false), 4200);
    }, 500);
  }, []);

  const replay = useCallback(() => {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    setIsMusicPlaying(false);
    setPhase('intro');
    setConfettiActive(false);
  }, []);

  return (
    <div className="home-shell">
      <audio
        ref={audioRef}
        src={MUSIC_SRC}
        loop
        preload="metadata"
        onPlay={() => setIsMusicPlaying(true)}
        onPause={() => setIsMusicPlaying(false)}
      />

      <ParticleBackground />
      <Confetti active={confettiActive} />

      <div className="top-bar">
        <button
          type="button"
          className="icon-button"
          onClick={toggleMusic}
          aria-pressed={isMusicPlaying}
          title={isMusicPlaying ? 'Pause musique' : 'Lecture musique'}
        >
          <span className="sr-only">Musique de fond</span>
          <span aria-hidden>{isMusicPlaying ? '🔊' : '🔈'}</span>
        </button>
        <button
          type="button"
          className="icon-button"
          onClick={toggleTheme}
          title={`Thème ${theme === 'light' ? 'sombre' : 'clair'}`}
        >
          <span className="sr-only">Changer le thème</span>
          <span aria-hidden>{theme === 'light' ? '🌙' : '☀️'}</span>
        </button>
      </div>

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
                <h1 className={styles.introTitle}>Tu as un message 💌</h1>
                <p className={styles.introHint}>
                  Un petit clin d’œil rien que pour toi
                </p>
                <button
                  type="button"
                  className={styles.cta}
                  onClick={goToWishes}
                >
                  Ouvrir le message
                </button>
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
