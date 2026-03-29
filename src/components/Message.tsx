import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FloatingHearts } from './FloatingHearts';
import styles from './Message.module.css';

function buildText(lines: string[]) {
  return lines.join('\n');
}

export function MessageStatic({ lines }: { lines: string[] }) {
  const text = buildText(lines);

  return (
    <motion.div
      className={styles.shell}
      initial={{ 
        opacity: 0, 
        y: 80, 
        scale: 0.8,
        rotateX: 8,
        transformPerspective: 1000
      }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        rotateX: 0
      }}
      transition={{ 
        duration: 1.0, 
        ease: [0.22, 1, 0.36, 1],
        delay: 0.2
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.6, 
          delay: 0.5,
          ease: "easeOut"
        }}
      >
        <FloatingHearts />
      </motion.div>
      <motion.div 
        className={styles.card}
        initial={{ 
          scale: 0.85, 
          opacity: 0,
          boxShadow: "0 0 0 rgba(0,0,0,0)"
        }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          boxShadow: "var(--shadow)"
        }}
        transition={{ 
          duration: 0.7, 
          delay: 0.7,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        <motion.p 
          className={styles.kicker}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          Avec tout mon cœur
        </motion.p>
        <motion.div 
          className={styles.body}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.4 }}
        >
          {text}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

type MessageProps = {
  lines: string[];
  typingSpeedMs?: number;
  linePauseMs?: number;
  onComplete: () => void;
};

export function Message({
  lines,
  typingSpeedMs = 80,
  linePauseMs = 1000,
  onComplete,
}: MessageProps) {
  const fullText = buildText(lines);
  const [shown, setShown] = useState('');
  const [done, setDone] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let i = 0;
    let cancelled = false;
    let timeoutId = 0;

    const tick = () => {
      if (cancelled) return;
      if (i >= fullText.length) {
        setDone(true);
        onCompleteRef.current();
        return;
      }

      const char = fullText[i];
      setShown(fullText.slice(0, i + 1));

      const isLineBreak = char === '\n';
      const pause = isLineBreak ? linePauseMs : typingSpeedMs;
      i += 1;
      timeoutId = window.setTimeout(tick, pause);
    };

    timeoutId = window.setTimeout(tick, 800);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [fullText, linePauseMs, typingSpeedMs]);

  return (
    <div className={styles.combinedAnimation}>
      {/* Direct message appearance without envelope */}
      <motion.div
        className={styles.mysteriousMessage}
        initial={{ 
          opacity: 0,
          scale: 0.6,
          rotate: -3,
          filter: "blur(15px)"
        }}
        animate={{ 
          opacity: 1,
          scale: 1,
          rotate: 0,
          filter: "blur(0px)"
        }}
        transition={{ 
          duration: 1.5,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        <motion.div
          className={styles.centeredMessage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: 1.2,
              ease: "easeOut"
            }}
          >
            <FloatingHearts dense />
          </motion.div>
          <motion.div 
            className={styles.card}
            initial={{ 
              scale: 0.7, 
              opacity: 0,
              y: 30
            }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              y: 0
            }}
            transition={{ 
              duration: 0.9, 
              delay: 1.6,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <motion.p 
              className={styles.kicker}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2, duration: 0.6 }}
            >
              Avec tout mon cœur
            </motion.p>
            <motion.div 
              className={styles.body} 
              aria-live="polite"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.6, duration: 0.5 }}
            >
              {shown}
              {!done && (
                <motion.span
                  className={styles.caret}
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                  aria-hidden
                />
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
