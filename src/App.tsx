import { ThemeProvider } from './context/ThemeContext';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Countdown } from './components/Countdown';

// Import new pages (will be created)
import { Special } from './pages/Special';
import { Birthday } from './pages/Birthday';
import { Song } from './pages/Song';
import { Moments } from './pages/Moments';
import { Dreams } from './pages/Dreams';

type Phase = 'countdown' | 'birthday';

export default function App() {
  const [phase, setPhase] = useState<Phase>('countdown');

  const handleCountdownComplete = () => {
    setPhase('birthday');
  };

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              phase === 'countdown' ? (
                <Countdown onComplete={handleCountdownComplete} />
              ) : (
                <Home />
              )
            } 
          />
          <Route path="/special" element={<Special />} />
          <Route path="/birthday" element={<Birthday />} />
          <Route path="/song" element={<Song />} />
          <Route path="/moments" element={<Moments />} />
          <Route path="/dreams" element={<Dreams />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
