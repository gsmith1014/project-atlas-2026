/**
 * CorVistaPatient3D — patient visualization with signal analysis overlays.
 * ECG: synthetic PQRST Gaussian model (demonstration only, not clinical data).
 * Phase space: delay-embedded cardiac attractor via Takens' theorem.
 * Images: licensed x-ray illustration (patient-front.webp, patient-back.webp).
 */

import React, { useRef, useEffect } from 'react';

// ── ECG signal model ──────────────────────────────────────────────────────────
const g = (x, mu, s) => Math.exp(-0.5 * Math.pow((x - mu) / s, 2));
const ecgAt = c => (
   g(c, 0.20,  0.028) *  0.22    // P wave
 - g(c, 0.375, 0.013) *  0.18    // Q wave
 + g(c, 0.42,  0.015) *  2.10    // R wave
 - g(c, 0.475, 0.015) *  0.32    // S wave
 + g(c, 0.62,  0.048) *  0.52    // T wave
);
const LUT_N   = 1000;
const ECG_LUT = Float32Array.from({ length: LUT_N }, (_, i) => ecgAt(i / LUT_N));
const ecg     = t => ECG_LUT[Math.round(((t % 1 + 1) % 1) * (LUT_N - 1))];

// ── Single-cycle trajectory (5 repeats → one clean 3D loop, no jitter) ────────
// Each repetition traces the same path, so in 3D they collapse to one crisp loop.
const LOOP_SPB  = 240;          // samples per cardiac cycle (smooth)
const FLAT_REPS = 5;            // ECG cycles shown in flat phase
const FLAT_N    = FLAT_REPS * LOOP_SPB;  // 1200 total points
const LOOP_TAU  = 0.020;        // delay fraction: spreads R-peak into 3D
const ECG_PEAK  = 2.10;         // normalise by R-peak amplitude

const LOOP_TRAJ = Array.from({ length: FLAT_N }, (_, i) => {
  const t = (i % LOOP_SPB) / LOOP_SPB;  // periodic — all reps trace the same path
  return [ecg(t), ecg(t - LOOP_TAU), ecg(t - 2 * LOOP_TAU)];
});

// ── Helpers ───────────────────────────────────────────────────────────────────
const clampF = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const eioC   = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// ── Real-time ECG trace (section 3: dataset) ──────────────────────────────────
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
      ctx.beginPath(); ctx.arc(wx, wy, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#5BAFE8'; ctx.globalAlpha = 0.18; ctx.fill();
      ctx.beginPath(); ctx.arc(wx, wy, 2.8, 0, Math.PI * 2);
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
// Three-phase animation:
//   Phase 1 — pulsing heart node + animated dotted electrode lines
//   Phase 2 — flat PQRST waveform writes across the canvas
//   Phase 3 — ECG folds into clean single 3D loop (turntable rotation follows)
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

    // 3D projection centre (slightly above mid)
    const cx = W * 0.50, cy = H * 0.44;
    const SC = W * 0.158;
    const EL_RAD = 26 * Math.PI / 180;
    const cEL = Math.cos(EL_RAD), sEL = Math.sin(EL_RAD);

    // Flat ECG layout (slightly below centre so it feels grounded)
    const xLeft  = W * 0.04, xRight = W * 0.96;
    const flatCy = H * 0.52, flatAmp = H * 0.21;

    // Capture phase layout
    const nodeCx = W * 0.50, nodeCy = H * 0.46;
    // Electrode positions mirroring reference: upper-left, upper-right, lower-centre
    const ELECS = [
      [W * 0.15, H * 0.22],
      [W * 0.85, H * 0.26],
      [W * 0.50, H * 0.80],
    ];
    const BEAT = 0.82;  // seconds per heartbeat (~73 BPM)

    // Phase timings (skip animations in reduced/thumbnail mode)
    const T_CAP      = reduced ? 0      : 2.2;
    const T_ECG      = reduced ? 0      : 1.8;
    const T_FOLD     = reduced ? 0.001  : 2.2;
    const ECG_START  = reduced ? 0      : T_CAP * 0.72;  // ECG starts before capture ends
    const FOLD_START = ECG_START + T_ECG;
    const ROT_START  = FOLD_START + T_FOLD;
    const ROT_RATE   = 0.20;  // rad/s

    // Box range matches ECG data
    const LO = -0.6, HI = 2.3;

    // ── 3D projection ────────────────────────────────────────────────────────
    const proj = (x, y, z, theta) => {
      const cT = Math.cos(theta), sT = Math.sin(theta);
      const x1 =  x * cT + z * sT;
      const z1 = -x * sT + z * cT;
      return [cx + x1 * SC, cy - (y * cEL - z1 * sEL) * SC];
    };

    // Flat-ECG helpers
    const fpX = (i) => xLeft + (xRight - xLeft) * (i / FLAT_N);
    const fpY = (i) => flatCy - (ecg((i % LOOP_SPB) / LOOP_SPB) / ECG_PEAK) * flatAmp;

    // ── Phase 1: capture visualisation ───────────────────────────────────────
    const drawCapture = (t, alpha) => {
      if (alpha < 0.005) return;
      ctx.lineJoin = 'round';

      const tb    = t % BEAT;
      const thump = Math.exp(-Math.pow(tb / 0.12, 2)) + 0.5 * Math.exp(-Math.pow((tb - 0.16) / 0.07, 2));
      const coreR = 22 + 7 * thump;

      // Expanding rings from centre
      const RING_LIFE = 2.0;
      const nBeats = Math.floor(t / BEAT) + 1;
      for (let k = 0; k < nBeats && k < 5; k++) {
        const age = t - k * BEAT;
        if (age <= 0 || age >= RING_LIFE) continue;
        const pr = age / RING_LIFE;
        ctx.beginPath();
        ctx.arc(nodeCx, nodeCy, 44 + pr * W * 0.46, 0, Math.PI * 2);
        ctx.strokeStyle = '#5BAFE8';
        ctx.lineWidth   = 1.6;
        ctx.globalAlpha = alpha * (1 - pr) * (1 - pr) * 0.55;
        ctx.stroke();
      }

      // Animated dotted lines to electrodes
      ctx.setLineDash([2, 7]);
      ELECS.forEach(([ex, ey]) => {
        ctx.lineDashOffset = -(t * 26) % 9;
        ctx.beginPath();
        ctx.moveTo(nodeCx, nodeCy);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = '#5BAFE8';
        ctx.lineWidth   = 1.5;
        ctx.globalAlpha = alpha * 0.40;
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Electrode nodes
      ELECS.forEach(([ex, ey], i) => {
        const ea = (t - i * 0.12) % BEAT;
        const ep = Math.exp(-Math.pow(ea / 0.14, 2));
        // Pulse ring
        ctx.beginPath();
        ctx.arc(ex, ey, 14 + 10 * ep, 0, Math.PI * 2);
        ctx.strokeStyle = '#5BAFE8';
        ctx.lineWidth   = 1.5;
        ctx.globalAlpha = alpha * (0.5 * (1 - ep) + 0.2);
        ctx.stroke();
        // Background
        ctx.beginPath();
        ctx.arc(ex, ey, 13, 0, Math.PI * 2);
        ctx.fillStyle   = '#0E1F33';
        ctx.globalAlpha = alpha;
        ctx.fill();
        // Ring
        ctx.beginPath();
        ctx.arc(ex, ey, 13, 0, Math.PI * 2);
        ctx.strokeStyle = '#7CC3EF';
        ctx.lineWidth   = 1.6;
        ctx.globalAlpha = alpha * 0.80;
        ctx.stroke();
        // Centre dot
        ctx.beginPath();
        ctx.arc(ex, ey, 4.5, 0, Math.PI * 2);
        ctx.fillStyle   = '#5BAFE8';
        ctx.globalAlpha = alpha;
        ctx.fill();
      });

      // Radial glow + core dot
      const gradR = coreR * 2.4;
      const grad  = ctx.createRadialGradient(nodeCx, nodeCy, 0, nodeCx, nodeCy, gradR);
      grad.addColorStop(0,    'rgba(234,246,255,1)');
      grad.addColorStop(0.42, `rgba(93,180,232,${0.4 + 0.3 * thump})`);
      grad.addColorStop(1,    'rgba(93,180,232,0)');
      ctx.beginPath();
      ctx.arc(nodeCx, nodeCy, gradR, 0, Math.PI * 2);
      ctx.fillStyle   = grad;
      ctx.globalAlpha = alpha * (0.5 + 0.3 * thump);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(nodeCx, nodeCy, coreR, 0, Math.PI * 2);
      ctx.fillStyle   = '#EAF6FF';
      ctx.shadowColor = '#5BAFE8';
      ctx.shadowBlur  = 12;
      ctx.globalAlpha = alpha;
      ctx.fill();
      ctx.shadowBlur  = 0;
      ctx.globalAlpha = 1;
    };

    // ── Grid (fades in with fold) ─────────────────────────────────────────────
    const drawGrid = (theta, alpha) => {
      ctx.strokeStyle = '#5DB4E8';
      ctx.lineWidth   = 1;
      ctx.setLineDash([]);
      ctx.lineJoin    = 'round';

      // Floor grid (y = LO)
      const STEPS = 4;
      ctx.beginPath();
      ctx.globalAlpha = alpha * 0.10;
      for (let i = 0; i <= STEPS; i++) {
        const u = LO + (HI - LO) * (i / STEPS);
        let p;
        p = proj(u, LO, LO, theta); ctx.moveTo(p[0], p[1]);
        p = proj(u, LO, HI, theta); ctx.lineTo(p[0], p[1]);
        p = proj(LO, LO, u, theta); ctx.moveTo(p[0], p[1]);
        p = proj(HI, LO, u, theta); ctx.lineTo(p[0], p[1]);
      }
      ctx.stroke();

      // 12 box edges
      const C = [
        [LO,LO,LO],[HI,LO,LO],[HI,HI,LO],[LO,HI,LO],
        [LO,LO,HI],[HI,LO,HI],[HI,HI,HI],[LO,HI,HI],
      ].map(([x, y, z]) => proj(x, y, z, theta));
      const E = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
      ctx.globalAlpha = alpha * 0.17;
      ctx.beginPath();
      E.forEach(([a, b]) => { ctx.moveTo(C[a][0], C[a][1]); ctx.lineTo(C[b][0], C[b][1]); });
      ctx.stroke();

      // mV axis labels appear once fold is nearly done
      if (alpha > 0.55) {
        const la = (alpha - 0.55) / 0.45 * 0.46;
        ctx.globalAlpha = la;
        ctx.fillStyle   = '#5A8099';
        ctx.font        = `500 ${Math.round(W * 0.024)}px ui-monospace, monospace`;
        ctx.textAlign   = 'center';
        let p;
        p = proj(HI * 1.26, LO,       LO,       theta); ctx.fillText('mV', p[0], p[1]);
        p = proj(LO,        LO,        HI * 1.26, theta); ctx.fillText('mV', p[0], p[1]);
        p = proj(LO * 0.88, HI * 1.20, LO,       theta); ctx.fillText('mV', p[0], p[1]);
      }
      ctx.globalAlpha = 1;
    };

    // ── ECG + fold trajectory ─────────────────────────────────────────────────
    const drawTrajectory = (count, foldM, theta, alpha, showHead) => {
      const path = new Path2D();
      for (let i = 0; i < count; i++) {
        const [ex, ey, ez] = LOOP_TRAJ[i];
        const [px3, py3]   = proj(ex, ey, ez, theta);
        let px, py;
        if (foldM >= 0.998) {
          [px, py] = [px3, py3];
        } else {
          const fx = fpX(i), fy = fpY(i);
          px = fx + (px3 - fx) * foldM;
          py = fy + (py3 - fy) * foldM;
        }
        if (i === 0) path.moveTo(px, py);
        else         path.lineTo(px, py);
      }

      ctx.lineJoin = 'round';
      ctx.setLineDash([]);

      // Glow underlay
      ctx.strokeStyle = '#5DB4E8';
      ctx.lineWidth   = 3.5;
      ctx.globalAlpha = alpha * 0.12;
      ctx.shadowColor = 'rgba(93,180,232,0.85)';
      ctx.shadowBlur  = 16;
      ctx.stroke(path);
      ctx.shadowBlur  = 0;

      // Main line — thicker while flat, thinner once in 3D
      ctx.globalAlpha = alpha * (foldM < 0.5 ? 0.80 : 0.60);
      ctx.lineWidth   = foldM < 0.5 ? 2.0 : 1.1;
      ctx.stroke(path);

      // Glowing head dot during build / fold
      if (showHead && count > 0) {
        const li = count - 1;
        const [ex, ey, ez] = LOOP_TRAJ[li];
        const [px3, py3]   = proj(ex, ey, ez, theta);
        let hx, hy;
        if (foldM >= 0.998) {
          [hx, hy] = [px3, py3];
        } else {
          const fx = fpX(li), fy = fpY(li);
          hx = fx + (px3 - fx) * foldM;
          hy = fy + (py3 - fy) * foldM;
        }
        ctx.beginPath();
        ctx.arc(hx, hy, 3.5, 0, Math.PI * 2);
        ctx.fillStyle   = '#EAF6FF';
        ctx.globalAlpha = alpha;
        ctx.shadowColor = '#5BAFE8';
        ctx.shadowBlur  = 16;
        ctx.fill();
        ctx.shadowBlur  = 0;
      }
      ctx.globalAlpha = 1;
    };

    // ── Main animation loop ───────────────────────────────────────────────────
    const draw = (now) => {
      if (lastTs.current !== null) {
        const dt = Math.min((now - lastTs.current) / 1000, 0.05);
        animT.current += dt;
      }
      lastTs.current = now;

      const t = animT.current;

      // Background
      ctx.fillStyle   = '#091629';
      ctx.globalAlpha = 1;
      ctx.fillRect(0, 0, W, H);
      ctx.setLineDash([]);

      // Derived animation values
      const capAlpha  = clampF(t / 0.5, 0, 1) * (1 - clampF((t - T_CAP) / 0.6, 0, 1));
      const ecgLocal  = t - ECG_START;
      const ecgAlpha  = ecgLocal > 0 ? clampF(ecgLocal / 0.4, 0, 1) : 0;
      const buildProg = clampF(T_ECG > 0 ? ecgLocal / T_ECG : 1, 0, 1);
      const foldLocal = t - FOLD_START;
      const foldM     = foldLocal > 0 ? eioC(clampF(foldLocal / T_FOLD, 0, 1)) : 0;
      const theta     = 0.48 + Math.max(0, t - ROT_START) * ROT_RATE;

      // How many points of the trajectory are visible
      const count    = foldM > 0 ? FLAT_N : Math.max(2, Math.floor(buildProg * FLAT_N));
      const showHead = (buildProg < 1 && foldM === 0) || (foldM > 0 && foldM < 0.88);

      // Phase 1: capture
      drawCapture(t, capAlpha);

      // Phase 2+: ECG trace / fold / rotating 3D loop
      if (ecgAlpha > 0.005) {
        if (foldM > 0.02) drawGrid(theta, foldM);
        drawTrajectory(count, foldM, theta, ecgAlpha, showHead);
      }

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

      {/* Section 4: capture → ECG → fold → 3D attractor */}
      <PhaseSpace3D visible={sceneState === 'algorithm'} reduced={reduced} />
    </div>
  );
}
