import React, { useState } from 'react';
import { Eyebrow, Section, SectionHeader, ImgPh, Btn, Stat, NavA, navTo } from '../components.jsx';

const SOC_STEPS = [
  {
    id: 'cad',
    label: 'CAD Workup',
    time: '2–6 weeks to result',
    detail: 'Stress testing (exercise ECG, nuclear imaging, or CT coronary angiography) to assess for obstructive coronary artery disease. Typical referral-to-report time spans several weeks across multiple specialist visits.',
    posLabel: 'CAD treatment initiated',
    restart: 'Negative — workup restarts for pulmonary hypertension',
  },
  {
    id: 'ph',
    label: 'PH Workup',
    time: '2–6 more weeks to result',
    detail: 'Echocardiography, V/Q scan, and potentially right heart catheterization to assess for pulmonary hypertension. Requires a new referral cycle — often through a different specialist — after the CAD workup concludes.',
    posLabel: 'PH treatment initiated',
    restart: 'Negative — workup restarts for HFpEF',
  },
  {
    id: 'hfpef',
    label: 'HFpEF Workup',
    time: '2–6 more weeks to result',
    detail: 'Stress echocardiography with diastolic assessment, cardiac MRI, or invasive hemodynamic testing for heart failure with preserved ejection fraction — the most commonly missed diagnosis in unexplained dyspnea workup.',
    posLabel: 'HFpEF treatment initiated',
    restart: null,
  },
];

const RESTART_ICON = (
  <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
  </svg>
);

const INFO_ICON = (
  <svg width="11" height="11" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
);

function WorkflowComparison() {
  const [open, setOpen] = useState({});
  const toggle = id => setOpen(s => ({ ...s, [id]: !s[id] }));

  return (
    <div>
      <div className="wf-grid">

        {/* ── SOC track ── */}
        <div className="wf-track wf-soc">
          <div className="wf-head">
            <div className="wf-head-name">Standard of Care</div>
            <div className="wf-head-sub">Sequential — months to diagnosis</div>
          </div>
          <div className="wf-flow">

            <div className="wf-pill wf-pill-navy">Patient with unexplained dyspnea</div>
            <div className="wf-vline" />

            {SOC_STEPS.map((step, i) => (
              <React.Fragment key={step.id}>
                <div className="wf-decision">
                  <button
                    className="wf-test"
                    aria-expanded={!!open[step.id]}
                    onClick={() => toggle(step.id)}
                  >
                    <div className="wf-test-label">{step.label}</div>
                    <div className="wf-test-time">{step.time}</div>
                    <div className="wf-hint">
                      {INFO_ICON}
                      <span>{open[step.id] ? 'Tap to collapse' : 'Tap to learn more'}</span>
                    </div>
                  </button>
                  <div className={`wf-detail${open[step.id] ? ' open' : ''}`}>{step.detail}</div>
                  <div className="wf-branch">
                    <div className="wf-neg-col">
                      <div className="wf-neg-tag">Neg.</div>
                      <div className="wf-neg-line" />
                    </div>
                    <div className="wf-pos-col">
                      <div className="wf-pos">
                        <div className="wf-pos-ey">If positive</div>
                        <div className="wf-pos-text">{step.posLabel}</div>
                      </div>
                    </div>
                  </div>
                  {step.restart && (
                    <div className="wf-restart">{RESTART_ICON}{step.restart}</div>
                  )}
                </div>
                {i < SOC_STEPS.length - 1 && <div className="wf-vline" />}
              </React.Fragment>
            ))}

            <div className="wf-vline wf-vline-red" />
            <div className="wf-pill wf-pill-red">
              Months of delays — still no diagnosis
              <div className="wf-pill-sub">Up to 50% of patients lost to follow-up between referral cycles</div>
            </div>
          </div>
        </div>

        {/* ── CorVista track ── */}
        <div className="wf-track wf-cv">
          <div className="wf-head">
            <div className="wf-head-name">With CorVista</div>
            <div className="wf-head-sub">Comprehensive answers — same visit</div>
          </div>
          <div className="wf-flow">

            <div className="wf-pill wf-pill-blue">Patient with unexplained dyspnea</div>
            <div className="wf-vline wf-vline-blue" />

            <div className="wf-decision">
              <button
                className="wf-test wf-test-cv"
                aria-expanded={!!open.cv}
                onClick={() => toggle('cv')}
              >
                <div className="wf-test-label">CorVista Study</div>
                <div className="wf-test-time">Single non-invasive study</div>
                <div className="wf-hint">
                  {INFO_ICON}
                  <span>{open.cv ? 'Tap to collapse' : 'Tap to learn more'}</span>
                </div>
              </button>
              <div className={`wf-detail wf-detail-cv${open.cv ? ' open' : ''}`}>
                CorVista's non-invasive system simultaneously evaluates hemodynamic signatures associated with CAD, pulmonary hypertension, and HFpEF in a single study — eliminating the need for sequential referrals and repeated wait times.
              </div>
            </div>

            <div className="wf-vline wf-vline-blue" />
            <div className="wf-simul">Simultaneous results</div>

            <div className="wf-tiles">
              {[
                { abbr: 'CAD',   full: 'Coronary artery disease' },
                { abbr: 'PH',    full: 'Pulmonary hypertension' },
                { abbr: 'HFpEF', full: 'Heart failure (preserved EF)' },
              ].map(t => (
                <div key={t.abbr} className="wf-tile">
                  <div className="wf-tile-abbr">{t.abbr}</div>
                  <div className="wf-tile-full">{t.full}</div>
                </div>
              ))}
            </div>

            <div className="wf-vline wf-vline-green" />
            <div className="wf-pill wf-pill-grn">
              Targeted treatment — same visit
              <div className="wf-pill-sub">Clinician directs next step immediately</div>
            </div>
          </div>
        </div>

      </div>

      {/* Summary cards */}
      <div className="wf-summary">
        <div className="wf-sum wf-sum-soc">
          <div className="wf-sum-title">Standard of Care</div>
          {[
            { ico: '#D97706', path: 'M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z', text: 'Multiple weeks per workup — each requiring a new referral and specialist appointment' },
            { ico: '#DC2626', path: 'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z', text: 'Negative results restart the process — patients can be lost between workup cycles' },
            { ico: '#6B7280', path: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z', text: 'Comprehensive diagnosis may take months — or may never be reached' },
          ].map((li, i) => (
            <div key={i} className="wf-sum-li">
              <svg className="wf-sum-ico" width="14" height="14" viewBox="0 0 20 20" fill={li.ico} aria-hidden="true"><path fillRule="evenodd" d={li.path} clipRule="evenodd" /></svg>
              <span>{li.text}</span>
            </div>
          ))}
        </div>
        <div className="wf-sum wf-sum-cv">
          <div className="wf-sum-title">With CorVista</div>
          {[
            'One study delivers CAD, PH, and HFpEF assessment simultaneously',
            'No restart on a negative result — clinician directs next step same visit',
            'Patients remain in care — no gaps, no repeated referrals',
          ].map((text, i) => (
            <div key={i} className="wf-sum-li">
              <svg className="wf-sum-ico" width="14" height="14" viewBox="0 0 20 20" fill="#16A34A" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              <span>{text}</span>
            </div>
          ))}
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

          {/* Case 1: PH/HFpEF */}
          <div className="case-card">
            <div className="case-head">
              <div className="case-head-eyebrow">Case study · Published JACC: Case Reports, 2025</div>
              <div className="case-head-title">75-year-old woman — atrial fibrillation, worsening dyspnea, fatigue, and palpitations</div>
            </div>
            <div className="case-steps">
              <div className="case-step">
                <div className="case-step-n">01 · Presentation</div>
                <div className="case-step-title">Standard workup</div>
                <div className="case-step-body">Three echocardiograms, all negative for PH. Six years of evaluation. Equivocal stress test. Workup pointed toward coronary disease — cardiac catheterization planned.</div>
              </div>
              <div className="case-step cv-step">
                <div className="case-step-n">02 · CorVista PH test</div>
                <div className="case-step-title">CorVista added before cath</div>
                <div className="case-step-body">CorVista PH test returned a positive result — 10.3 positive likelihood ratio — prompting addition of right heart catheterization to the planned procedure.</div>
              </div>
              <div className="case-step" style={{ gridColumn: '1 / -1', borderBottom: 'none' }}>
                <div className="case-step-n">03 · Diagnosis</div>
                <div className="case-step-title">Group 2 PH / HFpEF confirmed</div>
                <div className="case-step-body">mPAP 35 mmHg · PCWP 31 mmHg · No significant CAD. Patient referred to PH specialist and started on SGLT2 inhibitor. Six years of workup resolved in one additional test.</div>
              </div>
            </div>
            <div className="case-outcome">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Correct diagnosis reached after six years of missed workup — directed to appropriate specialist and treatment
            </div>
            <div className="case-cite">Aben R, Burton T, Fathieh F, et al. Facilitating Earlier Diagnosis of Pulmonary Hypertension Using a Novel Noninvasive Diagnostic. J Am Coll Cardiol Case Rep. 2025;30(26):104876.</div>
          </div>

          {/* Case 2: CAD */}
          <div className="case-card">
            <div className="case-head">
              <div className="case-head-eyebrow">Case study · Published European Heart Journal — Case Reports, 2026</div>
              <div className="case-head-title">63-year-old man — exertional chest pain, multiple risk factors, strong family history</div>
            </div>
            <div className="case-steps">
              <div className="case-step">
                <div className="case-step-n">01 · Standard workup</div>
                <div className="case-step-title">Three negative tests</div>
                <div className="case-step-body">Pretest CAD risk 35–44%. Normal echocardiogram. Negative SPECT nuclear perfusion imaging. Standard workup complete — no indication for catheterization.</div>
              </div>
              <div className="case-step cv-step">
                <div className="case-step-n">02 · CorVista CAD test</div>
                <div className="case-step-title">CorVista positive</div>
                <div className="case-step-body">CorVista CAD score 0.20 — positive result. Patient sent directly to invasive cardiac catheterization on the strength of CorVista's finding.</div>
              </div>
              <div className="case-step" style={{ gridColumn: '1 / -1', borderBottom: 'none' }}>
                <div className="case-step-n">03 · Catheterization</div>
                <div className="case-step-title">Severe multivessel disease found and treated</div>
                <div className="case-step-body">80% LAD stenosis · 2× 80% LCX stenosis · Subtotal RCA occlusion. Four lesions stented. Three standard-of-care tests had missed balanced ischemia that CorVista detected.</div>
              </div>
            </div>
            <div className="case-outcome">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Severe multivessel CAD identified and treated — after three standard-of-care tests returned negative
            </div>
            <div className="case-cite">Alkhawam M, et al. Utility of a novel point-of-care test in detecting coronary artery disease following negative nuclear testing: a case series. European Heart Journal — Case Reports. 2026;10(2):ytag016.</div>
          </div>

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
