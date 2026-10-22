import React, { useRef, useLayoutEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

  const { camera } = useThree();
  // Σημείο στο οποίο κοιτάζει η κάμερα (Camera LookAt Target)
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
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#scroll-wrapper',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
          onUpdate: (self) => {
            // Υπολογισμός σε ποιο από τα 6 sections βρισκόμαστε (0 έως 5)
            const step = Math.min(5, Math.floor(self.progress * 6));
            setActiveStep(step);
          },
        },
      });

      // =========================================================
      // ΦΑΣΗ 1 (ΠΡΩΤΟ SCROLL): ΠΛΗΡΗΣ ΑΠΟΔΟΜΗΣΗ (FULL EXPLODED VIEW)
      // Όλα τα κομμάτια ανοίγουν ταυτόχρονα προς τα έξω!
      // =========================================================
      tl.to(wingLeftRef.current.position, { x: -1.6, y: 0.2, duration: 2, ease: 'power2.out' }, 0)
        .to(wingRightRef.current.position, { x: 1.6, y: 0.2, duration: 2, ease: 'power2.out' }, 0)
        .to(fuselageShellRef.current.position, { y: 1.4, duration: 2, ease: 'power2.out' }, 0)
        .to(tailGroupRef.current.position, { z: -1.6, y: 0.5, duration: 2, ease: 'power2.out' }, 0)
        .to(propRef.current.position, { z: 2.6, duration: 2, ease: 'power2.out' }, 0)
        .to(avionicsGroupRef.current.position, { y: -0.2, duration: 2, ease: 'power2.out' }, 0)
        // Η κάμερα ανοίγει λίγο σε ισομετρική γωνία για να φανεί όλη η έκρηξη
        .to(camera.position, { x: 3.2, y: 2.4, z: 6.5, duration: 2 }, 0)
        .to(camTarget.current, { x: 0, y: 0.3, z: 0, duration: 2 }, 0)

      // =========================================================
      // ΦΑΣΗ 2: ΕΣΤΙΑΣΗ ΣΤΗΝ ΑΕΡΟΔΥΝΑΜΙΚΗ / ΠΤΕΡΥΓΑ (AERODYNAMICS)
      // =========================================================
        .to(camera.position, { x: -3.8, y: 1.2, z: 2.8, duration: 2, ease: 'power1.inOut' }, 2)
        .to(camTarget.current, { x: -2.2, y: 0.2, z: 0.1, duration: 2, ease: 'power1.inOut' }, 2)

      // =========================================================
      // ΦΑΣΗ 3: ΕΣΤΙΑΣΗ ΣΕ STRUCTURES, ΑΤΡΑΚΤΟ & ΟΥΡΑ
      // =========================================================
        .to(camera.position, { x: 2.8, y: 2.3, z: -3.2, duration: 2, ease: 'power1.inOut' }, 4)
        .to(camTarget.current, { x: 0, y: 1.0, z: -1.2, duration: 2, ease: 'power1.inOut' }, 4)

      // =========================================================
      // ΦΑΣΗ 4: ΕΣΤΙΑΣΗ ΣΤΑ AVIONICS & RF TELEMETRY (CLOSE-UP ZOOM)
      // =========================================================
        .to(camera.position, { x: 1.1, y: 0.3, z: 1.5, duration: 2, ease: 'power1.inOut' }, 6)
        .to(camTarget.current, { x: 0, y: -0.1, z: 0.2, duration: 2, ease: 'power1.inOut' }, 6)
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
        .to(camera.position, { x: 0, y: 1.4, z: 6.2, duration: 2 }, 8)
        .to(camTarget.current, { x: 0, y: 0, z: 0, duration: 2 }, 8);
    });

    return () => ctx.revert();
  }, [camera, setActiveStep]);

  return (
    <group
      ref={rootRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Float speed={1.4} rotationIntensity={0.1} floatIntensity={0.25}>
        {/* FUSELAGE OUTER CARBON SHELL */}
        <group ref={fuselageShellRef}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <capsuleGeometry args={[0.38, 2.4, 16, 32]} />
            <meshStandardMaterial
              ref={skinMatRef}
              color="#1e293b"
              metalness={0.7}
              roughness={0.25}
              transparent
              opacity={0.96}
            />
          </mesh>
          <mesh position={[0, 0.28, 0.4]} rotation={[Math.PI / 2.2, 0, 0]}>
            <capsuleGeometry args={[0.22, 0.9, 16, 16]} />
            <meshStandardMaterial color="#38bdf8" metalness={0.9} roughness={0.1} transparent opacity={0.55} />
          </mesh>
          {(activeStep === 1 || activeStep === 3) && (
            <Html position={[0, 0.65, 0.4]} center distanceFactor={6}>
              <div className="hud-label active-hud">
                <strong>CFRP MONOCOQUE</strong>
                <span>Vacuum Infused Carbon Shell</span>
              </div>
            </Html>
          )}
        </group>

        {/* INTERNAL AVIONICS, TELEMETRY & DSP CORE */}
        <group ref={avionicsGroupRef}>
          <mesh position={[0, -0.05, 0.2]}>
            <boxGeometry args={[0.45, 0.06, 1.3]} />
            <meshStandardMaterial color="#065f46" metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.02, 0.35]}>
            <boxGeometry args={[0.22, 0.05, 0.22]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0.15, 0.22, -0.15]}>
            <cylinderGeometry args={[0.015, 0.015, 0.45, 12]} />
            <meshStandardMaterial color="#f59e0b" metalness={1} roughness={0.1} />
          </mesh>
          <mesh position={[0.15, 0.45, -0.15]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          {(activeStep === 1 || activeStep === 4) && (
            <Html position={[0.25, 0.55, 0.1]} center distanceFactor={4}>
              <div className="hud-label active-hud">
                <strong>AVIONICS & RF CORE</strong>
                <span>433MHz LoRa / Pixhawk / DSP</span>
              </div>
            </Html>
          )}
        </group>

        {/* LEFT WING + INTERNAL RIBS */}
        <group ref={wingLeftRef}>
          <mesh position={[-1.85, 0.05, 0.1]} rotation={[0, -0.12, 0]} castShadow>
            <boxGeometry args={[3.1, 0.06, 0.75]} />
            <meshStandardMaterial
              ref={wingLeftMatRef}
              color="#0f172a"
              metalness={0.6}
              roughness={0.3}
              transparent
              opacity={0.96}
            />
          </mesh>
          <mesh position={[-3.38, 0.28, -0.05]} rotation={[0, 0, -0.25]}>
            <boxGeometry args={[0.06, 0.5, 0.45]} />
            <meshStandardMaterial color="#0ea5e9" metalness={0.5} roughness={0.2} />
          </mesh>
          {[-0.8, -1.4, -2.0, -2.6].map((xPos, idx) => (
            <mesh key={idx} position={[xPos, 0.05, 0.1]} rotation={[0, -0.12, 0]}>
              <boxGeometry args={[0.03, 0.08, 0.72]} />
              <meshBasicMaterial color="#38bdf8" wireframe />
            </mesh>
          ))}
          {(activeStep === 1 || activeStep === 2) && (
            <Html position={[-2.1, 0.4, 0.1]} center distanceFactor={6}>
              <div className="hud-label active-hud">
                <strong>PORT HIGH-LIFT WING</strong>
                <span>Laser-Cut Ribs & Carbon Spar</span>
              </div>
            </Html>
          )}
        </group>

        {/* RIGHT WING + INTERNAL RIBS */}
        <group ref={wingRightRef}>
          <mesh position={[1.85, 0.05, 0.1]} rotation={[0, 0.12, 0]} castShadow>
            <boxGeometry args={[3.1, 0.06, 0.75]} />
            <meshStandardMaterial
              ref={wingRightMatRef}
              color="#0f172a"
              metalness={0.6}
              roughness={0.3}
              transparent
              opacity={0.96}
            />
          </mesh>
          <mesh position={[3.38, 0.28, -0.05]} rotation={[0, 0, 0.25]}>
            <boxGeometry args={[0.06, 0.5, 0.45]} />
            <meshStandardMaterial color="#0ea5e9" metalness={0.5} roughness={0.2} />
          </mesh>
          {[0.8, 1.4, 2.0, 2.6].map((xPos, idx) => (
            <mesh key={idx} position={[xPos, 0.05, 0.1]} rotation={[0, 0.12, 0]}>
              <boxGeometry args={[0.03, 0.08, 0.72]} />
              <meshBasicMaterial color="#38bdf8" wireframe />
            </mesh>
          ))}
        </group>

        {/* TAIL ASSEMBLY (EMPENNAGE) */}
        <group ref={tailGroupRef}>
          <mesh position={[0, 0.05, -1.85]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.14, 1.6, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.5, -2.5]} rotation={[0.25, 0, 0]}>
            <boxGeometry args={[0.06, 0.9, 0.45]} />
            <meshStandardMaterial color="#0ea5e9" metalness={0.6} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.92, -2.6]}>
            <boxGeometry args={[1.5, 0.05, 0.35]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
          </mesh>
          {(activeStep === 1 || activeStep === 3) && (
            <Html position={[0, 1.25, -2.6]} center distanceFactor={6}>
              <div className="hud-label active-hud">
                <strong>T-TAIL EMPENNAGE</strong>
                <span>Pitch & Yaw Stabilization</span>
              </div>
            </Html>
          )}
        </group>

        {/* PROPULSION SYSTEM */}
        <group position={[0, 0, 1.68]} ref={propRef}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.14, 0.25, 16]} />
            <meshStandardMaterial color="#38bdf8" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh>
            <boxGeometry args={[1.15, 0.08, 0.02]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}