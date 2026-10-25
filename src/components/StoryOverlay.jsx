import { SECTIONS_DATA } from '../data/sectionsData';
import './StoryOverlay.css';

export default function StoryOverlay({ activeStep }) {
  return (
    <main className="ui-layer">
      {SECTIONS_DATA.map((sec, index) => {
        const isVisible = activeStep === index;
        return (
          <section key={sec.id} className={`section ${sec.align}`}>
            <div className={`card interactive ${isVisible ? 'card-pop-active' : 'card-pop-hidden'}`}>
              <span className="tag">{sec.tag}</span>
              {index === 0 ? <h1>{sec.title}</h1> : <h2>{sec.title}</h2>}
              <p>{sec.description}</p>

              {sec.specs.length > 0 && (
                <div className="specs-grid">
                  {sec.specs.map((s, i) => (
                    <div key={i} className="spec-item">
                      <span className="spec-label">{s.label}</span>
                      <span className="spec-val">{s.val}</span>
                    </div>
                  ))}
                </div>
              )}

              {sec.isOutro && (
                <button
                  className="xray-btn interactive active"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  ↑ ΕΠΙΣΤΡΟΦΗ ΣΤΗΝ ΑΡΧΗ ΤΟΥ HANGAR
                </button>
              )}
            </div>
          </section>
        );
      })}
    </main>
  );
}