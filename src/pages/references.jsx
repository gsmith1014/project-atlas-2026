import React from 'react';
import { Eyebrow, Section } from '../components.jsx';

export const REFS = [
  // [1] CAD validation
  {
    n: 1,
    authors: 'Fathieh F, et al.',
    title: 'Clinical Validation of a Machine-Learned, Point-of-Care System to IDENTIFY Functionally Significant Coronary Artery Disease.',
    journal: 'Diagnostics.',
    year: '2024',
    detail: '14(10):987.',
    note: 'IDENTIFY trial · n = 1,816 · 18 sites',
    doi: 'https://www.mdpi.com/2075-4418/14/10/987',
    claims: ['CAD sensitivity 88%, specificity 51%, NPV 99%'],
  },
  // [2] PH validation
  {
    n: 2,
    authors: 'Gill SS, et al.',
    title: 'Clinical Validation of a Machine-Learned, Point-of-Care System to IDENTIFY Pulmonary Hypertension.',
    journal: 'ERJ Open Research.',
    year: '2025',
    detail: '11(5):01287-2024.',
    note: 'Prospective validation · n = 462 · 18 sites',
    doi: 'https://publications.ersnet.org/content/erjor/11/5/01287-2024',
    claims: ['PH sensitivity 82%, specificity 92%, NPV >99%'],
  },
  // [3] PCWP validation
  {
    n: 3,
    authors: 'Fathieh F, et al.',
    title: 'Validation of a Noninvasive Machine-Learning Algorithm to Assess Elevated Pulmonary Capillary Wedge Pressure at Point-of-Care.',
    journal: 'Circulation Supplements.',
    year: '2025',
    detail: '152(Suppl 3):4365733.',
    note: 'AHA Scientific Sessions 2025 · n = 255',
    doi: 'https://www.ahajournals.org/doi/abs/10.1161/circ.152.suppl_3.4365733',
    claims: ['PCWP sensitivity 82%, specificity 83%, NPV >99%'],
  },
  // [4] CAD economics
  {
    n: 4,
    authors: 'Fathieh F, et al.',
    title: 'Signal Acquisition, Score Interpretation, and Economics of a Non-Invasive Point-of-Care Test for Coronary Artery Disease.',
    journal: 'Journal of Visualized Experiments.',
    year: '2024',
    detail: '(205):66933.',
    note: 'Methods and economic analysis',
    doi: 'https://www.jove.com/t/66933/signal-acquisition-score-interpretation-economics-non-invasive-point',
    claims: ['CAD diagnostic pathway cost −32%', 'Cath lab yield vs SPECT +21%'],
  },
  // [5] PH economics
  {
    n: 5,
    authors: 'CorVista Health.',
    title: 'The Economic Toll of Diagnosing Pulmonary Hypertension.',
    journal: 'Internal economic analysis.',
    year: '2025',
    detail: '',
    note: 'Standard PH diagnostic pathway cost $9,085–$17,819 (MDSave cost data; standard care pathway); CorVista pathway $6,555–$10,034; modeled cost reduction 27–44%',
    doi: '',
    claims: ['PH total cost of care −44%'],
  },
  // [6] Heart disease mortality
  {
    n: 6,
    authors: 'Centers for Disease Control and Prevention.',
    title: 'Heart Disease Facts.',
    journal: 'CDC.',
    year: '2025',
    detail: '',
    note: 'Last reviewed 2025',
    doi: 'https://www.cdc.gov/heart-disease/data-research/facts-stats/',
    claims: ['Heart disease is the leading cause of death in the United States'],
  },
  // [7] Cardiology deserts
  {
    n: 7,
    authors: 'Khan SU, et al.',
    title: 'Cardiology deserts in the United States: a geographic analysis of cardiovascular workforce access.',
    journal: 'Journal of the American College of Cardiology.',
    year: '2023',
    detail: '',
    note: 'Geographic workforce analysis',
    doi: 'https://www.jacc.org/',
    claims: ['22 million Americans live in counties with no practicing cardiologist'],
  },
  // [8] Appointment wait times
  {
    n: 8,
    authors: 'AMN Healthcare.',
    title: '2025 Physician Appointment Wait Times Survey.',
    journal: 'AMN Healthcare.',
    year: '2025',
    detail: '',
    note: 'Annual survey',
    doi: 'https://www.amnhealthcare.com/',
    claims: ['Average wait to see a cardiologist after referral: 32.7 days'],
  },
  // [9] PAH diagnostic delay
  {
    n: 9,
    authors: 'Humbert M, et al.',
    title: 'Survival in incident and prevalent cohorts of patients with pulmonary arterial hypertension.',
    journal: 'European Respiratory Journal.',
    year: '2010',
    detail: '36(3):549–555.',
    note: 'Diagnostic delay in PAH; consistent with subsequent literature',
    doi: 'https://erj.ersjournals.com/content/36/3/549',
    claims: ['Median delay from unexplained dyspnea to PAH diagnosis: 2.26 years', 'Average PH diagnostic delay: 2.5 years'],
  },
  // [10] PH case series
  {
    n: 10,
    authors: 'Aben R, Burton T, Fathieh F, et al.',
    title: 'Facilitating Earlier Diagnosis of Pulmonary Hypertension Using a Novel Noninvasive Diagnostic.',
    journal: 'JACC: Case Reports.',
    year: '2025',
    detail: '30(26):104876.',
    note: 'n = 4 cases',
    doi: 'https://www.jacc.org/doi/10.1016/j.jaccas.2025.104876',
    claims: ['Clinical case series — PH detected via CorVista following negative echocardiography'],
  },
  // [11] CAD case series
  {
    n: 11,
    authors: 'Alkhawam M, et al.',
    title: 'Utility of a Novel Point-of-Care Test in Detecting Coronary Artery Disease Following Negative Nuclear Testing: A Case Series.',
    journal: 'European Heart Journal — Case Reports.',
    year: '2026',
    detail: '10(2):ytag016.',
    note: 'n = 5 cases',
    doi: 'https://doi.org/10.1093/ehjcr/ytag016',
    claims: ['Clinical case series — CAD detected via CorVista following negative SPECT'],
  },
  // [12] PH economic burden — delayed diagnosis (CHEST 2023)
  {
    n: 12,
    authors: 'Burger CD, et al.',
    title: 'The Economic Burden of Delayed Diagnosis in Patients with Pulmonary Arterial Hypertension.',
    journal: 'CHEST.',
    year: '2023',
    detail: '',
    note: 'Peer-reviewed basis for PH diagnostic delay cost burden estimates',
    doi: 'https://journal.chestnet.org/article/S0012-3692(23)00755-9/ppt',
    claims: ['Economic burden of delayed PAH diagnosis'],
  },
  // [13] PAH economic burden in US (2024)
  {
    n: 13,
    authors: 'Watzker A, et al.',
    title: 'Economic Burden Associated with Pulmonary Arterial Hypertension in the United States.',
    journal: 'Pulmonary Circulation.',
    year: '2024',
    detail: '',
    note: 'Real-world economic burden of PAH in the U.S. healthcare system',
    doi: 'https://experts.nebraska.edu/en/publications/economic-burden-associated-with-pulmonary-arterial-hypertension-i',
    claims: ['Economic burden of PAH in the United States'],
  },
];

export function ReferencesPage() {
  return (
    <div className="page-fade" data-screen-label="References" data-page="references">
      <div className="subhero">
        <div className="container">
          <Eyebrow>Data sources</Eyebrow>
          <h1 style={{ marginTop: 28 }}>
            References.
          </h1>
          <p className="lead" style={{ maxWidth: '64ch' }}>
            Performance statistics, economic analyses, and epidemiological figures cited throughout this website are sourced from peer-reviewed publications and recognized public health databases listed below.
          </p>
        </div>
      </div>

      <Section>
        <RefList refs={REFS} />
      </Section>

      <Section>
        <div style={{ background: 'var(--paper)', borderRadius: 4, padding: '32px 40px', maxWidth: '72ch' }}>
          <h4 style={{ marginBottom: 16 }}>Notes on data presentation</h4>
          <p style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.7, marginBottom: 12 }}>
            Diagnostic performance values (sensitivity, specificity, NPV) are drawn from peer-reviewed studies conducted under pre-specified protocols with independent reference standard testing. Results reflect performance in the study populations described in the cited publications and may differ in other settings.
          </p>
          <p style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.7, marginBottom: 12 }}>
            Economic estimates (pathway cost reductions, cath lab yield improvements) are from health economic analyses conducted alongside or subsequent to the clinical validation studies. These represent modeled analyses and should not be interpreted as guaranteed savings in any particular health system.
          </p>
          <p style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.7 }}>
            Epidemiological statistics are drawn from publicly available sources including CDC national health statistics and published peer-reviewed literature. Figures may be updated as new data become available.
          </p>
        </div>
      </Section>
    </div>
  );
}

function RefList({ refs }) {
  return (
    <div>
      {refs.map(r => (
        <div key={r.n} id={`ref-${r.n}`} style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: 24, padding: '24px 0', borderTop: '1px solid var(--rule)', alignItems: 'start' }}>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13, color: 'var(--blue)', fontWeight: 600, paddingTop: 2 }}>
            [{r.n}]
          </div>
          <div>
            <div style={{ fontSize: 16, lineHeight: 1.45, fontWeight: 500 }}>
              {r.authors} {r.title}
            </div>
            <div style={{ marginTop: 6, fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.5 }}>
              <em>{r.journal}</em> {r.year}{r.detail ? `;${r.detail}` : '.'}{r.note ? <span style={{ marginLeft: 8, opacity: 0.7 }}>· {r.note}</span> : null}
            </div>
            {r.doi && (
              <a href={r.doi} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 8, fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--blue)' }}>
                DOI →
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
