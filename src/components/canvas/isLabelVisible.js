// Λογική Εμφάνισης Ταμπελών: 
  // - Στο κινητό: ΜΟΝΟ στο exploded view (activeStep === 1)
  //               Γυρνάει πίσω ΜΟΝΟ μονο το phase 1 (exploded view) για να μην γεμίζει η οθόνη με labels.
  // - Στο Desktop: Στο exploded view Ή όταν η κάμερα εστιάζει στο συγκεκριμένο part
  export const isLabelVisible = (isMobile, activeStep, targetStep) => {
    // Επιστρέφει true αν είμαστε στο Exploded View (1) 
    // Ή αν είμαστε στο Step 3 και το συγκεκριμένο label αφορά το Step 3
    if (isMobile) return activeStep === 1 || (activeStep === 3 && targetStep === 3);
    return activeStep === 1 || activeStep === targetStep;
  };