import React, { useState } from 'react';
import Navbar from './components/Navbar';
import SceneCanvas from './components/canvas/SceneCanvas';
import StoryOverlay from './components/StoryOverlay';
import LoadingScreen from './components/LoadingScreen'; 
import './index.css';

export default function App() {
  const [xrayToggle, setXrayToggle] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const isXrayActive = xrayToggle || hovered;

  return (
    <>
      {/* 1. Η Οθόνη Φόρτωσης μπαίνει πρώτη και πάνω από όλα */}
      <LoadingScreen />

      <div id="scroll-wrapper">
        <Navbar
          isXrayActive={isXrayActive}
          xrayToggle={xrayToggle}
          setXrayToggle={setXrayToggle}
        />
        
        {/* Σημαντικό: Για να δουλέψει σωστά το Loader, το Canvas (ή τα 3D αντικείμενα μέσα του)
            πρέπει ιδανικά να τυλιχτούν σε ένα <Suspense fallback={null}>, 
            αλλά το useProgress του Drei συχνά πιάνει την πρόοδο αυτόματα. */}
        
        <SceneCanvas
          isXrayActive={isXrayActive}
          setHovered={setHovered}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />
        <StoryOverlay activeStep={activeStep} />
      </div>
    </>
  );
}