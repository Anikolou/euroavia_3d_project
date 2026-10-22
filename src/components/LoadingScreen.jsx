import React, { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';

// 1. Κάνουμε import την εικόνα από τον φάκελο assets (Προσάρμοσε τα '../' ανάλογα με το πού είναι το LoadingScreen.jsx)
import euroaviaLogo from '../assets/euroavia_logo_hangar26-preview.png';

export default function LoadingScreen() {
  const { progress, active } = useProgress();
  const [hidden, setHidden] = useState(false);
  const [fade, setFade] = useState(false); 
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  // 2. ΝΕΟ: Μετράει τον ελάχιστο τεχνητό χρόνο (π.χ. 2500ms = 2.5 δευτερόλεπτα)
  useEffect(() => {
    const minTimer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 2500); 

    return () => clearTimeout(minTimer);
  }, []);

  // 3. ΕΝΗΜΕΡΩΜΕΝΟ: Κλείνει μόνο αν τελειώσουν τα assets ΚΑΙ περάσει ο χρόνος
  useEffect(() => {
    const isAssetLoadingDone = !active && (progress === 100 || progress === 0);

    if (isAssetLoadingDone && minTimeElapsed) {
      setFade(true); // Ξεκινάει το animation εξαφάνισης
      
      const timer = setTimeout(() => {
        setHidden(true); // Βγαίνει από το DOM μετά το animation (800ms)
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [active, progress, minTimeElapsed]); // Προστέθηκε το minTimeElapsed εδώ

  // Αν έχει τελειώσει το animation εξαφάνισης, το βγάζουμε τελείως από το DOM
  if (hidden) return null;

  return (
    <div className={`loading-screen ${fade ? 'fade-out' : ''}`}>
      <div className="loading-content">
        
        <img 
          src={euroaviaLogo} 
          alt="Euroavia Logo" 
          className="loading-logo" 
        />
        
        {/* Μπάρα φόρτωσης */}
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="loading-text">
          <span>HANGAR 26 INITIALIZING...</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}