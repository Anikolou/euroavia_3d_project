import { Canvas } from '@react-three/fiber';
import { Stars, Sparkles, Grid, ContactShadows } from '@react-three/drei';
import EuroaviaUAV from './EuroaviaUAV';
import { useState, useEffect, Suspense } from 'react'; /* Προσθήκη useState και useEffect */

export default function SceneCanvas({ isXrayActive, setHovered, activeStep, setActiveStep }) {
  // State που κρατάει το αν βρισκόμαστε σε mobile οθόνη (κάτω από 768px)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Listener που ενημερώνει το state αν ο χρήστης αλλάξει το μέγεθος του παραθύρου
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="canvas-container">
      <Canvas shadows camera={{ position: [0, 1.4, 6.2], fov: 45 }}>
        <color attach="background" args={['#0b0c0e']} />
        <fog attach="fog" args={['#0b0c0e', 7, 24]} />

        <ambientLight intensity={0.6} />
        <directionalLight position={[6, 10, 6]} intensity={2.2} color="#f8fafc" castShadow />
        <pointLight position={[-6, -2, -4]} intensity={1.8} color="#0ea5e9" />
        <spotLight position={[0, 8, -6]} intensity={2.5} color="#38bdf8" angle={0.5} penumbra={1} />

        {/* Το group ανεβάζει όλα τα 3D στοιχεία κατά 1.2 στον άξονα Y μόνο στα κινητά */}
        <group position={[0, isMobile ? 0.6 : 0, 0]} scale={isMobile ? 0.65 : 1}> 
          <Grid
            position={[0, -1.6, 0]}
            args={[30, 30]}
            cellSize={0.6}
            cellThickness={0.5}
            cellColor="#0f172a"
            sectionSize={3}
            sectionThickness={1}
            sectionColor="#1e2433"
            fadeDistance={22}
            fadeStrength={1}
          />
          <ContactShadows position={[0, -1.59, 0]} opacity={0.65} scale={12} blur={2.5} far={4} />
          <Stars radius={60} depth={40} count={2500} factor={3} saturation={0} fade speed={1} />
          <Sparkles count={80} scale={[10, 4, 10]} size={2} speed={0.6} color="#38bdf8" opacity={0.4} />
          <Suspense fallback={null}>
            <EuroaviaUAV
              xrayMode={isXrayActive}
              setHovered={setHovered}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
            />
          </Suspense>
        </group>
      </Canvas>
    </div>
  );
}