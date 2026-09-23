import React, { useState, useEffect, useRef } from 'react';
import { Eyebrow } from '../components.jsx';
import { useReveal } from '../hooks.jsx';
import CorVistaPatient3D from './CorVistaPatient3D.jsx';

const ACTS = [
  {
    id: 'patient', n: '01',
    headline: 'The first conversation starts here.',
    body: 'Every cardiopulmonary diagnostic journey begins the same way: a patient with symptoms, and a clinician who needs an answer. For the conditions that hide — CAD, pulmonary hypertension, heart failure — that first conversation has historically ended with a referral.',
    detail: '50% of first heart attacks happen without prior symptoms. The front-line workup hasn\'t changed in over four decades.',
  },
  {
    id: 'capture', n: '02',
    headline: 'Two signals. One resting moment.',
    body: 'Six electrodes placed on the anterior surface, and one on the posterior, capture the heart\'s electrical activity as the OVG signal. A finger sensor captures hemodynamic blood flow through PPG. Both streams begin simultaneously — at rest, with no exertion required.',
    detail: '3.5 minutes. No exercise. No contrast. No radiation.',
    toggle: true,
  },
  {
    id: 'dataset', n: '03',
    headline: '270 heartbeats. 3,300 features.',
    body: 'A standard ECG samples roughly three heartbeats at 500 Hz. CorVista samples both signals at 8,000 Hz for the full 3.5-minute capture — analyzing 270 heartbeats across multiple physiological dimensions simultaneously.',
    detail: 'A richer dataset than any front-line cardiovascular test available today.',
    comparison: true,
  },
  {
    id: 'algorithm', n: '04',
    headline: 'A new geometry of the heart.',
    body: 'Cardiac Phase Space Tomography reconstructs the signal across three dimensions of state space. AI algorithms — trained against cardiac catheterization and right-heart catheterization as ground truth — detect patterns that time-domain waveforms cannot resolve.',
    detail: '20+ peer-reviewed publications · 10,000+ patients · 40+ clinical sites',
    algo: true,
  },
  {
    id: 'result', n: '05',
    headline: 'Physician-ready in minutes.',
    body: 'The cloud inference engine runs all three indication algorithms in parallel. A physician report with disease probability scores and recommended next steps reaches the clinician\'s portal before the patient leaves the room.',
    detail: 'Three answers. One scan. Same visit.',
    result: true,
  },
];

// AHA standard lead colors — RA/LA/RL/LL are limb leads, V1/V6 are precordial
// Note: anatomically, RA = patient's right = image left; LA = patient's left = image right
const FRONT_LEADS = [
  { id: 'ra', label: 'RA',  color: '#C8C8C8', cx: 68,  cy: 130 }, // patient's right shoulder
  { id: 'la', label: 'LA',  color: '#A0A0A0', cx: 212, cy: 130 }, // patient's left shoulder
  { id: 'rl', label: 'RL',  color: '#2BC48A', cx: 72,  cy: 358 }, // patient's right lower torso
  { id: 'll', label: 'LL',  color: '#D85528', cx: 208, cy: 358 }, // patient's left lower torso
  { id: 'v1', label: 'V1',  color: '#8B6545', cx: 122, cy: 192 }, // 4th ICS, right sternal border
  { id: 'v6', label: 'V6',  color: '#F3B51A', cx: 200, cy: 215 }, // 5th ICS, mid-axillary line
];
const BACK_LEAD = { id: 'ppg', label: 'PPG', color: '#5BAFE8', cx: 140, cy: 198 };

const HEART_CX = 134, HEART_CY = 197;

function ElectrodePad({ cx, cy, color, label, visible, delay, reduced, side }) {
  return (
    <g style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'scale(0.4)',
      transformOrigin: `${cx}px ${cy}px`,
      transition: reduced ? 'none' : `opacity 0.5s ease ${delay}ms, transform 0.55s cubic-bezier(.34,1.45,.64,1) ${delay}ms`,
    }}>
      {/* Outer diffuse halo */}
      <circle cx={cx} cy={cy} r="16" fill={color} opacity="0.05" />
      {/* Sensor ring */}
      <circle cx={cx} cy={cy} r="10" fill="none" stroke={color} strokeWidth="0.75" opacity="0.3" />
      {/* Sensor body */}
      <circle cx={cx} cy={cy} r="7" fill={color} opacity="0.15" />
      {/* Contact */}
      <circle cx={cx} cy={cy} r="4.5" fill={color} />
      {/* Label */}
      <text
        x={cx + (side === 'left' ? -16 : 16)}
        y={cy}
        textAnchor={side === 'left' ? 'end' : 'start'}
        dominantBaseline="middle"
        fontFamily="'Geist Mono', monospace"
        fontSize="7.5"
        fill={color}
        opacity="0.8"
      >{label}</text>
    </g>
  );
}

function HumanFigure({ act, showBack, reduced }) {
  const showElec = act !== 'patient';
  const showLines = ['dataset', 'algorithm', 'result'].includes(act);
  const heartActive = act === 'algorithm' || act === 'result';

  return (
    <svg
      viewBox="0 0 280 430"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <radialGradient id="torsoGrad" cx="48%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#142038" />
          <stop offset="100%" stopColor="#0B1320" />
        </radialGradient>
        <radialGradient id="heartGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D85528" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#D85528" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── HEAD ── */}
      <circle cx="140" cy="46" r="36" fill="url(#torsoGrad)" stroke="#1E2E42" strokeWidth="1.5" />
      {/* Jaw line detail */}
      <path d="M 114 62 C 118 72, 128 78, 140 79 C 152 78, 162 72, 166 62"
        stroke="#192840" strokeWidth="1" fill="none" />

      {/* ── NECK ── */}
      <rect x="127" y="81" width="26" height="25" rx="2" fill="url(#torsoGrad)" stroke="#1E2E42" strokeWidth="1.2" />

      {/* ── TORSO ── */}
      <path
        d="
          M 127 104
          C 108 105, 60 116, 38 142
          C 30 153, 30 170, 40 182
          L 58 246
          C 61 278, 68 304, 73 330
          C 75 348, 73 364, 76 380
          L 204 380
          C 207 364, 205 348, 207 330
          C 212 304, 219 278, 222 246
          L 240 182
          C 250 170, 250 153, 242 142
          C 220 116, 172 105, 153 104
          Z
        "
        fill="url(#torsoGrad)"
        stroke="#1E2E42"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* ── ANATOMICAL DETAILS ── */}
      {/* Left clavicle */}
      <path d="M 130 117 C 114 113, 78 119, 57 138"
        stroke="#192840" strokeWidth="1.1" strokeLinecap="round" fill="none" />
      {/* Right clavicle */}
      <path d="M 150 117 C 166 113, 202 119, 223 138"
        stroke="#192840" strokeWidth="1.1" strokeLinecap="round" fill="none" />
      {/* Sternum */}
      <line x1="140" y1="124" x2="140" y2="218"
        stroke="#162236" strokeWidth="0.8" strokeDasharray="2.5 3.5" />
      {/* Subtle rib arcs (3 pairs) */}
      {[160, 185, 208].map((y, i) => (
        <React.Fragment key={i}>
          <path d={`M 140 ${y} C 124 ${y - 4}, 105 ${y + 8}, 90 ${y + 16}`}
            stroke="#162236" strokeWidth="0.7" fill="none" opacity="0.6" />
          <path d={`M 140 ${y} C 156 ${y - 4}, 175 ${y + 8}, 190 ${y + 16}`}
            stroke="#162236" strokeWidth="0.7" fill="none" opacity="0.6" />
        </React.Fragment>
      ))}

      {/* ── HEART ── */}
      <g style={{
        opacity: heartActive ? 1 : 0.07,
        transition: reduced ? 'none' : 'opacity 0.9s ease',
      }}>
        {/* Glow */}
        <circle cx={HEART_CX} cy={HEART_CY} r="26" fill="url(#heartGlow)"
          style={{ opacity: heartActive ? 1 : 0, transition: reduced ? 'none' : 'opacity 0.9s ease' }} />
        {/* Heart body */}
        <path
          d={`
            M ${HEART_CX} ${HEART_CY - 14}
            C ${HEART_CX - 2} ${HEART_CY - 22},
              ${HEART_CX - 12} ${HEART_CY - 25},
              ${HEART_CX - 16} ${HEART_CY - 21}
            C ${HEART_CX - 20} ${HEART_CY - 17},
              ${HEART_CX - 20} ${HEART_CY - 8},
              ${HEART_CX - 14} ${HEART_CY - 2}
            L ${HEART_CX} ${HEART_CY + 14}
            L ${HEART_CX + 14} ${HEART_CY - 2}
            C ${HEART_CX + 20} ${HEART_CY - 8},
              ${HEART_CX + 20} ${HEART_CY - 17},
              ${HEART_CX + 16} ${HEART_CY - 21}
            C ${HEART_CX + 12} ${HEART_CY - 25},
              ${HEART_CX + 2} ${HEART_CY - 22},
              ${HEART_CX} ${HEART_CY - 14} Z
          `}
          fill="none"
          stroke={heartActive ? '#D85528' : '#1A2C40'}
          strokeWidth="1.5"
          style={{ transition: reduced ? 'none' : 'stroke 0.9s ease' }}
        />
        {/* Aortic arch */}
        <path
          d={`M ${HEART_CX - 4} ${HEART_CY - 18} C ${HEART_CX - 2} ${HEART_CY - 30}, ${HEART_CX + 10} ${HEART_CY - 30}, ${HEART_CX + 10} ${HEART_CY - 24}`}
          fill="none" stroke={heartActive ? '#D85528' : '#1A2C40'} strokeWidth="1"
          opacity="0.55"
          style={{ transition: reduced ? 'none' : 'stroke 0.9s ease' }}
        />
      </g>

      {/* ── SIGNAL LINES ── */}
      {showLines && !showBack && FRONT_LEADS.map((e, i) => (
        <line
          key={`ln-${e.id}`}
          x1={e.cx} y1={e.cy} x2={HEART_CX} y2={HEART_CY}
          stroke={e.color} strokeWidth="0.6" opacity="0.18"
          style={{ transition: reduced ? 'none' : `opacity 0.5s ease ${i * 60 + 150}ms` }}
        />
      ))}

      {/* ── FRONT ELECTRODES ── */}
      {!showBack && FRONT_LEADS.map((e, i) => (
        <ElectrodePad
          key={e.id}
          cx={e.cx} cy={e.cy}
          color={e.color}
          label={e.label}
          visible={showElec}
          delay={i * 85}
          reduced={reduced}
          side={e.cx < 140 ? 'left' : 'right'}
        />
      ))}

      {/* ── BACK ELECTRODE ── */}
      {showBack && (
        <ElectrodePad
          cx={BACK_LEAD.cx} cy={BACK_LEAD.cy}
          color={BACK_LEAD.color}
          label={BACK_LEAD.label}
          visible={showElec}
          delay={0}
          reduced={reduced}
          side="right"
        />
      )}

      {/* ── FIGURE ID ── */}
      <text
        x="140" y="422"
        textAnchor="middle"
        fontFamily="'Geist Mono', monospace"
        fontSize="7.5"
        fill="#1E2E42"
        letterSpacing="0.1em"
      >
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
    { label: 'Heartbeats',  ecg: '~3',      cv: '270',      key: true },
    { label: 'Sample rate', ecg: '500 Hz',   cv: '8,000 Hz' },
    { label: 'Features',    ecg: '~12',      cv: '3,300+',   key: true },
    { label: 'Dimensions',  ecg: '2D',       cv: '3D' },
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
    <div style={{ border: '1px solid #25324A', borderRadius: 8, background: '#0B1827', overflow: 'hidden', width: '100%' }}>
      <div style={{ padding: '16px 22px', borderBottom: '1px solid #1F2A3D', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: '#5B6F88', letterSpacing: '0.14em', textTransform: 'uppercase' }}>CorVista Clinical Report</span>
        <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: '#2A3A50', letterSpacing: '0.1em' }}>Physician Ready</span>
      </div>
      {items.map((item, i) => (
        <div key={item.ind} style={{
          padding: '18px 22px',
          borderBottom: i < items.length - 1 ? '1px solid #1F2A3D' : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateY(5px)',
          transition: `opacity 0.5s ease ${i * 120}ms, transform 0.5s ease ${i * 120}ms`,
        }}>
          <div>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: 14, color: '#5BAFE8', letterSpacing: '0.1em' }}>{item.ind}</span>
            <div style={{ marginTop: 6, fontSize: 13, color: '#5B6F88', lineHeight: 1.5 }}>{item.note}</div>
          </div>
          <span style={{
            padding: '7px 14px', borderRadius: 4,
            background: `${item.color}18`, border: `1px solid ${item.color}38`,
            color: item.color, fontFamily: 'var(--f-mono)', fontSize: 13,
            letterSpacing: '0.06em', whiteSpace: 'nowrap',
          }}>{item.score}</span>
        </div>
      ))}
      <div style={{
        padding: '14px 22px', borderTop: '1px solid #1F2A3D',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.5s ease 380ms',
      }}>
        <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: '#2A3A50', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Result delivered</span>
        <span style={{ fontFamily: 'var(--f-mono)', fontSize: 16, color: '#F4F6F9' }}>4 min 22 sec</span>
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
          {/* Progress */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 44 }}>
            {ACTS.map(a => (
              <div key={a.id} style={{
                width: a.id === activeAct ? 22 : 6, height: 6, borderRadius: 3,
                background: a.id === activeAct ? '#5BAFE8' : '#1F2A3D',
                transition: reduced ? 'none' : 'width 0.4s var(--cv-ease-out), background 0.3s ease',
              }} />
            ))}
          </div>

          {/* 3D visualization */}
          <div style={{ position: 'relative', width: '100%', maxWidth: 400 }}>
            <CorVistaPatient3D
              sceneState={activeAct}
              view={showBack ? 'back' : 'front'}
              reduced={reduced}
            />
            {/* Result card overlay (DOM, over the 3D canvas) */}
            <div style={{
              position: 'absolute', inset: 0,
              opacity: activeAct === 'result' ? 1 : 0,
              transition: reduced ? 'none' : 'opacity 0.7s ease',
              display: 'flex', alignItems: 'flex-start', paddingTop: 16,
              pointerEvents: activeAct === 'result' ? 'auto' : 'none',
            }}>
              <ResultCard visible={activeAct === 'result'} />
            </div>
          </div>

          {/* Front / Back toggle */}
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
              {showBack ? 'Posterior — OVG electrical' : 'Anterior — OVG electrical'}
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
                    <div style={{ fontFamily: 'var(--f-mono)', fontSize: 9, color: '#5BAFE8', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>OVG — Anterior & Posterior</div>
                    <div style={{ color: '#C8D0DC', fontSize: 14, lineHeight: 1.5 }}>Electrical cardiac activity · 7 surface electrodes</div>
                  </div>
                  <div style={{ padding: '16px 18px', background: '#081523', borderLeft: '1px solid #1F2A3D' }}>
                    <div style={{ fontFamily: 'var(--f-mono)', fontSize: 9, color: '#5BAFE8', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>PPG — Finger</div>
                    <div style={{ color: '#C8D0DC', fontSize: 14, lineHeight: 1.5 }}>Hemodynamic blood flow · 1 finger sensor</div>
                  </div>
                </div>
              )}

              {act.comparison && <DataComparison visible={activeAct === 'dataset'} />}

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
                    3+ DIMENSIONS · 20+ PUBLICATIONS · 10,000+ PATIENTS
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
