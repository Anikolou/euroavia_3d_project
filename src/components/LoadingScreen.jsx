import React, { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';

// 1. Κάνουμε import την εικόνα από τον φάκελο assets (Προσάρμοσε τα '../' ανάλογα με το πού είναι το LoadingScreen.jsx)
import euroaviaLogo from '../assets/euroavia_logo_hangar26-preview.png';

export default function LoadingScreen() {
  const { progress, active } = useProgress();
  const [hidden, setHidden] = useState(false);
  const [fade, setFade] = useState(false); // Νέο state για να ελέγχουμε το CSS fade-out

  useEffect(() => {
    // 2. Σωστές παρενθέσεις: Αν ΔΕΝ είναι active ΚΑΙ (είναι 100 Ή 0)
    if (!active && (progress === 100 || progress === 0)) {
      setFade(true); // Ξεκινάει το animation εξαφάνισης
      
      const timer = setTimeout(() => {
        setHidden(true); // Βγαίνει από το DOM μετά το animation (800ms)
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [active, progress]);

  // Αν έχει τελειώσει το animation εξαφάνισης, το βγάζουμε τελείως από το DOM
  if (hidden) return null;

  return (
    // 3. Η κλάση fade-out μπαίνει βάσει του state `fade`
    <div className={`loading-screen ${fade ? 'fade-out' : ''}`}>
      <div className="loading-content">
        
        {/* Σωστή χρήση της εικόνας μέσω του import */}
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