import React, { useState, useEffect, useRef } from 'react';
import { Eyebrow } from '../components.jsx';
import { useReveal } from '../hooks.jsx';

// AHA/IEC 61215 standard ECG electrode colors
const ELECTRODES = [
  { id: 'ra', label: 'RA',  color: '#E0E0E0', cx: 68,  cy: 120 },
  { id: 'la', label: 'LA',  color: '#606060', cx: 172, cy: 120 },
  { id: 'rl', label: 'RL',  color: '#2BC48A', cx: 72,  cy: 294 },
  { id: 'll', label: 'LL',  color: '#D85528', cx: 168, cy: 294 },
  { id: 'v1', label: 'V1',  color: '#8B5E3C', cx: 108, cy: 182 },
  { id: 'v6', label: 'V6',  color: '#F3B51A', cx: 153, cy: 205 },
];
const BACK_ELEC = { id: 'ppg', label: 'PPG', color: '#5BAFE8', cx: 120, cy: 192 };

const ACTS = [
  {
    id: 'patient', n: '01',
    headline: 'The first conversation starts here.',
    body: 'Every cardiovascular diagnostic journey begins the same way: a patient with symptoms, and a clinician who needs an answer. For the conditions that hide — CAD, pulmonary hypertension, heart failure — that first conversation has ended with a referral for forty years.',
    detail: '50% of first heart attacks happen without prior symptoms. The front-line workup hasn\'t changed in four decades.',
  },
  {
    id: 'capture', n: '02',
    headline: 'Two signals. One resting moment.',
    body: 'Six electrodes placed on the anterior surface capture the heart\'s electrical activity as the OVG signal. A seventh electrode, posterior, captures hemodynamic blood flow through PPG. Both streams begin simultaneously — at rest, with no exertion required.',
    detail: '220 seconds. No exercise. No contrast. No radiation.',
    toggle: true,
  },
  {
    id: 'dataset', n: '03',
    headline: '270 heartbeats. 3,300 features.',
    body: 'A standard ECG samples roughly three heartbeats at 500 Hz. CorVista samples both signals at 8,000 Hz for the full 220-second capture — analyzing 270 heartbeats across two physiological dimensions simultaneously.',
    detail: 'A richer dataset than any front-line cardiovascular test available today.',
    comparison: true,
  },
  {
    id: 'algorithm', n: '04',
    headline: 'A new geometry of the heart.',
    body: 'Cardiac Phase Space Tomography reconstructs the signal across twelve dimensions of state space. Machine-learning models — trained against cardiac catheterization, right-heart catheterization, and MRI as ground truth — detect patterns that time-domain waveforms cannot resolve.',
    detail: '50+ peer-reviewed publications · 10,000+ patients · 40+ clinical sites',
    algo: true,
  },
  {
    id: 'result', n: '05',
    headline: 'Physician-ready in minutes.',
    body: 'The cloud inference engine runs all three indication algorithms in parallel. A physician-reviewed report with disease probability scores and recommended next steps reaches the clinician\'s portal before the patient leaves the room.',
    detail: 'Three answers. One scan. Same visit.',
    result: true,
  },
];

function HumanFigure({ act, showBack, reduced }) {
  const showElec = act !== 'patient';
  const showLines = ['dataset', 'algorithm', 'result'].includes(act);
  const heartActive = act === 'algorithm' || act === 'result';

  return (
    <svg viewBox="0 0 240 360" fill="none" xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true" style={{ width: '100%', height: '100%', maxHeight: 380 }}>

      {/* Head */}
      <circle cx="120" cy="38" r="27" fill="#0B1320" stroke="#1F2A3D" strokeWidth="1.5" />

      {/* Neck */}
      <line x1="110" y1="64" x2="110" y2="82" stroke="#1F2A3D" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="130" y1="64" x2="130" y2="82" stroke="#1F2A3D" strokeWidth="1.5" strokeLinecap="round" />

      {/* Body outline */}
      <path
        d="M 110 82
           C 92 83 56 92 46 112
           C 40 124 48 140 58 146
           L 63 200
           C 65 252 67 278 69 316
           L 171 316
           C 173 278 175 252 177 200
           L 182 146
           C 192 140 200 124 194 112
           C 184 92 148 83 130 82
           Z"
        fill="#0B1320" stroke="#1F2A3D" strokeWidth="1.5" strokeLinejoin="round"
      />

      {/* Heart */}
      <g style={{ opacity: heartActive ? 1 : 0.1, transition: reduced ? 'none' : 'opacity 0.8s ease' }}>
        <circle cx="118" cy="184" r="18" fill={heartActive ? 'rgba(216,85,40,0.07)' : 'none'} />
        <path
          d="M 118 173 C 116 168 110 165 107 168 C 104 171 104 178 108 183 L 118 196 L 128 183 C 132 178 132 171 129 168 C 126 165 120 168 118 173 Z"
          fill="none"
          stroke={heartActive ? '#D85528' : '#1F2A3D'}
          strokeWidth="1.5"
          style={{ transition: reduced ? 'none' : 'stroke 0.8s ease' }}
        />
      </g>

      {/* Connection lines: electrode → heart */}
      {showLines && !showBack && ELECTRODES.map((e, i) => (
        <line
          key={`l-${e.id}`}
          x1={e.cx} y1={e.cy} x2={118} y2={183}
          stroke={e.color} strokeWidth="0.5" opacity="0.18"
          style={{ transition: reduced ? 'none' : `opacity 0.5s ease ${150 + i * 50}ms` }}
        />
      ))}

      {/* Front electrodes */}
      {!showBack && ELECTRODES.map((e, i) => (
        <g key={e.id} style={{
          opacity: showElec ? 1 : 0,
          transform: showElec ? 'none' : 'scale(0)',
          transformOrigin: `${e.cx}px ${e.cy}px`,
          transition: reduced ? 'none' : `opacity 0.45s ease ${i * 80}ms, transform 0.45s ease ${i * 80}ms`,
        }}>
          <circle cx={e.cx} cy={e.cy} r="9" fill={e.color} opacity="0.1" />
          <circle cx={e.cx} cy={e.cy} r="4.5" fill={e.color} />
          <text
            x={e.cx < 120 ? e.cx - 14 : e.cx + 14}
            y={e.cy}
            textAnchor={e.cx < 120 ? 'end' : 'start'}
            dominantBaseline="middle"
            fontFamily="'Geist Mono', monospace"
            fontSize="7"
            fill={e.color}
            opacity="0.7"
          >{e.label}</text>
        </g>
      ))}

      {/* Back electrode */}
      {showBack && (
        <g style={{ opacity: showElec ? 1 : 0, transition: reduced ? 'none' : 'opacity 0.45s ease' }}>
          <circle cx={BACK_ELEC.cx} cy={BACK_ELEC.cy} r="9" fill={BACK_ELEC.color} opacity="0.12" />
          <circle cx={BACK_ELEC.cx} cy={BACK_ELEC.cy} r="4.5" fill={BACK_ELEC.color} />
          <text x={BACK_ELEC.cx + 14} y={BACK_ELEC.cy}
            dominantBaseline="middle"
            fontFamily="'Geist Mono', monospace"
            fontSize="7" fill={BACK_ELEC.color} opacity="0.7"
          >{BACK_ELEC.label}</text>
        </g>
      )}

      {/* Figure label */}
      <text x="120" y="350" textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="7.5"
        fill="#2A3A50" letterSpacing="0.12em" textTransform="uppercase">
        {showBack ? 'FIG. 02B — POSTERIOR' : 'FIG. 02A — ANTERIOR'}
      </text>
    </svg>
  );
}

function AlgoCanvas({ active, reduced }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;

    const dpr = window.devicePixelRatio || 1;
    const W = 280, H = 280;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    const cx = W / 2, cy = H / 2;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Orbital rings at varying tilts
      for (let r = 0; r < 7; r++) {
        const rx = 18 + r * 19;
        const ry = 10 + r * 9;
        const tilt = (r * Math.PI) / 7 + t * (r % 2 === 0 ? 0.09 : -0.06);
        const cosTilt = Math.cos(tilt), sinTilt = Math.sin(tilt);

        ctx.beginPath();
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(tilt);
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.restore();
        ctx.strokeStyle = `rgba(91,175,232,${0.04 + r * 0.022})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();

        // Data points on each ring
        const pts = 4 + r * 2;
        for (let p = 0; p < pts; p++) {
          const angle = (p / pts) * Math.PI * 2 + t * (0.3 + r * 0.1) * (r % 2 === 0 ? 1 : -1);
          const cosA = Math.cos(angle), sinA = Math.sin(angle);
          const px = cx + cosA * rx * cosTilt - sinA * ry * sinTilt;
          const py = cy + cosA * rx * sinTilt + sinA * ry * cosTilt;
          ctx.beginPath();
          ctx.arc(px, py, 0.8 + r * 0.32, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(91,175,232,${0.12 + r * 0.055})`;
          ctx.fill();
        }
      }

      // Central pulse
      const pulse = (Math.sin(t * 3.2) + 1) / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 3 + pulse * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(216,85,40,${0.55 + pulse * 0.3})`;
      ctx.fill();

      if (!reduced) {
        t += 0.008;
        animRef.current = requestAnimationFrame(draw);
      }
    };

    draw();
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [active, reduced]);

  return <canvas ref={canvasRef} style={{ display: 'block' }} />;
}

function DataComparison({ visible }) {
  const rows = [
    { label: 'Heartbeats',   ecg: '~3',       cv: '270',      key: true },
    { label: 'Sample rate',  ecg: '500 Hz',    cv: '8,000 Hz' },
    { label: 'Features',     ecg: '~12',       cv: '3,300+',   key: true },
    { label: 'Dimensions',   ecg: '2D',        cv: '12D+' },
  ];

  return (
    <div style={{ marginTop: 28, border: '1px solid #1F2A3D', borderRadius: 4, overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #1F2A3D', background: '#091629' }}>
          <span style={{ fontFamily: 'var(--f-mono)', fontSize: 9, color: '#3A4A5C', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Standard ECG</span>
        </div>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #1F2A3D', borderLeft: '1px solid #1F2A3D', background: 'rgba(91,175,232,0.05)' }}>
          <span style={{ fontFamily: 'var(--f-mono)', fontSize: 9, color: '#5BAFE8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>CorVista</span>
        </div>
        {rows.map((row, i) => (
          <React.Fragment key={row.label}>
            <div style={{ padding: '14px 16px', borderBottom: i < rows.length - 1 ? '1px solid #1F2A3D' : 'none', background: '#091629' }}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 8, color: '#2A3A50', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{row.label}</div>
              <div style={{ color: '#3D5068', fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em', fontFamily: 'var(--f-sans)' }}>{row.ecg}</div>
            </div>
            <div style={{ padding: '14px 16px', borderBottom: i < rows.length - 1 ? '1px solid #1F2A3D' : 'none', borderLeft: '1px solid #1F2A3D', background: row.key ? 'rgba(91,175,232,0.07)' : 'rgba(91,175,232,0.03)' }}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 8, color: '#5BAFE8', opacity: 0.6, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{row.label}</div>
              <div style={{
                color: '#5BAFE8', fontSize: 22, fontWeight: 500,
                letterSpacing: '-0.02em', fontFamily: 'var(--f-sans)',
                opacity: visible ? 1 : 0,
                transition: `opacity 0.55s ease ${i * 100 + 80}ms`,
              }}>{row.cv}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function ResultCard({ visible }) {
  const items = [
    { ind: 'CAD',  score: 'Negative', color: '#2BC48A', note: 'NPV 99% — rule-out without referral' },
    { ind: 'PH',   score: 'Elevated', color: '#F3B51A', note: 'Recommend RHC for confirmation' },
    { ind: 'PCWP', score: 'Negative', color: '#2BC48A', note: 'NPV >99% — HF unlikely' },
  ];

  return (
    <div style={{ border: '1px solid #25324A', borderRadius: 6, background: '#0B1827', overflow: 'hidden', width: '100%', maxWidth: 300 }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid #1F2A3D', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--f-mono)', fontSize: 8, color: '#4A5568', letterSpacing: '0.14em', textTransform: 'uppercase' }}>CorVista Clinical Report</span>
        <span style={{ fontFamily: 'var(--f-mono)', fontSize: 8, color: '#25324A', letterSpacing: '0.1em' }}>Physician Reviewed</span>
      </div>
      {items.map((item, i) => (
        <div key={item.ind} style={{
          padding: '14px 18px',
          borderBottom: i < items.length - 1 ? '1px solid #1F2A3D' : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateY(5px)',
          transition: `opacity 0.5s ease ${i * 120}ms, transform 0.5s ease ${i * 120}ms`,
        }}>
          <div>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: '#5BAFE8', letterSpacing: '0.1em' }}>{item.ind}</span>
            <div style={{ marginTop: 4, fontSize: 11, color: '#4A5568', lineHeight: 1.4, maxWidth: '20ch' }}>{item.note}</div>
          </div>
          <span style={{
            padding: '5px 10px', borderRadius: 3,
            background: `${item.color}18`, border: `1px solid ${item.color}38`,
            color: item.color, fontFamily: 'var(--f-mono)', fontSize: 10,
            letterSpacing: '0.06em', whiteSpace: 'nowrap',
          }}>{item.score}</span>
        </div>
      ))}
      <div style={{
        padding: '12px 18px', borderTop: '1px solid #1F2A3D',
        display: 'flex', justifyContent: 'space-between',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.5s ease 380ms',
      }}>
        <span style={{ fontFamily: 'var(--f-mono)', fontSize: 8, color: '#2A3A50', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Result delivered</span>
        <span style={{ fontFamily: 'var(--f-mono)', fontSize: 13, color: '#F4F6F9' }}>4 min 22 sec</span>
      </div>
    </div>
  );
}

export function ScienceSection() {
  const [activeAct, setActiveAct] = useState('patient');
  const [showBack, setShowBack] = useState(false);
  const actRefs = useRef([]);
  const reduced = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ).current;

  useEffect(() => {
    const track = () => {
      const mid = window.innerHeight / 2;
      let bestId = 'patient', bestDist = Infinity;
      actRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dist = Math.abs((r.top + r.height / 2) - mid);
        if (dist < bestDist) { bestDist = dist; bestId = ACTS[i].id; }
      });
      setActiveAct(bestId);
    };
    window.addEventListener('scroll', track, { passive: true });
    track();
    return () => window.removeEventListener('scroll', track);
  }, []);

  const isBodyAct = ['patient', 'capture', 'dataset'].includes(activeAct);

  return (
    <section style={{ background: '#091629' }}>
      {/* Section intro */}
      <div className="container" style={{ paddingTop: 'var(--section-y)', paddingBottom: 72 }}>
        <Eyebrow><span style={{ color: '#98A2B3' }}>The science</span></Eyebrow>
        <h2 style={{ marginTop: 20, color: '#F4F6F9', fontSize: 'clamp(36px, 5vw, 72px)', maxWidth: '18ch', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          From resting signal<br />to clinical answer<br />in 3.7 minutes.
        </h2>
      </div>

      {/* Sticky split layout */}
      <div className="science-layout">
        {/* Left sticky panel */}
        <div className="science-panel">
          {/* Progress indicator */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 44 }}>
            {ACTS.map(a => (
              <div key={a.id} style={{
                width: a.id === activeAct ? 22 : 6, height: 6, borderRadius: 3,
                background: a.id === activeAct ? '#5BAFE8' : '#1F2A3D',
                transition: reduced ? 'none' : 'width 0.4s var(--cv-ease-out), background 0.3s ease',
              }} />
            ))}
          </div>

          {/* Visualization stack */}
          <div style={{ position: 'relative', width: '100%', maxWidth: 300, height: 340 }}>
            {/* Layer 1: Human figure */}
            <div style={{
              position: 'absolute', inset: 0,
              opacity: isBodyAct ? 1 : 0,
              transition: reduced ? 'none' : 'opacity 0.6s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <HumanFigure act={activeAct} showBack={showBack} reduced={reduced} />
            </div>

            {/* Layer 2: Algorithm canvas */}
            <div style={{
              position: 'absolute', inset: 0,
              opacity: activeAct === 'algorithm' ? 1 : 0,
              transition: reduced ? 'none' : 'opacity 0.6s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: activeAct === 'algorithm' ? 'auto' : 'none',
            }}>
              <AlgoCanvas active={activeAct === 'algorithm'} reduced={reduced} />
            </div>

            {/* Layer 3: Result card */}
            <div style={{
              position: 'absolute', inset: 0,
              opacity: activeAct === 'result' ? 1 : 0,
              transition: reduced ? 'none' : 'opacity 0.6s ease',
              display: 'flex', alignItems: 'flex-start', paddingTop: 24,
              pointerEvents: activeAct === 'result' ? 'auto' : 'none',
            }}>
              <ResultCard visible={activeAct === 'result'} />
            </div>
          </div>

          {/* Front / Back toggle — capture act */}
          <div style={{
            marginTop: 24,
            opacity: activeAct === 'capture' ? 1 : 0,
            transition: reduced ? 'none' : 'opacity 0.35s ease',
            pointerEvents: activeAct === 'capture' ? 'auto' : 'none',
          }}>
            <div style={{ display: 'inline-flex', border: '1px solid #25324A', borderRadius: 4, overflow: 'hidden' }}>
              {['Front', 'Back'].map(side => {
                const sel = (side === 'Back') === showBack;
                return (
                  <button key={side} onClick={() => setShowBack(side === 'Back')} style={{
                    padding: '8px 18px', border: 0, cursor: 'pointer',
                    background: sel ? '#5BAFE8' : 'transparent',
                    color: sel ? '#091629' : '#5BAFE8',
                    fontFamily: 'var(--f-mono)', fontSize: 10,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    transition: reduced ? 'none' : 'background 0.2s ease, color 0.2s ease',
                  }}>{side}</button>
                );
              })}
            </div>
            <div style={{ marginTop: 8, fontFamily: 'var(--f-mono)', fontSize: 9, color: '#4A5568', letterSpacing: '0.1em' }}>
              {showBack ? 'Posterior — PPG hemodynamic' : 'Anterior — OVG electrical'}
            </div>
          </div>
        </div>

        {/* Right: scrolling acts */}
        <div style={{ borderLeft: '1px solid #1F2A3D' }}>
          {ACTS.map((act, i) => (
            <div key={act.id} className="science-act" ref={el => actRefs.current[i] = el}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: '#5BAFE8', letterSpacing: '0.14em', marginBottom: 20 }}>{act.n}</div>
              <h3 style={{ color: '#F4F6F9', fontSize: 'clamp(24px, 3vw, 42px)', lineHeight: 1.15, letterSpacing: '-0.025em', maxWidth: '24ch', fontWeight: 500 }}>
                {act.headline}
              </h3>
              <p style={{ marginTop: 22, color: '#8B96A3', fontSize: 16, lineHeight: 1.7, maxWidth: '44ch' }}>
                {act.body}
              </p>

              {act.toggle && (
                <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: '1px solid #1F2A3D', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ padding: '16px 18px', background: '#081523' }}>
                    <div style={{ fontFamily: 'var(--f-mono)', fontSize: 9, color: '#5BAFE8', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>OVG — Anterior</div>
                    <div style={{ color: '#C8D0DC', fontSize: 14, lineHeight: 1.5 }}>Electrical cardiac activity · 6 surface electrodes</div>
                  </div>
                  <div style={{ padding: '16px 18px', background: '#081523', borderLeft: '1px solid #1F2A3D' }}>
                    <div style={{ fontFamily: 'var(--f-mono)', fontSize: 9, color: '#5BAFE8', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>PPG — Posterior</div>
                    <div style={{ color: '#C8D0DC', fontSize: 14, lineHeight: 1.5 }}>Hemodynamic blood flow · 1 posterior electrode</div>
                  </div>
                </div>
              )}

              {act.comparison && (
                <DataComparison visible={activeAct === 'dataset'} />
              )}

              {act.algo && (
                <div style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {['CAD', 'PH', 'PCWP'].map(ind => (
                    <div key={ind} style={{
                      padding: '10px 16px', border: '1px solid #1F2A3D', borderRadius: 4,
                      fontFamily: 'var(--f-mono)', fontSize: 11, color: '#5BAFE8',
                      letterSpacing: '0.12em', background: 'rgba(91,175,232,0.05)',
                    }}>{ind} ALGORITHM</div>
                  ))}
                  <div style={{ width: '100%', marginTop: 12, fontFamily: 'var(--f-mono)', fontSize: 10, color: '#3A4A5C', letterSpacing: '0.08em' }}>
                    12+ DIMENSIONS · 50+ PUBLICATIONS · 10,000+ PATIENTS
                  </div>
                </div>
              )}

              <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid #1F2A3D', fontFamily: 'var(--f-mono)', fontSize: 10, color: '#3A4A5C', letterSpacing: '0.1em', lineHeight: 1.6 }}>
                {act.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
