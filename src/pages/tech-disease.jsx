import React from 'react';
import { Eyebrow, Section, SectionHeader, ImgPh, Btn, Stat, NavA, EcgLine, navTo } from '../components.jsx';
import { CadAnimation, PhAnimation, HfAnimation } from '../animations.jsx';

const CV_DISEASES = {
  cad: {
    slug: 'tech-cad',
    abbr: 'CAD',
    name: 'Coronary artery disease',
    status: 'FDA-cleared',
    screenLabel: '02a CAD',
    title: <>Find obstructive coronary disease — from a <span className="em">resting</span> signal.</>,
    lead: 'Stress testing and CT angiography gatekeep the cath lab — but many symptomatic patients can’t exercise, and imaging adds radiation, contrast, cost, and days of delay. CorVista assesses functionally significant CAD from 220 seconds of resting biosignals.',
    problemTitle: 'The front line is leaky.',
    problemLead: 'Stable, symptomatic patients deserve a clear first answer. Today they rarely get one — and the gaps push disease downstream.',
    problems: [
      { t: 'Most patients can’t complete a stress test', c: 'Roughly 60% of patients are ineligible for, or non-diagnostic on, exercise stress — leaving clinicians to choose between imaging and uncertainty.' },
      { t: 'Imaging adds cost, contrast, and radiation', c: 'SPECT exposes patients to ionizing radiation; CCTA requires contrast and a separate appointment. Both add days to the workup.' },
      { t: 'Normal first-line tests still miss high-grade disease', c: 'A previously normal stress test can sit in front of a 99% LAD lesion. False reassurance is its own clinical risk.' },
    ],
    perf: { sens: '88%', spec: '51%', npv: '99%' },
    perfNote: 'Functionally significant obstructive coronary disease in stable, symptomatic patients. A >99% rule-out lets clinicians defer or avoid downstream testing with confidence.',
    workflow: [
      { n: '01', t: 'At presentation', c: 'A symptomatic patient with chest discomfort is tested at rest — no treadmill, no contrast, no radiation.' },
      { n: '02', t: 'In minutes', c: 'A physician-reviewed CAD probability score returns to the portal, raising or lowering pre-test probability.' },
      { n: '03', t: 'Toward the right next step', c: 'Rule out without a downstream referral, or send the right patients to the cath lab with sharper indication.' },
    ],
    stats: [
      { label: 'CAD diagnostic pathway cost', value: '−32', unit: '%', desc: 'Avoids unnecessary downstream imaging and admissions.' },
      { label: 'Cath lab yield vs SPECT', value: '+21', unit: '%', desc: 'More patients sent to cath have obstructive disease.' },
      { label: 'Patients ineligible for stress', value: '60', unit: '%', desc: 'Resting capture works where exercise testing can’t.' },
    ],
    studies: [
      { title: 'Diagnostic Accuracy of Machine-Learned Algorithms Utilizing Cardiac Phase Tomography vs SPECT in the Assessment of CAD', journal: 'JACC: Cardiovascular Imaging', meta: 'Pivotal · PRIDE-CAD', n: 'n = 1,968' },
      { title: 'Coronary Artery Disease Learning and Algorithm Development Study (CADLAD)', journal: 'Mayo Clinic Proceedings', meta: 'Development cohort', n: 'n = 2,209' },
    ],
  },
  ph: {
    slug: 'tech-ph',
    abbr: 'PH',
    name: 'Pulmonary hypertension',
    status: 'FDA-cleared',
    screenLabel: '02b PH',
    title: <>Put pulmonary hypertension on the <span className="em">differential</span> — sooner.</>,
    lead: 'PH presents like everything else — asthma, COPD, deconditioning — so it is diagnosed an average of 2.5 years late. CorVista flags pulmonary hypertension from a resting capture, at the front line of care, where the workup begins.',
    problemTitle: 'Behind every breath, a question.',
    problemLead: 'Breathlessness is one of the most common — and most ambiguous — presentations in medicine. PH hides inside it.',
    problems: [
      { t: 'It looks like everything else', c: 'Dyspnea from PH is routinely attributed to more common conditions, so the differential rarely includes it until late.' },
      { t: 'Confirmation lives at specialist centers', c: 'Definitive diagnosis requires right-heart catheterization — an invasive procedure available only at referral programs.' },
      { t: 'Delay compounds cost and harm', c: 'The average patient waits roughly 2.5 years for a diagnosis. Outcomes and total cost of care both worsen with every month lost.' },
    ],
    perf: { sens: '82%', spec: '92%', npv: '>99%' },
    perfNote: 'Elevated pulmonary artery pressure consistent with PH, assessed at the front line. High specificity and a >99% NPV make it a smarter first test for breathless patients.',
    workflow: [
      { n: '01', t: 'For breathless patients', c: 'When dyspnea is unexplained, a resting CorVista capture screens for PH without a specialist referral.' },
      { n: '02', t: 'A clearer signal', c: 'A physician-reviewed PH probability score helps decide who genuinely needs a right-heart cath — and who doesn’t.' },
      { n: '03', t: 'To the right specialist, faster', c: 'Patients who screen positive reach a PH program months — or years — earlier than they would today.' },
    ],
    stats: [
      { label: 'PH total cost of care', value: '−44', unit: '%', desc: 'Identifies PH earlier, before care costs compound.' },
      { label: 'Average diagnostic delay today', value: '2.5', unit: 'yrs', desc: 'The gap CorVista is built to close.' },
      { label: 'Right-heart cath avoided', value: '1 in 3', unit: '', desc: 'A negative result safely defers invasive testing.' },
    ],
    studies: [
      { title: 'Noninvasive Detection of Pulmonary Hypertension Using Resting Phase Signals and Advanced Machine Learning', journal: 'Pulmonary Circulation', meta: 'Multi-center · 9 sites', n: 'n = 524' },
      { title: 'CV-PH-VALIDATE — PH detection in symptomatic patients', journal: 'Prospective clinical trial', meta: 'Enrolling · 2025', n: 'Multi-site' },
    ],
  },
  pcwp: {
    slug: 'tech-pcwp',
    abbr: 'PCWP',
    name: 'Heart failure (PCWP)',
    status: 'FDA-submitted',
    screenLabel: '02c PCWP',
    title: <>Catch heart failure before the <span className="em">hospital</span> does.</>,
    lead: 'Elevated pulmonary capillary wedge pressure is the hemodynamic signature of heart failure with preserved ejection fraction — but confirming it means an echo wait or an invasive measurement. CorVista estimates elevated wedge pressure in-office, from a resting signal.',
    problemTitle: 'Heart failure hides in plain sight.',
    problemLead: 'HFpEF builds quietly behind breathlessness and fatigue. By the time it declares itself, it is often a hospitalization.',
    problems: [
      { t: 'Roughly half of HF goes undiagnosed', c: 'Preserved-EF heart failure is easy to miss on front-line exam and easy to mistake for deconditioning or age.' },
      { t: 'Echo capacity is the bottleneck', c: 'Confirmatory echocardiography carries wait times of 4–8 weeks in many systems — long enough for a patient to decompensate.' },
      { t: 'The first diagnosis is often the ED', c: 'Without an in-office signal, elevated filling pressures frequently surface only at acute presentation.' },
    ],
    perf: { sens: '82%', spec: '83%', npv: '>99%' },
    perfNote: 'Increased pulmonary capillary wedge pressure, consistent with heart failure with preserved ejection fraction. Submitted to the FDA; performance shown from validation cohorts.',
    workflow: [
      { n: '01', t: 'In primary care', c: 'A resting capture flags elevated filling pressures during a routine visit — before symptoms force an admission.' },
      { n: '02', t: 'A decision in-office', c: 'A physician-reviewed PCWP score gives the clinician a hemodynamic read without waiting weeks for an echo.' },
      { n: '03', t: 'Earlier management', c: 'Patients begin guideline-directed therapy sooner, bending the curve away from decompensation and hospitalization.' },
    ],
    stats: [
      { label: 'HF patients undiagnosed', value: '~50', unit: '%', desc: 'The population a front-line signal can reach.' },
      { label: 'Echo wait time today', value: '4–8', unit: 'wks', desc: 'Replaced by an in-office read in minutes.' },
      { label: 'In-office decision', value: '<8', unit: 'min', desc: 'Scan to physician-reviewed report.' },
    ],
    studies: [
      { title: 'Assessing Reduced LVEF Using Resting Biosignals and Machine Learning', journal: 'JACC: Heart Failure', meta: 'First-in-human', n: 'n = 612' },
      { title: 'CV-HF-EARLY — Reduced LVEF screening in primary care', journal: 'Prospective clinical trial', meta: 'Initiated · 2026', n: 'Multi-site' },
    ],
  },
};

function DiseaseSubNav({ active }) {
  const order = ['cad', 'ph', 'pcwp'];
  return (
    <div className="subnav" role="navigation" aria-label="Disease areas">
      <NavA to="technology" className="back">{'←'} Technology overview</NavA>
      {order.map(k => (
        <NavA key={k} to={CV_DISEASES[k].slug} className={active === k ? 'active' : ''}>
          {CV_DISEASES[k].abbr}
        </NavA>
      ))}
    </div>
  );
}

const DISEASE_ANIM = {
  cad: CadAnimation,
  ph: PhAnimation,
  pcwp: HfAnimation,
};

function DiseasePage({ d, activeKey }) {
  const DiseaseAnim = DISEASE_ANIM[activeKey];
  return (
    <div className="page-fade" data-screen-label={d.screenLabel} data-page={d.slug}>
      <div className="subhero">
        <div className="container">
          <div className="crumb">
            <NavA to="technology">Technology</NavA>
            <span>/</span>
            <span style={{ color: 'var(--fg)' }}>{d.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 28 }}>
            <div className="chip chip-blue">{d.abbr}</div>
            <div className="chip">{d.status}</div>
          </div>
          <h1 style={{ marginTop: 22 }}>{d.title}</h1>
          <p className="lead">{d.lead}</p>
          <DiseaseSubNav active={activeKey} />
        </div>
      </div>

      <Section>
        <div className="row row-2" style={{ gridTemplateColumns: '1fr 1.4fr', gap: 80, alignItems: 'start' }}>
          <div>
            <Eyebrow>The clinical problem</Eyebrow>
            <h2 style={{ marginTop: 20, fontSize: 'clamp(34px, 4vw, 56px)' }}>{d.problemTitle}</h2>
            <p className="lead" style={{ marginTop: 24 }}>{d.problemLead}</p>
          </div>
          <div className="row" style={{ gap: 0 }}>
            {d.problems.map((p, i) => (
              <div key={i} style={{ padding: '24px 0', borderTop: '1px solid var(--rule)', display: 'grid', gridTemplateColumns: '40px 1fr', gap: 24, alignItems: 'start' }}>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--mid)', letterSpacing: '0.14em' }}>{String(i + 1).padStart(2, '0')}</div>
                <div>
                  <h4 style={{ fontSize: 21, letterSpacing: '-0.01em' }}>{p.t}</h4>
                  <p style={{ marginTop: 8, color: 'var(--fg-muted)', maxWidth: '56ch' }}>{p.c}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {DiseaseAnim && (
        <Section>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 32 }}>
            <Eyebrow>How the condition presents</Eyebrow>
            <span className="meta">Interactive · real-time</span>
          </div>
          <div style={{ border: '1px solid var(--rule)', overflow: 'hidden', background: '#0A1120' }}>
            <DiseaseAnim />
          </div>
        </Section>
      )}

      <Section dark>
        <div className="row row-2" style={{ gridTemplateColumns: '1fr 1.2fr', gap: 80, alignItems: 'center' }}>
          <div>
            <Eyebrow><span style={{ color: '#98A2B3' }}>What CorVista detects</span></Eyebrow>
            <h2 style={{ color: '#F4F6F9', marginTop: 20, fontSize: 'clamp(34px, 4vw, 56px)' }}>
              {d.name}, from a resting capture.
            </h2>
            <p className="lead" style={{ color: '#C8D0DC', marginTop: 24 }}>{d.perfNote}</p>
            <div style={{ marginTop: 40 }}>
              <EcgLine color="#5BAFE8" height={64} segments={8} />
            </div>
          </div>
          <div className="row row-3" style={{ gap: 0 }}>
            {[
              { k: 'Sensitivity', v: d.perf.sens },
              { k: 'Specificity', v: d.perf.spec },
              { k: 'NPV', v: d.perf.npv },
            ].map((m, i) => (
              <div key={i} style={{ padding: '8px 24px', borderLeft: i > 0 ? '1px solid #1F2A3D' : 0 }}>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: '#5BAFE8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{m.k}</div>
                <div style={{ fontFamily: 'var(--f-sans)', fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 500, color: '#F4F6F9', letterSpacing: '-0.02em', marginTop: 12, lineHeight: 1 }}>{m.v}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Where it fits" title="In the workup, not after it." />
        <div className="row row-3">
          {d.workflow.map(s => (
            <div key={s.n} style={{ borderTop: '1px solid var(--ink)', paddingTop: 24 }}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--mid)', letterSpacing: '0.14em' }}>{s.n}</div>
              <h4 style={{ marginTop: 14, letterSpacing: '-0.01em' }}>{s.t}</h4>
              <p style={{ marginTop: 12, fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.5 }}>{s.c}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 56 }}>
          <div style={{ marginBottom: 40 }}><Eyebrow>The impact</Eyebrow></div>
          <div className="row row-3">
            {d.stats.map((s, i) => (
              <Stat key={i} label={s.label} value={s.value} unit={s.unit} desc={s.desc} />
            ))}
          </div>
        </div>
      </Section>

      <Section dark>
        <SectionHeader
          eyebrow={<span style={{ color: '#98A2B3' }}>The evidence</span>}
          title={<span style={{ color: '#F4F6F9' }}>Validated in peer-reviewed studies.</span>}
        />
        <div style={{ borderTop: '1px solid #1F2A3D' }}>
          {d.studies.map((s, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 240px 140px', gap: 32, padding: '24px 0', borderBottom: '1px solid #1F2A3D', alignItems: 'center', color: '#F4F6F9' }}>
              <div style={{ fontSize: 18, lineHeight: 1.3, letterSpacing: '-0.01em', textWrap: 'pretty' }}>{s.title}</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: '#98A2B3' }}>{s.journal} · {s.meta}</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: '#5BAFE8', textAlign: 'right' }}>{s.n}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 56, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <NavA to="evidence" className="btn">Read the full evidence base<span className="arrow">{'→'}</span></NavA>
          <NavA to="contact" className="btn btn-ghost">Request a demo<span className="arrow">{'→'}</span></NavA>
        </div>
      </Section>
    </div>
  );
}

export function TechCadPage() { return <DiseasePage d={CV_DISEASES.cad} activeKey="cad" />; }
export function TechPhPage() { return <DiseasePage d={CV_DISEASES.ph} activeKey="ph" />; }
export function TechPcwpPage() { return <DiseasePage d={CV_DISEASES.pcwp} activeKey="pcwp" />; }
