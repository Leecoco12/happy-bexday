import { ThemeProvider } from './context/ThemeContext';
import { useState } from 'react';
import { Home } from './pages/Home';
import { Countdown } from './components/Countdown';

type Phase = 'countdown' | 'birthday';

export default function App() {
  const [phase, setPhase] = useState<Phase>('countdown');

  const handleCountdownComplete = () => {
    setPhase('birthday');
  };

  return (
    <ThemeProvider>
      {phase === 'countdown' ? (
        <Countdown onComplete={handleCountdownComplete} />
      ) : (
        <Home />
      )}
    </ThemeProvider>
  );
}
