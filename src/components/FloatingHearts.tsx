import { motion } from 'framer-motion';
import { useMemo } from 'react';

const HEARTS = ['💕', '✨', '💖', '💫', '🌸', '✿', '♡'];

type HeartProps = {
  char: string;
  left: string;
  delay: number;
  duration: number;
  scale: number;
};

function makeHearts(count: number): HeartProps[] {
  return Array.from({ length: count }, (_, i) => ({
    char: HEARTS[i % HEARTS.length],
    left: `${8 + ((i * 13) % 84)}%`,
    delay: (i % 7) * 0.35,
    duration: 10 + (i % 5) * 1.2,
    scale: 0.75 + (i % 4) * 0.12,
  }));
}

export function FloatingHearts({ dense }: { dense?: boolean }) {
  const items = useMemo(() => makeHearts(dense ? 18 : 10), [dense]);

  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 1,
      }}
    >
      {items.map((h, i) => (
        <motion.span
          key={`${h.char}-${i}`}
          style={{
            position: 'absolute',
            left: h.left,
            bottom: '-8%',
            fontSize: `clamp(0.9rem, 2.2vw, ${1.25 * h.scale}rem)`,
            filter: 'drop-shadow(0 6px 14px rgba(90, 40, 80, 0.15))',
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, 0.85, 0.75, 0],
            y: ['0%', '-120vh'],
            rotate: [0, 8, -6, 4, 0],
          }}
          transition={{
            duration: h.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: h.delay,
          }}
        >
          {h.char}
        </motion.span>
      ))}
    </div>
  );
}
