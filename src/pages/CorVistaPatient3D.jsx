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

// ── Delay-embedded phase space trajectory ─────────────────────────────────────
// τ = 0.020 cycles: when x peaks at R (2.1), y is on the R rise (~0.86) and
// z is in the Q dip (-0.11), giving the characteristic 3D cardiac loop shape.
const TAU    = 0.020;
const TRAJ_N = 2400;
const TRAJ   = (() => {
  const pts = new Array(TRAJ_N);
  for (let i = 0; i < TRAJ_N; i++) {
    const t = i / 120;
    pts[i] = [ecg(t), ecg(t - TAU), ecg(t - 2 * TAU)];
  }
  return pts;
})();

// ── 3D → 2D projection ───────────────────────────────────────────────────────
// AZ=+30° tilts so X goes upper-right, Z goes lower-left — matching the
// reference image orientation (Y vertical, two diagonals visible).
const AZ = 30 * Math.PI / 180;
const EL = 28 * Math.PI / 180;
const [cAZ, sAZ, cEL, sEL] = [Math.cos(AZ), Math.sin(AZ), Math.cos(EL), Math.sin(EL)];

function proj(x, y, z, cx, cy, sc) {
  const x1 =  x * cAZ + z * sAZ;
  const z1 = -x * sAZ + z * cAZ;
  return [cx + x1 * sc, cy - (y * cEL - z1 * sEL) * sc];
}

// ── Real-time ECG trace (section 3: dataset) ──────────────────────────────────
// Writes left → right like a cardiac monitor, then wraps and overwrites.
// Buffer persists the full trace; a gap ahead of the cursor shows where
// the pen is heading.
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

    const SPEED = 88;   // px / second  →  ≈ 60 BPM at 88 px/cycle
    const CPX   = 88;   // canvas pixels per cardiac cycle
    const GAP   = 14;   // erase zone ahead of cursor (px)

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

      // Persistent trace — skip the erase gap just ahead of the cursor
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

      // Glowing cursor at write head
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
function PhaseSpace3D({ visible, reduced }) {
  const ref = useRef(null);
  const raf = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx    = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    // Offset center slightly left so box is well framed
    const cx = W * 0.48, cy = H * 0.46, sc = W * 0.145;
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

      const STEPS = 5;
      const step  = (HI - LO) / STEPS;
      const G1 = '#1C3552', G2 = '#172C46';

      for (let i = 0; i <= STEPS; i++) {
        const v = LO + i * step;
        // Floor (y = LO)
        line3(v,LO,LO, v,LO,HI, G1, 0.40);
        line3(LO,LO,v, HI,LO,v, G1, 0.40);
        // Left wall (z = HI — back)
        line3(v,LO,HI, v,HI,HI, G2, 0.30);
        line3(LO,v,HI, HI,v,HI, G2, 0.30);
        // Right wall (x = HI)
        line3(HI,LO,v, HI,HI,v, G2, 0.28);
        line3(HI,v,LO, HI,v,HI, G2, 0.28);
      }

      // Axis edges
      const AX = '#3A5A7A';
      line3(LO,LO,LO, HI,LO,LO, AX, 0.85, 1.1);
      line3(LO,LO,LO, LO,HI,LO, AX, 0.85, 1.1);
      line3(LO,LO,LO, LO,LO,HI, AX, 0.85, 1.1);

      // Tick marks + values on Y axis (vertical)
      ctx.font = `${W*0.026}px system-ui,sans-serif`;
      ctx.textAlign = 'right'; ctx.fillStyle = '#4A6A84'; ctx.globalAlpha = 0.58;
      for (let i = 0; i <= STEPS; i++) {
        const v = LO + i * step;
        const [px,py] = proj(LO-0.08, v, LO, cx, cy, sc);
        ctx.fillText(v.toFixed(1), px, py + 4);
      }
      // Tick marks on X axis (floor front)
      ctx.textAlign = 'center';
      for (let i = 0; i <= STEPS; i++) {
        const v = LO + i * step;
        const [px,py] = proj(v, LO-0.12, LO, cx, cy, sc);
        ctx.fillText(v.toFixed(1), px, py);
      }

      // Axis labels
      ctx.font = `bold ${W*0.032}px system-ui,sans-serif`;
      ctx.fillStyle = '#6A90AA'; ctx.globalAlpha = 0.65;
      const [yx,yy] = proj(LO-0.72, (LO+HI)/2, LO, cx, cy, sc);
      const [xx,xy] = proj((LO+HI)/2, LO-0.5, LO, cx, cy, sc);
      const [zx,zy] = proj(LO-0.35, LO, (LO+HI)/2, cx, cy, sc);
      ctx.textAlign = 'center';
      ctx.fillText('mV', yx, yy);
      ctx.fillText('mV', xx, xy);
      ctx.fillText('mV', zx, zy);
      ctx.globalAlpha = 1;
    };

    // Progressive build: trajectory draws itself cycle by cycle
    let drawn = 0;
    const SPF = reduced ? TRAJ_N : 48; // points per frame

    const frame = () => {
      drawScene();

      if (drawn > 1) {
        // Fade older segments slightly — first pass fully opaque, subsequent passes lighter
        ctx.beginPath();
        ctx.strokeStyle = '#5BAFE8';
        ctx.lineWidth   = 1.6;
        ctx.lineJoin    = 'round';
        ctx.globalAlpha = 0.88;

        const [sx,sy] = proj(...TRAJ[0], cx, cy, sc);
        ctx.moveTo(sx, sy);
        for (let i = 1; i < drawn; i++) {
          const [px,py] = proj(...TRAJ[i], cx, cy, sc);
          ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      drawn = Math.min(drawn + SPF, TRAJ_N);
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

      {/* Section 4: 3D cardiac phase space attractor */}
      <PhaseSpace3D visible={sceneState === 'algorithm'} reduced={reduced} />
    </div>
  );
}
