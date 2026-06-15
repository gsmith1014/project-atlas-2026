import React from 'react';
import { Eyebrow, Section, SectionHeader, ImgPh, Btn, Stat, NavA, EcgLine, navTo } from '../components.jsx';

export function TechnologyPage() {
  return (
    <div className="page-fade" data-screen-label="02 Technology" data-page="technology">
      <div className="subhero">
        <div className="container">
          <Eyebrow>Technology</Eyebrow>
          <h1 style={{ marginTop: 28 }}>
            From signal to <span className="em">diagnosis</span>, in minutes.
          </h1>
          <p className="lead">
            The CorVista System captures resting biosignals and runs them through AI algorithms trained on tens of thousands of patient cases — producing physician-grade insights without radiation, contrast, or stress.
          </p>
        </div>
      </div>

      <Section>
        <SectionHeader eyebrow="How it works" title="A four-step pathway." />
        <div className="row row-4">
          {[
            { n: '01', t: 'Non-invasive sensors', c: 'FDA-cleared electrical and blood flow sensors acquire 220 seconds of resting cardiovascular biosignals — no exercise, no contrast, no radiation.' },
            { n: '02', t: 'Cardiac Phase Tomography', c: 'Signals are reconstructed into a 3D phase-space representation of the heart\'s electrical and mechanical activity.' },
            { n: '03', t: 'AI analysis', c: 'Models trained on tens of thousands of paired cases (cath, echo, RHC, MRI) generate predictive disease scores.' },
            { n: '04', t: 'Physician report', c: 'Cloud-based reporting delivers patient results in minutes.' },
          ].map(s => (
            <div key={s.n} style={{ borderTop: '1px solid var(--ink)', paddingTop: 24 }}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--mid)', letterSpacing: '0.14em' }}>{s.n}</div>
              <h4 style={{ marginTop: 14, letterSpacing: '-0.01em' }}>{s.t}</h4>
              <p style={{ marginTop: 12, fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.5 }}>{s.c}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section dark>
        <div className="row row-2" style={{ gridTemplateColumns: '1fr 1.2fr', gap: 80, alignItems: 'center' }}>
          <div>
            <Eyebrow><span style={{ color: '#98A2B3' }}>The science</span></Eyebrow>
            <h2 style={{ color: '#F4F6F9', marginTop: 20, fontSize: 'clamp(40px, 5vw, 72px)' }}>
              Cardiac Phase Space Tomography.
            </h2>
            <p className="lead" style={{ color: '#C8D0DC', marginTop: 24 }}>
              CPST is a mathematical reconstruction technique: rather than analyzing waveforms in time, it reconstructs the heart's behavior across multiple dimensions of state space — revealing structural and functional patterns that conventional ECG and front-line tests cannot resolve.
            </p>
            <ul className="bullets" style={{ marginTop: 32 }}>
              <li>Patented signal reconstruction across 12+ dimensions</li>
              <li>Trained against gold-standard truth labels (angiography, RHC, MRI)</li>
              <li>Continuously validated through real-world deployment</li>
            </ul>
          </div>
          <div style={{ position: 'relative' }}>
            <ImgPh label="Phase-space visualization (3D)" ratio="1/1" dark />
            <div style={{ position: 'absolute', bottom: 16, right: 16, fontFamily: 'var(--f-mono)', fontSize: 11, color: '#F4F6F9', letterSpacing: '0.14em', textTransform: 'uppercase', background: '#0B1320', padding: '6px 10px', border: '1px solid #25324A' }}>
              FIG. 02 — CPST RECONSTRUCTION
            </div>
          </div>
        </div>
        <div style={{ marginTop: 80, paddingTop: 40, borderTop: '1px solid #1F2A3D' }}>
          <EcgLine color="#5BAFE8" height={80} segments={10} />
        </div>
      </Section>

      <Section>
        <div className="row row-2" style={{ gridTemplateColumns: '1fr 1.4fr', gap: 80 }}>
          <div>
            <Eyebrow>One scan, three answers</Eyebrow>
            <h2 style={{ marginTop: 20, fontSize: 'clamp(36px, 4.4vw, 64px)' }}>
              What the CorVista System measures.
            </h2>
          </div>
          <div className="row row-3" style={{ gap: 0 }}>
            {[
              { slug: 'tech-cad', eyebrow: 'CAD', label: 'Coronary artery disease', desc: 'Functionally significant obstructive coronary disease in stable, symptomatic patients.', metric: 'Sensitivity 88% · Specificity 51% · NPV 99%' },
              { slug: 'tech-ph', eyebrow: 'PH', label: 'Pulmonary hypertension', desc: 'Elevated pulmonary artery pressure consistent with PH — at the front line of care.', metric: 'Sensitivity 82% · Specificity 92% · NPV >99%' },
              { slug: 'tech-pcwp', eyebrow: 'PCWP', label: 'Pulmonary Capillary Wedge Pressure', desc: 'Increased wedge pressure, consistent with heart failure with preserved ejection fraction.', metric: 'Sensitivity 82% · Specificity 83% · NPV >99%' },
            ].map((m, i) => (
              <NavA key={i} to={m.slug} className={`disease-card${i === 0 ? ' first' : ''}`}>
                <div className="chip chip-blue">{m.eyebrow}</div>
                <h4 style={{ marginTop: 18, fontSize: 22 }}>{m.label}</h4>
                <p style={{ marginTop: 12, color: 'var(--fg-muted)', fontSize: 14, lineHeight: 1.5 }}>{m.desc}</p>
                <div className="meta" style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--rule)' }}>{m.metric}</div>
                <div className="explore">Explore {m.eyebrow}<span className="arrow">{'→'}</span></div>
              </NavA>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="The workflow" title="Fewer tests. Earlier answers. Lower cost." />
        <p className="lead" style={{ maxWidth: '64ch', marginTop: -8 }}>
          The conventional cardiovascular workup is a relay of referrals — each test scheduled, performed, and read on its own timeline. CorVista collapses that relay into a single resting capture that returns a physician-reviewed answer where care begins.
        </p>
        <div className="row row-2" style={{ gap: 28, marginTop: 56, alignItems: 'stretch' }}>
          <div className="compare-col before">
            <div className="meta" style={{ letterSpacing: '0.12em', textTransform: 'uppercase' }}>The conventional workup</div>
            <h4 style={{ marginTop: 14, fontSize: 26 }}>Weeks, and several stops.</h4>
            {[
              ['Multiple appointments', 'Stress test, imaging, echo, specialist referral — each a separate visit.'],
              ['Radiation & contrast', 'SPECT and CCTA carry ionizing radiation or contrast load.'],
              ['Days to weeks of delay', 'Scheduling and reading queues stretch the path to a decision.'],
              ['Costly downstream testing', 'Low-yield catheterizations and redundant studies pile up.'],
            ].map(([t, c], i) => (
              <div key={i} className="compare-row">
                <span style={{ color: 'var(--mid-2)', fontFamily: 'var(--f-mono)', fontSize: 12, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span>
                <div><strong style={{ fontWeight: 600 }}>{t}.</strong> <span style={{ color: 'var(--fg-muted)' }}>{c}</span></div>
              </div>
            ))}
          </div>
          <div className="compare-col after">
            <div className="meta" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5BAFE8' }}>With CorVista</div>
            <h4 style={{ marginTop: 14, fontSize: 26, color: '#F4F6F9' }}>One scan. Minutes.</h4>
            {[
              ['A single resting capture', '220 seconds at rest — no exercise, no contrast, no radiation.'],
              ['Decision at the point of care', 'The first answer arrives in the same visit the patient presents.'],
              ['Physician-ready report in minutes', 'Disease probability scores and recommended next steps in the portal.'],
              ['Right test, right patient', 'Rule out without referral, or send the right patients downstream.'],
            ].map(([t, c], i) => (
              <div key={i} className="compare-row">
                <span style={{ color: '#5BAFE8', fontFamily: 'var(--f-mono)', fontSize: 12, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span>
                <div><strong style={{ fontWeight: 600, color: '#F4F6F9' }}>{t}.</strong> <span style={{ color: '#C8D0DC' }}>{c}</span></div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section dark>
        <div className="row row-2" style={{ gridTemplateColumns: '1fr 1.3fr', gap: 80, alignItems: 'start' }}>
          <div>
            <Eyebrow><span style={{ color: '#98A2B3' }}>The economics</span></Eyebrow>
            <h2 style={{ color: '#F4F6F9', marginTop: 20, fontSize: 'clamp(34px, 4vw, 56px)' }}>
              Reducing costs throughout the <span style={{ color: '#5BAFE8' }}>pathway</span>, while improving care.
            </h2>
            <p className="lead" style={{ color: '#C8D0DC', marginTop: 24 }}>
              Savings come from doing less of what doesn't help: fewer low-yield catheterizations, fewer redundant scans, and far less time spent waiting for an answer the front line can now deliver. Earlier detection bends the long-tail cost of disease that goes unmanaged.
            </p>
            <ul className="bullets" style={{ marginTop: 32 }}>
              <li>Higher cath lab yield means fewer non-obstructive procedures</li>
              <li>Front-line rule-out avoids downstream imaging and admissions</li>
              <li>Earlier PH and HF detection prevents costly late-stage care</li>
            </ul>
          </div>
          <div className="row row-2" style={{ gap: 32 }}>
            <Stat label="PH total cost of care" value="−44" unit="%" desc="Reduction across the full care episode." />
            <Stat label="CAD diagnostic pathway" value="−32" unit="%" desc="Avoids downstream imaging and low-yield cath." />
            <Stat label="Per-test cost" value="~$1,200" unit="" desc="Versus $3,000–8,000 for typical downstream imaging." />
            <Stat label="Time to physician report" value="<8" unit="min" desc="Scan to signed result." />
          </div>
        </div>
      </Section>

      <Section>
        <div className="row row-2" style={{ gridTemplateColumns: '1fr 1.2fr', gap: 80, alignItems: 'center' }}>
          <div>
            <Eyebrow>The performance numbers</Eyebrow>
            <h2 style={{ marginTop: 20, fontSize: 'clamp(34px, 4vw, 56px)' }}>
              Validated. Peer-reviewed. Deployed.
            </h2>
            <p className="lead" style={{ marginTop: 24 }}>
              CorVista has been validated against gold-standard truth labels — cardiac catheterization for CAD, right-heart catheterization for PH and PCWP — across 20,000+ patients and 40+ clinical sites.
            </p>
            <NavA to="evidence" className="btn btn-ghost" style={{ marginTop: 32, display: 'inline-flex' }}>
              See the full evidence base<span className="arrow">→</span>
            </NavA>
          </div>
          <div className="row row-3" style={{ gap: 0 }}>
            {[
              { abbr: 'CAD', sens: '88%', spec: '51%', npv: '99%' },
              { abbr: 'PH', sens: '82%', spec: '92%', npv: '>99%' },
              { abbr: 'PCWP', sens: '82%', spec: '83%', npv: '>99%' },
            ].map((m) => (
              <div key={m.abbr} style={{ padding: '28px 0', borderTop: '1px solid var(--rule)' }}>
                <div className="chip chip-blue" style={{ marginBottom: 18 }}>{m.abbr}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {[['Sens.', m.sens], ['Spec.', m.spec], ['NPV', m.npv]].map(([k, v]) => (
                    <div key={k}>
                      <div className="meta">{k}</div>
                      <div style={{ fontFamily: 'var(--f-sans)', fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--blue-deep)', marginTop: 4 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
