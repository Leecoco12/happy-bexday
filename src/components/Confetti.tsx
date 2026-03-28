import { motion } from 'framer-motion';
import { useMemo } from 'react';

const COLORS = [
  '#e8a4cf',
  '#c4a8f5',
  '#f0d080',
  '#9b7ed9',
  '#f7b6d2',
  '#a8e6cf',
];

type Piece = {
  id: number;
  left: string;
  delay: number;
  duration: number;
  size: number;
  color: string;
  rotate: number;
  x: number;
};

function makePieces(count: number): Piece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 0.35,
    duration: 1.8 + Math.random() * 1.4,
    size: 6 + Math.random() * 10,
    color: COLORS[i % COLORS.length],
    rotate: Math.random() * 360,
    x: (Math.random() - 0.5) * 220,
  }));
}

type ConfettiProps = {
  active: boolean;
};

export function Confetti({ active }: ConfettiProps) {
  const pieces = useMemo(() => makePieces(72), []);

  if (!active) return null;

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 60,
        overflow: 'hidden',
      }}
    >
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          style={{
            position: 'absolute',
            top: '-12%',
            left: p.left,
            width: p.size,
            height: p.size * 0.55,
            borderRadius: 2,
            background: p.color,
            boxShadow: `0 0 ${p.size}px ${p.color}`,
            rotate: p.rotate,
          }}
          initial={{ y: 0, opacity: 0, scale: 0.6 }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, p.x, p.x * 1.4],
            rotate: [p.rotate, p.rotate + 520],
            opacity: [0, 1, 1, 0],
            scale: [0.6, 1, 1, 0.8],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  );
}
