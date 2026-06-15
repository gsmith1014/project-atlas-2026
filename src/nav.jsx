import React from 'react';
import { Brand, NavA, navTo } from './components.jsx';

function TechMenu({ page }) {
  const links = [
    { slug: 'technology', label: 'Technology overview', sub: 'How the CorVista System works' },
    { slug: 'tech-cad', abbr: 'CAD', label: 'Coronary artery disease' },
    { slug: 'tech-ph', abbr: 'PH', label: 'Pulmonary hypertension' },
    { slug: 'tech-pcwp', abbr: 'PCWP', label: 'Heart failure' },
  ];
  return (
    <div className="nav-item">
      <NavA to="technology" className={(page || '').startsWith('tech') ? 'active has-caret' : 'has-caret'} aria-haspopup="true">
        Technology<span className="caret" aria-hidden="true"></span>
      </NavA>
      <div className="dropdown" role="menu" aria-label="Technology">
        <NavA to="technology" role="menuitem">
          Technology overview
          <span className="d-sub">How the CorVista System works</span>
        </NavA>
        <div className="d-sep"></div>
        {links.slice(1).map(l => (
          <NavA key={l.slug} to={l.slug} role="menuitem" className={page === l.slug ? 'active' : ''}>
            <span className="d-abbr">{l.abbr}</span>{l.label}
          </NavA>
        ))}
      </div>
    </div>
  );
}

export function Header({ page }) {
  const items = [
    { slug: 'home', label: 'Home' },
    { slug: 'clinicians', label: 'For Clinicians' },
    { slug: 'patients', label: 'For Patients' },
    { slug: 'evidence', label: 'Clinical Evidence' },
    { slug: 'about', label: 'About' },
    { slug: 'news', label: 'News' },
    { slug: 'investors', label: 'Investors' },
  ];
  return (
    <header className="header">
      <div className="header-inner">
        <Brand />
        <nav className="nav" aria-label="Primary">
          <NavA to="home" className={page === 'home' ? 'active' : ''}>Home</NavA>
          <TechMenu page={page} />
          {items.filter(it => it.slug !== 'home').map(it => (
            <NavA key={it.slug} to={it.slug} className={page === it.slug ? 'active' : ''}>{it.label}</NavA>
          ))}
        </nav>
        <div className="nav-cta">
          <NavA to="contact" className="btn btn-primary" style={{ padding: '10px 18px', fontSize: 14 }}>
            Request a demo<span className="arrow">→</span>
          </NavA>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M5 8 L16 22 L27 8" fill="none" stroke="#5BAFE8" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" />
                <path d="M10 8 L16 16 L22 8" fill="none" stroke="#5BAFE8" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" />
              </svg>
              <div style={{ fontFamily: 'var(--f-sans)', fontSize: 15, fontWeight: 800, color: '#F4F6F9', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                COR<span style={{ color: '#5BAFE8' }}>VISTA</span><sup style={{ fontSize: '0.5em', letterSpacing: 0 }}>®</sup>
              </div>
            </div>
            <p style={{ color: '#98A2B3', maxWidth: 320, fontSize: 14, lineHeight: 1.5 }}>
              The world's most comprehensive front-line cardiovascular test. Built to find disease earlier — at the point of care.
            </p>
            <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
              <a href="#contact" onClick={(e) => { e.preventDefault(); navTo('contact'); }} className="btn btn-primary" style={{ padding: '10px 18px', fontSize: 14 }}>
                Request a demo<span className="arrow">→</span>
              </a>
            </div>
          </div>
          <div>
            <h6>Product</h6>
            <a href="#" onClick={(e) => { e.preventDefault(); navTo('technology'); }}>Technology</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navTo('tech-cad'); }}>Coronary artery disease</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navTo('tech-ph'); }}>Pulmonary hypertension</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navTo('tech-pcwp'); }}>Heart failure (PCWP)</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navTo('evidence'); }}>Clinical evidence</a>
          </div>
          <div>
            <h6>Company</h6>
            <a href="#" onClick={(e) => { e.preventDefault(); navTo('about'); }}>About</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navTo('news'); }}>News & insights</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navTo('investors'); }}>Investors</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navTo('contact'); }}>Contact</a>
          </div>
          <div>
            <h6>Resources</h6>
            <a href="#">Publications</a>
            <a href="#">Press kit</a>
            <a href="#">Careers</a>
            <a href="#">Partnerships</a>
          </div>
          <div>
            <h6>Connect</h6>
            <a href="#">LinkedIn</a>
            <a href="#">X / Twitter</a>
            <a href="#">YouTube</a>
            <a href="#">Email updates</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} CorVista Health, Inc. — All rights reserved.</span>
          <div style={{ display: 'flex', gap: 32 }}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Accessibility</a>
            <a href="#">Indications for use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
