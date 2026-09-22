/**
 * CorVistaPatient3D — patient visualization with signal analysis overlays.
 * ECG: synthetic PQRST Gaussian model (demonstration only, not clinical data).
 * Phase space: delay-embedded cardiac attractor via Takens' theorem.
 * Images: licensed x-ray illustration (patient-front.webp, patient-back.webp).
 */

import React, { useRef, useEffect } from 'react';

// ── ECG signal model ──────────────────────────────────────────────────────────
const g = (x, mu, s) => Math.exp(-0.5 * ((x - mu) / s) ** 2);
const ecgAt = c => (
   g(c, 0.20,  0.028) *  0.22    // P wave
 - g(c, 0.375, 0.013) *  0.18    // Q wave
 + g(c, 0.42,  0.015) *  2.10    // R wave
 - g(c, 0.475, 0.015) *  0.32    // S wave
 + g(c, 0.62,  0.048) *  0.52    // T wave
);
const LUT_N = 1000;
const ECG_LUT = Float32Array.from({ length: LUT_N }, (_, i) => ecgAt(i / LUT_N));
const ecg = t => ECG_LUT[Math.round(((t % 1 + 1) % 1) * (LUT_N - 1))];

// ── Delay-embedded phase space trajectory (Takens' theorem) ──────────────────
// Projects the 1D ECG into 3D state space: [x(t), x(t−τ), x(t−2τ)].
// At τ=0.042 cycles the resulting attractor matches the characteristic
// cardiac loop visible in clinical phase space tomography imagery.
const TAU    = 0.042;
const TRAJ_N = 2400;  // ~20 cardiac cycles at 120 pts/cycle
const TRAJ   = (() => {
  const pts = new Array(TRAJ_N);
  for (let i = 0; i < TRAJ_N; i++) {
    const t = i / 120;
    pts[i] = [ecg(t), ecg(t - TAU), ecg(t - 2 * TAU)];
  }
  return pts;
})();

// ── 3D → 2D projection ───────────────────────────────────────────────────────
const AZ = -36 * Math.PI / 180;
const EL =  27 * Math.PI / 180;
const [cAZ, sAZ, cEL, sEL] = [Math.cos(AZ), Math.sin(AZ), Math.cos(EL), Math.sin(EL)];

function proj(x, y, z, cx, cy, sc) {
  const x1 =  x * cAZ + z * sAZ;
  const z1 = -x * sAZ + z * cAZ;
  return [cx + x1 * sc, cy - (y * cEL - z1 * sEL) * sc];
}

// ── Scrolling ECG overlay (section 3: dataset) ────────────────────────────────
function EcgOverlay({ visible, reduced }) {
  const ref   = useRef(null);
  const raf   = useRef(null);
  const t0    = useRef(null);
  const phase = useRef(0);

  useEffect(() => {
    if (!visible) return;
    const canvas = ref.current;
    const ctx    = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const CHANNELS      = 3;
    const CH_H          = H / CHANNELS;
    const SPEED         = 0.42;          // cardiac cycles per second
    const PX_PER_CYCLE  = W * 0.54;
    const PHASE_OFF     = [0, 0.34, 0.67];

    const draw = (now) => {
      if (t0.current !== null) phase.current += (now - t0.current) / 1000 * SPEED;
      t0.current = now;
      ctx.clearRect(0, 0, W, H);

      for (let ch = 0; ch < CHANNELS; ch++) {
        const cy  = CH_H * (ch + 0.5);
        const amp = CH_H * 0.33;

        // Baseline tick
        ctx.beginPath();
        ctx.strokeStyle = '#1A3A55';
        ctx.lineWidth   = 0.5;
        ctx.globalAlpha = 0.5;
        ctx.moveTo(0, cy); ctx.lineTo(W, cy);
        ctx.stroke();

        // ECG trace — scrolls right → left
        ctx.beginPath();
        ctx.strokeStyle = '#5BAFE8';
        ctx.lineWidth   = 1.7;
        ctx.globalAlpha = 0.90;
        ctx.lineJoin    = 'round';
        for (let px = 0; px <= W; px++) {
          const y = cy - ecg(phase.current - px / PX_PER_CYCLE + PHASE_OFF[ch]) * amp;
          px === 0 ? ctx.moveTo(px, y) : ctx.lineTo(px, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      if (!reduced) raf.current = requestAnimationFrame(draw);
    };

    raf.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf.current); t0.current = null; };
  }, [visible, reduced]);

  return (
    <canvas ref={ref} width={400} height={533} style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      opacity: visible ? 0.92 : 0,
      transition: reduced ? 'none' : 'opacity 0.9s ease',
      pointerEvents: 'none',
    }} />
  );
}

// ── 3D cardiac phase space (section 4: algorithm) ─────────────────────────────
function PhaseSpace3D({ visible, reduced }) {
  const ref = useRef(null);
  const raf = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx    = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W * 0.53, cy = H * 0.47, sc = W * 0.15;
    const LO = -0.5, HI = 2.6;

    ctx.clearRect(0, 0, W, H);
    if (!visible) return;

    const line3 = (x0,y0,z0, x1,y1,z1, color, alpha, lw = 0.5) => {
      const [ax,ay] = proj(x0,y0,z0, cx,cy,sc);
      const [bx,by] = proj(x1,y1,z1, cx,cy,sc);
      ctx.beginPath();
      ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.globalAlpha = alpha;
      ctx.moveTo(ax,ay); ctx.lineTo(bx,by); ctx.stroke();
    };

    const drawScene = () => {
      ctx.fillStyle = '#091629'; ctx.globalAlpha = 1; ctx.fillRect(0,0,W,H);

      const G = '#1E3554', STEPS = 5, step = (HI - LO) / STEPS;
      for (let i = 0; i <= STEPS; i++) {
        const v = LO + i * step;
        line3(v,LO,LO, v,HI,LO, G, 0.38);   // floor x-lines
        line3(LO,v,LO, HI,v,LO, G, 0.38);   // floor y-lines
        line3(LO,v,LO, LO,v,HI, G, 0.28);   // left wall
        line3(LO,LO,v, LO,HI,v, G, 0.28);
        line3(LO,HI,v, HI,HI,v, G, 0.25);   // back wall
        line3(v,HI,LO, v,HI,HI, G, 0.25);
      }

      // Axis edges
      const AX = '#3A5A78';
      line3(LO,LO,LO, HI,LO,LO, AX, 0.80, 1.2);
      line3(LO,LO,LO, LO,HI,LO, AX, 0.80, 1.2);
      line3(LO,LO,LO, LO,LO,HI, AX, 0.80, 1.2);

      // Tick labels on Y axis (left wall)
      ctx.font = `${W*0.027}px system-ui,sans-serif`;
      ctx.textAlign = 'right';
      for (let i = 0; i <= STEPS; i++) {
        const v = LO + i * step;
        const [px,py] = proj(LO - 0.08, v, LO, cx, cy, sc);
        ctx.fillStyle = '#4A6A84'; ctx.globalAlpha = 0.55;
        ctx.fillText(v.toFixed(1), px, py + 4);
      }

      // Axis labels
      ctx.font = `bold ${W*0.033}px system-ui,sans-serif`;
      ctx.textAlign = 'center'; ctx.globalAlpha = 0.6; ctx.fillStyle = '#6A90A8';
      const [lax,lay] = proj((LO+HI)/2, LO-0.6, LO, cx, cy, sc);
      const [lbx,lby] = proj(LO-0.8, (LO+HI)/2, LO, cx, cy, sc);
      const [lcx,lcy] = proj(LO-0.4, LO, (LO+HI)/2, cx, cy, sc);
      ctx.fillText('mV', lax, lay);
      ctx.fillText('mV', lbx, lby);
      ctx.fillText('mV', lcx, lcy);
      ctx.globalAlpha = 1;
    };

    // Progressive trajectory draw — builds the attractor cycle by cycle
    let drawn = 0;
    const PTS_PER_FRAME = reduced ? TRAJ_N : 32;

    const frame = () => {
      drawScene();

      if (drawn > 1) {
        ctx.beginPath();
        ctx.strokeStyle = '#5BAFE8';
        ctx.lineWidth   = 1.5;
        ctx.lineJoin    = 'round';
        ctx.globalAlpha = 0.90;
        const [sx,sy] = proj(...TRAJ[0], cx, cy, sc);
        ctx.moveTo(sx, sy);
        for (let i = 1; i < drawn; i++) {
          const [px,py] = proj(...TRAJ[i], cx, cy, sc);
          ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      drawn = Math.min(drawn + PTS_PER_FRAME, TRAJ_N);
      if (drawn < TRAJ_N) raf.current = requestAnimationFrame(frame);
    };

    raf.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf.current);
  }, [visible, reduced]);

  return (
    <canvas ref={ref} width={400} height={533} style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      opacity: visible ? 1 : 0,
      transition: reduced ? 'none' : 'opacity 1.1s ease',
      pointerEvents: 'none',
    }} />
  );
}

// ── Public component ──────────────────────────────────────────────────────────
export default function CorVistaPatient3D({ sceneState = 'patient', view = 'front', reduced = false }) {
  const T = reduced ? 'none' : 'opacity 0.9s ease';

  const bodyVisible = ['patient', 'capture', 'dataset'].includes(sceneState);
  const dimmed      = sceneState === 'dataset';
  const showFront   = bodyVisible && view !== 'back';
  const showBack    = bodyVisible && view === 'back';
  const opacity     = (on) => on ? (dimmed ? 0.58 : 1) : 0;

  return (
    <div
      role="img"
      aria-label="CorVista patient sensor placement and cardiac signal visualization"
      style={{ position: 'relative', width: '100%', aspectRatio: '3 / 4', overflow: 'hidden' }}
    >
      {/* Patient x-ray illustrations */}
      <img src="/patient-front.webp" alt="" draggable="false" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center top',
        opacity: opacity(showFront), transition: T, userSelect: 'none',
      }} />
      <img src="/patient-back.webp" alt="" draggable="false" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center top',
        opacity: opacity(showBack), transition: T, userSelect: 'none',
      }} />

      {/* Section 3: scrolling ECG overlay */}
      <EcgOverlay visible={sceneState === 'dataset'} reduced={reduced} />

      {/* Section 4: 3D cardiac phase space attractor */}
      <PhaseSpace3D visible={sceneState === 'algorithm'} reduced={reduced} />
    </div>
  );
}
