import React, { useEffect, useRef } from 'react';
import { navTo } from '../components.jsx';
import './a4l.css';

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
              A decade of research. 3,300+ physiological features validated against invasive ground truth in 10,000+ patients. 95+ patents protecting the IP.{' '}
              <strong>Analytics for Life built the world's most comprehensive cardiovascular feature map — and now we're bringing it to partners who want to build the next generation of cardiovascular applications.</strong>
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
              <p>Standard diagnostics capture a fraction of what the cardiovascular system communicates. We went deeper — capturing oscilloimpedance (OVG) and photoplethysmography (PPG) simultaneously at 8,000 Hz, reconstructing each heartbeat as a 3D geometric object in phase space, and extracting 3,300+ features per test.</p>
              <p>The result is the most precise non-invasive cardiovascular dataset ever assembled — validated against invasive reference standards, proven in <strong>FDA-cleared clinical applications</strong>, and protected by <strong>95+ patents across 40+ invention families</strong>.</p>
              <p>Whether you're building a consumer wellness product, a medical monitoring device, or a clinical research platform, this is the data infrastructure that can accelerate your development by years.</p>
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
              <div className="a4l-step-body">OVG and PPG recorded simultaneously from a resting fingertip sensor. 8,000 Hz across both channels. 270 heartbeats per test, every waveform timestamped to microsecond precision. The highest-resolution cardiovascular biosignal capture outside a catheterization lab.</div>
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
              <div className="a4l-step-body">Each heartbeat is transformed from a time-domain waveform into a 3D geometric object via Cardiac Phase Space Tomography (CPST). The orbit shape simultaneously encodes electrical, mechanical, and hemodynamic cardiovascular variables.</div>
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
              <div className="a4l-step-body">3,300+ geometric and spectral features extracted per orbit. Machine learned models trained on 10,000+ patients with invasive reference standards. The same feature map that drives FDA-cleared diagnostics is available as a development platform for partners.</div>
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
                <div className="a4l-stake-item"><strong>Cardiovascular intelligence for the wrist</strong>Your device captures biosignals. We tell you what they mean — from resting hemodynamics to cardiovascular indicators that no current wearable has mapped. If you're building for sport or daily wellness, there's signal here you're not yet using.</div>
                <div className="a4l-stake-item"><strong>Longitudinal health tracking</strong>Our feature map enables day-over-day cardiovascular trending that goes far beyond heart rate or SpO2 — the kind of depth that changes how consumers understand their own health over time.</div>
                <div className="a4l-stake-item"><strong>Population-level research</strong>Interested in cardiovascular phenotyping at scale? A partnership with A4L provides the feature vocabulary and the IP to build meaningful cardiovascular intelligence into consumer products.</div>
              </div>
            </div>
            <div className="a4l-stake-col">
              <div className="a4l-stake-name"><div className="a4l-stake-dot" />Medical devices &amp; diagnostics</div>
              <div className="a4l-stake-items">
                <div className="a4l-stake-item"><strong>Build on FDA-validated IP</strong>If you're developing a monitoring or diagnostic device, our cardiovascular feature map — and the 95+ patents protecting it — can be the science behind your product. CorVista demonstrates what's possible.</div>
                <div className="a4l-stake-item"><strong>Monitoring applications</strong>Post-surgical monitoring, chronic disease management, remote patient monitoring — the same phase-space technology that detects disease can track its course longitudinally with precision unavailable elsewhere.</div>
                <div className="a4l-stake-item"><strong>Accelerated development</strong>Our 95+ patents and 20+ peer-reviewed publications create a credentialed starting point. Partner with a team that has already navigated cardiovascular AI through regulatory clearance.</div>
              </div>
            </div>
            <div className="a4l-stake-col">
              <div className="a4l-stake-name"><div className="a4l-stake-dot" />Research &amp; clinical applications</div>
              <div className="a4l-stake-items">
                <div className="a4l-stake-item"><strong>Cardiovascular phenotyping</strong>The most precise non-invasive cardiovascular phenotyping available. For drug development programs, population studies, or biomarker discovery that requires measuring cardiovascular physiology at a depth standard diagnostics cannot reach.</div>
                <div className="a4l-stake-item"><strong>Custom algorithm development</strong>Build ML models on the most feature-rich cardiovascular dataset ever assembled: 3,300+ features, 10,000+ patients, invasive ground-truth labels. Train on our data or bring your own problem.</div>
                <div className="a4l-stake-item"><strong>Novel endpoint development</strong>Define and validate cardiovascular endpoints for clinical trials. Our feature map offers measurement precision — and the validation record — that positions novel endpoints for regulatory acceptance.</div>
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
            <p className="a4l-ip-sub">A decade of algorithmic innovation, signal processing research, and clinical validation has produced a patent portfolio that covers the full stack — from hardware sensing through mathematical transformation to AI-driven diagnostics. This IP is both a moat and a partnership asset: it protects what we've built, and anchors what we can build with you.</p>
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
            <h2 className="a4l-stats-h2">The numbers behind the map.</h2>
            <div className="a4l-slabel" style={{alignSelf:'flex-end'}}>Research dataset · 2017–2025</div>
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
              <p>The 3,300+ features span every domain of cardiovascular physiology. <strong>Geometric features</strong> of the phase-space orbit — topology, curvature, volume, trajectory. <strong>Spectral features</strong> across frequency bands. <strong>Temporal features</strong> characterizing inter-beat dynamics. <strong>Morphological features</strong> of raw waveforms.</p>
              <p>No single feature predicts disease or describes health. The power is in the relationships — how features cluster, correlate, and combine in a patient population. Machine learning finds those relationships. The map is what makes training on them possible. For a partner, this is a decade of work you do not need to repeat.</p>
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

      {/* MISSION */}
      <section className="a4l-mission">
        <div className="a4l-mission-bg" aria-hidden="true">A4L</div>
        <div className="a4l-inner">
          <div className="a4l-mission-content a4l-reveal">
            <div className="a4l-slabel">Why partner with us</div>
            <h2 className="a4l-mission-h2">What took a decade to build,<br />we can bring to your product <em>in months.</em></h2>
            <p className="a4l-mission-p">Building cardiovascular intelligence from scratch requires years of clinical study design, data collection, signal processing research, algorithm development, and regulatory navigation. We have already done all of it.</p>
            <p className="a4l-mission-p">The A4L cardiovascular feature map is not a finished product — <strong>it is a platform</strong>. The 3,300 features, the 95+ patents, the 10,000-patient dataset, the FDA-cleared algorithms: all of these are starting points for what a partnership with A4L can produce. The question is what you want to build.</p>
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
            <p className="a4l-cv-body">CorVista Health is the first product built on the A4L cardiovascular data platform — three FDA-cleared AI algorithms for the most common cardiovascular diseases, deployed at the point of primary care. The same technology stack, the same feature map, the same IP. Available to build on.</p>
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
            <p className="a4l-pct-sub">The A4L research team works with organizations across consumer health, academic research, and regulated medtech. Whether your interest is in collaboration, dataset access, algorithm development, or IP licensing, reach out and we'll connect you with the right people.</p>
          </div>
          <div className="a4l-pct-grid a4l-reveal" style={{transitionDelay:'.08s'}}>
            <div className="a4l-pct-card">
              <div className="a4l-pct-cat">Consumer health &amp; wearables</div>
              <p className="a4l-pct-desc">Integrating cardiovascular intelligence into a fitness tracker, wellness app, or consumer biosensor? A4L's feature map offers a depth of physiological signal no current wearable uses. Let's talk about what that could mean for your product.</p>
              <a href="mailto:info@corvista.com?subject=Partnership%20inquiry%3A%20Consumer%20health%20%26%20wearables" className="a4l-pct-link">Start a conversation →</a>
            </div>
            <div className="a4l-pct-card">
              <div className="a4l-pct-cat">Academic &amp; research institutions</div>
              <p className="a4l-pct-desc">Collaborating on cardiovascular research, co-developing study methodologies, or seeking access to the cardiovascular feature dataset for a clinical or population study? The A4L team actively collaborates with academic partners.</p>
              <a href="mailto:info@corvista.com?subject=Research%20collaboration%20inquiry" className="a4l-pct-link">Research inquiry →</a>
            </div>
            <div className="a4l-pct-card">
              <div className="a4l-pct-cat">Medtech &amp; regulated healthcare</div>
              <p className="a4l-pct-desc">Developing a regulated monitoring or diagnostic device? A4L offers IP licensing, co-development partnerships, and algorithm development services built on a patent portfolio and FDA clearance record that takes years to replicate from scratch.</p>
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
