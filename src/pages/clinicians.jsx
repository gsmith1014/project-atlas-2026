import React from 'react';
import { Eyebrow, Section, SectionHeader, ImgPh, Btn, Stat, NavA, navTo } from '../components.jsx';

export function CliniciansPage() {
  return (
    <div className="page-fade" data-screen-label="03 Clinicians" data-page="clinicians">
      <div className="subhero">
        <div className="container">
          <Eyebrow>For Clinicians</Eyebrow>
          <h1 style={{ marginTop: 28 }}>
            A better first <span className="em">answer</span> — without the wait.
          </h1>
          <p className="lead">
            Get a physician-reviewed report back in minutes. Move confidently into next steps, or rule out disease without a downstream referral.
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 36, flexWrap: 'wrap' }}>
            <NavA to="contact" className="btn btn-primary">Request a demo<span className="arrow">→</span></NavA>
            <NavA to="evidence" className="btn btn-ghost">See the evidence<span className="arrow">→</span></NavA>
          </div>
        </div>
      </div>

      <Section>
        <SectionHeader eyebrow="The workflow" title="Fits the way you already work." />
        <div className="row row-2" style={{ gridTemplateColumns: '1fr 1.5fr', gap: 64 }}>
          <ImgPh label="CorVista in clinic — workflow shot" ratio="3/4" />
          <div className="row" style={{ gap: 0 }}>
            {[
              { n: '01', t: 'Identify candidates', c: 'Symptomatic patients with chest discomfort, dyspnea, or unexplained fatigue.' },
              { n: '02', t: 'Order from your EHR', c: 'CorVista is a billable test like any other front-line cardiovascular study. CPT codes available on request.' },
              { n: '03', t: 'Apply the sensor', c: 'A medical assistant places the non-invasive sensors. The acquisition takes 220 seconds at rest.' },
              { n: '04', t: 'Review the report', c: 'A physician-reviewed report delievered to your portal — typically within minutes — with disease scores predictive of potential disease and recommended next steps.' },
            ].map(s => (
              <div key={s.n} style={{ padding: '24px 0', borderTop: '1px solid var(--rule)', display: 'grid', gridTemplateColumns: '80px 1fr', gap: 32, alignItems: 'start' }}>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--mid)', letterSpacing: '0.14em' }}>{s.n}</div>
                <div>
                  <h4 style={{ fontSize: 22, letterSpacing: '-0.01em' }}>{s.t}</h4>
                  <p style={{ marginTop: 8, color: 'var(--fg-muted)', maxWidth: '52ch' }}>{s.c}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section dark>
        <SectionHeader eyebrow={<span style={{ color: '#98A2B3' }}>What it changes</span>} title={<span style={{ color: '#F4F6F9' }}>Better triage. Fewer false negatives.</span>} />
        <div className="row row-3">
          <Stat label="Cath lab yield vs SPECT" value="+21" unit="%" desc="More patients sent to cath have obstructive disease." />
          <Stat label="CAD pathway cost" value="−32" unit="%" desc="Avoids unnecessary downstream testing and admissions." />
          <Stat label="PH total cost of care" value="−44" unit="%" desc="Identifies pulmonary hypertension earlier in the workup." />
        </div>
      </Section>

      <Section>
        <div className="row row-2" style={{ gap: 64 }}>
          <div className="card" style={{ padding: 48 }}>
            <Eyebrow>From a cardiologist</Eyebrow>
            <p className="quote" style={{ marginTop: 24, fontSize: 'clamp(22px, 2.2vw, 32px)' }}>
              I've already seen it help identify a 99% LAD blockage after a previously normal stress test — enabling us to immediately refer the patient for life-saving catheterization.
            </p>
            <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--rule)' }}>
              <div style={{ fontWeight: 500 }}>Tracy Neal, MD</div>
              <div className="meta" style={{ marginTop: 4 }}>Cardiology</div>
            </div>
          </div>
          <div className="card" style={{ padding: 48 }}>
            <Eyebrow>From a PH specialist</Eyebrow>
            <p className="quote" style={{ marginTop: 24, fontSize: 'clamp(22px, 2.2vw, 32px)' }}>
              I can't emphasize the importance of early diagnosis enough. This technology has the potential to really improve the time from symptoms to diagnosis.
            </p>
            <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--rule)' }}>
              <div style={{ fontWeight: 500 }}>Vallerie V. McLaughlin, MD</div>
              <div className="meta" style={{ marginTop: 4 }}>Director, Pulmonary Hypertension Program</div>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Implementation" title="A program your team can stand up in weeks." />
        <div className="row row-4">
          {[
            { t: 'Reimbursement', c: 'Coverage paths under category codes today. CorVista guides billing setup and documentation.' },
            { t: 'Training', c: '90-minute virtual onboarding for medical assistants. No technologist required.' },
            { t: 'Hardware', c: 'Capture device ships in 48 hours. The tablet and electrodes are provided. No capex.' },
            { t: 'Support', c: 'Dedicated clinical account manager.' },
          ].map(s => (
            <div key={s.t} style={{ borderTop: '1px solid var(--ink)', paddingTop: 20 }}>
              <h5>{s.t}</h5>
              <p style={{ marginTop: 12, color: 'var(--fg-muted)', fontSize: 14 }}>{s.c}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 64, display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <NavA to="contact" className="btn btn-primary">Request a demo<span className="arrow">→</span></NavA>
          <NavA to="evidence" className="btn btn-ghost">Read the evidence<span className="arrow">→</span></NavA>
        </div>
      </Section>
    </div>
  );
}
