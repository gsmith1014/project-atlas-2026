/* global React, ReactDOM, Header, Footer, HomePage, TechnologyPage, CliniciansPage,
   PatientsPage, EvidencePage, AboutPage, NewsPage, InvestorsPage, ContactPage,
   TechCadPage, TechPhPage, TechPcwpPage, SiteTweaks, useTweaks */

const { useState, useEffect } = React;

const TWEAK_DEFAULTS = window.__TWEAK_DEFAULTS__;

function App() {
  const [page, setPage] = useState(() => {
    const h = (window.location.hash || '').replace('#', '');
    const valid = ['home', 'technology', 'tech-cad', 'tech-ph', 'tech-pcwp', 'clinicians', 'patients', 'evidence', 'about', 'news', 'investors', 'contact'];
    return valid.includes(h) ? h : 'home';
  });
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Navigation
  useEffect(() => {
    const handler = (e) => {
      const slug = e.detail;
      if (slug && slug !== page) {
        setPage(slug);
        window.location.hash = slug;
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };
    window.addEventListener('cv-navigate', handler);
    const hashHandler = () => {
      const h = (window.location.hash || '').replace('#', '');
      if (h) setPage(h);
    };
    window.addEventListener('hashchange', hashHandler);
    return () => {
      window.removeEventListener('cv-navigate', handler);
      window.removeEventListener('hashchange', hashHandler);
    };
  }, [page]);

  // Apply theme + density to root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tweaks.theme);
    document.documentElement.setAttribute('data-density', tweaks.density);
    document.documentElement.style.setProperty('--blue', tweaks.accentHue);
    // Derive deep variant via filter-equivalent — just darken with hue preservation
    document.documentElement.style.setProperty('--blue-deep',
      tweaks.theme === 'dark' ? tweaks.accentHue : darken(tweaks.accentHue, 0.22));
    document.documentElement.style.setProperty('--blue-tint', tint(tweaks.accentHue, 0.85));
    document.documentElement.style.setProperty('--blue-tint-2', tint(tweaks.accentHue, 0.93));
  }, [tweaks.theme, tweaks.density, tweaks.accentHue]);

  let Page = HomePage;
  if (page === 'technology') Page = TechnologyPage;
  else if (page === 'tech-cad') Page = TechCadPage;
  else if (page === 'tech-ph') Page = TechPhPage;
  else if (page === 'tech-pcwp') Page = TechPcwpPage;
  else if (page === 'clinicians') Page = CliniciansPage;
  else if (page === 'patients') Page = PatientsPage;
  else if (page === 'evidence') Page = EvidencePage;
  else if (page === 'about') Page = AboutPage;
  else if (page === 'news') Page = NewsPage;
  else if (page === 'investors') Page = InvestorsPage;
  else if (page === 'contact') Page = ContactPage;

  return (
    <>
      <Header page={page} />
      <main key={page}>
        <Page tweaks={tweaks} />
      </main>
      <Footer />
      <SiteTweaks tweaks={tweaks} setTweak={setTweak} />
    </>
  );
}

// Tiny color utilities
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}
function rgbToHex([r,g,b]) {
  return '#' + [r,g,b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2,'0')).join('');
}
function darken(hex, amt) {
  const [r,g,b] = hexToRgb(hex);
  return rgbToHex([r*(1-amt), g*(1-amt), b*(1-amt)]);
}
function tint(hex, amt) {
  // mix with white
  const [r,g,b] = hexToRgb(hex);
  return rgbToHex([r + (255-r)*amt, g + (255-g)*amt, b + (255-b)*amt]);
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
