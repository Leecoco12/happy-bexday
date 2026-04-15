import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './AccessProtection.module.css';

interface AccessProtectionProps {
  children: React.ReactNode;
  onAccessGranted: () => void;
}

export function AccessProtection({ children, onAccessGranted }: AccessProtectionProps) {
  const [code, setCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Vérifier si l'accès a déjà été validé dans cette session
  useEffect(() => {
    const accessGranted = sessionStorage.getItem('birthday_access_granted');
    if (accessGranted === 'true') {
      setIsVerified(true);
      onAccessGranted();
    }
  }, [onAccessGranted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowError(false);

    try {
      // Code fixe : 15 Avril 2001
      const secretCode = '15042001';
      
      if (code === secretCode) {
        setIsVerified(true);
        sessionStorage.setItem('birthday_access_granted', 'true');
        onAccessGranted();
      } else {
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    } catch (error) {
      console.error('Erreur vérification:', error);
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerified) {
    return <>{children}</>;
  }

  return (
    <div className={styles.accessProtection}>
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <motion.div
            className={styles.content}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className={styles.title}>🎂 Accès Privé</h2>
            <p className={styles.description}>
              Ce site d'anniversaire est protégé par un code d'accès.
            </p>
            <p className={styles.hint}>
              Entrez le code d'accès secret<br/>
              (Code fixe pour l'anniversaire)
            </p>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="JJMMAA"
                className={styles.input}
                maxLength={8}
                autoFocus
              />
              
              <motion.button
                type="submit"
                disabled={code.length !== 8 || isLoading}
                className={styles.submitButton}
                whileHover={{ scale: code.length === 8 && !isLoading ? 1.05 : 1 }}
                whileTap={{ scale: code.length === 8 && !isLoading ? 0.95 : 1 }}
              >
                {isLoading ? 'Vérification...' : 'Accéder au site'}
              </motion.button>
            </form>

            {showError && (
              <motion.div
                className={styles.error}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                ❌ Code incorrect. Veuillez réessayer.
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
