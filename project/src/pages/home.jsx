/* global React, EcgLine, ImgPh, Btn, Stat, Eyebrow, Section, SectionHeader, Marquee, NavA, navTo */

const { useState: useStateHome } = React;

// ============================================================
// HERO VARIANTS — three explorations toggled via Tweaks panel
// ============================================================

function HeroEditorial({ tweaks }) {
  // Editorial: huge mixed grotesk + serif italic, image on right, ECG underline
  return (
    <div className="hero">
      <div className="container">
        <div className="hero-eyebrow">
          <Eyebrow>FDA-cleared cardiovascular diagnostic</Eyebrow>
          <span className="tag">CorVista® System</span>
        </div>
        <div className="hero-grid" style={{ gridTemplateColumns: '1.55fr 1fr', gap: 56 }}>
          <div>
            <h1 className="hero-title">
              Find heart<br />
              disease <span className="em">earlier.</span><br />
              At the point<br />
              of care.
            </h1>
            <p className="lead" style={{ marginTop: 36, maxWidth: '46ch' }}>
              CorVista is the world's most comprehensive front-line cardiovascular test. One non-invasive scan. Three conditions. Results in minutes — without radiation, contrast, or stress.
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 40, flexWrap: 'wrap' }}>
              <Btn variant="primary" onClick={() => navTo('contact')}>Request a demo</Btn>
              <Btn variant="ghost" onClick={() => navTo('technology')}>See how it works</Btn>
            </div>
          </div>
          <div>
            <ImgPh label="Hero — clinician + patient" ratio="4/5" />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--mid)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              <span>FIG. 01</span>
              <span>Point-of-care testing</span>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 60 }}>
          <EcgLine height={50} />
        </div>
      </div>
    </div>
  );
}

function HeroSplit({ tweaks }) {
  // Split: light left (copy), dark right (visual + stats)
  return (
    <div className="hero-split">
      <div className="hero-split-left">
        <div className="hero-eyebrow">
          <Eyebrow>FDA-cleared</Eyebrow>
          <span className="tag">CorVista® System</span>
        </div>
        <div>
          <h1 className="hero-title" style={{ fontSize: 'clamp(46px, 6.2vw, 96px)' }}>
            A new <span className="em">front line</span><br />
            for cardiovascular<br />
            care.
          </h1>
          <p className="lead" style={{ marginTop: 28, maxWidth: '44ch' }}>
            One non-invasive test. Three conditions: coronary artery disease, pulmonary hypertension, and reduced left-ventricular ejection fraction. Results in minutes.
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 36, flexWrap: 'wrap' }}>
            <Btn variant="primary" onClick={() => navTo('contact')}>Request a demo</Btn>
            <Btn variant="ghost" onClick={() => navTo('evidence')}>Read the evidence</Btn>
          </div>
        </div>
      </div>
      <div className="hero-split-right" style={{ color: '#F4F6F9' }}>
        <div>
          <div className="eyebrow" style={{ color: '#98A2B3' }}>
            <span className="dot"></span>Clinical impact
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 56 }}>
            <Stat label="PH costs" value="−44" unit="%" desc="Reduction in pulmonary hypertension diagnostic & care costs." />
            <Stat label="CAD pathway" value="−32" unit="%" desc="Reduction in CAD diagnostic pathway cost." />
            <Stat label="Cath lab yield" value="+21" unit="%" desc="Improvement vs SPECT." />
            <Stat label="Time to result" value="<8" unit="min" desc="From scan to physician-reviewed report." />
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <EcgLine color="#5BAFE8" height={64} />
          <div style={{ marginTop: 14, fontFamily: 'var(--f-mono)', fontSize: 11, color: '#98A2B3', letterSpacing: '0.14em', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>
            <span>Lead I · 25 mm/s</span>
            <span>CorVista signal acquisition</span>
          </div>
        </div>
        <div className="ring" style={{ width: 520, height: 520, right: -180, bottom: -180 }}></div>
        <div className="ring" style={{ width: 320, height: 320, right: -80, bottom: -80 }}></div>
      </div>
    </div>
  );
}

function HeroDataViz({ tweaks }) {
  // Bold statement + giant single stat
  return (
    <div className="hero" style={{ paddingBottom: 80 }}>
      <div className="container">
        <div className="hero-eyebrow">
          <Eyebrow>The CorVista® System</Eyebrow>
          <span className="tag">FDA-cleared · CAD · PH · LVEF</span>
        </div>
        <h1 className="hero-title" style={{ fontSize: 'clamp(56px, 9.2vw, 168px)', marginBottom: 56 }}>
          The most comprehensive<br />
          <span className="em">front-line</span> cardiovascular<br />
          test ever built.
        </h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 64, alignItems: 'end' }}>
          <div>
            <p className="lead" style={{ maxWidth: '56ch' }}>
              CorVista finds disease that other front-line tests miss — quickly, safely, and without sending patients down expensive pathways for answers we can deliver in minutes.
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 36, flexWrap: 'wrap' }}>
              <Btn variant="primary" onClick={() => navTo('contact')}>Request a demo</Btn>
              <Btn variant="link" onClick={() => navTo('evidence')}>50+ peer-reviewed publications</Btn>
            </div>
          </div>
          <div style={{ borderLeft: '1px solid var(--rule)', paddingLeft: 32 }}>
            <Stat label="Reduction in PH diagnostic costs" value="−44" unit="%" big />
            <div className="meta" style={{ marginTop: 16 }}>
              Source: CorVista Health analysis of total cost of care, 2025.
            </div>
          </div>
        </div>
        <div style={{ marginTop: 72 }}>
          <EcgLine height={52} />
        </div>
      </div>
    </div>
  );
}

function HeroPatient({ tweaks }) {
  // Patient-led — full-bleed image with title overlay
  return (
    <div className="hero" style={{ padding: 0, position: 'relative' }}>
      <div style={{ position: 'relative', minHeight: '76vh', background: 'var(--ink)', color: '#F4F6F9', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <ImgPh label="Patient portrait — full bleed" ratio="auto" style={{ width: '100%', height: '100%', borderRadius: 0, border: 0 }} dark />
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: 96, paddingBottom: 80, minHeight: '76vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="hero-eyebrow">
            <Eyebrow><span style={{ color: '#98A2B3' }}>Why CorVista</span></Eyebrow>
          </div>
          <div>
            <h1 className="hero-title" style={{ color: '#F4F6F9', fontSize: 'clamp(48px, 7.6vw, 132px)', maxWidth: '14ch' }}>
              Half of all<br />
              heart attacks happen<br />
              <span className="em" style={{ color: '#5BAFE8' }}>without warning.</span>
            </h1>
            <p className="lead" style={{ color: '#C8D0DC', maxWidth: '50ch', marginTop: 28 }}>
              CorVista is changing that — bringing comprehensive cardiovascular testing into every primary care office, in the first conversation about chest pain.
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 36, flexWrap: 'wrap' }}>
              <Btn variant="primary" onClick={() => navTo('patients')}>For patients</Btn>
              <Btn variant="ghost" onClick={() => navTo('technology')}>See the science</Btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero({ tweaks }) {
  const v = tweaks.heroVariant;
  if (v === 'split') return <HeroSplit tweaks={tweaks} />;
  if (v === 'dataviz') return <HeroDataViz tweaks={tweaks} />;
  if (v === 'patient') return <HeroPatient tweaks={tweaks} />;
  return <HeroEditorial tweaks={tweaks} />;
}

// ============================================================
// PAGE — HOME
// ============================================================

function HomePage({ tweaks }) {
  const [active, setActive] = useStateHome('cad');
  const conditions = {
    cad: {
      label: 'Coronary artery disease',
      eyebrow: 'CAD',
      blurb: 'Detect obstructive coronary disease without exercise stress, radiation, or contrast — using only resting signals and the CorVista algorithm.',
      stats: [
        { label: 'Diagnostic cost', value: '−32', unit: '%' },
        { label: 'Cath lab yield', value: '+21', unit: '%' },
        { label: 'Patients ineligible for stress', value: '60', unit: '%' },
      ]
    },
    ph: {
      label: 'Pulmonary hypertension',
      eyebrow: 'PH',
      blurb: 'Identify pulmonary hypertension earlier in the diagnostic journey — before it progresses and care costs compound.',
      stats: [
        { label: 'Total cost of care', value: '−44', unit: '%' },
        { label: 'Average diagnostic delay today', value: '2.5', unit: 'yrs' },
        { label: 'Right-heart cath avoided', value: '1 in 3', unit: '' },
      ]
    },
    lvef: {
      label: 'Heart Failure',
      eyebrow: 'PCWP',
      blurb: 'Test for increased pulmonary capillary wedge pressure in primary care — finding heart failure long before symptoms force a hospitalization.',
      stats: [
        { label: 'HF patients undiagnosed', value: '~50', unit: '%' },
        { label: 'Echo wait time today', value: '4–8', unit: 'wks' },
        { label: 'In-office decision', value: '<8', unit: 'min' },
      ]
    }
  };
  const c = conditions[active];

  return (
    <div className="page-fade" data-screen-label="01 Home" data-page="home">
      <Hero tweaks={tweaks} />

      {/* Marquee — clinical credentials */}
      <Marquee items={[
        'FDA-cleared', 'CE-marked (EU)', 'Health Canada', '50+ peer-reviewed publications',
        'CAD · PH · PCWP', 'TCT · AHA · ACC', 'No radiation', 'No contrast'
      ]} />

      {/* What is CorVista? Block */}
      <Section>
        <div className="row row-2" style={{ gridTemplateColumns: '1fr 1.4fr', alignItems: 'start', gap: 80 }}>
          <div>
            <Eyebrow>What we built</Eyebrow>
          </div>
          <div>
            <h2 style={{ fontSize: 'clamp(36px, 4.8vw, 72px)' }}>
              A non-invasive scan that <span className="serif-i" style={{ color: 'var(--blue-deep)' }}>sees</span> what front-line cardiovascular tests miss.
            </h2>
            <p className="lead" style={{ marginTop: 36, fontSize: 'clamp(18px, 1.6vw, 22px)' }}>
              The CorVista® System combines a wearable signal sensor, a cloud-based AI inference engine, and a physician-grade report. The result: a fast, comprehensive, accurate first answer about a patient's cardiovascular health — delivered where care begins.
            </p>
            <div className="row row-3" style={{ marginTop: 56 }}>
              <div>
                <Eyebrow>01</Eyebrow>
                <h5 style={{ marginTop: 12 }}>Acquire</h5>
                <p style={{ marginTop: 8, color: 'var(--fg-muted)', fontSize: 14, lineHeight: 1.5 }}>A 220-second resting signal capture using a single-use wearable sensor.</p>
              </div>
              <div>
                <Eyebrow>02</Eyebrow>
                <h5 style={{ marginTop: 12 }}>Analyze</h5>
                <p style={{ marginTop: 8, color: 'var(--fg-muted)', fontSize: 14, lineHeight: 1.5 }}>Phase-space tomography and machine-learned algorithms generate disease probability scores.</p>
              </div>
              <div>
                <Eyebrow>03</Eyebrow>
                <h5 style={{ marginTop: 12 }}>Act</h5>
                <p style={{ marginTop: 8, color: 'var(--fg-muted)', fontSize: 14, lineHeight: 1.5 }}>Physician-reviewed report returns to the clinician's portal — usually in under eight minutes.</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Conditions — large interactive tabs */}
      <Section dark>
        <div className="section-header" style={{ alignItems: 'flex-end' }}>
          <div>
            <Eyebrow>One scan. Three answers.</Eyebrow>
            <h2 style={{ marginTop: 18, color: '#F4F6F9', fontSize: 'clamp(40px, 5vw, 80px)' }}>
              Built for the conditions<br /> that hide in plain sight.
            </h2>
          </div>
          <NavA to="evidence" className="btn btn-ghost">See the clinical evidence<span className="arrow">→</span></NavA>
        </div>
        <div style={{ borderTop: '1px solid #1F2A3D', borderBottom: '1px solid #1F2A3D' }}>
          <div style={{ display: 'flex', gap: 0 }}>
            {Object.entries(conditions).map(([k, v]) => (
              <button
                key={k}
                onClick={() => setActive(k)}
                style={{
                  flex: 1, padding: '24px 28px',
                  background: active === k ? '#131C2C' : 'transparent',
                  color: active === k ? '#F4F6F9' : '#98A2B3',
                  border: 0, borderRight: '1px solid #1F2A3D',
                  textAlign: 'left', cursor: 'pointer',
                  transition: 'background 200ms, color 200ms',
                  fontFamily: 'var(--f-sans)',
                  position: 'relative'
                }}>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: active === k ? '#5BAFE8' : '#6B7280' }}>{v.eyebrow}</div>
                <div style={{ fontSize: 20, marginTop: 8, letterSpacing: '-0.01em' }}>{v.label}</div>
                {active === k && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: '#5BAFE8' }}></div>}
              </button>
            ))}
          </div>
        </div>
        <div className="row row-2" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 56, gap: 56 }}>
          <div>
            <p className="lead" style={{ color: '#C8D0DC', fontSize: 24, lineHeight: 1.4 }}>{c.blurb}</p>
            <NavA to="technology" style={{ marginTop: 32, display: 'inline-block' }} className="ilink">How the system works  →</NavA>
          </div>
          <div className="row row-3" style={{ gap: 24 }}>
            {c.stats.map((s, i) => (
              <div key={i} style={{ borderTop: '1px solid #1F2A3D', paddingTop: 20 }}>
                <div className="stat-label">{s.label}</div>
                <div className="stat-num" style={{ fontSize: 'clamp(44px, 5vw, 76px)', color: '#F4F6F9' }}>
                  {s.value}{s.unit && <span className="unit">{s.unit}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Pathfinder tiles */}
      <Section>
        <SectionHeader
          eyebrow="Where to start"
          title="Find what you came for."
          action={<NavA to="contact" className="btn btn-ghost">Contact us<span className="arrow">→</span></NavA>}
        />
        <div className="row row-3" style={{ gap: 0, borderTop: '1px solid var(--rule)' }}>
          {[
            ['clinicians', 'For Clinicians', 'Integrate CorVista into your front-line workup. Order kits, train staff, view reports.'],
            ['patients', 'For Patients', 'Understand what a CorVista test is, what to expect, and how to ask your doctor.'],
            ['evidence', 'Clinical Evidence', 'Peer-reviewed publications, real-world data, and regulatory milestones.'],
          ].map(([slug, title, copy]) => (
            <NavA key={slug} to={slug} className="tile" style={{ borderTop: 0 }}>
              <span className="tile-arrow">↗</span>
              <Eyebrow>{slug === 'clinicians' ? 'For clinicians' : slug === 'patients' ? 'For patients' : 'Evidence'}</Eyebrow>
              <h4 style={{ marginTop: 20, fontSize: 28, lineHeight: 1.15 }}>{title}</h4>
              <p style={{ marginTop: 16 }}>{copy}</p>
            </NavA>
          ))}
        </div>
      </Section>

      {/* Quote */}
      <Section>
        <div className="row row-2" style={{ gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <ImgPh label="Tracy Neal, MD — portrait" ratio="3/4" />
          <div>
            <Eyebrow>From the field</Eyebrow>
            <p className="quote" style={{ marginTop: 28 }}>
              CorVista represents a shift in how we diagnose cardiovascular disease — enabling earlier detection in patients who might otherwise slip through the cracks.
            </p>
            <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--rule)' }}>
              <div style={{ fontWeight: 500, fontSize: 16 }}>Tracy Neal, MD</div>
              <div className="meta" style={{ marginTop: 4 }}>Practicing cardiologist · CorVista user since 2024</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Press logos */}
      <div className="container">
        <div style={{ marginBottom: 32 }}>
          <Eyebrow>In the news</Eyebrow>
        </div>
      </div>
      <div className="press-grid">
        {['Fierce MedTech', 'Cardiovascular Bus.', 'DeviceTalks', 'Medical Device Network', 'Forbes', 'AI in Healthcare'].map(p => (
          <div key={p} className="press-cell">{p}</div>
        ))}
      </div>

      {/* CTA banner */}
      <Section dark>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 40 }}>
          <div style={{ maxWidth: '24ch' }}>
            <Eyebrow><span style={{ color: '#98A2B3' }}>Get started</span></Eyebrow>
            <h2 style={{ color: '#F4F6F9', marginTop: 20, fontSize: 'clamp(40px, 5vw, 84px)' }}>
              Bring CorVista to <span className="serif-i" style={{ color: '#5BAFE8' }}>your</span> practice.
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <NavA to="contact" className="btn btn-primary">Request a demo<span className="arrow">→</span></NavA>
            <NavA to="evidence" className="btn btn-ghost">Read the evidence<span className="arrow">→</span></NavA>
          </div>
        </div>
      </Section>
    </div>
  );
}

Object.assign(window, { HomePage, Hero });
