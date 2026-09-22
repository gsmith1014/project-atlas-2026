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

// ── Single-cycle trajectory (5 repeats → one clean 3D loop) ──────────────────
const LOOP_SPB  = 240;
const FLAT_REPS = 5;
const FLAT_N    = FLAT_REPS * LOOP_SPB;
const LOOP_TAU  = 0.020;
const ECG_PEAK  = 2.10;

const LOOP_TRAJ = Array.from({ length: FLAT_N }, (_, i) => {
  const t = (i % LOOP_SPB) / LOOP_SPB;
  return [ecg(t), ecg(t - LOOP_TAU), ecg(t - 2 * LOOP_TAU)];
});

// ── Helpers ───────────────────────────────────────────────────────────────────
const clampF = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const eioC   = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// ── Pulsing capture node (overlaid on patient image) ─────────────────────────
// Shown semi-transparently over the patient during capture + dataset states.
function CaptureOverlay({ visible, reduced }) {
  const ref  = useRef(null);
  const raf  = useRef(null);
  const t0   = useRef(null);
  const tRef = useRef(0);

  useEffect(() => {
    if (!visible) {
      cancelAnimationFrame(raf.current);
      tRef.current = 0;
      t0.current   = null;
      return;
    }

    const canvas = ref.current;
    const ctx    = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    // Node over the heart/chest area of the patient image
    const nodeCx = W * 0.50, nodeCy = H * 0.40;
    const BEAT   = 0.82;
    // Electrode positions on the chest
    const ELECS  = [
      [W * 0.24, H * 0.32],  // left chest
      [W * 0.76, H * 0.34],  // right chest
      [W * 0.50, H * 0.58],  // lower sternum
    ];

    const draw = (now) => {
      if (t0.current !== null) {
        tRef.current += Math.min((now - t0.current) / 1000, 0.05);
      }
      t0.current = now;
      const t = tRef.current;

      ctx.clearRect(0, 0, W, H);

      const tb    = t % BEAT;
      const thump = Math.exp(-Math.pow(tb / 0.12, 2)) + 0.5 * Math.exp(-Math.pow((tb - 0.16) / 0.07, 2));
      const coreR = 16 + 6 * thump;

      // Expanding rings
      const RING_LIFE = 2.0;
      for (let k = 0; k < 5; k++) {
        const age = t - k * BEAT;
        if (age <= 0 || age >= RING_LIFE) continue;
        const pr = age / RING_LIFE;
        ctx.beginPath();
        ctx.arc(nodeCx, nodeCy, 32 + pr * W * 0.40, 0, Math.PI * 2);
        ctx.strokeStyle = '#5BAFE8';
        ctx.lineWidth   = 1.4;
        ctx.globalAlpha = (1 - pr) * (1 - pr) * 0.50;
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
        ctx.lineWidth   = 1.4;
        ctx.globalAlpha = 0.55;
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Electrode nodes
      ELECS.forEach(([ex, ey], i) => {
        const ea = (t - i * 0.12) % BEAT;
        const ep = Math.exp(-Math.pow(ea / 0.14, 2));
        ctx.beginPath();
        ctx.arc(ex, ey, 12 + 9 * ep, 0, Math.PI * 2);
        ctx.strokeStyle = '#5BAFE8';
        ctx.lineWidth   = 1.5;
        ctx.globalAlpha = 0.5 * (1 - ep) + 0.20;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(ex, ey, 11, 0, Math.PI * 2);
        ctx.fillStyle   = 'rgba(14,31,51,0.55)';
        ctx.globalAlpha = 1;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(ex, ey, 11, 0, Math.PI * 2);
        ctx.strokeStyle = '#7CC3EF';
        ctx.lineWidth   = 1.5;
        ctx.globalAlpha = 0.80;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(ex, ey, 4, 0, Math.PI * 2);
        ctx.fillStyle   = '#5BAFE8';
        ctx.globalAlpha = 0.90;
        ctx.fill();
      });

      // Radial glow behind node
      const gradR = coreR * 2.8;
      const grad  = ctx.createRadialGradient(nodeCx, nodeCy, 0, nodeCx, nodeCy, gradR);
      grad.addColorStop(0,    'rgba(234,246,255,0.9)');
      grad.addColorStop(0.42, `rgba(93,180,232,${0.35 + 0.25 * thump})`);
      grad.addColorStop(1,    'rgba(93,180,232,0)');
      ctx.beginPath();
      ctx.arc(nodeCx, nodeCy, gradR, 0, Math.PI * 2);
      ctx.fillStyle   = grad;
      ctx.globalAlpha = 0.5 + 0.25 * thump;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(nodeCx, nodeCy, coreR, 0, Math.PI * 2);
      ctx.fillStyle   = '#EAF6FF';
      ctx.shadowColor = '#5BAFE8';
      ctx.shadowBlur  = 12;
      ctx.globalAlpha = 1;
      ctx.fill();
      ctx.shadowBlur  = 0;

      if (!reduced) raf.current = requestAnimationFrame(draw);
    };

    raf.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf.current); t0.current = null; };
  }, [visible, reduced]);

  return (
    <canvas ref={ref} width={400} height={533} style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      opacity: visible ? 0.72 : 0,
      transition: reduced ? 'none' : 'opacity 0.9s ease',
      pointerEvents: 'none',
    }} />
  );
}

// ── 3D cardiac phase space (section 4: algorithm) ─────────────────────────────
// Two-phase animation:
//   Phase 1 — PQRST waveform writes slowly across the canvas (3.5 s)
//   Phase 2 — ECG folds into clean single 3D loop → turntable rotation
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

    const cx = W * 0.50, cy = H * 0.44;
    const SC = W * 0.158;
    const EL_RAD = 26 * Math.PI / 180;
    const cEL = Math.cos(EL_RAD), sEL = Math.sin(EL_RAD);

    const xLeft  = W * 0.04, xRight = W * 0.96;
    const flatCy = H * 0.52, flatAmp = H * 0.21;

    // Animation timing — ECG write is slow so the transformation feels deliberate
    const T_ECG  = reduced ? 0     : 3.5;
    const T_FOLD = reduced ? 0.001 : 2.2;
    const FOLD_START = T_ECG;
    const ROT_START  = FOLD_START + T_FOLD;
    const ROT_RATE   = 0.20;

    const LO = -0.6, HI = 2.3;

    const proj = (x, y, z, theta) => {
      const cT = Math.cos(theta), sT = Math.sin(theta);
      const x1 =  x * cT + z * sT;
      const z1 = -x * sT + z * cT;
      return [cx + x1 * SC, cy - (y * cEL - z1 * sEL) * SC];
    };

    const fpX = (i) => xLeft + (xRight - xLeft) * (i / FLAT_N);
    const fpY = (i) => flatCy - (ecg((i % LOOP_SPB) / LOOP_SPB) / ECG_PEAK) * flatAmp;

    const drawGrid = (theta, alpha) => {
      ctx.strokeStyle = '#5DB4E8';
      ctx.lineWidth   = 1;
      ctx.setLineDash([]);
      ctx.lineJoin    = 'round';

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

      const C = [
        [LO,LO,LO],[HI,LO,LO],[HI,HI,LO],[LO,HI,LO],
        [LO,LO,HI],[HI,LO,HI],[HI,HI,HI],[LO,HI,HI],
      ].map(([x, y, z]) => proj(x, y, z, theta));
      const E = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
      ctx.globalAlpha = alpha * 0.17;
      ctx.beginPath();
      E.forEach(([a, b]) => { ctx.moveTo(C[a][0], C[a][1]); ctx.lineTo(C[b][0], C[b][1]); });
      ctx.stroke();

      if (alpha > 0.55) {
        const la = (alpha - 0.55) / 0.45 * 0.46;
        ctx.globalAlpha = la;
        ctx.fillStyle   = '#5A8099';
        ctx.font        = `500 ${Math.round(W * 0.024)}px ui-monospace, monospace`;
        ctx.textAlign   = 'center';
        let p;
        p = proj(HI * 1.26, LO,        LO,        theta); ctx.fillText('mV', p[0], p[1]);
        p = proj(LO,        LO,        HI * 1.26,  theta); ctx.fillText('mV', p[0], p[1]);
        p = proj(LO * 0.88, HI * 1.20, LO,        theta); ctx.fillText('mV', p[0], p[1]);
      }
      ctx.globalAlpha = 1;
    };

    const drawTrajectory = (count, foldM, theta, showHead) => {
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

      ctx.lineJoin    = 'round';
      ctx.setLineDash([]);

      // Glow underlay
      ctx.strokeStyle = '#5DB4E8';
      ctx.lineWidth   = 3.5;
      ctx.globalAlpha = 0.12;
      ctx.shadowColor = 'rgba(93,180,232,0.85)';
      ctx.shadowBlur  = 16;
      ctx.stroke(path);
      ctx.shadowBlur  = 0;

      // Main line
      ctx.globalAlpha = foldM < 0.5 ? 0.82 : 0.62;
      ctx.lineWidth   = foldM < 0.5 ? 2.1  : 1.1;
      ctx.stroke(path);

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
        ctx.globalAlpha = 1;
        ctx.shadowColor = '#5BAFE8';
        ctx.shadowBlur  = 16;
        ctx.fill();
        ctx.shadowBlur  = 0;
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

      ctx.fillStyle   = '#091629';
      ctx.globalAlpha = 1;
      ctx.fillRect(0, 0, W, H);
      ctx.setLineDash([]);

      const buildProg = clampF(T_ECG > 0 ? t / T_ECG : 1, 0, 1);
      const foldLocal = t - FOLD_START;
      const foldM     = foldLocal > 0 ? eioC(clampF(foldLocal / T_FOLD, 0, 1)) : 0;
      const theta     = 0.48 + Math.max(0, t - ROT_START) * ROT_RATE;

      const count    = foldM > 0 ? FLAT_N : Math.max(2, Math.floor(buildProg * FLAT_N));
      const showHead = (buildProg < 1 && foldM === 0) || (foldM > 0 && foldM < 0.88);

      if (foldM > 0.02) drawGrid(theta, foldM);
      drawTrajectory(count, foldM, theta, showHead);

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

  // Capture overlay shows over the patient image during capture + dataset
  const captureVisible = sceneState === 'capture' || sceneState === 'dataset';

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

      {/* Pulsing capture node — semi-transparent over patient image */}
      <CaptureOverlay visible={captureVisible} reduced={reduced} />

      {/* Section 4: ECG writes then folds into 3D attractor */}
      <PhaseSpace3D visible={sceneState === 'algorithm'} reduced={reduced} />
    </div>
  );
}
