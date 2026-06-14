/* global React */

// ============================================================
// Shared site components (logos, ECG, image placeholders, etc)
// ============================================================

// (hooks accessed via React.* where needed)

// CorVista brand mark — original geometric chevron‑in‑hex,
// inspired by the cardiovascular pulse motif (not the registered logo).
function BrandMark({ size = 26, color = "currentColor", accent = "#5BAFE8" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M5 8 L16 22 L27 8" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" />
      <path d="M10 8 L16 16 L22 8" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  );
}

function Brand({ small = false }) {
  return (
    <a href="#home" className="brand" aria-label="CorVista Health home">
      <BrandMark size={small ? 22 : 26} />
      <span className="brand-name">
        Cor<span className="blue">Vista</span> <span style={{opacity: 0.55, fontWeight: 400}}>Health</span>
      </span>
    </a>
  );
}

// ECG sparkline (decorative)
function EcgLine({ color = "var(--blue)", height = 60, segments = 6, strokeWidth = 1.5 }) {
  // Build a procedurally generated ECG-like polyline
  const width = 1000;
  const baseline = height / 2;
  const segW = width / segments;
  let d = `M 0 ${baseline}`;
  for (let i = 0; i < segments; i++) {
    const x0 = i * segW;
    // PQRST shape relative to segment
    d += ` L ${x0 + segW*0.18} ${baseline}`;          // baseline
    d += ` L ${x0 + segW*0.22} ${baseline - height*0.08}`; // P
    d += ` L ${x0 + segW*0.26} ${baseline}`;
    d += ` L ${x0 + segW*0.30} ${baseline + height*0.05}`;  // Q
    d += ` L ${x0 + segW*0.34} ${baseline - height*0.45}`;  // R
    d += ` L ${x0 + segW*0.38} ${baseline + height*0.20}`;  // S
    d += ` L ${x0 + segW*0.50} ${baseline}`;
    d += ` L ${x0 + segW*0.60} ${baseline - height*0.12}`;  // T
    d += ` L ${x0 + segW*0.68} ${baseline}`;
    d += ` L ${x0 + segW} ${baseline}`;
  }
  return (
    <svg className="ecg-line" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{height}}>
      <path d={d} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

// Image placeholder with striped fill and a small monospace label
function ImgPh({ label, ratio = "4/3", className = "", dark = false, style = {} }) {
  return (
    <div className={`imgph ${dark ? 'imgph-dark' : ''} ${className}`} style={{ aspectRatio: ratio, ...style }}>
      <div className="imgph-label">{label}</div>
    </div>
  );
}

// Button
function Btn({ children, variant = "primary", as = "button", href, onClick, ...rest }) {
  const cls = `btn ${variant === 'primary' ? 'btn-primary' : variant === 'ghost' ? 'btn-ghost' : variant === 'link' ? 'btn-link' : ''}`;
  if (as === "a" || href) {
    return <a href={href} className={cls} onClick={onClick} {...rest}>{children}<span className="arrow">→</span></a>;
  }
  return <button className={cls} onClick={onClick} {...rest}>{children}<span className="arrow">→</span></button>;
}

// Stat block
function Stat({ value, unit, label, desc, big = false }) {
  return (
    <div>
      <div className="stat-label">{label}</div>
      <div className="stat-num" style={big ? { fontSize: 'clamp(80px, 11vw, 180px)' } : {}}>
        {value}{unit && <span className="unit">{unit}</span>}
      </div>
      {desc && <p className="stat-desc" style={{ marginTop: 12 }}>{desc}</p>}
    </div>
  );
}

// Eyebrow
function Eyebrow({ children, dot = true }) {
  return (
    <div className="eyebrow">
      {dot && <span className="dot"></span>}{children}
    </div>
  );
}

// Section
function Section({ children, dark = false, id, className = "", style = {} }) {
  return (
    <section id={id} className={`section ${dark ? 'section-dark' : ''} ${className}`} style={style}>
      <div className="container">{children}</div>
    </section>
  );
}

// Section header
function SectionHeader({ eyebrow, title, action }) {
  return (
    <div className="section-header">
      <div>
        {eyebrow && <div style={{ marginBottom: 18 }}><Eyebrow>{eyebrow}</Eyebrow></div>}
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}

// Marquee bar
function Marquee({ items }) {
  const content = [...items, ...items];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {content.map((it, i) => (
          <React.Fragment key={i}>
            <span>{it}</span>
            <span className="dot">●</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// Tabs
function Tabs({ items, value, onChange }) {
  return (
    <div role="tablist" className="tabs">
      {items.map(it => (
        <button
          key={it.id}
          role="tab"
          aria-selected={value === it.id}
          className="tab"
          onClick={() => onChange(it.id)}
        >{it.label}</button>
      ))}
    </div>
  );
}

// In-page link click handler (prevents page jump, sets app state)
function navTo(slug) {
  window.dispatchEvent(new CustomEvent('cv-navigate', { detail: slug }));
}
function NavA({ to, className = "", children, ...rest }) {
  return (
    <a href={`#${to}`} className={className} onClick={(e) => { e.preventDefault(); navTo(to); }} {...rest}>{children}</a>
  );
}

Object.assign(window, {
  BrandMark, Brand, EcgLine, ImgPh, Btn, Stat, Eyebrow, Section, SectionHeader,
  Marquee, Tabs, NavA, navTo
});
