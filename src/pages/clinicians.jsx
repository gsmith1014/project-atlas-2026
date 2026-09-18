import React from 'react';
import { Eyebrow, Section, SectionHeader, ImgPh, Btn, Stat, NavA, navTo } from '../components.jsx';
import { useReveal, CountUp } from '../hooks.jsx';

const RESTART_SVG = (
  <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor" style={{ flexShrink: 0 }} aria-hidden="true">
    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
  </svg>
);

const SOC_PHASES = [
  {
    n: '01',
    label: 'CAD Workup',
    time: '6–8 weeks',
    detail: 'Stress testing — exercise ECG, nuclear imaging, or CT coronary angiography. Multiple specialist visits across several weeks.',
    restart: { to: 'PH workup', note: 'New referral cycle — new specialist — scheduling restarts from zero.' },
  },
  {
    n: '02',
    label: 'PH Workup',
    time: '6–8 more weeks',
    detail: 'Echocardiography, V/Q scan, and potentially right heart catheterization — requiring a separate specialist from the CAD workup.',
    restart: { to: 'heart failure workup', note: 'Third restart — often the last referral patients will attempt.' },
  },
  {
    n: '03',
    label: 'Heart Failure Workup',
    time: '6–8+ more weeks',
    detail: 'Stress echocardiography, cardiac MRI, or invasive hemodynamic testing — frequently the most time-consuming cycle to complete.',
    restart: null,
  },
];

function WorkflowComparison() {
  const [headerRef, headerVisible] = useReveal(0.25);

  return (
    <div>
      {/* Animated time header */}
      <div
        ref={headerRef}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 1,
          background: 'var(--rule)',
          border: '1px solid var(--rule)',
          borderRadius: 6,
          overflow: 'hidden',
          marginBottom: 28,
        }}
      >
        <div style={{ padding: '28px 32px', background: 'var(--card)' }}>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--coral)', marginBottom: 10 }}>Standard of care — best case</div>
          <div style={{ fontFamily: 'var(--f-sans)', fontSize: 56, fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--fg)', lineHeight: 1 }}>
            {headerVisible ? <CountUp end={24} suffix="+" duration={1200} /> : '0+'}
          </div>
          <div style={{ fontSize: 15, color: 'var(--fg-muted)', marginTop: 8, lineHeight: 1.4 }}>weeks before a complete cardiovascular differential under sequential workup</div>
        </div>
        <div style={{ padding: '28px 32px', background: 'var(--ink)' }}>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--blue)', marginBottom: 10 }}>With CorVista</div>
          <div style={{ fontFamily: 'var(--f-sans)', fontSize: 56, fontWeight: 700, letterSpacing: '-0.04em', color: '#F4F6F9', lineHeight: 1 }}>3.7</div>
          <div style={{ fontSize: 15, color: '#98A2B3', marginTop: 8, lineHeight: 1.4 }}>minutes — same visit, same capture, physician-reviewed report</div>
        </div>
      </div>

      <div className="row row-2" style={{ gap: 24, alignItems: 'stretch' }}>

        {/* SOC Column */}
        <div className="compare-col before">
          <div className="meta" style={{ textTransform: 'uppercase', letterSpacing: '0.12em' }}>Standard of care</div>
          <h4 style={{ marginTop: 10, fontSize: 20, letterSpacing: '-0.01em', lineHeight: 1.3 }}>Three separate workup cycles — each requiring a full restart on a negative result.</h4>

          {SOC_PHASES.map((phase, i) => (
            <React.Fragment key={phase.n}>
              <div className="compare-row" style={{ alignItems: 'start' }}>
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--mid)', letterSpacing: '0.12em', paddingTop: 3 }}>{phase.n}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 17 }}>{phase.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--coral)', fontWeight: 700, marginTop: 4, fontFamily: 'var(--f-mono)', letterSpacing: '0.04em' }}>{phase.time} per cycle</div>
                  <div style={{ fontSize: 14, color: 'var(--fg-muted)', marginTop: 6, lineHeight: 1.55 }}>{phase.detail}</div>
                </div>
              </div>

              {phase.restart && (
                <div style={{
                  marginLeft: 32,
                  marginTop: -4,
                  padding: '10px 14px',
                  background: 'rgba(216,85,40,.05)',
                  border: '1px solid rgba(216,85,40,.15)',
                  borderLeft: '3px solid var(--coral)',
                  borderRadius: 4,
                }}>
                  <div style={{ fontSize: 12, fontFamily: 'var(--f-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--coral)', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {RESTART_SVG} Workup restarts for {phase.restart.to}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.5 }}>{phase.restart.note}</div>
                </div>
              )}
            </React.Fragment>
          ))}

          {/* Dropout block */}
          <div style={{ marginTop: 24, padding: '20px', background: 'var(--card)', border: '1px solid var(--rule)', borderRadius: 6, borderLeft: '3px solid var(--coral)' }}>
            <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0 }}>
                <div style={{ fontFamily: 'var(--f-sans)', fontSize: 44, fontWeight: 700, color: 'var(--coral)', letterSpacing: '-0.04em', lineHeight: 1 }}>50%</div>
                <div style={{ fontSize: 11, fontFamily: 'var(--f-mono)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--coral)', marginTop: 3 }}>of patients</div>
              </div>
              <div style={{ paddingTop: 2 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg)', lineHeight: 1.35 }}>Lost to follow-up between referral cycles</div>
                <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 6, lineHeight: 1.6 }}>
                  Each restart gap is a period without diagnosis. Scheduling fatigue, insurance gaps, and the burden of repeated appointments all compound — while the underlying disease continues to progress untreated.
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 12, padding: '14px 16px', border: '1px solid rgba(216,85,40,.25)', borderRadius: 6, fontSize: 14, fontWeight: 600, color: 'var(--coral)', lineHeight: 1.45 }}>
            Months of delays — and every week of delay is a week of disease progression for the patient.
          </div>
        </div>

        {/* CorVista Column */}
        <div className="compare-col after">
          <div className="meta" style={{ textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--blue)' }}>With CorVista</div>
          <h4 style={{ marginTop: 10, fontSize: 20, letterSpacing: '-0.01em', color: '#F4F6F9', lineHeight: 1.3 }}>One study quarterbacks the full differential — same visit, no restart.</h4>

          <div className="compare-row" style={{ alignItems: 'start' }}>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--blue)', letterSpacing: '0.12em', paddingTop: 3 }}>01</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 17, color: '#F4F6F9' }}>Single resting capture</div>
              <div style={{ fontSize: 13, color: 'var(--blue)', fontWeight: 700, marginTop: 4, fontFamily: 'var(--f-mono)', letterSpacing: '0.04em' }}>3.7 minutes</div>
              <div style={{ fontSize: 14, color: '#98A2B3', marginTop: 6, lineHeight: 1.55 }}>Non-invasive biosignal acquisition at rest — no exercise, no contrast, no radiation. Applied by a medical assistant in any clinical setting.</div>
            </div>
          </div>

          <div className="compare-row" style={{ display: 'block', paddingTop: 20 }}>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: '#98A2B3', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Simultaneous assessment</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                { abbr: 'CAD', full: 'Coronary artery disease' },
                { abbr: 'PH', full: 'Pulmonary hypertension' },
                { abbr: 'HF', full: 'Heart failure' },
              ].map(t => (
                <div key={t.abbr} style={{ background: 'rgba(91,175,232,.1)', border: '1px solid rgba(91,175,232,.2)', borderRadius: 6, padding: '14px 8px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--f-sans)', fontSize: 14, fontWeight: 700, color: 'var(--blue)' }}>{t.abbr}</div>
                  <div style={{ fontSize: 11, color: '#98A2B3', marginTop: 4, lineHeight: 1.3 }}>{t.full}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="compare-row" style={{ alignItems: 'start' }}>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--blue)', letterSpacing: '0.12em', paddingTop: 3 }}>02</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 17, color: '#F4F6F9' }}>Physician-reviewed report</div>
              <div style={{ fontSize: 14, color: '#98A2B3', marginTop: 6, lineHeight: 1.55 }}>Disease probability scores delivered to the portal in minutes. Clinician immediately directs next steps — the right path, on the first visit.</div>
            </div>
          </div>

          <div style={{ marginTop: 20, padding: '20px', background: 'rgba(43,196,138,.08)', border: '1px solid rgba(43,196,138,.3)', borderRadius: 6, borderLeft: '3px solid var(--green-cv)' }}>
            <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0 }}>
                <div style={{ fontFamily: 'var(--f-sans)', fontSize: 44, fontWeight: 700, color: 'var(--green-cv)', letterSpacing: '-0.04em', lineHeight: 1 }}>0</div>
                <div style={{ fontSize: 11, fontFamily: 'var(--f-mono)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--green-cv)', marginTop: 3 }}>restarts</div>
              </div>
              <div style={{ paddingTop: 2 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#F4F6F9', lineHeight: 1.35 }}>Every patient leaves with a clinical direction — same visit</div>
                <div style={{ fontSize: 13, color: '#98A2B3', marginTop: 6, lineHeight: 1.6 }}>No new referrals. No gaps between cycles where patients fall out of care. One capture, all three answers, clinician directs next steps immediately.</div>
              </div>
            </div>
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

              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--rule)' }}>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--green-cv)', marginBottom: 8 }}>Outcome</div>
                <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.3 }}>{c.outcome}</div>
              </div>

              {[
                { ...c.before, mono: 'var(--mid)', fg: 'var(--fg-muted)' },
                { ...c.cv, mono: 'var(--blue-deep)', fg: 'var(--fg)' },
              ].map((row, j) => (
                <div key={j} style={{ padding: '16px 24px', borderBottom: '1px solid var(--rule)', display: 'grid', gridTemplateColumns: '120px 1fr', gap: 16, alignItems: 'start' }}>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: row.mono, lineHeight: 1.5, paddingTop: 2 }}>{row.label}</div>
                  <div style={{ fontSize: 15, color: row.fg, lineHeight: 1.6 }}>{row.text}</div>
                </div>
              ))}

              <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <svg width="15" height="15" viewBox="0 0 20 20" fill="var(--green-cv)" style={{ marginTop: 2, flexShrink: 0 }} aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span style={{ fontSize: 15, color: 'var(--fg-muted)', lineHeight: 1.55 }}>{c.dx}</span>
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
