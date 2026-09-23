import React, { useState } from 'react';
import { EcgLine, Btn, Stat, Eyebrow, Section, SectionHeader, Marquee, NavA, navTo } from '../components.jsx';
import { CountUp } from '../hooks.jsx';
import heroImg from '/hero-clinician.jpg';
import tracyImg from '/tracy-neal.jpg';

function HeroEditorial() {
  return (
    <div className="hero">
      <div className="container">
        <div className="hero-eyebrow">
          <Eyebrow>FDA-cleared cardiopulmonary diagnostic</Eyebrow>
          <span className="tag">CorVista® System</span>
        </div>
        <div className="hero-grid" style={{ gridTemplateColumns: '1.3fr 1fr', gap: 64 }}>
          <div>
            <h1 className="hero-title">
              Chest pain.<br />
              Breathlessness.<br />
              Fatigue.<br />
              <span className="em">Answered.</span>
            </h1>
            <p className="lead" style={{ marginTop: 36, maxWidth: '48ch' }}>
              Three of the most common — and most ambiguous — presentations in primary care. Each could signal CAD, pulmonary hypertension, or heart failure. CorVista assesses all three from a single 3.5-minute resting capture. No radiation, no contrast, no referral needed.
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 40, flexWrap: 'wrap' }}>
              <Btn variant="primary" onClick={() => navTo('contact')}>Request a demo</Btn>
              <Btn variant="ghost" onClick={() => navTo('technology')}>See how it works</Btn>
            </div>
          </div>
          <div>
            <img src={heroImg} alt="Clinician using CorVista with patient at point of care" style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block', borderRadius: 4 }} />
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

function Hero() {
  return <HeroEditorial />;
}

export function HomePage({ tweaks }) {
  const [active, setActive] = useState('cad');
  const conditions = {
    cad: {
      label: 'Coronary artery disease',
      eyebrow: 'CAD',
      blurb: 'Detect obstructive coronary disease without exercise stress, radiation, or contrast — using only resting signals and the CorVista algorithm.',
      stats: [
        { label: 'Diagnostic cost', value: '−32', unit: '%' },
        { label: 'Cath lab yield', value: '+21', unit: '%' },
      ]
    },
    ph: {
      label: 'Pulmonary hypertension',
      eyebrow: 'PH',
      blurb: 'Identify pulmonary hypertension earlier in the diagnostic journey — before it progresses and care costs compound.',
      stats: [
        { label: 'Total cost of care', value: '−44', unit: '%' },
        { label: 'Average diagnostic delay today', value: '2.5', unit: 'yrs' },
      ]
    },
    lvef: {
      label: 'Heart Failure',
      eyebrow: 'PCWP',
      blurb: 'Test for increased pulmonary capillary wedge pressure in primary care — finding heart failure long before symptoms force a hospitalization.',
      stats: [
        { label: 'HF patients undiagnosed', value: '~50', unit: '%' },
        { label: 'Echo wait time today', value: '4–8', unit: 'wks' },
      ]
    }
  };
  const c = conditions[active];

  return (
    <div className="page-fade" data-screen-label="01 Home" data-page="home">
      <Hero />

      <Marquee items={[
        '99% NPV for CAD', '>99% NPV for PH', '>99% NPV for PCWP',
        'FDA-cleared · 3 indications', 'Breakthrough Designated',
        '10,000+ patients validated', '20+ peer-reviewed publications',
        '3.5 minutes · first-visit answer', '−44% PH cost of care',
        '+21% cath yield vs SPECT', '40+ active clinical sites',
      ]} />

      {/* Problem stats section */}
      <section className="section section-dark" style={{ paddingBlock: 'var(--section-y)' }}>
        <div className="container">
          <Eyebrow><span style={{ color: '#98A2B3' }}>The problem</span></Eyebrow>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap', marginTop: 20 }}>
            <h2 style={{ color: '#F4F6F9', fontSize: 'clamp(32px, 4vw, 52px)', maxWidth: '28ch', lineHeight: 1.15 }}>
              Timely diagnosis — not treatment — is the <span className="serif-i" style={{ color: 'var(--blue)' }}>bottleneck</span>.
            </h2>
            <p style={{ color: '#98A2B3', fontSize: 15, maxWidth: '42ch', lineHeight: 1.6 }}>
              Today the first physician a patient sees still has little more than a stethoscope and an ECG. The cardiac workup has not kept pace with the burden of disease.
            </p>
          </div>
        </div>
        <div className="prob-grid">
          {[
            { num: 1, suffix: '', prefix: '#', label: 'Heart disease is the leading cause of death in the U.S.', source: 'CDC Heart Disease Facts' },
            { num: 22, suffix: 'M', prefix: '', label: 'Americans live in counties with no practicing cardiologist.', source: 'Khan et al., Cardiology deserts in the U.S.' },
            { num: 32.7, decimals: 1, suffix: '', prefix: '', unit: 'days', label: 'Average wait to see a cardiologist after referral.', source: 'AMN Healthcare, 2025 Physician Appointment Survey' },
            { num: 2.26, decimals: 2, suffix: '', prefix: '', unit: 'yrs', label: 'Median delay from unexplained dyspnea to PAH diagnosis.', source: 'JACC Advances, PAH diagnostic delay literature' },
          ].map((s, i) => (
            <div key={i} className="prob-tile">
              <div className="prob-num">
                {s.prefix}<CountUp end={s.num} decimals={s.decimals || 0} duration={1600} />
                {s.unit && <span style={{ fontSize: '0.38em', verticalAlign: 'middle', marginLeft: 4, fontWeight: 700 }}>{s.unit}</span>}
                {s.suffix && <span style={{ fontSize: '0.55em', verticalAlign: 'super', fontWeight: 700 }}>{s.suffix}</span>}
              </div>
              <div className="prob-label">{s.label}</div>
              <div className="prob-source">{s.source}</div>
            </div>
          ))}
        </div>
      </section>

      <Section>
        <div className="row row-2" style={{ gridTemplateColumns: '1fr 1.4fr', alignItems: 'start', gap: 80 }}>
          <div>
            <Eyebrow>What we built</Eyebrow>
          </div>
          <div>
            <h2 style={{ fontSize: 'clamp(36px, 4.8vw, 72px)' }}>
              A non-invasive test that <span className="serif-i" style={{ color: 'var(--blue-deep)' }}>sees</span> what front-line cardiopulmonary diagnostics miss.
            </h2>
            <p className="lead" style={{ marginTop: 36, fontSize: 'clamp(18px, 1.6vw, 22px)' }}>
              The CorVista® System combines non-invasive signal sensors, a cloud-based AI analysis engine, and a physician-grade report. The result: a fast, comprehensive, accurate first answer about a patient's cardiopulmonary health — delivered where care begins.
            </p>
            <div className="row row-3" style={{ marginTop: 56 }}>
              <div>
                <Eyebrow>01</Eyebrow>
                <h5 style={{ marginTop: 12 }}>Acquire</h5>
                <p style={{ marginTop: 8, color: 'var(--fg-muted)', fontSize: 14, lineHeight: 1.5 }}>A 3.5-minute resting signal capture using non-invasive sensors.</p>
              </div>
              <div>
                <Eyebrow>02</Eyebrow>
                <h5 style={{ marginTop: 12 }}>Analyze</h5>
                <p style={{ marginTop: 8, color: 'var(--fg-muted)', fontSize: 14, lineHeight: 1.5 }}>Three dimensional data and AI-based algorithms generate unique scores, predictive of disease.</p>
              </div>
              <div>
                <Eyebrow>03</Eyebrow>
                <h5 style={{ marginTop: 12 }}>Act</h5>
                <p style={{ marginTop: 8, color: 'var(--fg-muted)', fontSize: 14, lineHeight: 1.5 }}>Physician-reviewed report returns to the clinician's portal in minutes.</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

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
          <div className="condition-tabs" style={{ display: 'flex', gap: 0 }}>
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
        <div className="row row-2 condition-content" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 56, gap: 56 }}>
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

      <Section>
        <SectionHeader
          eyebrow="Where to start"
          title="Find what you came for."
          action={<NavA to="contact" className="btn btn-ghost">Contact us<span className="arrow">→</span></NavA>}
        />
        <div className="row row-3" style={{ gap: 0, borderTop: '1px solid var(--rule)' }}>
          {[
            ['clinicians', 'For Clinicians', 'Integrate CorVista into your front-line workup. Request a demo, train staff, view reports.'],
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

      <Section>
        <div className="row row-2" style={{ gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <img src={tracyImg} alt="Tracy Neal, MD" style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block', borderRadius: 4 }} />
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

      <div className="container">
        <div style={{ marginBottom: 32 }}>
          <Eyebrow>As seen in</Eyebrow>
        </div>
      </div>
      <div className="press-grid">
        {['Fierce MedTech', 'Cardiovascular Bus.', 'DeviceTalks', 'TIME Magazine', 'Forbes', 'AI in Healthcare'].map(p => (
          <div key={p} className="press-cell">{p}</div>
        ))}
      </div>

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
