import React from 'react';
import { Eyebrow, Section, SectionHeader, ImgPh, Btn, Stat, NavA, navTo } from '../components.jsx';

const RESTART_SVG = (
  <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
  </svg>
);

const SOC_PHASES = [
  { n: '01', label: 'CAD Workup', time: '2–6 weeks per cycle', restart: 'Negative → restart for PH' },
  { n: '02', label: 'PH Workup', time: '2–6 more weeks', restart: 'Negative → restart for HFpEF' },
  { n: '03', label: 'HFpEF Workup', time: '2–6 more weeks', restart: null },
];

function WorkflowComparison() {
  return (
    <div>
      <div className="row row-2" style={{ gap: 24, alignItems: 'stretch' }}>

        {/* SOC Column */}
        <div className="compare-col before">
          <div className="meta" style={{ textTransform: 'uppercase', letterSpacing: '0.12em' }}>Standard of care</div>
          <h4 style={{ marginTop: 12, fontSize: 22, letterSpacing: '-0.01em' }}>Sequential — months to diagnosis.</h4>

          {SOC_PHASES.map(phase => (
            <div key={phase.n} className="compare-row" style={{ alignItems: 'start' }}>
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--mid)', letterSpacing: '0.12em', paddingTop: 3 }}>{phase.n}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{phase.label}</div>
                <div style={{ fontSize: 12, color: 'var(--coral)', fontWeight: 600, marginTop: 3 }}>{phase.time}</div>
                {phase.restart && (
                  <div style={{ marginTop: 6, fontSize: 12, color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    {RESTART_SVG} {phase.restart}
                  </div>
                )}
              </div>
            </div>
          ))}

          <div style={{ marginTop: 20, padding: '14px 16px', background: 'var(--card)', border: '1px solid var(--rule)', borderRadius: 6, borderLeft: '3px solid var(--coral)' }}>
            <div style={{ fontFamily: 'var(--f-sans)', fontSize: 28, fontWeight: 700, color: 'var(--coral)', letterSpacing: '-0.02em' }}>50%</div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4 }}>of patients lost to follow-up between referral cycles</div>
          </div>

          <div style={{ marginTop: 10, padding: '12px 14px', border: '1px solid var(--rule)', borderRadius: 6, fontSize: 13, fontWeight: 600, color: 'var(--coral)' }}>
            Months of delays — often no diagnosis
          </div>
        </div>

        {/* CorVista Column */}
        <div className="compare-col after">
          <div className="meta" style={{ textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--blue)' }}>With CorVista</div>
          <h4 style={{ marginTop: 12, fontSize: 22, letterSpacing: '-0.01em', color: '#F4F6F9' }}>Comprehensive answers — same visit.</h4>

          <div className="compare-row" style={{ alignItems: 'start' }}>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--blue)', letterSpacing: '0.12em', paddingTop: 3 }}>01</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: '#F4F6F9' }}>CorVista Study</div>
              <div style={{ fontSize: 12, color: 'var(--blue)', fontWeight: 600, marginTop: 3 }}>Single non-invasive capture — 3.7 minutes</div>
            </div>
          </div>

          <div className="compare-row" style={{ display: 'block', paddingTop: 20 }}>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: '#98A2B3', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Simultaneous results</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                { abbr: 'CAD', full: 'Coronary artery disease' },
                { abbr: 'PH', full: 'Pulmonary hypertension' },
                { abbr: 'HFpEF', full: 'Heart failure (preserved EF)' },
              ].map(t => (
                <div key={t.abbr} style={{ background: 'rgba(91,175,232,.1)', border: '1px solid rgba(91,175,232,.2)', borderRadius: 6, padding: '10px 8px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--f-sans)', fontSize: 13, fontWeight: 700, color: 'var(--blue)' }}>{t.abbr}</div>
                  <div style={{ fontSize: 10, color: '#98A2B3', marginTop: 3, lineHeight: 1.3 }}>{t.full}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 20, padding: '12px 14px', background: 'rgba(43,196,138,.08)', border: '1px solid rgba(43,196,138,.25)', borderRadius: 6, color: 'var(--green-cv)', fontSize: 13, fontWeight: 600 }}>
            Targeted next step — same visit
          </div>
        </div>

      </div>
      <p className="wf-footnote">Workflow representation is directional. Individual institution timelines may vary.</p>
    </div>
  );
}

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
        <SectionHeader eyebrow="The serial testing problem" title="One study. Three answers." />
        <WorkflowComparison />
      </Section>

      <Section>
        <SectionHeader eyebrow="Real-world impact" title="What standard workup missed — CorVista caught." />
        <div className="case-grid">
          {[
            {
              pub: 'JACC: Case Reports · 2025',
              patient: '75-year-old woman — atrial fibrillation, worsening dyspnea, fatigue, and palpitations',
              outcome: '6 years of missed diagnosis resolved with one test',
              before: { label: 'Standard workup', text: 'Three echocardiograms, all negative for PH. Six years of evaluation, equivocal stress test — workup pointing toward coronary disease.' },
              cv: { label: 'CorVista PH test', text: 'Returned positive (LR+ 10.3), prompting right heart catheterization. mPAP 35 mmHg · PCWP 31 mmHg · No significant CAD confirmed.' },
              dx: 'Group 2 PH / HFpEF — referred to PH specialist, started on SGLT2 inhibitor',
              cite: 'Aben R, Burton T, Fathieh F, et al. J Am Coll Cardiol Case Rep. 2025;30(26):104876.',
            },
            {
              pub: 'European Heart Journal — Case Reports · 2026',
              patient: '63-year-old man — exertional chest pain, multiple risk factors, family history of CAD',
              outcome: '3 negative standard-of-care tests — severe multivessel CAD still found',
              before: { label: 'Standard workup', text: 'Pretest risk 35–44%. Normal echocardiogram, negative SPECT nuclear perfusion — no indication for catheterization.' },
              cv: { label: 'CorVista CAD test', text: 'Score 0.20, positive — sent to catheterization. 80% LAD · 2× 80% LCX · Subtotal RCA occlusion. Four lesions stented.' },
              dx: 'Severe multivessel CAD — balanced ischemia that three prior tests missed, four lesions stented',
              cite: 'Alkhawam M, et al. European Heart Journal — Case Reports. 2026;10(2):ytag016.',
            },
          ].map((c, i) => (
            <div key={i} className="case-card">
              <div className="case-head">
                <div className="case-head-eyebrow">Case study · Published {c.pub}</div>
                <div className="case-head-title">{c.patient}</div>
              </div>

              <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--rule)' }}>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--green-cv)', marginBottom: 6 }}>Outcome</div>
                <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.35 }}>{c.outcome}</div>
              </div>

              {[
                { ...c.before, mono: 'var(--mid)', fg: 'var(--fg-muted)' },
                { ...c.cv, mono: 'var(--blue-deep)', fg: 'var(--fg)' },
              ].map((row, j) => (
                <div key={j} style={{ padding: '14px 24px', borderBottom: '1px solid var(--rule)', display: 'grid', gridTemplateColumns: '110px 1fr', gap: 16, alignItems: 'start' }}>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: row.mono, lineHeight: 1.4, paddingTop: 2 }}>{row.label}</div>
                  <div style={{ fontSize: 14, color: row.fg, lineHeight: 1.55 }}>{row.text}</div>
                </div>
              ))}

              <div style={{ padding: '14px 24px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="var(--green-cv)" style={{ marginTop: 2, flexShrink: 0 }} aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.5 }}>{c.dx}</span>
              </div>

              <div className="case-cite">{c.cite}</div>
            </div>
          ))}
        </div>
      </Section>

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
