export const SECTIONS_DATA = [
  {
    id: 'sec-hero',
    align: 'left',
    tag: '01 // EUROAVIA ATHENS NTUA',
    title: 'Autonomous Cargo UAV Architecture',
    description:
      'Κάνε το πρώτο scroll για να ενεργοποιήσεις το πλήρες Exploded View του αεροσκάφους. Καθώς κατεβαίνεις, η κάμερα θα εστιάζει σε κάθε υποσύστημα της ομάδας.',
    specs: [
      { label: 'WINGSPAN', val: '3.20 m' },
      { label: 'MTOW', val: '14.5 kg' },
      { label: 'COMPETITION', val: 'Air Cargo / NFC' },
      { label: 'TELEMETRY LINK', val: 'Full-Duplex RF' },
    ],
  },
  {
    id: 'sec-explode',
    align: 'right',
    tag: '02 // FULL SYSTEM DECONSTRUCTION',
    title: 'Modular Aerospace Engineering',
    description:
      'Το αεροσκάφος έχει πλέον αποδομηθεί πλήρως στα βασικά του υποσυστήματα: Πτέρυγες, Κέλυφος Ατράκτου (Monocoque), Ουραίο Πτέρωμα, Προωθητικό Σύστημα και Avionics Core.',
    specs: [
      { label: 'SUBSYSTEMS', val: '5 Modular Groups' },
      { label: 'CAD PIPELINE', val: 'AutoCAD / Blender / GLTF' },
    ],
  },
  {
    id: 'sec-aero',
    align: 'left',
    tag: '03 // AERODYNAMICS DEPARTMENT',
    title: 'High-Lift Airfoil & CFD Optimization',
    description:
      'Εστίαση στην πτέρυγα: Σχεδιασμένη με custom αεροτομές χαμηλού αριθμού Reynolds, εσωτερικές αεροτομές (ribs) και winglets μείωσης επαγόμενης οπισθέλκουσας.',
    specs: [
      { label: 'L/D RATIO', val: '18.4 : 1' },
      { label: 'STALL SPEED', val: '11.2 m/s' },
    ],
  },
  {
    id: 'sec-struct',
    align: 'right',
    tag: '04 // STRUCTURES & COMPOSITES',
    title: 'Carbon-Kevlar Monocoque & Empennage',
    description:
      'Εστίαση στην άτρακτο και την ουρά: Συνδυασμός ανθρακονημάτων (CFRP) και Rohacell foam core για μέγιστη δυσκαμψία σε υψηλές φορτίσεις με ελάχιστο βάρος.',
    specs: [
      { label: 'EMPTY WEIGHT', val: '3.8 kg' },
      { label: 'LOAD FACTOR', val: '+6G / -3G' },
    ],
  },
  {
    id: 'sec-avionics',
    align: 'left',
    tag: '05 // AVIONICS, TELEMETRY & DSP',
    title: 'Real-Time Flight Data & Ground Station',
    description:
      'Εστίαση στον πυρήνα: Flight Controller, ψηφιακή επεξεργασία σήματος (DSP) και RF τηλεμετρία που στέλνει πακέτα δεδομένων σε πραγματικό χρόνο στον επίγειο σταθμό.',
    specs: [
      { label: 'DOWNLINK', val: '433 MHz / LoRa' },
      { label: 'AVIONICS BUS', val: 'CAN / UART / I2C' },
    ],
  },
  {
    id: 'sec-outro',
    align: 'center',
    tag: '06 // READY FOR TAKE-OFF',
    title: 'Reassembly & Flight Readiness',
    description:
      'Το αεροσκάφος επανασυναρμολογείται πλήρως και παίρνει θέση απογείωσης.',
    specs: [],
    isOutro: true,
  },
];