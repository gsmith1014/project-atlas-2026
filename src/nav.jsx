import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Brand, NavA, navTo } from './components.jsx';
import { EmailSignup } from './signup.jsx';

// Develop Hub is reachable through the CorVista VPN.
const CUSTOMER_HUB_URL = 'https://hub-research-pd.corvista.cc/';

function TechMenu({ page }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef(null);
  useEffect(() => { setOpen(false); }, [page]);
  const links = [
    { slug: 'technology', label: 'Technology overview', sub: 'How the CorVista System works' },
    { slug: 'tech-cad', abbr: 'CAD', label: 'Coronary artery disease' },
    { slug: 'tech-ph', abbr: 'PH', label: 'Pulmonary hypertension' },
    { slug: 'tech-pcwp', abbr: 'PCWP', label: 'Heart failure' },
  ];
  return (
    <div className="nav-item" onBlur={e => {
      if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
    }} onKeyDown={e => {
      if (e.key === 'Escape' && open) { e.preventDefault(); setOpen(false); trigger.current.focus(); }
    }}>
      <button ref={trigger} type="button" className="nav-disclosure" aria-expanded={open} aria-controls="technology-links" onClick={() => setOpen(v => !v)}>
        Technology<span className="caret" aria-hidden="true"></span>
      </button>
      <div id="technology-links" className="dropdown" hidden={!open} onClick={() => setOpen(false)}>
        <NavA to="technology">
          Technology overview
          <span className="d-sub">How the CorVista System works</span>
        </NavA>
        <div className="d-sep"></div>
        {links.slice(1).map(l => (
          <NavA key={l.slug} to={l.slug} className={page === l.slug ? 'active' : ''}>
            <span className="d-abbr">{l.abbr}</span>{l.label}
          </NavA>
        ))}
      </div>
    </div>
  );
}

function MobileNav({ page, onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    const desktop = window.matchMedia('(min-width: 769px)');
    const onResize = () => { if (desktop.matches) onClose(); };
    desktop.addEventListener('change', onResize);
    return () => { desktop.removeEventListener('change', onResize); element.close(); };
  }, [onClose]);
  function go(slug) { navTo(slug); onClose(); }
  const navGroups = [
    { slug: 'home', label: 'Home' },
    { slug: 'technology', label: 'Technology' },
    { slug: 'tech-cad', label: 'CAD — Coronary artery disease', sub: true },
    { slug: 'tech-ph', label: 'PH — Pulmonary hypertension', sub: true },
    { slug: 'tech-pcwp', label: 'PCWP — Heart failure', sub: true },
    { slug: 'clinicians', label: 'For Clinicians' },
    { slug: 'patients', label: 'For Patients' },
    { slug: 'evidence', label: 'Clinical Evidence' },
    { slug: 'about', label: 'About' },
    { slug: 'news', label: 'News' },
    { slug: 'customer-hub', label: 'Customer Hub', external: true },
  ];
  return (
    <dialog ref={dialog} id="mobile-navigation" className="mobile-nav" aria-label="Navigation" onCancel={onClose}>
      <button type="button" className="btn btn-ghost mobile-close" onClick={onClose} autoFocus>Close navigation</button>
      {navGroups.map(item => (
        item.external
          ? <a key={item.slug} href={CUSTOMER_HUB_URL} className="m-nav-link" onClick={onClose}>{item.label}</a>
          : <a
              key={item.slug}
              href={`#${item.slug}`}
              aria-current={page === item.slug ? 'page' : undefined}
              className={`m-nav-link${item.sub ? ' m-sub' : ''}${page === item.slug ? ' active' : ''}`}
              onClick={e => { e.preventDefault(); go(item.slug); }}
            >
              {item.label}
            </a>
      ))}
      <div className="m-nav-cta">
        <a
          href="#contact"
          className="btn btn-primary"
          onClick={e => { e.preventDefault(); go('contact'); }}
        >
          Request a demo<span className="arrow">→</span>
        </a>
      </div>
    </dialog>
  );
}

export function Header({ page }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => { setMenuOpen(false); }, [page]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const items = [
    { slug: 'home', label: 'Home' },
    { slug: 'clinicians', label: 'For Clinicians' },
    { slug: 'patients', label: 'For Patients' },
    { slug: 'evidence', label: 'Clinical Evidence' },
    { slug: 'about', label: 'About' },
    { slug: 'news', label: 'News' },
    { slug: 'customer-hub', label: 'Customer Hub', external: true },
  ];
  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Brand />
          <nav className="nav" aria-label="Primary">
            <NavA to="home" className={page === 'home' ? 'active' : ''}>Home</NavA>
            <TechMenu page={page} />
            {items.filter(it => it.slug !== 'home').map(it =>
              it.external
                ? <a key={it.slug} href={CUSTOMER_HUB_URL} className="nav-external">{it.label}</a>
                : <NavA key={it.slug} to={it.slug} className={page === it.slug ? 'active' : ''}>{it.label}</NavA>
            )}
          </nav>
          <div className="nav-cta">
            <NavA to="contact" className="btn btn-primary" style={{ padding: '10px 18px', fontSize: 14 }}>
              Request a demo<span className="arrow">→</span>
            </NavA>
          </div>
          <button
            className={`hamburger${menuOpen ? ' is-open' : ''}`}
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            aria-controls={menuOpen ? 'mobile-navigation' : undefined}
            onClick={() => setMenuOpen(o => !o)}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </header>
      {menuOpen && <MobileNav page={page} onClose={closeMenu} />}
    </>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{
                width: 198,
                height: 26,
                backgroundImage: 'url(/corvista-logo-white.png)',
                backgroundSize: '246px 138px',
                backgroundPosition: '-24px -50px',
                backgroundRepeat: 'no-repeat',
              }} role="img" aria-label="CorVista Health" />
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
            <a href="#" onClick={(e) => { e.preventDefault(); navTo('reimbursement'); }}>Reimbursement</a>
          </div>
          <div>
            <h6>Company</h6>
            <a href="#" onClick={(e) => { e.preventDefault(); navTo('about'); }}>About</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navTo('news'); }}>News & insights</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navTo('contact'); }}>Contact</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navTo('references'); }}>References</a>
          </div>
          <div>
            <h6>Connect</h6>
            <a href="https://www.linkedin.com/company/corvista-health" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <div style={{ paddingTop: 4 }}>
              <div style={{ fontSize: 14, color: '#C2C9D4', paddingBottom: 2 }}>Email updates</div>
              <EmailSignup />
            </div>
          </div>
        </div>
        <div style={{ padding: '16px 0', borderTop: '1px solid #1F2A3D', fontSize: 12, color: '#7A8899', lineHeight: 1.6 }}>
          The CorVista System® with CAD Add-on, PH Add-on, and PCWP Add-on have been cleared to market as 510(k) devices. CorVista® System is developed and manufactured by Analytics For Life, Inc., and licensed exclusively to CorVista Health.
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} CorVista Health, Inc. — All rights reserved.</span>
          <div style={{ display: 'flex', gap: 32 }}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
