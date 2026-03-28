import { motion } from 'framer-motion';
import { useMemo } from 'react';

type Particle = {
  id: number;
  x: string;
  y: string;
  size: number;
  duration: number;
  delay: number;
};

function randomParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    size: 2 + Math.random() * 4,
    duration: 14 + Math.random() * 18,
    delay: Math.random() * 8,
  }));
}

export function ParticleBackground() {
  const particles = useMemo(() => randomParticles(42), []);

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: 'var(--particle)',
            boxShadow: `0 0 ${p.size * 3}px var(--particle)`,
          }}
          animate={{
            y: [0, -40, 20, -15, 0],
            x: [0, 15, -10, 8, 0],
            opacity: [0.25, 0.6, 0.35, 0.55, 0.25],
            scale: [1, 1.2, 0.9, 1.05, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
