import { useState, useEffect } from 'react';

export default function Navbar({ isXrayActive, xrayToggle, setXrayToggle }) {
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Αν κάνουμε scroll κάτω και έχουμε περάσει τα πρώτα 50px
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        setIsHidden(true);
      } else {
        // Αν κάνουμε scroll πάνω
        setIsHidden(false);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Καθαρισμός του event listener όταν το component γίνεται unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`navbar ${isHidden ? 'navbar-hidden' : ''}`}>
      <div className="brand">
        <span className="brand-dot" />
        <span>EUROAVIA ATHENS // HANGAR 26</span>
      </div>
      <button
        className={`xray-btn interactive ${isXrayActive ? 'active' : ''}`}
        onClick={() => setXrayToggle(!xrayToggle)}
      >
        {isXrayActive ? '◉ X-RAY: ON' : <>◎ X-RAY<span className="hide-on-mobile"> CAD MODE</span></>}
      </button>
    </header>
  );
}