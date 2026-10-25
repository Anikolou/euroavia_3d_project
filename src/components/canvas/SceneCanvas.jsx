import { Canvas } from '@react-three/fiber';
import { Stars, Sparkles, Grid, ContactShadows } from '@react-three/drei';
import EuroaviaUAV from './EuroaviaUAV';
import { Suspense } from 'react';
import useIsMobile from './isMobile';
import CameraDebugger from './CameraDebugger';
import './SceneCanvas.css';

export default function SceneCanvas({ isXrayActive, setHovered, activeStep, setActiveStep }) {
  // Το custom hook αναλαμβάνει αυτόματα το state και το resize listener
  const isMobile = useIsMobile(768);

  return (
    <div className="canvas-container">
      <Canvas shadows camera={{ position: [0, 1.4, 6.2], fov: 45 }}>
         {/* <CameraDebugger /> */}

        <fog attach="fog" args={['#0b0c0e', 10, 35]} />

        <ambientLight intensity={0.6} />
        <directionalLight position={[6, 10, 6]} intensity={2.2} color="#f8fafc" castShadow />
        <pointLight position={[-6, -2, -4]} intensity={1.8} color="#0ea5e9" />
        <spotLight position={[0, 8, -6]} intensity={2.5} color="#38bdf8" angle={0.5} penumbra={1} />

        <Grid
            position={[0, -1.6, 0]}
            args={[60, 60]}
            cellSize={0.6}
            cellThickness={0.5}
            cellColor="#0f172a"
            sectionSize={3}
            sectionThickness={1}
            sectionColor="#1e2433"
            fadeDistance={30}
            fadeStrength={1}
          />
          <Stars radius={60} depth={40} count={2500} factor={3} saturation={0} fade speed={1} />
          <Sparkles count={80} scale={[10, 4, 10]} size={2} speed={0.6} color="#38bdf8" opacity={0.4} />

          {/* 2. ΤΟ ΜΟΝΤΕΛΟ ΚΑΙ Η ΣΚΙΑ (ΜΕΣΑ ΣΤΟ GROUP) */}
          {/* Το group ανεβάζει όλα τα 3D στοιχεία κατά 0.3 στον άξονα Y μόνο στα κινητά */}
          {/* Το scale πλέον επηρεάζει ΜΟΝΟ το UAV και τη σκιά του, όχι τον "κόσμο" */}
          <group position={[0, isMobile ? (activeStep === 0 ? 0.45 : activeStep === 1 ? -0.35 : 0) : 0, 0]} scale={isMobile ? 0.45 : 1}>
          <ContactShadows position={[0, -1.59, 0]} opacity={0.65} scale={60} blur={2.5} far={4} />
          <Suspense fallback={null}>

            <EuroaviaUAV
              isMobile={isMobile}
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