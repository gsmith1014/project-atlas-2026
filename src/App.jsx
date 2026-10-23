import React, { useState, useEffect, useRef } from 'react';
import { Header, Footer } from './nav.jsx';
import { HomePage } from './pages/home.jsx';
import { TechnologyPage } from './pages/technology.jsx';
import { TechCadPage, TechPhPage, TechPcwpPage } from './pages/tech-disease.jsx';
import { CliniciansPage } from './pages/clinicians.jsx';
import { PatientsPage } from './pages/patients.jsx';
import { EvidencePage } from './pages/evidence.jsx';
import { AboutPage } from './pages/about.jsx';
import { NewsPage } from './pages/news.jsx';
import { ContactPage } from './pages/contact.jsx';
import { ReimbursementPage } from './pages/reimbursement.jsx';
import { ReferencesPage } from './pages/references.jsx';

const TWEAK_DEFAULTS = {
  heroVariant: 'editorial',
  theme: 'light',
  density: 'spacious',
  accentHue: '#5BAFE8',
  showECG: true,
};

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function darken(hex, amount = 0.2) {
  const [r, g, b] = hexToRgb(hex);
  const f = 1 - amount;
  return '#' + [r, g, b].map(c => Math.round(c * f).toString(16).padStart(2, '0')).join('');
}

function tint(hex, amount = 0.85) {
  const [r, g, b] = hexToRgb(hex);
  return '#' + [r, g, b].map(c => Math.round(c + (255 - c) * amount).toString(16).padStart(2, '0')).join('');
}

function getPage(slug, sub, tweaks) {
  switch (slug) {
    case 'home': return <HomePage tweaks={tweaks} />;
    case 'technology': return <TechnologyPage />;
    case 'tech-cad': return <TechCadPage />;
    case 'tech-ph': return <TechPhPage />;
    case 'tech-pcwp': return <TechPcwpPage />;
    case 'clinicians': return <CliniciansPage />;
    case 'patients': return <PatientsPage />;
    case 'evidence': return <EvidencePage />;
    case 'about': return <AboutPage />;
    case 'news': return <NewsPage articleSlug={sub} />;
    case 'contact': return <ContactPage />;
    case 'reimbursement': return <ReimbursementPage />;
    case 'references': return <ReferencesPage />;
    default: return <HomePage tweaks={tweaks} />;
  }
}

function getRouteFromHash() {
  const hash = window.location.hash.replace('#', '').trim();
  if (!hash) return { page: 'home', sub: null };
  const slash = hash.indexOf('/');
  if (slash === -1) return { page: hash, sub: null };
  return { page: hash.slice(0, slash), sub: hash.slice(slash + 1) };
}

export default function App() {
  const [{ page, sub }, setRoute] = useState(getRouteFromHash);
  const tweaks = TWEAK_DEFAULTS;
  const mainRef = useRef(null);
  const firstRender = useRef(true);

  // Hash-based routing
  useEffect(() => {
    const onHashChange = () => setRoute(getRouteFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Custom navigation event
  useEffect(() => {
    const onNav = (e) => {
      const slug = e.detail;
      window.location.hash = slug;
      setRoute(getRouteFromHash());
    };
    window.addEventListener('cv-navigate', onNav);
    return () => window.removeEventListener('cv-navigate', onNav);
  }, []);

  // Focus the new page and scroll to top after route changes.
  useEffect(() => {
    if (!firstRender.current) {
      mainRef.current?.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
    firstRender.current = false;
  }, [page, sub]);

  // Apply tweaks to CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    const accent = tweaks.accentHue;

    root.setAttribute('data-theme', tweaks.theme);
    root.setAttribute('data-density', tweaks.density);
    root.setAttribute('data-ecg', tweaks.showECG ? '1' : '0');

    root.style.setProperty('--blue', accent);
    root.style.setProperty('--blue-dark', darken(accent, 0.15));
    root.style.setProperty('--blue-tint', tint(accent, 0.88));

    if (tweaks.theme === 'dark') {
      root.style.setProperty('--bg', '#0E1F33');
      root.style.setProperty('--fg', '#F2F4F7');
      root.style.setProperty('--fg-muted', '#8C9BAE');
      root.style.setProperty('--rule', '#1F2A3D');
      root.style.setProperty('--ink', '#F2F4F7');
      root.style.setProperty('--paper', '#0E1F33');
      root.style.setProperty('--card-bg', '#131F2E');
    } else {
      root.style.setProperty('--bg', '#F2F4F7');
      root.style.setProperty('--fg', '#0B1320');
      root.style.setProperty('--fg-muted', '#6B7280');
      root.style.setProperty('--rule', '#D4CFC3');
      root.style.setProperty('--ink', '#091629');
      root.style.setProperty('--paper', '#F5F1E8');
      root.style.setProperty('--card-bg', '#F5F1E8');
    }
  }, [tweaks]);

  return (
    <>
      <a className="skip-link" href="#main-content" onClick={event => {
        event.preventDefault(); mainRef.current?.focus(); mainRef.current?.scrollIntoView();
      }}>Skip to main content</a>
      <Header page={page} />
      <main id="main-content" ref={mainRef} tabIndex={-1} key={page + (sub || '')}>
        {getPage(page, sub, tweaks)}
      </main>
      <Footer />
    </>
  );
}
