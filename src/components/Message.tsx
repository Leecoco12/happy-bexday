import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FloatingHearts } from './FloatingHearts';
import styles from './Message.module.css';

function buildText(lines: string[]) {
  return lines.join('\n\n');
}

export function MessageStatic({ lines }: { lines: string[] }) {
  const text = buildText(lines);

  return (
    <motion.div
      className={styles.shell}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <FloatingHearts />
      <div className={styles.card}>
        <p className={styles.kicker}>Avec tout mon cœur</p>
        <div className={styles.body}>{text}</div>
      </div>
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
  typingSpeedMs = 42,
  linePauseMs = 600,
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

    timeoutId = window.setTimeout(tick, 280);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [fullText, linePauseMs, typingSpeedMs]);

  return (
    <motion.div
      className={styles.shell}
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      <FloatingHearts dense />
      <div className={styles.card}>
        <p className={styles.kicker}>Avec tout mon cœur</p>
        <div className={styles.body} aria-live="polite">
          {shown}
          {!done && (
            <motion.span
              className={styles.caret}
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 0.9, repeat: Infinity }}
              aria-hidden
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
