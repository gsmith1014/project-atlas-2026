import React from 'react';
import { Eyebrow, Section, SectionHeader, ImgPh, Btn, Stat, NavA, navTo } from '../components.jsx';
import { useReveal, CountUp } from '../hooks.jsx';

const RESTART_SVG = (
  <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor" style={{ flexShrink: 0 }} aria-hidden="true">
    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
  </svg>
);

// ── Flowchart icon set ──────────────────────────────────────────────────
const FlowIcons = {
  patient: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z"/>
    </svg>
  ),
  sensor: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="4" y="8" width="16" height="12" rx="2"/>
      <path d="M9 8V6a3 3 0 0 1 6 0v2"/>
      <circle cx="12" cy="14" r="2" fill="currentColor" stroke="none"/>
    </svg>
  ),
  report: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
      <polyline points="13 2 13 9 20 9"/>
      <line x1="8" y1="13" x2="16" y2="13"/>
      <line x1="8" y1="17" x2="13" y2="17"/>
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9"/>
      <polyline points="12 7 12 12 16 14"/>
    </svg>
  ),
  pulse: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2 12 6 12 8 5 10 19 13 10 15 14 18 14 22 14"/>
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3"/>
    </svg>
  ),
  hospital: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="4" width="18" height="17" rx="2"/>
      <line x1="12" y1="8" x2="12" y2="16"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  ),
  dollar: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="2" x2="12" y2="22"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  userX: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="9" cy="7" r="4"/>
      <path d="M1 21c0-4 3.58-7 8-7"/>
      <line x1="17" y1="11" x2="23" y2="17"/>
      <line x1="23" y1="11" x2="17" y2="17"/>
    </svg>
  ),
  corvista: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Device body */}
      <rect x="3" y="5" width="18" height="13" rx="2"/>
      {/* Screen bezel */}
      <rect x="5" y="7" width="14" height="8" rx="1" strokeWidth="1.5"/>
      {/* Biosignal waveform on screen */}
      <polyline points="6 11 7.5 11 9 8.5 10.5 13.5 12 9.5 13.5 11 16 11 18 11" strokeWidth="1.5"/>
      {/* Sensor lead dots */}
      <circle cx="8" cy="20" r="1.2" fill="currentColor" stroke="none"/>
      <circle cx="16" cy="20" r="1.2" fill="currentColor" stroke="none"/>
      {/* Lead lines from device */}
      <line x1="8" y1="18" x2="8" y2="20"/>
      <line x1="16" y1="18" x2="16" y2="20"/>
    </svg>
  ),
};

const CV_TEAL  = '#4ECDC4';
const CV_CORAL = '#D85528';
const CV_GREEN = '#2BC48A';
const CV_BLUE  = '#5BAFE8';
const CV_DARK  = '#1A2E45';

function FlowNode({ icon, bg, delay = 0, visible = true }) {
  return (
    <div style={{
      width: 52, height: 52, borderRadius: '50%',
      background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, color: '#fff',
      boxShadow: `0 0 0 6px ${bg}1A`,
      opacity: visible ? 1 : 0,
      transform: visible ? 'scale(1)' : 'scale(0.6)',
      transition: `opacity 0.35s ease ${delay}ms, transform 0.35s ease ${delay}ms`,
    }}>
      {FlowIcons[icon]}
    </div>
  );
}

function VConnector({ color, delay = 0, height = 32, visible = true }) {
  return (
    <div style={{
      width: 2,
      height: visible ? height : 0,
      background: color,
      flexShrink: 0,
      transition: `height 0.3s ease ${delay}ms`,
    }} />
  );
}

function FlowPill({ label, color }) {
  return (
    <span style={{
      display: 'inline-block', padding: '3px 11px', borderRadius: 20,
      background: `${color}16`, border: `1px solid ${color}32`,
      color, fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.06em',
    }}>{label}</span>
  );
}

function RestartRow({ label, delay = 0, visible = true }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '9px 14px',
      background: `${CV_CORAL}0A`, border: `1px solid ${CV_CORAL}24`,
      borderLeft: `3px solid ${CV_CORAL}`, borderRadius: 4,
      fontFamily: 'var(--f-mono)', fontSize: 12, color: CV_CORAL,
      width: '100%', maxWidth: 270,
      opacity: visible ? 1 : 0,
      transition: `opacity 0.4s ease ${delay}ms`,
    }}>
      {RESTART_SVG}{label}
    </div>
  );
}

// Visual timeline strip for missed-diagnosis case cards
function CaseMissTimeline({ events, cvEvent }) {
  return (
    <div style={{ padding: '16px 20px 18px', background: 'rgba(216,85,40,.04)', borderBottom: '1px solid rgba(216,85,40,.10)' }}>
      <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#4A5568', marginBottom: 14 }}>
        Diagnostic timeline
      </div>
      <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto' }}>
        {events.map((e, i) => (
          <React.Fragment key={i}>
            <div style={{ flexShrink: 0, textAlign: 'center', minWidth: 64 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(216,85,40,.13)', border: '1px solid rgba(216,85,40,.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                <svg viewBox="0 0 20 20" fill="#D85528" width="14" height="14">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#D85528', marginTop: 5, fontFamily: 'var(--f-mono)', whiteSpace: 'nowrap' }}>{e.label}</div>
              <div style={{ fontSize: 10, color: '#4A5568', marginTop: 2, whiteSpace: 'nowrap' }}>{e.sub}</div>
            </div>
            <div style={{ flex: '1 0 20px', height: 1, background: 'rgba(216,85,40,.2)' }} />
          </React.Fragment>
        ))}
        <div style={{ flexShrink: 0, textAlign: 'center', minWidth: 72 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(43,196,138,.13)', border: '1px solid rgba(43,196,138,.36)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
            <svg viewBox="0 0 20 20" fill="#2BC48A" width="14" height="14">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#2BC48A', marginTop: 5, fontFamily: 'var(--f-mono)', whiteSpace: 'nowrap' }}>{cvEvent.label}</div>
          <div style={{ fontSize: 10, color: '#2BC48A', marginTop: 2, whiteSpace: 'nowrap', opacity: 0.8 }}>{cvEvent.sub}</div>
        </div>
      </div>
    </div>
  );
}

function DiagnosticDoomLoop() {
  const [headerRef, headerVisible] = useReveal(0.25);
  const [flowRef, flowVisible]     = useReveal(0.05);

  const d = (n) => flowVisible ? n : 0;

  return (
    <div>
      {/* Stat comparison header */}
      <div
        ref={headerRef}
        style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 1, background: 'var(--rule)',
          border: '1px solid var(--rule)', borderRadius: 8,
          overflow: 'hidden', marginBottom: 56,
        }}
      >
        <div style={{ padding: '28px 32px', background: 'var(--card)' }}>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: CV_CORAL, marginBottom: 10 }}>Standard of care — best case</div>
          <div style={{ fontFamily: 'var(--f-sans)', fontSize: 56, fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--fg)', lineHeight: 1 }}>
            {headerVisible ? <CountUp end={24} suffix="+" duration={1200} /> : '0+'}
          </div>
          <div style={{ fontSize: 14, color: 'var(--fg-muted)', marginTop: 8, lineHeight: 1.5 }}>weeks to complete a full cardiovascular differential under sequential workup</div>
        </div>
        <div style={{ padding: '28px 32px', background: '#091629' }}>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: CV_BLUE, marginBottom: 10 }}>With CorVista</div>
          <div style={{ fontFamily: 'var(--f-sans)', fontSize: 56, fontWeight: 700, letterSpacing: '-0.04em', color: '#F4F6F9', lineHeight: 1 }}>3.7</div>
          <div style={{ fontSize: 14, color: '#98A2B3', marginTop: 8, lineHeight: 1.5 }}>minutes — same visit — physician-reviewed report</div>
        </div>
      </div>

      {/* Animated flowchart */}
      <div ref={flowRef}>

        {/* Patient start node — centered */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FlowNode icon="patient" bg={CV_BLUE} delay={d(0)} visible={flowVisible} />
          <div style={{ marginTop: 10, textAlign: 'center', opacity: flowVisible ? 1 : 0, transition: `opacity 0.4s ease ${d(80)}ms` }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg)' }}>Patient presents with cardiac symptoms</div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 4 }}>Chest pain · Dyspnea · Unexplained fatigue</div>
          </div>
          <div style={{ width: 2, height: flowVisible ? 36 : 0, background: '#253A52', margin: '16px 0 0', transition: `height 0.3s ease ${d(200)}ms` }} />
        </div>

        {/* Horizontal branch split */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div style={{ height: 2, background: '#1F3352' }} />
          <div style={{ height: 2, background: '#1F3352' }} />
        </div>

        {/* Two-column paths */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>

          {/* ═══════════ CorVista path (left) ═══════════ */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <VConnector color={CV_TEAL} delay={d(260)} height={28} visible={flowVisible} />
            <div style={{ padding: '3px 12px', background: `${CV_TEAL}14`, border: `1px solid ${CV_TEAL}2A`, borderRadius: 20, fontFamily: 'var(--f-mono)', fontSize: 11, color: CV_TEAL, letterSpacing: '0.07em', marginBottom: 4, opacity: flowVisible ? 1 : 0, transition: `opacity 0.3s ease ${d(280)}ms` }}>
              With CorVista
            </div>
            <VConnector color={CV_TEAL} delay={d(330)} height={20} visible={flowVisible} />

            <FlowNode icon="corvista" bg={CV_TEAL} delay={d(380)} visible={flowVisible} />
            <div style={{ textAlign: 'center', marginTop: 10, opacity: flowVisible ? 1 : 0, transition: `opacity 0.4s ease ${d(430)}ms` }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}>CorVista capture</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 4, lineHeight: 1.4 }}>Non-invasive. MA-applied. At rest.</div>
              <div style={{ marginTop: 8 }}><FlowPill label="15 minutes total visit" color={CV_TEAL} /></div>
            </div>

            <VConnector color={CV_TEAL} delay={d(580)} height={28} visible={flowVisible} />
            <FlowNode icon="report" bg={CV_TEAL} delay={d(630)} visible={flowVisible} />
            <div style={{ textAlign: 'center', marginTop: 10, opacity: flowVisible ? 1 : 0, transition: `opacity 0.4s ease ${d(680)}ms` }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}>Physician-reviewed report</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 4, lineHeight: 1.4 }}>CAD · PH · HF — all three assessed simultaneously</div>
              <div style={{ marginTop: 8 }}><FlowPill label="Minutes after capture" color={CV_TEAL} /></div>
            </div>

            <VConnector color={CV_GREEN} delay={d(880)} height={28} visible={flowVisible} />
            <FlowNode icon="check" bg={CV_GREEN} delay={d(930)} visible={flowVisible} />
            <div style={{ textAlign: 'center', marginTop: 10, opacity: flowVisible ? 1 : 0, transition: `opacity 0.4s ease ${d(980)}ms` }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: CV_GREEN }}>Directed to right care pathway</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 4, lineHeight: 1.4 }}>No referral gap. No dropout risk. Same visit.</div>
            </div>

            <div style={{ marginTop: 24, padding: '18px 20px', background: `${CV_GREEN}09`, border: `1px solid ${CV_GREEN}26`, borderRadius: 8, textAlign: 'center', width: '100%', maxWidth: 260, opacity: flowVisible ? 1 : 0, transition: `opacity 0.5s ease ${d(1150)}ms` }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: CV_GREEN, letterSpacing: '-0.02em', lineHeight: 1.2 }}>In a single visit</div>
              <div style={{ fontSize: 13, color: CV_GREEN, marginTop: 6, opacity: 0.85 }}>Complete differential. Every patient.</div>
            </div>
          </div>

          {/* ═══════════ SOC Doom Loop (right) ═══════════ */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <VConnector color={CV_CORAL} delay={d(260)} height={28} visible={flowVisible} />
            <div style={{ padding: '3px 12px', background: `${CV_CORAL}11`, border: `1px solid ${CV_CORAL}26`, borderRadius: 20, fontFamily: 'var(--f-mono)', fontSize: 11, color: CV_CORAL, letterSpacing: '0.07em', marginBottom: 4, opacity: flowVisible ? 1 : 0, transition: `opacity 0.3s ease ${d(280)}ms` }}>
              Standard of care
            </div>
            <VConnector color={CV_CORAL} delay={d(330)} height={20} visible={flowVisible} />

            {/* Referral */}
            <FlowNode icon="clock" bg={CV_DARK} delay={d(380)} visible={flowVisible} />
            <div style={{ textAlign: 'center', marginTop: 10, opacity: flowVisible ? 1 : 0, transition: `opacity 0.4s ease ${d(430)}ms` }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}>Referral to specialist</div>
              <div style={{ marginTop: 8 }}><FlowPill label="6–8 weeks" color={CV_CORAL} /></div>
            </div>

            {/* 50% dropout */}
            <div style={{ marginTop: 14, padding: '10px 14px', background: `${CV_CORAL}09`, border: `1px solid ${CV_CORAL}20`, borderRadius: 6, display: 'flex', gap: 10, alignItems: 'center', width: '100%', maxWidth: 270, opacity: flowVisible ? 1 : 0, transition: `opacity 0.5s ease ${d(580)}ms` }}>
              <div style={{ color: CV_CORAL, flexShrink: 0 }}>{FlowIcons.userX}</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: CV_CORAL, letterSpacing: '-0.03em', lineHeight: 1 }}>50%</div>
                <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 2, lineHeight: 1.3 }}>of patients never attend follow-up</div>
              </div>
            </div>

            <VConnector color={CV_CORAL} delay={d(630)} height={20} visible={flowVisible} />

            {/* CAD Workup */}
            <FlowNode icon="pulse" bg={CV_DARK} delay={d(680)} visible={flowVisible} />
            <div style={{ textAlign: 'center', marginTop: 10, opacity: flowVisible ? 1 : 0, transition: `opacity 0.4s ease ${d(730)}ms` }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}>CAD Workup</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 4, lineHeight: 1.4 }}>Stress test · Nuclear imaging · CT angio</div>
            </div>
            <div style={{ marginTop: 12, width: '100%', maxWidth: 270 }}>
              <RestartRow label="Negative → restart for PH" delay={d(880)} visible={flowVisible} />
            </div>

            <VConnector color={CV_CORAL} delay={d(930)} height={20} visible={flowVisible} />

            {/* PH Workup */}
            <FlowNode icon="pulse" bg={CV_DARK} delay={d(980)} visible={flowVisible} />
            <div style={{ textAlign: 'center', marginTop: 10, opacity: flowVisible ? 1 : 0, transition: `opacity 0.4s ease ${d(1030)}ms` }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}>PH Workup</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 4, lineHeight: 1.4 }}>Echo · V/Q scan · Right heart cath</div>
              <div style={{ marginTop: 8 }}><FlowPill label="6–8 more weeks" color={CV_CORAL} /></div>
            </div>
            <div style={{ marginTop: 12, width: '100%', maxWidth: 270 }}>
              <RestartRow label="Negative → restart for HF" delay={d(1180)} visible={flowVisible} />
            </div>

            <VConnector color={CV_CORAL} delay={d(1230)} height={20} visible={flowVisible} />

            {/* HF Workup */}
            <FlowNode icon="pulse" bg={CV_DARK} delay={d(1280)} visible={flowVisible} />
            <div style={{ textAlign: 'center', marginTop: 10, opacity: flowVisible ? 1 : 0, transition: `opacity 0.4s ease ${d(1330)}ms` }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}>HF Workup</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 4, lineHeight: 1.4 }}>Stress echo · Cardiac MRI · Hemodynamics</div>
              <div style={{ marginTop: 8 }}><FlowPill label="6–8 more weeks" color={CV_CORAL} /></div>
            </div>

            {/* Doom callouts */}
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 270 }}>
              {[
                { k: 'warning',  label: 'Disease progresses untreated',  sub: 'Each week of delay = unchecked disease advancement', delay: 1520 },
                { k: 'hospital', label: 'ER risk compounds',              sub: 'Undiagnosed patients at higher acute-event risk',     delay: 1660 },
                { k: 'dollar',   label: 'Costs multiply per cycle',       sub: 'Tests, visits, and specialist fees compound',         delay: 1800 },
              ].map(item => (
                <div key={item.k} style={{ padding: '10px 14px', background: `${CV_CORAL}07`, border: `1px solid ${CV_CORAL}1A`, borderRadius: 6, display: 'flex', gap: 10, alignItems: 'flex-start', opacity: flowVisible ? 1 : 0, transition: `opacity 0.4s ease ${d(item.delay)}ms` }}>
                  <div style={{ color: CV_CORAL, flexShrink: 0, marginTop: 1 }}>{FlowIcons[item.k]}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)', lineHeight: 1.3 }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 3, lineHeight: 1.3 }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, padding: '18px 20px', background: `${CV_CORAL}09`, border: `1px solid ${CV_CORAL}26`, borderRadius: 8, textAlign: 'center', width: '100%', maxWidth: 270, opacity: flowVisible ? 1 : 0, transition: `opacity 0.5s ease ${d(1950)}ms` }}>
              <div style={{ fontSize: 34, fontWeight: 700, color: CV_CORAL, letterSpacing: '-0.03em', lineHeight: 1 }}>24+ <span style={{ fontSize: 18, fontWeight: 600 }}>weeks</span></div>
              <div style={{ fontSize: 12, color: CV_CORAL, marginTop: 6, opacity: 0.8 }}>best case — often incomplete</div>
            </div>
          </div>
        </div>
      </div>

      <p className="wf-footnote">Workflow representation is directional. Individual institution timelines may vary.</p>
    </div>
  );
}

const CASES = [
  {
    n: '01',
    pub: 'JACC: Case Reports · 2025',
    patient: '75-year-old woman — atrial fibrillation, worsening dyspnea, fatigue, and palpitations',
    heroStat: '6', heroUnit: 'years',
    heroDesc: 'of evaluation — three echocardiograms, all negative — without a diagnosis',
    timeline: {
      events: [
        { label: 'Echo ✗', sub: 'Year 1' },
        { label: 'Echo ✗', sub: 'Year 3' },
        { label: 'Echo ✗', sub: 'Year 5' },
      ],
      cv: { label: 'CorVista+', sub: 'Year 6' },
    },
    before: {
      title: 'What standard care found',
      text: 'Three echocardiograms over six years, all negative for pulmonary hypertension. An equivocal stress test had the workup pointing toward coronary disease — cardiac catheterization was being planned.',
    },
    cv: {
      title: 'What CorVista found',
      text: 'CorVista PH test returned positive — likelihood ratio +10.3. Right heart catheterization was added to the planned procedure.',
      findings: ['mPAP 35 mmHg', 'PCWP 31 mmHg', 'No obstructive CAD'],
    },
    dx: 'Group 2 PH / HFpEF confirmed — referred to pulmonary hypertension specialist and started on SGLT2 inhibitor',
    cite: 'Aben R, Burton T, Fathieh F, et al. J Am Coll Cardiol Case Rep. 2025;30(26):104876.',
  },
  {
    n: '02',
    pub: 'European Heart Journal — Case Reports · 2026',
    patient: '63-year-old man — exertional chest pain, multiple cardiovascular risk factors, family history of CAD',
    heroStat: '2', heroUnit: 'tests',
    heroDesc: 'returned negative — severe multivessel disease was found on the third',
    timeline: {
      events: [
        { label: 'Echo ✗',  sub: 'Test 1' },
        { label: 'SPECT ✗', sub: 'Test 2' },
        { label: 'Stress ✗', sub: 'Test 3' },
      ],
      cv: { label: 'CorVista+', sub: 'Test 4' },
    },
    before: {
      title: 'What standard care found',
      text: 'Normal echocardiogram. Negative SPECT nuclear perfusion imaging. With a pretest CAD risk of 35–44%, the standard workup returned no indication for catheterization.',
    },
    cv: {
      title: 'What CorVista found',
      text: 'CorVista CAD score 0.20 — positive. Patient sent directly to invasive cardiac catheterization.',
      findings: ['80% LAD stenosis', '2× 80% LCX stenosis', 'Subtotal RCA occlusion', '4 lesions stented'],
    },
    dx: 'Severe multivessel CAD confirmed and treated — balanced ischemia that three standard-of-care tests missed',
    cite: 'Alkhawam M, et al. European Heart Journal — Case Reports. 2026;10(2):ytag016.',
  },
];

export function CliniciansPage() {
  return (
    <div className="page-fade" data-screen-label="03 Clinicians" data-page="clinicians">
      <div className="subhero">
        <div className="container">
          <Eyebrow>For Clinicians</Eyebrow>
          <h1 style={{ marginTop: 28 }}>
            A better first <span className="em">answer</span> — without the wait.
          </h1>
          <p className="lead">
            Get a physician-reviewed report back in minutes. Move confidently into next steps, or rule out disease without a downstream referral.
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 36, flexWrap: 'wrap' }}>
            <NavA to="contact" className="btn btn-primary">Request a demo<span className="arrow">→</span></NavA>
            <NavA to="evidence" className="btn btn-ghost">See the evidence<span className="arrow">→</span></NavA>
          </div>
        </div>
      </div>

      <Section>
        <SectionHeader eyebrow="The serial testing problem" title="One study. Three answers." />
        <DiagnosticDoomLoop />
      </Section>

      <Section>
        <SectionHeader eyebrow="Real-world impact" title="What standard workup missed — CorVista caught." />
        <div className="case-grid">
          {CASES.map((c) => (
            <div key={c.n} className="case-card">

              {/* Dark header */}
              <div className="case-head">
                <div className="case-head-eyebrow">Case {c.n} · Published {c.pub}</div>
                <div className="case-head-title">{c.patient}</div>
              </div>

              {/* Hero stat */}
              <div className="case-hero">
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <span className="case-hero-num">{c.heroStat}</span>
                  <span className="case-hero-unit">{c.heroUnit}</span>
                </div>
                <div className="case-hero-desc">{c.heroDesc}</div>
              </div>

              {/* Before / After narrative */}
              <div className="case-body-grid">
                <div className="case-before">
                  <div className="case-zone-label">{c.before.title}</div>
                  <p className="case-zone-body">{c.before.text}</p>
                </div>
                <div className="case-after">
                  <div className="case-zone-label">{c.cv.title}</div>
                  <p className="case-zone-body">{c.cv.text}</p>
                  <div className="case-findings">
                    {c.cv.findings.map((f, i) => (
                      <div key={i} className="case-finding">{f}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Outcome */}
              <div className="case-outcome-row">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="var(--green-cv)" style={{ marginTop: 3, flexShrink: 0 }} aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="case-outcome-text">{c.dx}</span>
              </div>

              <div className="case-cite">{c.cite}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="The workflow" title="Fits the way you already work." />
        <div className="row row-2" style={{ gridTemplateColumns: '1fr 1.5fr', gap: 64 }}>
          <img
            src="/hero-clinician.jpg"
            alt="Clinician applying CorVista sensors at the point of care"
            style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', objectPosition: 'center top', display: 'block', borderRadius: 4 }}
          />
          <div className="row" style={{ gap: 0 }}>
            {[
              { n: '01', t: 'Identify candidates', c: 'Symptomatic patients with chest discomfort, dyspnea, or unexplained fatigue.' },
              { n: '02', t: 'Order from your EHR', c: 'CorVista is a billable test like any other front-line cardiovascular study. CPT codes available on request.' },
              { n: '03', t: 'Apply the sensor', c: 'A medical assistant places the non-invasive sensors. The acquisition takes 220 seconds at rest.' },
              { n: '04', t: 'Review the report', c: 'A physician-reviewed report delivered to your portal — typically within minutes — with disease scores and recommended next steps.' },
            ].map(s => (
              <div key={s.n} style={{ padding: '24px 0', borderTop: '1px solid var(--rule)', display: 'grid', gridTemplateColumns: '80px 1fr', gap: 32, alignItems: 'start' }}>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--mid)', letterSpacing: '0.14em' }}>{s.n}</div>
                <div>
                  <h4 style={{ fontSize: 22, letterSpacing: '-0.01em' }}>{s.t}</h4>
                  <p style={{ marginTop: 8, color: 'var(--fg-muted)', maxWidth: '52ch' }}>{s.c}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section dark>
        <SectionHeader eyebrow={<span style={{ color: '#98A2B3' }}>What it changes</span>} title={<span style={{ color: '#F4F6F9' }}>Better triage. Fewer false negatives.</span>} />
        <div className="row row-3">
          <Stat label="Cath lab yield vs SPECT" value="+21" unit="%" desc="More patients sent to cath have obstructive disease." />
          <Stat label="CAD pathway cost" value="−32" unit="%" desc="Avoids unnecessary downstream testing and admissions." />
          <Stat label="PH total cost of care" value="−44" unit="%" desc="Identifies pulmonary hypertension earlier in the workup." />
        </div>
      </Section>

      <Section>
        <div className="row row-2" style={{ gap: 64 }}>
          <div className="card" style={{ padding: 48 }}>
            <Eyebrow>From a cardiologist</Eyebrow>
            <p className="quote" style={{ marginTop: 24, fontSize: 'clamp(22px, 2.2vw, 32px)' }}>
              I've already seen it help identify a 99% LAD blockage after a previously normal stress test — enabling us to immediately refer the patient for life-saving catheterization.
            </p>
            <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--rule)' }}>
              <div style={{ fontWeight: 500 }}>Tracy Neal, MD</div>
              <div className="meta" style={{ marginTop: 4 }}>Cardiology</div>
            </div>
          </div>
          <div className="card" style={{ padding: 48 }}>
            <Eyebrow>From a PH specialist</Eyebrow>
            <p className="quote" style={{ marginTop: 24, fontSize: 'clamp(22px, 2.2vw, 32px)' }}>
              I can't emphasize the importance of early diagnosis enough. This technology has the potential to really improve the time from symptoms to diagnosis.
            </p>
            <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--rule)' }}>
              <div style={{ fontWeight: 500 }}>Vallerie V. McLaughlin, MD</div>
              <div className="meta" style={{ marginTop: 4 }}>Director, Pulmonary Hypertension Program</div>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Implementation" title="A program your team can stand up in weeks." />
        <div className="row row-4">
          {[
            { t: 'Reimbursement', c: 'Coverage paths under category codes today. CorVista guides billing setup and documentation.' },
            { t: 'Training', c: '90-minute virtual onboarding for medical assistants. No technologist required.' },
            { t: 'Hardware', c: 'Capture device ships in 48 hours. The tablet and electrodes are provided. No capex.' },
            { t: 'Support', c: 'Dedicated clinical account manager.' },
          ].map(s => (
            <div key={s.t} style={{ borderTop: '1px solid var(--ink)', paddingTop: 20 }}>
              <h5>{s.t}</h5>
              <p style={{ marginTop: 12, color: 'var(--fg-muted)', fontSize: 14 }}>{s.c}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 64, display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <NavA to="contact" className="btn btn-primary">Request a demo<span className="arrow">→</span></NavA>
          <NavA to="evidence" className="btn btn-ghost">Read the evidence<span className="arrow">→</span></NavA>
        </div>
      </Section>
    </div>
  );
}
