import React, { useEffect, useRef } from 'react';
import { navTo } from '../components.jsx';
import './a4l.css';

/* ── RADAR CHART ─────────────────────────────────────────────────────────── */
/* Values: 6-axis polar, scale ±0.3. Axes match PHLEX/PHGEX feature families. */
const RADAR_AXES = [
  { lines: ['Hemodynamics'],          n: 39,  θ:  Math.PI / 2         },
  { lines: ['Cardiac', 'Dynamics'],   n: 22,  θ:  Math.PI / 6         },
  { lines: ['Ventricular', 'Repol.'], n: 29,  θ: -Math.PI / 6         },
  { lines: ['Respiration'],           n: 24,  θ: -Math.PI / 2         },
  { lines: ['Ventricular', 'Depol.'], n: 74,  θ: -5 * Math.PI / 6     },
  { lines: ['Atrial', 'Conduction'],  n: 29,  θ:  5 * Math.PI / 6     },
];
// Reference profiles from PHLEX/PHGEX validation (Intel.-Based Med. 2026)
// Order: Hemodynamics, Cardiac Dynamics, Ventricular Repolarization,
//        Respiration, Ventricular Depolarization, Atrial Conduction
const TP_REF  = [ 0.25,  0.26,  0.17,  0.22,  0.25,  0.26]; // True positive
const TN_REF  = [ 0.12,  0.10,  0.20,  0.08,  0.08,  0.17]; // True negative — elevated VR
const PT_A    = [ 0.24,  0.24,  0.15,  0.21,  0.23,  0.25]; // Patient A — closely tracks TP
const PT_B    = [ 0.29,  0.24,  0.21,  0.12,  0.28,  0.29]; // Patient B — mixed: high Hemo/VD/AC, elevated VR, low Resp

function A4LRadar({ patient, patientLabel, size = 290 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.30;
  const lpad = size * 0.20;

  function pt(ai, v) {
    const ax = RADAR_AXES[ai];
    return { x: cx + (v / 0.3) * r * Math.cos(ax.θ), y: cy - (v / 0.3) * r * Math.sin(ax.θ) };
  }
  function poly(vals) {
    return vals.map((v, i) => { const p = pt(i, v); return `${p.x.toFixed(1)},${p.y.toFixed(1)}`; }).join(' ');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ overflow: 'visible' }}>
        {/* Grid rings at 0.1, 0.2, 0.3 */}
        {[1/3, 2/3, 1].map((f, i) => (
          <circle key={i} cx={cx} cy={cy} r={f * r} fill="none" stroke="rgba(60,90,160,.28)" strokeWidth="0.75" />
        ))}
        {/* Spokes */}
        {RADAR_AXES.map((ax, i) => {
          const p = { x: cx + r * Math.cos(ax.θ), y: cy - r * Math.sin(ax.θ) };
          return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(60,90,160,.32)" strokeWidth="0.75" />;
        })}
        {/* Outer reference boundary */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,80,60,.28)" strokeWidth="1" strokeDasharray="4 3" />
        {/* True Negative */}
        <polygon points={poly(TN_REF)} fill="rgba(0,210,100,.06)" stroke="rgba(0,210,100,.65)" strokeWidth="1.5" strokeLinejoin="round" />
        {/* True Positive */}
        <polygon points={poly(TP_REF)} fill="rgba(255,176,48,.07)" stroke="rgba(255,176,48,.7)" strokeWidth="1.5" strokeLinejoin="round" />
        {/* Test patient band */}
        {[0.90, 0.95, 0.98].map((s, i) => (
          <polygon key={i} points={poly(patient.map(v => v * s))} fill="none" stroke="rgba(0,200,255,0.18)" strokeWidth="1.2" strokeLinejoin="round" />
        ))}
        {/* Test patient */}
        <polygon points={poly(patient)} fill="rgba(0,180,255,.11)" stroke="#00C8FF" strokeWidth="2.2" strokeLinejoin="round" />
        {/* Axis labels */}
        {RADAR_AXES.map((ax, i) => {
          const lx = cx + (r + lpad * 0.55) * Math.cos(ax.θ);
          const ly = cy - (r + lpad * 0.55) * Math.sin(ax.θ);
          const anchor = Math.cos(ax.θ) > 0.3 ? 'start' : Math.cos(ax.θ) < -0.3 ? 'end' : 'middle';
          const lh = 11, numLines = ax.lines.length + 1;
          const y0 = ly - (numLines * lh) / 2 + lh * 0.75;
          return (
            <g key={i}>
              {ax.lines.map((ln, li) => (
                <text key={li} x={lx} y={y0 + li * lh} textAnchor={anchor} fontSize="8.5" fill="rgba(196,212,244,.8)" fontFamily="'Space Mono',monospace">{ln}</text>
              ))}
              <text x={lx} y={y0 + ax.lines.length * lh} textAnchor={anchor} fontSize="7.5" fill="rgba(122,144,200,.5)" fontFamily="'Space Mono',monospace">N={ax.n}</text>
            </g>
          );
        })}
      </svg>
      <div style={{ fontFamily: "'Space Grotesk',system-ui,sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--fg)', marginTop: 14, letterSpacing: '-0.01em' }}>{patientLabel}</div>
    </div>
  );
}

export function A4LPage() {
  const phaseRef = useRef(null);
  const featureRef = useRef(null);

  /* Phase-space Lissajous orbital canvas */
  useEffect(() => {
    const canvas = phaseRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, cx, cy, rafId;
    let mounted = true;
    const orbits = [
      { a:1, b:2, phase:Math.PI/2, rxi:.26, ryi:.165, color:[0,220,255],  alpha:.95, n:24, spd:.0052 },
      { a:2, b:3, phase:0,          rxi:.36, ryi:.24,  color:[128,96,240], alpha:.85, n:18, spd:.0036 },
      { a:1, b:3, phase:Math.PI/4,  rxi:.16, ryi:.105, color:[255,185,48], alpha:.90, n:14, spd:.0068 },
      { a:3, b:4, phase:Math.PI/3,  rxi:.48, ryi:.32,  color:[0,200,255],  alpha:.45, n:16, spd:.0026 },
      { a:2, b:5, phase:Math.PI/5,  rxi:.20, ryi:.14,  color:[128,80,232], alpha:.60, n:10, spd:.0058 },
    ];
    orbits.forEach(o => { o.rx = 0; o.ry = 0; });
    let particles = [], stars = [];

    function resize() {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = Math.round(W * devicePixelRatio);
      canvas.height = Math.round(H * devicePixelRatio);
      ctx.scale(devicePixelRatio, devicePixelRatio);
      cx = W * .5; cy = H * .5;
      orbits.forEach(o => { o.rx = W * o.rxi; o.ry = H * o.ryi; });
      particles = [];
      orbits.forEach((o, oi) => {
        for (let i = 0; i < o.n; i++) {
          particles.push({ oi, t: (i/o.n)*Math.PI*2, spd: o.spd*(.75+Math.random()*.5), sz: 1.3+Math.random()*.9 });
        }
      });
      stars = Array.from({length:240}, () => ({
        x: Math.random()*W, y: Math.random()*H,
        sz: .3+Math.random()*.9, a: .08+Math.random()*.3,
        dx: (Math.random()-.5)*.07, dy: (Math.random()-.5)*.07,
      }));
    }

    function pt(o, t) { return { x: cx+o.rx*Math.sin(o.a*t+o.phase), y: cy+o.ry*Math.sin(o.b*t) }; }
    function rgba(c, a) { return 'rgba('+c[0]+','+c[1]+','+c[2]+','+a+')'; }

    function frame() {
      if (!mounted) return;
      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createRadialGradient(cx, cy*.7, 0, cx, cy, Math.hypot(W,H)*.6);
      bg.addColorStop(0, '#0A1232'); bg.addColorStop(1, '#040610');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      stars.forEach(s => {
        s.x = ((s.x+s.dx)+W)%W; s.y = ((s.y+s.dy)+H)%H;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.sz, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(100,140,230,'+s.a+')'; ctx.fill();
      });
      orbits.forEach(o => {
        ctx.beginPath();
        for (let i = 0; i <= 320; i++) { const p = pt(o,(i/320)*Math.PI*2); i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y); }
        ctx.closePath();
        ctx.strokeStyle = rgba(o.color, o.alpha*.22); ctx.lineWidth = 1; ctx.stroke();
      });
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 100);
      cg.addColorStop(0,'rgba(0,160,255,.08)'); cg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(cx, cy, 100, 0, Math.PI*2); ctx.fill();
      ctx.save();
      particles.forEach(p => {
        p.t += p.spd;
        const o = orbits[p.oi], pos = pt(o, p.t);
        ctx.shadowBlur = 16; ctx.shadowColor = rgba(o.color, 1);
        ctx.beginPath(); ctx.arc(pos.x, pos.y, p.sz, 0, Math.PI*2);
        ctx.fillStyle = rgba(o.color, o.alpha); ctx.fill();
      });
      ctx.restore();
      rafId = requestAnimationFrame(frame);
    }

    function start() { if (rafId) cancelAnimationFrame(rafId); resize(); frame(); }
    const ro = new ResizeObserver(start);
    ro.observe(canvas.parentElement);
    start();
    return () => { mounted = false; ro.disconnect(); cancelAnimationFrame(rafId); };
  }, []);

  /* Fibonacci spiral feature dot canvas */
  useEffect(() => {
    const canvas = featureRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, rafId, dots = [];
    let mounted = true;
    const palettes = [[0,220,255],[0,220,255],[0,220,255],[128,96,240],[255,185,48]];

    function resize() {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = Math.round(W*devicePixelRatio); canvas.height = Math.round(H*devicePixelRatio);
      ctx.scale(devicePixelRatio, devicePixelRatio);
      dots = Array.from({length:500}, (_,i) => {
        const angle = (i/500)*Math.PI*2*8;
        const r = (Math.sqrt(i/500)*.44+.04)*Math.min(W,H);
        const jitter = (Math.random()-.5)*.07*Math.min(W,H);
        const c = palettes[Math.floor(Math.random()*palettes.length)];
        return { x: W/2+r*Math.cos(angle)+jitter, y: H/2+r*Math.sin(angle)+jitter, sz: .8+Math.random()*1.8, a: .22+Math.random()*.6, c, ph: Math.random()*Math.PI*2, spd: .004+Math.random()*.012 };
      });
    }

    function frame() {
      if (!mounted) return;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#040610'; ctx.fillRect(0,0,W,H);
      const cg = ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,W*.42);
      cg.addColorStop(0,'rgba(0,100,200,.09)'); cg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle = cg; ctx.fillRect(0,0,W,H);
      dots.forEach(d => {
        d.ph += d.spd;
        const a = d.a*(.65+.35*Math.sin(d.ph));
        ctx.beginPath(); ctx.arc(d.x,d.y,d.sz,0,Math.PI*2);
        ctx.fillStyle = 'rgba('+d.c[0]+','+d.c[1]+','+d.c[2]+','+a+')'; ctx.fill();
      });
      ctx.font = '10px "Space Mono", monospace';
      ctx.fillStyle = 'rgba(100,140,200,.55)';
      ctx.fillText('3,300+ features · one 3.5-min test', 14, H-14);
      rafId = requestAnimationFrame(frame);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);
    resize();
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) rafId = requestAnimationFrame(frame);
    else { frame(); cancelAnimationFrame(rafId); }
    return () => { mounted = false; ro.disconnect(); cancelAnimationFrame(rafId); };
  }, []);

  /* Scroll reveal + stat counters */
  useEffect(() => {
    const FPS = 60, frames = Math.round(1400/1000*FPS);
    function ease(t) { return 1-Math.pow(1-t,3); }
    function animate(el, target, suffix) {
      let f = 0;
      const id = setInterval(() => {
        f++;
        const v = Math.round(ease(f/frames)*target);
        el.textContent = (target>=1000?v.toLocaleString():v)+(suffix||'');
        if (f>=frames) { el.textContent=(target>=1000?target.toLocaleString():target)+(suffix||''); clearInterval(id); }
      }, 1000/FPS);
    }
    const counterIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.querySelectorAll('.a4l-counter, .a4l-ip-counter').forEach(el => animate(el, +el.dataset.target, el.dataset.suffix||''));
        counterIO.unobserve(e.target);
      });
    }, { threshold: .3 });
    document.querySelectorAll('.a4l-page .a4l-stats-grid, .a4l-page .a4l-ip-grid').forEach(g => counterIO.observe(g));

    const revealIO = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); } });
    }, { threshold: .1 });
    document.querySelectorAll('.a4l-page .a4l-reveal').forEach(e => revealIO.observe(e));

    return () => { counterIO.disconnect(); revealIO.disconnect(); };
  }, []);

  return (
    <div className="a4l-page">

      {/* HERO */}
      <section className="a4l-hero" aria-label="Hero">
        <canvas ref={phaseRef} className="a4l-phase-canvas" aria-hidden="true" />
        <div className="a4l-inner a4l-hero-content">
          <div className="a4l-hero-eyebrow">Cardiovascular data platform · Analytics 4 Life, Inc.</div>
          <div>
            <span className="a4l-bignum"><span className="n">3,300</span></span>
            <span className="a4l-numtag">cardiovascular features mapped.<br />One platform. Built for what comes next.</span>
          </div>
          <div className="a4l-hero-rule" aria-hidden="true" />
          <div className="a4l-hero-row">
            <p className="a4l-hero-desc">
              A decade of research. 10,000+ patients. 95+ patents.{' '}
              <strong>Now available to partners building the next generation of cardiovascular products.</strong>
            </p>
            <div className="a4l-hero-actions">
              <a href="#a4l-contact" className="a4l-btn-p">Explore partnership →</a>
              <a href="#a4l-science" className="a4l-btn-g">The science</a>
            </div>
          </div>
        </div>
      </section>

      {/* ECG signal divider */}
      <div className="a4l-sig-div" aria-hidden="true">
        <svg viewBox="0 0 1200 44" preserveAspectRatio="none" fill="none">
          <polyline
            points="0,22 120,22 150,10 170,34 190,8 210,36 230,22 260,22 280,14 300,30 320,22 500,22 520,14 540,30 560,22 700,22 720,10 740,36 760,22 900,22 920,18 940,26 960,22 1200,22"
            stroke="rgba(0,200,255,0.18)" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* INTRO */}
      <section className="a4l-intro" id="a4l-intro">
        <div className="a4l-inner">
          <div className="a4l-reveal">
            <div className="a4l-slabel">What we built</div>
            <h2 className="a4l-intro-h2">The world's most precise cardiovascular feature map.<br />Built for discovery. Ready for <em>partnership.</em></h2>
          </div>
          <div className="a4l-reveal" style={{transitionDelay:'.1s'}}>
            <div className="a4l-intro-body">
              <p>We capture OVG and PPG simultaneously at 8,000 Hz — reconstructing each heartbeat as a 3D geometric object and extracting 3,300+ cardiovascular features per test from a resting fingertip sensor.</p>
              <p>The result is one of the world's leading databases of high-fidelity, synchronous multimodal cardiovascular data. Growing with every deployment. Validated against invasive reference standards. <strong>Proven in FDA-cleared applications</strong> and protected by <strong>95+ patents across 40+ invention families</strong>.</p>
              <p>Whether you're training models on cardiovascular phenotypes, developing a monitoring device that needs a precision calibration reference, or building consumer health products with real physiological depth — this is the foundation that accelerates development by years.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PIPELINE */}
      <section className="a4l-pipeline" id="a4l-science">
        <div className="a4l-inner">
          <div className="a4l-slabel a4l-reveal">The technology stack — from signal to intelligence</div>
          <div className="a4l-pipeline-steps a4l-reveal" style={{transitionDelay:'.08s'}}>
            {/* Step 01 */}
            <div className="a4l-step">
              <div className="a4l-step-num">01</div>
              <svg className="a4l-step-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                <rect x="2" y="23" width="44" height="2" fill="rgba(0,200,255,.1)" rx="1"/>
                <polyline points="2,24 8,24 12,13 16,32 20,10 24,38 28,16 32,30 36,24 44,24 46,24" fill="none" stroke="#00C8FF" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"/>
              </svg>
              <div className="a4l-step-title">Dual-modal signal capture</div>
              <div className="a4l-step-body">OVG and PPG recorded simultaneously from a resting fingertip sensor. 8,000 Hz. 270 heartbeats. The highest-resolution cardiovascular biosignal capture outside a catheterization lab.</div>
              <div className="a4l-step-metric">
                <div className="a4l-step-mval">8,000 Hz</div>
                <div className="a4l-step-mlabel">sampling rate · 160× clinical ECG</div>
              </div>
            </div>
            {/* Step 02 */}
            <div className="a4l-step">
              <div className="a4l-step-num">02</div>
              <svg className="a4l-step-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                <ellipse cx="24" cy="24" rx="16" ry="9" stroke="#7050E0" strokeWidth="1.2" strokeDasharray="3 2"/>
                <ellipse cx="24" cy="24" rx="9" ry="16" stroke="#7050E0" strokeWidth="1.2" strokeDasharray="3 2"/>
                <circle cx="24" cy="24" r="2.5" fill="#7050E0" opacity=".7"/>
                <circle cx="34" cy="18" r="2" fill="#00C8FF" opacity=".9"/>
                <circle cx="14" cy="30" r="2" fill="#FFB030" opacity=".9"/>
              </svg>
              <div className="a4l-step-title">Phase-space reconstruction</div>
              <div className="a4l-step-body">Each heartbeat becomes a 3D geometric object via Cardiac Phase Space Tomography (CPST). The orbit shape simultaneously encodes electrical, mechanical, and hemodynamic variables.</div>
              <div className="a4l-step-metric">
                <div className="a4l-step-mval">270 beats</div>
                <div className="a4l-step-mlabel">reconstructed per test</div>
              </div>
            </div>
            {/* Step 03 */}
            <div className="a4l-step">
              <div className="a4l-step-num">03</div>
              <svg className="a4l-step-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                <circle cx="24" cy="10" r="4.5" fill="none" stroke="#FFB030" strokeWidth="1.4"/>
                <circle cx="10" cy="36" r="4.5" fill="none" stroke="#FFB030" strokeWidth="1.2"/>
                <circle cx="38" cy="36" r="4.5" fill="none" stroke="#FFB030" strokeWidth="1.2"/>
                <line x1="24" y1="14.5" x2="13.5" y2="31.5" stroke="#FFB030" strokeWidth="1" opacity=".45"/>
                <line x1="24" y1="14.5" x2="34.5" y2="31.5" stroke="#FFB030" strokeWidth="1" opacity=".45"/>
                <line x1="14.5" y1="36" x2="33.5" y2="36" stroke="#FFB030" strokeWidth="1" opacity=".45"/>
                <circle cx="20" cy="23" r="1.8" fill="#FFB030" opacity=".6"/>
                <circle cx="28" cy="23" r="1.8" fill="#FFB030" opacity=".6"/>
              </svg>
              <div className="a4l-step-title">Feature extraction + AI training</div>
              <div className="a4l-step-body">3,300+ features extracted per orbit. Models trained on 10,000+ patients with invasive reference labels. The same feature map that drives FDA-cleared diagnostics — available to partners as a development platform.</div>
              <div className="a4l-step-metric">
                <div className="a4l-step-mval">3,300+</div>
                <div className="a4l-step-mlabel">cardiovascular features per test</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERSHIP APPLICATIONS */}
      <section className="a4l-stake" id="a4l-partner">
        <div className="a4l-inner">
          <div className="a4l-reveal">
            <div className="a4l-slabel">Who we work with</div>
            <h2 className="a4l-stake-h2">The same map.<br /><em>Countless applications.</em></h2>
          </div>
          <div className="a4l-stake-grid a4l-reveal" style={{transitionDelay:'.08s'}}>
            <div className="a4l-stake-col">
              <div className="a4l-stake-name"><div className="a4l-stake-dot" />Consumer health &amp; wearables</div>
              <div className="a4l-stake-items">
                <div className="a4l-stake-item"><strong>Cardiovascular intelligence for the wrist</strong>Your device captures biosignals. We tell you what they mean — indicators no current wearable has mapped.</div>
                <div className="a4l-stake-item"><strong>Longitudinal health tracking</strong>Day-over-day cardiovascular trending that goes far beyond heart rate or SpO2.</div>
                <div className="a4l-stake-item"><strong>Precision calibration reference</strong>The CorVista capture platform provides a high-fidelity reference against which continuous monitoring devices can be calibrated and given real clinical grounding.</div>
              </div>
            </div>
            <div className="a4l-stake-col">
              <div className="a4l-stake-name"><div className="a4l-stake-dot" />Medical devices &amp; diagnostics</div>
              <div className="a4l-stake-items">
                <div className="a4l-stake-item"><strong>Build on FDA-validated IP</strong>Our feature map and 95+ patents can be the science behind your product. CorVista demonstrates what's possible.</div>
                <div className="a4l-stake-item"><strong>Monitoring applications</strong>Post-surgical, chronic disease, remote — the same phase-space precision that detects disease can track its course longitudinally.</div>
                <div className="a4l-stake-item"><strong>Accelerated development</strong>Skip years of regulatory navigation. We've already been there — and cleared three indications.</div>
              </div>
            </div>
            <div className="a4l-stake-col">
              <div className="a4l-stake-name"><div className="a4l-stake-dot" />Research &amp; clinical applications</div>
              <div className="a4l-stake-items">
                <div className="a4l-stake-item"><strong>Cardiovascular phenotyping</strong>The most precise non-invasive cardiovascular phenotyping available — for drug development, population studies, or biomarker discovery.</div>
                <div className="a4l-stake-item"><strong>Custom algorithm development</strong>3,300+ features, 10,000+ patients, invasive ground-truth labels. Train on our data or bring your own problem.</div>
                <div className="a4l-stake-item"><strong>Novel endpoint development</strong>Define and validate cardiovascular endpoints with measurement precision and a validation record regulators recognize.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IP BAND */}
      <section className="a4l-ip-band" id="a4l-ip">
        <div className="a4l-inner">
          <div className="a4l-reveal">
            <div className="a4l-slabel">Intellectual property</div>
            <h2 className="a4l-ip-h2"><em>95+ patents.</em><br />The deepest IP portfolio in cardiovascular AI.</h2>
            <p className="a4l-ip-sub">A portfolio spanning the full stack — from hardware sensing through mathematical transformation to AI diagnostics. It protects what we've built, and anchors what we can build with you.</p>
          </div>
          <div className="a4l-reveal" style={{transitionDelay:'.1s'}}>
            <div className="a4l-ip-grid">
              <div className="a4l-ip-cell">
                <div className="a4l-ip-val"><span className="a4l-ip-counter" data-target="95">0</span><sup>+</sup></div>
                <div className="a4l-ip-label">Patents<br />issued</div>
              </div>
              <div className="a4l-ip-cell">
                <div className="a4l-ip-val"><span className="a4l-ip-counter" data-target="90">0</span><sup>+</sup></div>
                <div className="a4l-ip-label">Patents<br />pending</div>
              </div>
              <div className="a4l-ip-cell">
                <div className="a4l-ip-val"><span className="a4l-ip-counter" data-target="40">0</span></div>
                <div className="a4l-ip-label">Invention<br />families</div>
              </div>
              <div className="a4l-ip-cell">
                <div className="a4l-ip-val"><span className="a4l-ip-counter" data-target="185">0</span><sup>+</sup></div>
                <div className="a4l-ip-label">Total patent<br />filings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="a4l-stats-band" id="a4l-data">
        <div className="a4l-inner">
          <div className="a4l-stats-top a4l-reveal">
            <h2 className="a4l-stats-h2">The numbers behind the map — and the dataset behind the numbers.</h2>
            <div className="a4l-slabel" style={{alignSelf:'flex-end'}}>Active research dataset · 2017–present</div>
          </div>
          <div className="a4l-stats-grid a4l-reveal" style={{transitionDelay:'.08s'}}>
            <div className="a4l-stat-cell">
              <div className="a4l-stat-val"><span className="a4l-counter" data-target="3300" data-suffix="+">0</span></div>
              <div className="a4l-stat-label">Cardiovascular features mapped</div>
            </div>
            <div className="a4l-stat-cell">
              <div className="a4l-stat-val"><span className="a4l-counter" data-target="8000" data-suffix=" Hz">0</span></div>
              <div className="a4l-stat-label">Signal sampling resolution</div>
            </div>
            <div className="a4l-stat-cell">
              <div className="a4l-stat-val"><span className="a4l-counter" data-target="270">0</span></div>
              <div className="a4l-stat-label">Heartbeats analyzed per test</div>
            </div>
            <div className="a4l-stat-cell">
              <div className="a4l-stat-val"><span className="a4l-counter" data-target="10000" data-suffix="+">0</span></div>
              <div className="a4l-stat-label">Patients in research dataset</div>
            </div>
            <div className="a4l-stat-cell">
              <div className="a4l-stat-val"><span className="a4l-counter" data-target="20" data-suffix="+">0</span></div>
              <div className="a4l-stat-label">Peer-reviewed publications</div>
            </div>
            <div className="a4l-stat-cell">
              <div className="a4l-stat-val"><span className="a4l-counter" data-target="3">0</span></div>
              <div className="a4l-stat-label">FDA-cleared disease indications</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE MAP */}
      <section className="a4l-map-band" id="a4l-map">
        <div className="a4l-inner">
          <div className="a4l-map-visual a4l-reveal">
            <canvas ref={featureRef} className="a4l-feature-canvas" aria-hidden="true" />
          </div>
          <div className="a4l-reveal" style={{transitionDelay:'.1s'}}>
            <div className="a4l-slabel">The structured data map</div>
            <h2 className="a4l-map-h2">Every feature the heart can express — <em>captured, structured, yours to build on.</em></h2>
            <div className="a4l-map-body">
              <p>The 3,300+ features span every domain: <strong>geometric</strong> properties of the phase-space orbit, <strong>spectral</strong> decomposition across frequency bands, <strong>temporal</strong> inter-beat dynamics, and <strong>morphological</strong> waveform metrics. No single feature predicts disease. The power is in the relationships — and the map is what makes finding them possible. For a partner, this is a decade of work you do not need to repeat.</p>
            </div>
            <div className="a4l-feature-list">
              <div className="a4l-feature-item">
                <div className="a4l-fidx">01</div>
                <div><div className="a4l-fname">Phase-space geometry</div><div className="a4l-fdesc">Orbital topology, curvature tensors, volumetric metrics of the reconstructed 3D attractor per heartbeat</div></div>
              </div>
              <div className="a4l-feature-item">
                <div className="a4l-fidx">02</div>
                <div><div className="a4l-fname">Spectral decomposition</div><div className="a4l-fdesc">Multi-band frequency analysis across OVG + PPG, harmonic ratios, power spectral density</div></div>
              </div>
              <div className="a4l-feature-item">
                <div className="a4l-fidx">03</div>
                <div><div className="a4l-fname">Inter-beat dynamics</div><div className="a4l-fdesc">Beat-to-beat variability, rhythm patterns, temporal clustering across all 270 heartbeats</div></div>
              </div>
              <div className="a4l-feature-item">
                <div className="a4l-fidx">04</div>
                <div><div className="a4l-fname">Waveform morphology</div><div className="a4l-fdesc">Peak amplitudes, inflection profiles, area metrics, derivative waveforms, peak-to-peak intervals</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PATIENT INSIGHT */}
      <section className="a4l-insight-band" id="a4l-insight">
        <div className="a4l-inner">
          <div className="a4l-reveal">
            <div className="a4l-slabel">Patient-level insight</div>
            <h2 className="a4l-insight-h2">From 3,300 features to a single patient's physiological signature.</h2>
            <p className="a4l-insight-body">The feature map isn't only a training asset. At test time, the system profiles each patient across six cardiovascular feature families — showing which domains drive the prediction and how the individual signature compares to reference populations. Two patients, same test, different stories.</p>
          </div>
          <div className="a4l-radar-row a4l-reveal" style={{transitionDelay:'.1s'}}>
            <A4LRadar patient={PT_A} patientLabel="Patient A" />
            <A4LRadar patient={PT_B} patientLabel="Patient B" />
          </div>
          <div className="a4l-radar-legend a4l-reveal" style={{transitionDelay:'.18s'}}>
            {[
              { color: 'rgba(255,176,48,.85)', label: 'True positive reference' },
              { color: 'rgba(0,210,100,.75)',  label: 'True negative reference' },
              { color: '#00C8FF',              label: 'Test patient' },
            ].map(({ color, label }) => (
              <div key={label} className="a4l-radar-legend-item">
                <svg width="28" height="10"><line x1="2" y1="5" x2="26" y2="5" stroke={color} strokeWidth="2.5" /></svg>
                {label}
              </div>
            ))}
          </div>
          <p className="a4l-insight-cite">Feature family profiles from PHLEX / PHGEX validation · Intelligence-Based Medicine, 2026</p>
        </div>
      </section>

      {/* MISSION */}
      <section className="a4l-mission">
        <div className="a4l-mission-bg" aria-hidden="true">A4L</div>
        <div className="a4l-inner">
          <div className="a4l-mission-content a4l-reveal">
            <div className="a4l-slabel">Why partner with us</div>
            <h2 className="a4l-mission-h2">What took a decade to build,<br />we can bring to your product <em>in months.</em></h2>
            <p className="a4l-mission-p">Building cardiovascular AI from scratch means years of data collection, signal processing research, algorithm development, and regulatory navigation. We have already done all of it.</p>
            <p className="a4l-mission-p">The A4L platform — 3,300 features, 95+ patents, a growing database that may be among the most comprehensive of its kind, three FDA-cleared algorithms — is a starting point. <strong>The question is what you want to build.</strong></p>
            <div style={{marginTop:40, display:'flex', gap:14, flexWrap:'wrap'}}>
              <a href="#a4l-corvista" className="a4l-btn-p">See what a partnership produces →</a>
              <a href="#a4l-ip" className="a4l-btn-g">IP portfolio</a>
            </div>
          </div>
        </div>
      </section>

      {/* CORVISTA PROOF OF CONCEPT */}
      <section className="a4l-cv-bridge" id="a4l-corvista">
        <div className="a4l-inner">
          <div className="a4l-reveal">
            <div className="a4l-slabel">Proof of concept</div>
            <h3 className="a4l-cv-h3">CorVista Health is what a partnership with A4L produces.</h3>
            <p className="a4l-cv-body">Three FDA-cleared AI algorithms. Deployed at the point of primary care. The same technology stack, the same feature map, the same IP — available to build on.</p>
            <button className="a4l-btn-g" style={{fontSize:13}} onClick={() => navTo('technology')}>See the CorVista platform →</button>
          </div>
          <div className="a4l-cv-inds a4l-reveal" style={{transitionDelay:'.1s'}}>
            <div className="a4l-slabel" style={{marginBottom:16}}>FDA-cleared algorithms built on A4L</div>
            <div className="a4l-cv-ind">
              <div className="a4l-cv-ind-dot" style={{background:'var(--cyan)'}} />
              <div className="a4l-cv-ind-name">Coronary Artery Disease (CAD)</div>
              <div className="a4l-cv-ind-status" style={{color:'var(--cyan)'}}>FDA Cleared</div>
            </div>
            <div className="a4l-cv-ind">
              <div className="a4l-cv-ind-dot" style={{background:'var(--violet)'}} />
              <div className="a4l-cv-ind-name">Pulmonary Hypertension (PH)</div>
              <div className="a4l-cv-ind-status" style={{color:'var(--violet)'}}>FDA Cleared</div>
            </div>
            <div className="a4l-cv-ind">
              <div className="a4l-cv-ind-dot" style={{background:'var(--amber)'}} />
              <div className="a4l-cv-ind-name">Heart Failure — Elevated PCWP</div>
              <div className="a4l-cv-ind-status" style={{color:'var(--amber)'}}>FDA Cleared</div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERSHIP CTA */}
      <section className="a4l-partner-cta" id="a4l-contact">
        <div className="a4l-inner">
          <div className="a4l-reveal">
            <div className="a4l-slabel">Work with us</div>
            <h2 className="a4l-pct-h2">Ready to explore a partnership?</h2>
            <p className="a4l-pct-sub">Consumer health, academic research, regulated medtech. Tell us what you're building — we'll connect you with the right people.</p>
          </div>
          <div className="a4l-pct-grid a4l-reveal" style={{transitionDelay:'.08s'}}>
            <div className="a4l-pct-card">
              <div className="a4l-pct-cat">Consumer health &amp; wearables</div>
              <p className="a4l-pct-desc">A4L's feature map offers signal depth no current wearable uses. The CorVista capture platform can also serve as a calibration reference for continuous monitoring devices.</p>
              <a href="mailto:info@corvista.com?subject=Partnership%20inquiry%3A%20Consumer%20health%20%26%20wearables" className="a4l-pct-link">Start a conversation →</a>
            </div>
            <div className="a4l-pct-card">
              <div className="a4l-pct-cat">Academic &amp; research institutions</div>
              <p className="a4l-pct-desc">Research collaboration, dataset access, co-developed study methodologies. The A4L team actively works with academic partners.</p>
              <a href="mailto:info@corvista.com?subject=Research%20collaboration%20inquiry" className="a4l-pct-link">Research inquiry →</a>
            </div>
            <div className="a4l-pct-card">
              <div className="a4l-pct-cat">Medtech &amp; regulated healthcare</div>
              <p className="a4l-pct-desc">IP licensing, co-development, and algorithm services built on a patent portfolio and FDA clearance record that takes years to replicate from scratch.</p>
              <a href="mailto:info@corvista.com?subject=IP%20licensing%20and%20partnership%20inquiry" className="a4l-pct-link">Licensing inquiry →</a>
            </div>
          </div>
          <div className="a4l-pct-contact a4l-reveal" style={{transitionDelay:'.16s'}}>
            <span className="a4l-pct-contact-label">Contact the A4L research team directly:</span>
            <a href="mailto:info@corvista.com" className="a4l-pct-contact-email">info@corvista.com</a>
          </div>
        </div>
      </section>

    </div>
  );
}
