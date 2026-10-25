import React, { useRef, useLayoutEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import useIsMobile from './isMobile';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {isLabelVisible} from './isLabelVisible';

gsap.registerPlugin(ScrollTrigger);

// =========================================================================
// ΣΥΝΤΕΤΑΓΜΕΝΕΣ ΚΑΜΕΡΑΣ ΓΙΑ DESKTOP & MOBILE (SLOTS)
// =========================================================================
const CAM_COORDS = {
  desktop: {
    // Φάση 1: Exploded View (Επισκόπηση αποδόμησης)
    step1: {
      position: { x: 3.2, y: 2.4, z: 6.5 },
      target: { x: 0, y: 0.3, z: 0 },
    },
    // Φάση 2: Αεροδυναμική / Αριστερή Πτέρυγα
    step2: {
      position: { x: 0, y: 1.4, z: 3.2 },
      target: { x: -3.87, y: 0.14, z: 1.1 },
    },
    // Φάση 3: Structures / Άτρακτος & Ουρά
    step3: {
      position: { x: 3.86, y: 3.16, z: 2.62 },
      target: { x: -1.86, y: 0.23, z: -1.08 },
    },
    // Φάση 4: Avionics & Telemetry (Close-up)
    step4: {
      position: { x: 1.29, y: 1.3, z: 1.49 },
      target: { x: 0, y: -0.23, z: 0.15 },
    },
    // Φάση 5: Επανασυναρμολόγηση / Hero View
    step5: {
      position: { x: 0, y: 1.4, z: 6.2 },
      target: { x: 0, y: 0, z: 0 },
    },
  },

  // -----------------------------------------------------------------------
  // MOBILE SLOTS (Εδώ περνάς τις τιμές που θα πάρεις από το getCam())
  // -----------------------------------------------------------------------
  mobile: {
    // Φάση 1: Exploded View στο κινητό (πιο πίσω στο Z για να χωράνε τα άκρα)
    step1: {
      position: { x: 6.8, y: 2.95, z: 4.88 },
      target: { x: 1.24, y: -1.15, z: 0.5 },
    },
    // Φάση 2: Πτέρυγα στο κινητό
    step2: {
      position:  { x: -0.07, y: 2.78, z: 3.16 },
      target: { x: -1.24, y: 0.01, z: 0.76 },
    },
    
    // Φάση 3: Άτρακτος & Ουρά στο κινητό
    step3: {
      position: { x: 2.45, y: 1.93, z: 3.44 },
      target: { x: -0.24, y: 0, z: -0.54 },
    },

     step4: {
      position: { x: 1.29, y: 1.3, z: 1.49 },
      target: { x: 0, y: -0.23, z: 0.15 },
    },

    // Φάση 5: Hero / Επανασυναρμολόγηση στο κινητό (Z ~ 7 για iPhone SE)
    step5: {
      position: { x: 0, y: 1.55, z: 6.87 },
      target: { x: 0, y: 0, z: 0 },
    },
  },
};

export default function EuroaviaUAV({ xrayMode, setHovered, activeStep, setActiveStep }) {
  const rootRef = useRef();
  const fuselageShellRef = useRef();
  const wingLeftRef = useRef();
  const wingRightRef = useRef();
  const tailGroupRef = useRef();
  const avionicsGroupRef = useRef();
  const propRef = useRef();

  const skinMatRef = useRef();
  const wingLeftMatRef = useRef();
  const wingRightMatRef = useRef();

  // Χρήση του custom hook
  const isMobile = useIsMobile(768);

  const { camera } = useThree();
  const camTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {

    // 1. Περιστροφή έλικα
    if (propRef.current) {
      propRef.current.rotation.z += delta * 18;
    }

    // 2. Mouse Inertia
     if (rootRef.current) {
       const targetRotY = (state.pointer.x * Math.PI) / 12;
       const targetRotX = -(state.pointer.y * Math.PI) / 16;
       rootRef.current.rotation.y = THREE.MathUtils.lerp(rootRef.current.rotation.y, targetRotY, 0.05);
       rootRef.current.rotation.x = THREE.MathUtils.lerp(rootRef.current.rotation.x, targetRotX, 0.05);
     }

    // 3. Κλείδωμα της κάμερας πάνω στο εκάστοτε εξάρτημα
    camera.lookAt(camTarget.current);

    // 4. Ομαλή μετάβαση σε X-Ray / CAD Wireframe mode
    const targetOpacity = xrayMode ? 0.22 : 0.96;
    [skinMatRef, wingLeftMatRef, wingRightMatRef].forEach((ref) => {
      if (ref.current) {
        ref.current.opacity = THREE.MathUtils.lerp(ref.current.opacity, targetOpacity, 0.08);
        ref.current.wireframe = xrayMode;
      }

    });

  });

  useLayoutEffect(() => {
    // Επιλογή σετ συντεταγμένων ανάλογα με τη συσκευή
    const coords = isMobile ? CAM_COORDS.mobile : CAM_COORDS.desktop;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#scroll-wrapper',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
          onUpdate: (self) => {
            const step = Math.min(5, Math.floor(self.progress * 6));
            setActiveStep(step);
          },
        },
      });

      // =========================================================
      // ΦΑΣΗ 1: ΠΛΗΡΗΣ ΑΠΟΔΟΜΗΣΗ (FULL EXPLODED VIEW)
      // =========================================================
      tl.to(wingLeftRef.current.position, { x: -1.6, y: 0.2, duration: 2, ease: 'power2.out' }, 0)
        .to(wingRightRef.current.position, { x: 1.6, y: 0.2, duration: 2, ease: 'power2.out' }, 0)
        .to(fuselageShellRef.current.position, { y: 1.4, duration: 2, ease: 'power2.out' }, 0)
        .to(tailGroupRef.current.position, { z: -1.6, y: 0.5, duration: 2, ease: 'power2.out' }, 0)
        .to(propRef.current.position, { z: 2.6, duration: 2, ease: 'power2.out' }, 0)
        .to(avionicsGroupRef.current.position, { y: -0.2, duration: 2, ease: 'power2.out' }, 0)
        // Κάμερα Φάσης 1
        .to(camera.position, { ...coords.step1.position, duration: 2 }, 0)
        .to(camTarget.current, { ...coords.step1.target, duration: 2 }, 0)

      // =========================================================
      // ΦΑΣΗ 2: ΕΣΤΙΑΣΗ ΣΤΗΝ ΑΕΡΟΔΥΝΑΜΙΚΗ / ΠΤΕΡΥΓΑ
      // =========================================================
        .to(camera.position, { ...coords.step2.position, duration: 2, ease: 'power1.inOut' }, 2)
        .to(camTarget.current, { ...coords.step2.target, duration: 2, ease: 'power1.inOut' }, 2)

      // =========================================================
      // ΦΑΣΗ 3: ΕΣΤΙΑΣΗ ΣΕ STRUCTURES, ΑΤΡΑΚΤΟ & ΟΥΡΑ
      // =========================================================
        .to(camera.position, { ...coords.step3.position, duration: 2, ease: 'power1.inOut' }, 4)
        .to(camTarget.current, { ...coords.step3.target, duration: 2, ease: 'power1.inOut' }, 4)

      // =========================================================
      // ΦΑΣΗ 4: ΕΣΤΙΑΣΗ ΣΤΑ AVIONICS & RF TELEMETRY
      // =========================================================
        .to(camera.position, { ...coords.step4.position, duration: 2, ease: 'power1.inOut' }, 6)
        .to(camTarget.current, { ...coords.step4.target, duration: 2, ease: 'power1.inOut' }, 6)
        .to(avionicsGroupRef.current.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 2 }, 6)

      // =========================================================
      // ΦΑΣΗ 5: ΕΠΑΝΑΣΥΝΑΡΜΟΛΟΓΗΣΗ (REASSEMBLY)
      // =========================================================
        .to(wingLeftRef.current.position, { x: 0, y: 0, duration: 2 }, 8)
        .to(wingRightRef.current.position, { x: 0, y: 0, duration: 2 }, 8)
        .to(fuselageShellRef.current.position, { y: 0, duration: 2 }, 8)
        .to(tailGroupRef.current.position, { z: 0, y: 0, duration: 2 }, 8)
        .to(propRef.current.position, { z: 1.68, duration: 2 }, 8)
        .to(avionicsGroupRef.current.position, { y: 0, duration: 2 }, 8)
        .to(avionicsGroupRef.current.scale, { x: 1, y: 1, z: 1, duration: 2 }, 8)
        // Κάμερα Φάσης 5
        .to(camera.position, { ...coords.step5.position, duration: 2 }, 8)
        .to(camTarget.current, { ...coords.step5.target, duration: 2 }, 8);
    });

    return () => ctx.revert();
  }, [camera, setActiveStep, isMobile]);

  // Η δημιουργία του UAV. Το component επιστρέφει ένα group που περιέχει όλα τα 3D στοιχεία του UAV, με διάφορα sub-groups για κάθε μέρος του μοντέλου.
  return (
    <group
      ref={rootRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Float speed={1.4} rotationIntensity={0.1} floatIntensity={0.25}>
        
        {/* FUSELAGE */}
        <group ref={fuselageShellRef}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <capsuleGeometry args={[0.38, 2.4, 16, 32]} />
            <meshStandardMaterial ref={skinMatRef} color="#1e293b" metalness={0.7} roughness={0.25} transparent opacity={0.96} />
          </mesh>
          <mesh position={[0, 0.28, 0.4]} rotation={[Math.PI / 2.2, 0, 0]}>
            <capsuleGeometry args={[0.22, 0.9, 16, 16]} />
            <meshStandardMaterial color="#38bdf8" metalness={0.9} roughness={0.1} transparent opacity={0.55} />
          </mesh>
          
          <Html position={[0, 0.65, 0.4]} center distanceFactor={6}>
            <div 
              // Αν το isLabelVisible(3) είναι true, προστίθεται το active-hud. Αλλιώς μένει μόνο το hud-label.
              className={`hud-label ${isLabelVisible(isMobile, activeStep, 3) ? 'active-hud' : ''}`}
              style={{
                opacity: isLabelVisible(isMobile, activeStep, 3) ? 1 : 0,
                pointerEvents: isLabelVisible(isMobile, activeStep, 3) ? 'auto' : 'none',
                transition: 'opacity 0.4s ease-in-out'
              }}
            >
              <strong>CFRP MONOCOQUE</strong>
              <span>Vacuum Infused Carbon Shell</span>
            </div>
          </Html>
        </group>

        {/* AVIONICS */}
        <group ref={avionicsGroupRef}>
          <mesh position={[0, -0.05, 0.2]}><boxGeometry args={[0.45, 0.06, 1.3]} /><meshStandardMaterial color="#065f46" metalness={0.5} roughness={0.4} /></mesh>
          <mesh position={[0, 0.02, 0.35]}><boxGeometry args={[0.22, 0.05, 0.22]} /><meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} /></mesh>
          <mesh position={[0.15, 0.22, -0.15]}><cylinderGeometry args={[0.015, 0.015, 0.45, 12]} /><meshStandardMaterial color="#f59e0b" metalness={1} roughness={0.1} /></mesh>
          <mesh position={[0.15, 0.45, -0.15]}><sphereGeometry args={[0.04, 16, 16]} /><meshBasicMaterial color="#38bdf8" /></mesh>
          
          <Html position={[0.25, 0.55, 0.1]} center distanceFactor={4}>
            <div 
              // Αν το isLabelVisible(4) είναι true, προστίθεται το active-hud. Αλλιώς μένει μόνο το hud-label.
              className={`hud-label ${isLabelVisible(isMobile, activeStep, 4) ? 'active-hud' : ''}`}
              style={{
                opacity: isLabelVisible(isMobile, activeStep, 4) ? 1 : 0,
                pointerEvents: isLabelVisible(isMobile, activeStep, 4) ? 'auto' : 'none',
                transition: 'opacity 0.4s ease-in-out'
              }}
            >
              <strong>AVIONICS & RF CORE</strong>
              <span>433MHz LoRa / Pixhawk / DSP</span>
            </div>
          </Html>
        </group>

        {/* LEFT WING */}
        <group ref={wingLeftRef}>
          <mesh position={[-1.85, 0.05, 0.1]} rotation={[0, -0.12, 0]} castShadow>
            <boxGeometry args={[3.1, 0.06, 0.75]} />
            <meshStandardMaterial ref={wingLeftMatRef} color="#0f172a" metalness={0.6} roughness={0.3} transparent opacity={0.96} />
          </mesh>
          <mesh position={[-3.38, 0.28, -0.05]} rotation={[0, 0, -0.25]}><boxGeometry args={[0.06, 0.5, 0.45]} /><meshStandardMaterial color="#0ea5e9" metalness={0.5} roughness={0.2} /></mesh>
          {[-0.8, -1.4, -2.0, -2.6].map((xPos, idx) => (
            <mesh key={idx} position={[xPos, 0.05, 0.1]} rotation={[0, -0.12, 0]}><boxGeometry args={[0.03, 0.08, 0.72]} /><meshBasicMaterial color="#38bdf8" wireframe /></mesh>
          ))}
          
          <Html position={[-2.1, 0.4, 0.1]} center distanceFactor={6}>
            <div 
              className={`hud-label ${isLabelVisible(isMobile, activeStep, 2) ? 'active-hud' : ''}`}
              style={{
                opacity: isLabelVisible(isMobile, activeStep, 2) ? 1 : 0,
                pointerEvents: isLabelVisible(isMobile, activeStep, 2) ? 'auto' : 'none',
                transition: 'opacity 0.4s ease-in-out'
              }}
            >
              <strong>PORT HIGH-LIFT WING</strong>
              <span>Laser-Cut Ribs & Carbon Spar</span>
            </div>
          </Html>
        </group>

        {/* RIGHT WING (Δεν είχε HTML label στον κώδικά σου, παραμένει ίδιο) */}
        <group ref={wingRightRef}>
          <mesh position={[1.85, 0.05, 0.1]} rotation={[0, 0.12, 0]} castShadow>
            <boxGeometry args={[3.1, 0.06, 0.75]} />
            <meshStandardMaterial ref={wingRightMatRef} color="#0f172a" metalness={0.6} roughness={0.3} transparent opacity={0.96} />
          </mesh>
          <mesh position={[3.38, 0.28, -0.05]} rotation={[0, 0, 0.25]}><boxGeometry args={[0.06, 0.5, 0.45]} /><meshStandardMaterial color="#0ea5e9" metalness={0.5} roughness={0.2} /></mesh>
          {[0.8, 1.4, 2.0, 2.6].map((xPos, idx) => (
            <mesh key={idx} position={[xPos, 0.05, 0.1]} rotation={[0, 0.12, 0]}><boxGeometry args={[0.03, 0.08, 0.72]} /><meshBasicMaterial color="#38bdf8" wireframe /></mesh>
          ))}
        </group>

        {/* TAIL ASSEMBLY */}
        <group ref={tailGroupRef}>
          <mesh position={[0, 0.05, -1.85]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.08, 0.14, 1.6, 16]} /><meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} /></mesh>
          <mesh position={[0, 0.5, -2.5]} rotation={[0.25, 0, 0]}><boxGeometry args={[0.06, 0.9, 0.45]} /><meshStandardMaterial color="#0ea5e9" metalness={0.6} roughness={0.2} /></mesh>
          <mesh position={[0, 0.92, -2.6]}><boxGeometry args={[1.5, 0.05, 0.35]} /><meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} /></mesh>
          
          <Html position={[0, 1.25, -2.6]} center distanceFactor={6}>
            <div 
              className={`hud-label ${isLabelVisible(isMobile, activeStep, 3) ? 'active-hud' : ''}`}
              style={{
                opacity: isLabelVisible(isMobile, activeStep, 3) ? 1 : 0,
                pointerEvents: isLabelVisible(isMobile, activeStep, 3) ? 'auto' : 'none',
                transition: 'opacity 0.4s ease-in-out'
              }}
            >
              <strong>T-TAIL EMPENNAGE</strong>
              <span>Pitch & Yaw Stabilization</span>
            </div>
          </Html>
        </group>

        {/* PROPULSION SYSTEM */}
        <group position={[0, 0, 1.68]} ref={propRef}>
          <mesh rotation={[Math.PI / 2, 0, 0]}><coneGeometry args={[0.14, 0.25, 16]} /><meshStandardMaterial color="#38bdf8" metalness={0.8} roughness={0.2} /></mesh>
          <mesh><boxGeometry args={[1.15, 0.08, 0.02]} /><meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} /></mesh>
        </group>
        
      </Float>
    </group>
  );
}