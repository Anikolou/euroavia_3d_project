import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function CameraDebugger() {
  const { camera } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    // Καταχωρούμε τη συνάρτηση getCam στο window για να υπάρχει στο console
    window.getCam = () => {
      const pos = camera.position;
      const target = controlsRef.current ? controlsRef.current.target : { x: 0, y: 0, z: 0 };

      const posArr = [Number(pos.x.toFixed(2)), Number(pos.y.toFixed(2)), Number(pos.z.toFixed(2))];
      const targetArr = [Number(target.x.toFixed(2)), Number(target.y.toFixed(2)), Number(target.z.toFixed(2))];

      console.log('---  CAMERA SNAPSHOT ---');
      console.log(`camera.position: { x: ${posArr[0]}, y: ${posArr[1]}, z: ${posArr[2]} }`);
      console.log(`camTarget.current: { x: ${targetArr[0]}, y: ${targetArr[1]}, z: ${targetArr[2]} }`);
      console.log('---------------------------');
      
      return { position: posArr, target: targetArr };
    };

    console.log('✅ Το getCam() είναι έτοιμο! Περίστρεψε τη σκηνή και γράψε getCam() στο Console.');
    
    return () => {
      delete window.getCam;
    };
  }, [camera]);

  // Χρειαζόμαστε τα OrbitControls για να μπορείς να περιστρέφεις και να κάνεις pan/zoom ελεύθερα
  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan={true}
      // Ενεργοποιεί τη μετακίνηση (Pan) με τα βελάκια του πληκτρολογίου
      listenToKeyEvents={window}
      keyPanSpeed={18}
      // Ρυθμίσεις ποντικιού
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      }}
      // Ρυθμίσεις για Inspect / Emulation Touch (Pan με δύο δάχτυλα ή Shift+Drag)
      touches={{
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN,
      }}
    />
  );
}