import React, { useRef, useEffect, useState } from 'react';

/* ─── Cardiac Phase Space Tomography 3D Visualization ─── */
export function PhaseSpaceViz({ width = 600, height = 420, dark = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId, t = 0;

    // Generate a toroidal cardiac attractor with realistic scatter
    function makePts(n = 2200) {
      const pts = [];
      for (let i = 0; i < n; i++) {
        const u = (i / n) * Math.PI * 24;
        const v = (i / n) * Math.PI * 2 * 7;
        const R = 0.52, r = 0.18 + 0.06 * Math.sin(u * 2.3);
        const ns = 0.038;
        pts.push([
          (R + r * Math.cos(v)) * Math.cos(u) + (Math.random() - 0.5) * ns,
          (R + r * Math.cos(v)) * Math.sin(u) + (Math.random() - 0.5) * ns,
          r * Math.sin(v) + (Math.random() - 0.5) * ns,
          i / n, // normalized index for coloring
        ]);
      }
      return pts;
    }

    const pts = makePts();

    function project(x, y, z, ry, rx) {
      const cy = Math.cos(ry), sy = Math.sin(ry);
      const x1 = x * cy - z * sy;
      const z1 = x * sy + z * cy;
      const cx = Math.cos(rx), sx = Math.sin(rx);
      const y2 = y * cx - z1 * sx;
      const z2 = y * sx + z1 * cx;
      const fov = 2.8, W = canvas.width, H = canvas.height;
      const s = W * fov / (fov + z2 + 2.2);
      return { px: W / 2 + x1 * s, py: H / 2 + y2 * s, z: z2, sf: s / (W * fov) };
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const ry = t * 0.0035;
      const rx = 0.38;

      const sorted = pts
        .map(([x, y, z, fi]) => ({ ...project(x, y, z, ry, rx), fi }))
        .sort((a, b) => a.z - b.z);

      for (const p of sorted) {
        const br = Math.max(0, Math.min(1, (p.z + 1.8) / 3.2));
        const sz = Math.max(0.6, p.sf * 5.5);
        // Electric blue → cyan gradient by index position
        const hue = 196 + p.fi * 30;
        const sat = 70 + br * 30;
        const lit = 38 + br * 42;
        const alpha = 0.12 + br * 0.62;
        ctx.beginPath();
        ctx.arc(p.px, p.py, sz, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue},${sat}%,${lit}%,${alpha})`;
        ctx.fill();
      }

      // Label
      ctx.font = `10px "Geist Mono", monospace`;
      ctx.fillStyle = dark ? 'rgba(152,162,179,0.7)' : 'rgba(107,118,133,0.7)';
      ctx.letterSpacing = '0.12em';
      ctx.fillText('CARDIAC PHASE SPACE TOMOGRAPHY', 16, canvas.height - 14);
      ctx.fillText('FIG. 02', canvas.width - 56, canvas.height - 14);

      t++;
      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, [dark]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={420}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    />
  );
}

/* ─── CAD: Coronary Artery Cross-Section Animation ─── */
export function CadAnimation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId, t = 0;

    function drawArtery(cx, cy, outerR, innerR, plaqueAngle, label, healthy) {
      // Outer vessel wall
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
      ctx.fillStyle = '#3A1A1A';
      ctx.fill();
      ctx.strokeStyle = '#C25B5B';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (!healthy) {
        // Plaque buildup (eccentric)
        ctx.beginPath();
        ctx.arc(cx + outerR * 0.18, cy, outerR * 0.62, 0, Math.PI * 2);
        ctx.fillStyle = '#8B6914';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + outerR * 0.14, cy - outerR * 0.05, outerR * 0.55, 0, Math.PI * 2);
        ctx.fillStyle = '#C9A227';
        ctx.fill();
      }

      // Lumen
      ctx.beginPath();
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
      const lumenGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, innerR);
      lumenGrad.addColorStop(0, '#EF6060');
      lumenGrad.addColorStop(0.6, '#CC3333');
      lumenGrad.addColorStop(1, '#8B1A1A');
      ctx.fillStyle = lumenGrad;
      ctx.fill();

      // Animated blood cells
      const numCells = healthy ? 6 : 3;
      for (let i = 0; i < numCells; i++) {
        const phase = (t * 0.018 + i / numCells) % 1;
        const angle = phase * Math.PI * 2;
        const r = innerR * 0.55;
        const bx = cx + Math.cos(angle) * r * 0.4;
        const by = cy + Math.sin(angle) * r;
        const cellR = Math.min(innerR * 0.18, 7);
        ctx.beginPath();
        ctx.ellipse(bx, by, cellR, cellR * 0.65, angle, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(220,60,60,0.85)';
        ctx.fill();
        // Dimple
        ctx.beginPath();
        ctx.ellipse(bx, by, cellR * 0.35, cellR * 0.2, angle, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(140,20,20,0.6)';
        ctx.fill();
      }

      // Label
      ctx.font = '500 12px "Manrope", sans-serif';
      ctx.fillStyle = healthy ? '#4CAF85' : '#E07070';
      ctx.textAlign = 'center';
      ctx.fillText(label, cx, cy + outerR + 22);
      if (!healthy) {
        ctx.font = '11px "Geist Mono", monospace';
        ctx.fillStyle = '#C9A227';
        ctx.fillText('PLAQUE', cx, cy + outerR + 36);
      }
    }

    function draw() {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = '#0F1823';
      ctx.fillRect(0, 0, W, H);

      // Title
      ctx.font = '11px "Geist Mono", monospace';
      ctx.fillStyle = '#5BAFE8';
      ctx.textAlign = 'left';
      ctx.letterSpacing = '0.1em';
      ctx.fillText('CORONARY ARTERY · CROSS SECTION', 20, 24);

      // Two arteries: healthy left, stenotic right
      const cy = H / 2 + 10;
      drawArtery(W * 0.28, cy, 68, 52, 0, 'Normal lumen', true);
      drawArtery(W * 0.72, cy, 68, 26, 0, 'Stenotic (>70%)', false);

      // Divider
      ctx.beginPath();
      ctx.moveTo(W / 2, 40);
      ctx.lineTo(W / 2, H - 20);
      ctx.strokeStyle = '#1F2A3D';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Flow arrows on healthy side
      for (let i = 0; i < 3; i++) {
        const phase = (t * 0.012 + i / 3) % 1;
        const ay = (H * 0.3) + phase * H * 0.45;
        ctx.beginPath();
        ctx.moveTo(W * 0.28, ay);
        ctx.lineTo(W * 0.28 - 5, ay - 8);
        ctx.lineTo(W * 0.28 + 5, ay - 8);
        ctx.closePath();
        ctx.fillStyle = `rgba(91,175,232,${0.3 + phase * 0.5})`;
        ctx.fill();
      }

      ctx.font = '10px "Geist Mono", monospace';
      ctx.fillStyle = 'rgba(152,162,179,0.5)';
      ctx.textAlign = 'center';
      ctx.fillText('CorVista detects hemodynamic significance — without stress or contrast', W / 2, H - 12);

      t++;
      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas ref={canvasRef} width={560} height={340}
      style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 2 }} />
  );
}

/* ─── PH: Pulmonary Vasculature Pressure Animation ─── */
export function PhAnimation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId, t = 0;

    function drawHeart(cx, cy, scale, pressure) {
      // Right ventricle (enlarged under PH pressure)
      const rvScale = 1 + pressure * 0.35;
      ctx.beginPath();
      ctx.ellipse(cx - scale * 0.32 * rvScale, cy, scale * 0.28 * rvScale, scale * 0.38 * rvScale, -0.15, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,60,60,${0.5 + pressure * 0.3})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(220,80,80,${0.7 + pressure * 0.2})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Left ventricle
      ctx.beginPath();
      ctx.ellipse(cx + scale * 0.16, cy + scale * 0.05, scale * 0.22, scale * 0.36, 0.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(180,60,60,0.55)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(220,80,80,0.7)';
      ctx.stroke();

      // Septum label
      if (pressure > 0.5) {
        ctx.font = '10px "Geist Mono", monospace';
        ctx.fillStyle = 'rgba(255,160,80,0.8)';
        ctx.textAlign = 'center';
        ctx.fillText('SEPTAL SHIFT', cx, cy + scale * 0.52);
      }
    }

    function drawVessel(x1, y1, x2, y2, pressure, pulsing) {
      const pulse = pulsing ? 1 + Math.sin(t * 0.06) * 0.15 * pressure : 1;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      const r = Math.round(180 + pressure * 60);
      const g = Math.round(80 - pressure * 40);
      ctx.strokeStyle = `rgba(${r},${g},60,${0.5 + pressure * 0.4})`;
      ctx.lineWidth = (3 + pressure * 4) * pulse;
      ctx.stroke();
    }

    function draw() {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      ctx.fillStyle = '#0F1823';
      ctx.fillRect(0, 0, W, H);

      ctx.font = '11px "Geist Mono", monospace';
      ctx.fillStyle = '#5BAFE8';
      ctx.textAlign = 'left';
      ctx.fillText('PULMONARY VASCULATURE · PRESSURE MAP', 20, 24);

      // Animate pressure oscillation
      const pressure = 0.5 + 0.5 * Math.sin(t * 0.025);

      // Pulmonary arteries — tree structure
      const rootX = W * 0.5, rootY = H * 0.2;

      // Main PA
      drawVessel(rootX, rootY, rootX - 60, H * 0.38, pressure, true);
      drawVessel(rootX, rootY, rootX + 60, H * 0.38, pressure, true);

      // Branches
      drawVessel(rootX - 60, H * 0.38, rootX - 110, H * 0.56, pressure * 0.85, false);
      drawVessel(rootX - 60, H * 0.38, rootX - 20, H * 0.58, pressure * 0.75, false);
      drawVessel(rootX + 60, H * 0.38, rootX + 110, H * 0.56, pressure * 0.85, false);
      drawVessel(rootX + 60, H * 0.38, rootX + 20, H * 0.58, pressure * 0.75, false);

      // Sub-branches
      for (const [bx, by] of [[rootX - 110, H * 0.56], [rootX - 20, H * 0.58], [rootX + 110, H * 0.56], [rootX + 20, H * 0.58]]) {
        drawVessel(bx, by, bx - 30, by + 28, pressure * 0.6, false);
        drawVessel(bx, by, bx + 30, by + 28, pressure * 0.6, false);
      }

      // Heart
      drawHeart(W * 0.5, H * 0.68, 52, pressure);

      // PA pressure reading
      const mmhg = Math.round(25 + pressure * 40);
      ctx.font = 'bold 22px "Geist Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillStyle = pressure > 0.5 ? '#E07070' : '#4CAF85';
      ctx.fillText(`${mmhg} mmHg`, W - 20, H * 0.2 + 8);
      ctx.font = '10px "Geist Mono", monospace';
      ctx.fillStyle = 'rgba(152,162,179,0.6)';
      ctx.fillText('mPAP', W - 20, H * 0.2 + 22);

      // Normal range indicator
      ctx.strokeStyle = 'rgba(91,175,232,0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.moveTo(W - 90, H * 0.15);
      ctx.lineTo(W - 20, H * 0.15);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = '9px "Geist Mono", monospace';
      ctx.fillStyle = 'rgba(91,175,232,0.5)';
      ctx.fillText('NORMAL ≤20', W - 20, H * 0.15 - 4);

      ctx.font = '10px "Geist Mono", monospace';
      ctx.fillStyle = 'rgba(152,162,179,0.4)';
      ctx.textAlign = 'center';
      ctx.fillText('CorVista detects elevated mPAP from resting biosignals — no cath required', W / 2, H - 12);

      t++;
      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas ref={canvasRef} width={560} height={340}
      style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 2 }} />
  );
}

/* ─── HF: Cardiac Filling Pressure Animation ─── */
export function HfAnimation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId, t = 0;

    function drawChamber(x, y, w, h, fillFraction, color, label, pressure) {
      // Chamber outline
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 8);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Fill level
      const fillH = h * fillFraction;
      ctx.beginPath();
      ctx.roundRect(x + 1, y + h - fillH, w - 2, fillH, [0, 0, 7, 7]);
      const grad = ctx.createLinearGradient(x, y + h - fillH, x, y + h);
      grad.addColorStop(0, color.replace(')', ',0.3)').replace('rgb', 'rgba'));
      grad.addColorStop(1, color.replace(')', ',0.7)').replace('rgb', 'rgba'));
      ctx.fillStyle = grad;
      ctx.fill();

      // Pressure value
      ctx.font = 'bold 14px "Geist Mono", monospace';
      ctx.fillStyle = pressure > 18 ? '#E07070' : '#5BAFE8';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.round(pressure)} mmHg`, x + w / 2, y - 8);

      // Label
      ctx.font = '10px "Geist Mono", monospace';
      ctx.fillStyle = 'rgba(152,162,179,0.7)';
      ctx.fillText(label, x + w / 2, y + h + 16);
    }

    function draw() {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      ctx.fillStyle = '#0F1823';
      ctx.fillRect(0, 0, W, H);

      ctx.font = '11px "Geist Mono", monospace';
      ctx.fillStyle = '#5BAFE8';
      ctx.textAlign = 'left';
      ctx.fillText('CARDIAC FILLING PRESSURES · PCWP', 20, 24);

      // Heartbeat cycle
      const beat = (t * 0.022) % (Math.PI * 2);
      const systole = Math.max(0, Math.sin(beat));
      const diastoleFill = 0.55 + systole * 0.15;

      // Elevated PCWP oscillates higher
      const pcwpBase = 24; // elevated (normal <15)
      const lvedpBase = 22; // elevated
      const pcwp = pcwpBase + systole * 6;
      const lvedp = lvedpBase + systole * 8;

      // Left Atrium (top left)
      const laFill = 0.72 + systole * 0.12;
      drawChamber(W * 0.12, H * 0.1, 100, 80, laFill, 'rgb(180,80,80)', 'LA', Math.round(pcwp));

      // Left Ventricle (bottom left)
      drawChamber(W * 0.12, H * 0.55, 100, 110, diastoleFill, 'rgb(200,60,60)', 'LV', Math.round(lvedp));

      // Pulmonary veins (congested)
      for (let i = 0; i < 4; i++) {
        const vy = H * 0.12 + i * 22;
        const congestion = (laFill - 0.5) * 2;
        ctx.beginPath();
        ctx.moveTo(W * 0.44, vy);
        ctx.bezierCurveTo(W * 0.36, vy, W * 0.28, H * 0.14 + i * 14, W * 0.22, H * 0.14 + i * 10);
        ctx.strokeStyle = `rgba(180,80,80,${0.25 + congestion * 0.4})`;
        ctx.lineWidth = 2.5 + congestion * 2;
        ctx.stroke();
      }

      // Lungs schematic (right side)
      ctx.font = '10px "Geist Mono", monospace';
      ctx.textAlign = 'center';

      for (const [lx, side] of [[W * 0.62, 'R'], [W * 0.82, 'L']]) {
        const congestion = (laFill - 0.6) / 0.3;
        ctx.beginPath();
        ctx.ellipse(lx, H * 0.4, 44, 70, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.round(80 + congestion * 60)},${Math.round(100 - congestion * 30)},130,0.25)`;
        ctx.fill();
        ctx.strokeStyle = `rgba(${Math.round(120 + congestion * 80)},100,140,0.5)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Fluid level indicator
        if (congestion > 0.3) {
          const fluidH = 70 * congestion * 0.6;
          ctx.beginPath();
          ctx.ellipse(lx, H * 0.4 + 70 - fluidH / 2, 44 * 0.8, fluidH / 2, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180,100,100,${0.15 + congestion * 0.2})`;
          ctx.fill();
        }

        ctx.fillStyle = 'rgba(152,162,179,0.6)';
        ctx.fillText(`LUNG ${side}`, lx, H * 0.4 + 84);
      }

      // PCWP arrow + label
      ctx.beginPath();
      ctx.moveTo(W * 0.35, H * 0.22);
      ctx.lineTo(W * 0.54, H * 0.3);
      ctx.strokeStyle = 'rgba(224,112,112,0.5)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = '9px "Geist Mono", monospace';
      ctx.fillStyle = '#E07070';
      ctx.textAlign = 'left';
      ctx.fillText('PCWP reflects LA pressure', W * 0.55, H * 0.3);

      // Normal range bar
      ctx.fillStyle = 'rgba(91,175,232,0.15)';
      ctx.fillRect(W * 0.08, H * 0.08, 8, 22);
      ctx.font = '8px "Geist Mono", monospace';
      ctx.fillStyle = 'rgba(91,175,232,0.5)';
      ctx.textAlign = 'left';
      ctx.fillText('NL', W * 0.08, H * 0.06);

      ctx.font = '10px "Geist Mono", monospace';
      ctx.fillStyle = 'rgba(152,162,179,0.4)';
      ctx.textAlign = 'center';
      ctx.fillText('CorVista estimates elevated PCWP in-office — without an echocardiogram', W / 2, H - 12);

      t++;
      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas ref={canvasRef} width={560} height={340}
      style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 2 }} />
  );
}
