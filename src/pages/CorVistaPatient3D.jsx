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
const LUT_N  = 1000;
const ECG_LUT = Float32Array.from({ length: LUT_N }, (_, i) => ecgAt(i / LUT_N));
const ecg = t => ECG_LUT[Math.round(((t % 1 + 1) % 1) * (LUT_N - 1))];

// ── Phase-space signal with per-beat jitter (builds the dense band) ───────────
// Reproducible LCG so the attractor shape is stable across renders.
function lcg(seed) { let s = seed >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }

const PS_BEATS = 28;   // more beats → denser band
const PS_SPB   = 180;  // samples per beat
const PS_TAU   = 36;   // delay in samples (~0.20 of a beat period)
const PS_N     = PS_BEATS * PS_SPB;

const PS_DATA = (() => {
  const rnd = lcg(7240191);
  const raw = new Float32Array(PS_N + 2 * PS_TAU);
  for (let b = 0; b < PS_BEATS; b++) {
    const rAmp = 1.0 + (rnd() - 0.5) * 0.14;  // ±7% R-amplitude jitter → band thickness
    const rate = 1.0 + (rnd() - 0.5) * 0.05;  // ±2.5% cycle-length variability
    const sh   = (rnd() - 0.5) * 0.018;
    for (let j = 0; j < PS_SPB; j++) {
      const c = ((j / PS_SPB) * rate + sh + 1) % 1;
      raw[PS_TAU + b * PS_SPB + j] = ecgAt(c) * rAmp;
    }
  }
  const emb  = new Array(PS_N);
  const flat = new Float32Array(PS_N);
  let maxA = 0;
  for (let i = 0; i < PS_N; i++) {
    const idx = i + PS_TAU;
    emb[i] = [raw[idx], raw[idx - PS_TAU], raw[idx - 2 * PS_TAU]];
    if (Math.abs(raw[idx]) > maxA) maxA = Math.abs(raw[idx]);
  }
  for (let i = 0; i < PS_N; i++) flat[i] = raw[i + PS_TAU] / maxA;
  return { emb, flat };
})();

// ── Helpers ───────────────────────────────────────────────────────────────────
const clampF  = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const eioC    = t => t < 0.5 ? 4*t*t*t : 1 - (-2*t+2)**3/2;  // easeInOutCubic

// ── Real-time ECG trace (section 3: dataset) ──────────────────────────────────
// Writes left → right like a cardiac monitor, then wraps and overwrites.
function EcgOverlay({ visible, reduced }) {
  const ref    = useRef(null);
  const raf    = useRef(null);
  const t0     = useRef(null);
  const writeX = useRef(0);
  const ecgT   = useRef(0);
  const bufRef = useRef(null);

  useEffect(() => {
    if (!visible) {
      writeX.current = 0;
      ecgT.current   = 0;
      bufRef.current = null;
      return;
    }

    const canvas = ref.current;
    const ctx    = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cy  = H * 0.50;
    const amp = H * 0.24;

    const SPEED = 88;
    const CPX   = 88;
    const GAP   = 14;

    if (!bufRef.current) bufRef.current = new Float32Array(W).fill(cy);
    const buf = bufRef.current;

    const draw = (now) => {
      if (t0.current !== null) {
        const dPx   = Math.min((now - t0.current) / 1000, 0.05) * SPEED;
        const steps = Math.max(1, Math.round(dPx));
        for (let s = 0; s < steps; s++) {
          writeX.current = (writeX.current + 1) % W;
          ecgT.current  += 1 / CPX;
          buf[writeX.current] = cy - ecg(ecgT.current) * amp;
        }
      }
      t0.current = now;

      ctx.clearRect(0, 0, W, H);

      ctx.beginPath();
      ctx.strokeStyle = '#5BAFE8';
      ctx.lineWidth   = 2.0;
      ctx.globalAlpha = 0.93;
      ctx.lineJoin    = 'round';

      let drawing = false;
      for (let px = 0; px < W; px++) {
        const ahead = (px - writeX.current + W) % W;
        if (ahead >= 1 && ahead <= GAP) { drawing = false; continue; }
        if (!drawing) { ctx.moveTo(px + 0.5, buf[px]); drawing = true; }
        else          { ctx.lineTo(px + 0.5, buf[px]); }
      }
      ctx.stroke();

      const wx = writeX.current, wy = buf[wx];
      ctx.beginPath();
      ctx.arc(wx, wy, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#5BAFE8'; ctx.globalAlpha = 0.18; ctx.fill();
      ctx.beginPath();
      ctx.arc(wx, wy, 2.8, 0, Math.PI * 2);
      ctx.fillStyle = '#B8E8FF'; ctx.globalAlpha = 0.95; ctx.fill();
      ctx.globalAlpha = 1;

      if (!reduced) raf.current = requestAnimationFrame(draw);
    };

    raf.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf.current); t0.current = null; };
  }, [visible, reduced]);

  return (
    <canvas ref={ref} width={400} height={533} style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      opacity: visible ? 0.95 : 0,
      transition: reduced ? 'none' : 'opacity 0.9s ease',
      pointerEvents: 'none',
    }} />
  );
}

// ── 3D cardiac phase space (section 4: algorithm) ─────────────────────────────
// Animation sequence:
//   0 → T_BUILD s : flat ECG builds across canvas (left → right)
//   T_BUILD → +T_FOLD s : signal folds up into 3D attractor
//   then : slow turntable rotation
function PhaseSpace3D({ visible, reduced }) {
  const ref    = useRef(null);
  const raf    = useRef(null);
  const animT  = useRef(0);
  const lastTs = useRef(null);

  useEffect(() => {
    if (!visible) {
      cancelAnimationFrame(raf.current);
      animT.current  = 0;
      lastTs.current = null;
      return;
    }

    const canvas = ref.current;
    const ctx    = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    const cx = W * 0.50, cy = H * 0.46;
    const SC = W * 0.158;  // spatial scale
    const EL = 26 * Math.PI / 180;
    const cEL = Math.cos(EL), sEL = Math.sin(EL);

    const xLeft  = W * 0.04;
    const xRight = W * 0.96;
    const flatAmp = H * 0.20;

    // Phase durations (skip animations in reduced/thumbnail mode)
    const T_BUILD = reduced ? 0   : 2.2;
    const T_FOLD  = reduced ? 0.001 : 2.4;
    const ROT_RATE = 0.20;  // radians/second

    // Box data range
    const LO = -0.60, HI = 2.30;

    const proj = (x, y, z, theta) => {
      const cT = Math.cos(theta), sT = Math.sin(theta);
      const x1 =  x * cT + z * sT;
      const z1 = -x * sT + z * cT;
      return [cx + x1 * SC, cy - (y * cEL - z1 * sEL) * SC];
    };

    const drawGrid = (theta, alpha) => {
      const STEPS = 4;
      ctx.strokeStyle = '#5DB4E8';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 1;

      // Floor grid (y = LO)
      ctx.globalAlpha = alpha * 0.10;
      ctx.beginPath();
      for (let i = 0; i <= STEPS; i++) {
        const u = LO + (HI - LO) * (i / STEPS);
        let p = proj(u, LO, LO, theta); ctx.moveTo(p[0], p[1]);
        p = proj(u, LO, HI, theta);     ctx.lineTo(p[0], p[1]);
        p = proj(LO, LO, u, theta);     ctx.moveTo(p[0], p[1]);
        p = proj(HI, LO, u, theta);     ctx.lineTo(p[0], p[1]);
      }
      ctx.stroke();

      // Back wall (z = HI) — faint
      ctx.globalAlpha = alpha * 0.065;
      ctx.beginPath();
      for (let i = 0; i <= STEPS; i++) {
        const u = LO + (HI - LO) * (i / STEPS);
        let p = proj(u, LO, HI, theta); ctx.moveTo(p[0], p[1]);
        p = proj(u, HI, HI, theta);     ctx.lineTo(p[0], p[1]);
        p = proj(LO, u, HI, theta);     ctx.moveTo(p[0], p[1]);
        p = proj(HI, u, HI, theta);     ctx.lineTo(p[0], p[1]);
      }
      ctx.stroke();

      // 12 box edges
      const C = [
        [LO,LO,LO],[HI,LO,LO],[HI,HI,LO],[LO,HI,LO],
        [LO,LO,HI],[HI,LO,HI],[HI,HI,HI],[LO,HI,HI],
      ].map(([x,y,z]) => proj(x,y,z,theta));
      const E = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
      ctx.globalAlpha = alpha * 0.18;
      ctx.beginPath();
      E.forEach(([a,b]) => { ctx.moveTo(C[a][0],C[a][1]); ctx.lineTo(C[b][0],C[b][1]); });
      ctx.stroke();

      // Axis labels fade in after fold completes
      if (alpha > 0.55) {
        const la = (alpha - 0.55) / 0.45 * 0.48;
        ctx.globalAlpha = la;
        ctx.fillStyle = '#5A8099';
        ctx.font = `500 ${Math.round(W * 0.024)}px ui-monospace, monospace`;
        ctx.textAlign = 'center';
        let p = proj(HI * 1.25, LO, LO, theta);        ctx.fillText('mV', p[0], p[1]);
        p     = proj(LO,        LO, HI * 1.25, theta);  ctx.fillText('mV', p[0], p[1]);
        p     = proj(LO * 0.9, HI * 1.22, LO, theta);   ctx.fillText('mV', p[0], p[1]);
      }
      ctx.globalAlpha = 1;
    };

    const draw = (now) => {
      if (lastTs.current !== null) {
        const dt = Math.min((now - lastTs.current) / 1000, 0.05);
        animT.current += dt;
      }
      lastTs.current = now;

      const t = animT.current;
      const buildProg = T_BUILD > 0 ? clampF(t / T_BUILD, 0, 1) : 1;
      const count     = Math.max(2, Math.floor(buildProg * PS_N));
      const foldM     = eioC(clampF((t - T_BUILD) / T_FOLD, 0, 1));
      const theta     = 0.52 + Math.max(0, t - T_BUILD) * ROT_RATE;

      // Background
      ctx.fillStyle = '#091629'; ctx.globalAlpha = 1;
      ctx.fillRect(0, 0, W, H);

      // Grid fades in as the fold progresses
      if (foldM > 0.02) drawGrid(theta, foldM);

      // Project all points: interpolate between flat 2D and 3D positions
      const pts = new Array(count);
      for (let i = 0; i < count; i++) {
        const [ex, ey, ez] = PS_DATA.emb[i];
        const [px3, py3]   = proj(ex, ey, ez, theta);
        if (foldM >= 0.998) {
          pts[i] = [px3, py3];
        } else {
          const fx = xLeft + (xRight - xLeft) * (i / PS_N);
          const fy = cy - PS_DATA.flat[i] * flatAmp;
          pts[i] = [fx + (px3 - fx) * foldM, fy + (py3 - fy) * foldM];
        }
      }

      const path = new Path2D();
      path.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < count; i++) path.lineTo(pts[i][0], pts[i][1]);

      ctx.lineJoin = 'round';

      // Glow underlay
      ctx.strokeStyle = '#5DB4E8';
      ctx.lineWidth   = 3.8;
      ctx.globalAlpha = 0.12;
      ctx.shadowColor = 'rgba(93,180,232,0.85)';
      ctx.shadowBlur  = 16;
      ctx.stroke(path);
      ctx.shadowBlur  = 0;

      // Main line — thinner and denser once folded
      ctx.globalAlpha = foldM < 0.5 ? 0.75 : 0.50;
      ctx.lineWidth   = foldM < 0.5 ? 1.9  : 0.82;
      ctx.stroke(path);

      // Glowing head dot while still building or folding
      if (buildProg < 1 || foldM < 0.92) {
        const h = pts[count - 1];
        ctx.globalAlpha = 1;
        ctx.fillStyle   = '#EAF6FF';
        ctx.shadowColor = '#5DB4E8'; ctx.shadowBlur = 18;
        ctx.beginPath(); ctx.arc(h[0], h[1], 3.4, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur  = 0;
      }

      ctx.globalAlpha = 1;
      raf.current = requestAnimationFrame(draw);
    };

    raf.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf.current); lastTs.current = null; };
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
  const imgOpacity  = (on) => on ? (dimmed ? 0.55 : 1) : 0;

  return (
    <div
      role="img"
      aria-label="CorVista patient sensor placement and cardiac signal visualization"
      style={{ position: 'relative', width: '100%', aspectRatio: '3 / 4', overflow: 'hidden' }}
    >
      <img src="/patient-front.webp" alt="" draggable="false" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center top',
        opacity: imgOpacity(showFront), transition: T, userSelect: 'none',
      }} />
      <img src="/patient-back.webp" alt="" draggable="false" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center top',
        opacity: imgOpacity(showBack), transition: T, userSelect: 'none',
      }} />

      {/* Section 3: real-time ECG writing overlay */}
      <EcgOverlay visible={sceneState === 'dataset'} reduced={reduced} />

      {/* Section 4: 3D cardiac phase space — flat signal folds into attractor */}
      <PhaseSpace3D visible={sceneState === 'algorithm'} reduced={reduced} />
    </div>
  );
}
