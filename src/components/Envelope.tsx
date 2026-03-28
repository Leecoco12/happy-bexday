import { motion } from 'framer-motion';
import styles from './Envelope.module.css';

type EnvelopeProps = {
  open: boolean;
  onOpen: () => void;
  disabled?: boolean;
};

export function Envelope({ open, onOpen, disabled }: EnvelopeProps) {
  return (
    <motion.div
      className={styles.wrap}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <button
        type="button"
        className={styles.hit}
        onClick={onOpen}
        disabled={disabled || open}
        aria-expanded={open}
        aria-label={open ? 'Message opened' : 'Open your message'}
      >
        <span className={styles.scene}>
          <span className={styles.back} />
          <motion.span
            className={styles.letter}
            animate={
              open
                ? { y: '-118%', opacity: 1, rotateX: 6 }
                : { y: '8%', opacity: 0.96, rotateX: 0 }
            }
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={styles.letterInner}>
              <span className={styles.wax} aria-hidden />
            </span>
          </motion.span>
          <span className={styles.front} />
          <motion.span
            className={styles.flap}
            style={{ transformOrigin: '50% 0%' }}
            animate={
              open
                ? { rotateX: 178, zIndex: 2 }
                : { rotateX: 0, zIndex: 4 }
            }
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          />
        </span>
      </button>
    </motion.div>
  );
}
