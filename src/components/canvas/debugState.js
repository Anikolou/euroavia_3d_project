// debugState.js
//Αρχικά, διαβάζουμε το URL για να δούμε αν υπάρχει το ?debug=true και να ενεργοποιήσουμε τον CameraDebugger
class DebugState {
  constructor() {
    // Διαβάζει αυτόματα το URL (π.χ. localhost:5173/?debug=true&step=2) για να ενεργοποιήσει τον CameraDebugger και να ορίσει το αρχικό step
    const urlParams = new URLSearchParams(window.location.search);
    this.isDebug = urlParams.get('debug') === 'true';

    // Διαβάζει ποιο step θέλεις (αν δεν δοθεί, ξεκινάει από το 0)
    this.initialStep = urlParams.has('step') ? parseInt(urlParams.get('step'), 10) : 0;
    
    if (this.isDebug) {
      console.log("🛠️ Camera Debugger Mode: ACTIVE (URL flag detected)");
    }

    this.listeners = [];
  }

  toggle() {
    this.isDebug = !this.isDebug;
    console.log("🛠️ Camera Debugger Mode:", this.isDebug ? "ON" : "OFF");
    this.listeners.forEach(listener => listener(this.isDebug));
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}

export const debugState = new DebugState();