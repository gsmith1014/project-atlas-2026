import React, { useState } from 'react';
import { Eyebrow, Section, SectionHeader, Tabs, NavA, Stat } from '../components.jsx';

export const STUDIES = [
  // 2026
  { y: '2026', cat: 'cad', title: 'FDA Cleared Machine-Learned Model for Coronary Artery Disease Also Flags Ischemia With Nonobstructive Coronary Arteries: A High Sensitivity Rule-Out for Ischemia', journal: 'JACC Supplements', n: '', meta: 'Conference abstract · ACC 2026', doi: 'https://www.jacc.org/doi/10.1016/j.jacc.2026.02.4955' },
  { y: '2026', cat: 'cad', title: 'Noninvasive Ischemia Detection in Symptomatic Patients: A Physiologic Feature Machine-Learned Model', journal: 'JACC Supplements', n: '', meta: 'Conference abstract · ACC 2026', doi: 'https://www.jacc.org/doi/full/10.1016/j.jacc.2026.02.4957' },
  { y: '2026', cat: 'ph', title: 'Improving Trust in AI Diagnosis of Pulmonary Hypertension with Patient-Specific Insight', journal: 'Intelligence-Based Medicine', n: 'n = 252', meta: 'Explainability study · PHLEX/PHGEX', doi: 'https://www.sciencedirect.com/science/article/pii/S2666521226000487' },
  { y: '2026', cat: 'cad', title: 'Utility of a Novel Point-of-Care Test in Detecting Coronary Artery Disease Following Negative Nuclear Testing: A Case Series', journal: 'European Heart Journal — Case Reports', n: 'n = 5 cases', meta: 'Case series', doi: 'https://doi.org/10.1093/ehjcr/ytag016' },
  { y: '2026', cat: 'cad', title: 'Development and validation of a machine learned algorithm to IDENTIFY functionally significant coronary artery disease', journal: 'Frontiers in Digital Health', n: '', meta: '2026', doi: 'https://doi.org/10.3389/fdgth.2026.1955810' },
  // 2025
  { y: '2025', cat: 'pcwp', title: 'Enhancing Clinical Insight of an Artificial Intelligence Test for Pulmonary Capillary Wedge Pressure Elevation by Unmasking Physiological Mechanisms', journal: 'Journal of Cardiac Failure', n: '', meta: 'Conference abstract · HFSA 2025', doi: 'https://onlinejcf.com/article/S1071-9164(25)00674-8/abstract' },
  { y: '2025', cat: 'pcwp', title: 'The Impact of Population Selection on Establishing Trust in Diagnostic Models for Heart Failure Detection', journal: 'Journal of Cardiac Failure', n: '', meta: 'Conference abstract · HFSA 2025', doi: 'https://onlinejcf.com/article/S1071-9164(25)00650-5/abstract' },
  { y: '2025', cat: 'pcwp', title: 'Validation of a Noninvasive Machine-Learning Algorithm to Assess Elevated Pulmonary Capillary Wedge Pressure at Point-of-Care', journal: 'Circulation Supplements', n: 'n = 255', meta: 'Conference abstract · AHA 2025', doi: 'https://www.ahajournals.org/doi/abs/10.1161/circ.152.suppl_3.4365733' },
  { y: '2025', cat: 'pcwp', title: 'Point-of-Care Testing for PCWP Elevation Using Machine Learning on Non-Invasive Signals', journal: 'JACC Supplements', n: '', meta: 'Conference abstract · ACC 2025', doi: 'https://www.jacc.org/doi/full/10.1016/S0735-1097(25)03220-6' },
  { y: '2025', cat: 'ph', title: 'Facilitating Earlier Diagnosis of Pulmonary Hypertension Using a Novel Noninvasive Diagnostic', journal: 'JACC: Case Reports', n: 'n = 4 cases', meta: 'Case series', doi: 'https://www.jacc.org/doi/10.1016/j.jaccas.2025.104876' },
  { y: '2025', cat: 'ph', title: 'Clinical Validation of a Machine-Learned, Point-of-Care System to IDENTIFY Pulmonary Hypertension', journal: 'ERJ Open Research', n: 'n = 462', meta: 'Prospective · 18 sites', doi: 'https://publications.ersnet.org/content/erjor/11/5/01287-2024' },
  { y: '2025', cat: 'cad', title: 'Efficacy of a US-Developed Machine-Learned Coronary Artery Disease Algorithm in China', journal: 'Discover Medicine', n: 'n = 458', meta: 'International validation', doi: 'https://link.springer.com/article/10.1007/s44337-025-00255-3' },
  // 2024
  { y: '2024', cat: 'pcwp', title: 'Development of a Non-Invasive Point-of-Care Rule-Out Test for Heart Failure Using Machine Learning', journal: 'JACC Supplements', n: '', meta: 'Conference abstract · ACC 2024', doi: 'https://www.jacc.org/doi/full/10.1016/S0735-1097(24)04603-5' },
  { y: '2024', cat: 'cad', title: 'Signal Acquisition, Score Interpretation, and Economics of a Non-Invasive Point-of-Care Test for Coronary Artery Disease', journal: 'Journal of Visualized Experiments', n: '', meta: 'Methods & economics', doi: 'https://www.jove.com/t/66933/signal-acquisition-score-interpretation-economics-non-invasive-point' },
  { y: '2024', cat: 'cad', title: 'Clinical Validation of a Machine-Learned, Point-of-Care System to IDENTIFY Functionally Significant Coronary Artery Disease', journal: 'Diagnostics', n: 'n = 1,816', meta: 'IDENTIFY trial · 18 sites', doi: 'https://www.mdpi.com/2075-4418/14/10/987' },
  { y: '2024', cat: 'ph', title: 'Pulmonary Hypertension Detection Non-Invasively at Point-of-Care Using a Machine-Learned Algorithm', journal: 'Diagnostics', n: '', meta: 'Validation study', doi: 'https://www.mdpi.com/2075-4418/14/9/897' },
  { y: '2024', cat: 'cad', title: 'Development of a Non-Invasive Machine-Learned Point-of-Care Rule-Out Test for Coronary Artery Disease', journal: 'Diagnostics', n: '', meta: 'Algorithm development', doi: 'https://www.mdpi.com/2075-4418/14/7/719' },
  // 2023
  { y: '2023', cat: 'ph', title: 'Machine Learning to Detect Pulmonary Hypertension at Point-of-Care', journal: 'Circulation Supplements', n: '', meta: 'Conference abstract · AHA 2023', doi: 'https://www.ahajournals.org/doi/abs/10.1161/circ.148.suppl_1.14663' },
  { y: '2023', cat: 'ph', title: 'A Supervised Machine-Learned Algorithm to Identify Pulmonary Hypertension in Patients with New Onset Symptoms', journal: 'American Journal of Respiratory and Critical Care Medicine', n: '', meta: 'Conference abstract · ATS 2023', doi: 'https://academic.oup.com/ajrccm/article/207/Supplement_1/A2512/8546701' },
  { y: '2023', cat: 'cad', title: 'Machine Learning Algorithms: Selection of Appropriate Validation Populations for Cardiology Research—Be Careful!', journal: 'JACC: Advances', n: '', meta: 'Population analysis', doi: 'https://www.jacc.org/doi/10.1016/j.jacadv.2022.100166' },
  // 2022
  { y: '2022', cat: 'lvedp', title: 'Identifying Novel Phenotypes of Elevated Left Ventricular End Diastolic Pressure', journal: 'JACC Supplements', n: '', meta: 'Conference abstract · ACC 2022', doi: 'https://www.jacc.org/doi/10.1016/S0735-1097%2822%2902991-6' },
  { y: '2022', cat: 'lvedp', title: 'Multicenter validation of a machine learning phase space electro-mechanical pulse wave analysis to predict elevated left ventricular end diastolic pressure at the point-of-care', journal: 'PLOS ONE', n: '', meta: 'Multicenter validation', doi: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0277300' },
  { y: '2022', cat: 'lvedp', title: 'Identifying Novel Phenotypes of Elevated Left Ventricular End Diastolic Pressure Using Machine Learning', journal: 'Frontiers in Cardiovascular Medicine', n: '', meta: 'Machine learning analysis', doi: 'https://www.frontiersin.org/journals/cardiovascular-medicine/articles/10.3389/fcvm.2022.980625/full' },
  { y: '2022', cat: 'cad', title: 'Development and Validation of a Machine-Learned Algorithm to Identify Functionally Significant Coronary Artery Disease', journal: 'Frontiers in Cardiovascular Medicine', n: '', meta: 'Algorithm development & validation', doi: 'https://www.frontiersin.org/journals/cardiovascular-medicine/articles/10.3389/fcvm.2022.956147/full' },
  // 2021
  { y: '2021', cat: 'pcwp', title: 'Machine Learning — At the Heart of Failure Diagnosis', journal: 'Current Opinion in Cardiology', n: '', meta: 'Review', doi: 'https://doi.org/10.1097/hco.0000000000000833' },
  { y: '2021', cat: 'cad', title: 'Predicting Cardiac Disease from Interactions of Simultaneously-Acquired Hemodynamic and Cardiac Signals', journal: 'Computer Methods and Programs in Biomedicine', n: '', meta: 'Signal analysis study', doi: 'https://www.sciencedirect.com/science/article/pii/S0169260721000456' },
  // 2020
  { y: '2020', cat: 'lvedp', title: 'First-in-Man Development of a Machine Learning Cardiac Phase Space Analytic Approach to Predict Elevated Left Ventricular Pressures', journal: 'JACC Supplements', n: '', meta: 'Conference abstract · ACC 2020', doi: 'https://www.jacc.org/doi/full/10.1016/S0735-1097(20)34122-X' },
  // 2018
  { y: '2018', cat: 'cad', title: 'TCT-233: Machine-Learned Algorithms Utilizing Novel Tomography for Evaluating Coronary Artery Disease', journal: 'JACC Supplements', n: '', meta: 'Conference abstract · TCT 2018', doi: 'https://www.jacc.org/doi/full/10.1016/j.jacc.2018.08.1358' },
  { y: '2018', cat: 'cad', title: 'TCT-232: Diagnostic Accuracy of Machine-Learned Algorithms Utilizing a Novel Form of cPST vs SPECT', journal: 'JACC Supplements', n: '', meta: 'Conference abstract · TCT 2018', doi: 'https://www.jacc.org/doi/full/10.1016/j.jacc.2018.08.1357' },
  // 2017
  { y: '2017', cat: 'cad', title: 'TCT-154: Gender-Based Assessment of Coronary Artery Disease by Cardiac Phase Tomography Using Machine-Learned Algorithms', journal: 'JACC Supplements', n: '', meta: 'Conference abstract · TCT 2017', doi: 'https://www.jacc.org/doi/full/10.1016/j.jacc.2017.09.218' },
  { y: '2017', cat: 'cad', title: 'TCT-177: Assessing Coronary Artery Disease by Cardiac Phase Tomography Using Machine-Learned Algorithms in Obese and Elderly Subjects', journal: 'JACC Supplements', n: '', meta: 'Conference abstract · TCT 2017', doi: 'https://www.jacc.org/doi/full/10.1016/j.jacc.2017.09.245' },
  { y: '2017', cat: 'cad', title: 'CADLAD Study — Early Analysis of Ejection Fraction Evaluation', journal: 'JACC Supplements', n: '', meta: 'Conference abstract · ACC 2017', doi: 'https://www.jacc.org/doi/full/10.1016/S0735-1097(17)34342-5' },
  // 2013
  { y: '2013', cat: 'cad', title: 'Reliable Estimation of Left Ventricular Ejection Fraction Using High Resolution Surface Electrocardiography', journal: 'Circulation Supplements', n: '', meta: 'Conference abstract · AHA 2013', doi: 'https://www.ahajournals.org/doi/abs/10.1161/circ.128.suppl_22.A16785' },
];

export function EvidencePage() {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? STUDIES
    : filter === 'pcwp' ? STUDIES.filter(s => s.cat === 'pcwp' || s.cat === 'lvedp')
    : STUDIES.filter(s => s.cat === filter);

  return (
    <div className="page-fade" data-screen-label="05 Evidence" data-page="evidence">
      <div className="subhero">
        <div className="container">
          <Eyebrow>Clinical Evidence</Eyebrow>
          <h1 style={{ marginTop: 28 }}>
            The science <span className="em">behind</span> every report.
          </h1>
          <p className="lead">
            CorVista is supported by more than 30 peer-reviewed publications, conference abstracts, and posters — spanning over a decade of development and validated across leading cardiology programs worldwide.
          </p>
        </div>
      </div>

      <Section>
        <div className="row row-4">
          <Stat label="Publications & abstracts" value="30" unit="+" desc="Peer-reviewed papers and conference abstracts." />
          <Stat label="Patients studied" value="11K" unit="+" desc="Across CAD, PH, and PCWP cohorts." />
          <Stat label="Clinical sites" value="40" unit="+" desc="In the US, EU, Canada, and China." />
          <Stat label="Years of evidence" value="13" unit="+" desc="Spanning CAD, PH, and heart failure." />
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Publications" title="Browse the evidence." />
        <Tabs label="Filter studies"
          value={filter}
          onChange={setFilter}
          items={[
            { id: 'all', label: 'All studies' },
            { id: 'cad', label: 'CAD' },
            { id: 'ph', label: 'Pulmonary hypertension' },
            { id: 'pcwp', label: 'PCWP · Heart failure' },
          ]}
        />
        <p role="status" className="sr-only">{filtered.length} studies shown.</p>
        <div>
          {filtered.map((s, i) => (
            <div key={i} className="evidence-row" style={{ display: 'grid', gridTemplateColumns: '80px 1fr 240px 140px 80px', gap: 32, padding: '24px 0', borderTop: '1px solid var(--rule)', alignItems: 'center' }}>
              <div className="meta">{s.y}</div>
              <div>
                <div style={{ fontSize: 19, lineHeight: 1.25, letterSpacing: '-0.015em', fontWeight: 500, textWrap: 'pretty' }}>{s.title}</div>
                <div className="meta" style={{ marginTop: 6 }}>{s.journal} · {s.meta}</div>
              </div>
              <div className="meta evidence-n">{s.n}</div>
              <div><span className="chip chip-blue" style={s.cat === 'pcwp' || s.cat === 'lvedp' ? { color: '#7C5CFC', borderColor: '#7C5CFC' } : s.cat === 'ph' ? { color: '#2E9E6B', borderColor: '#2E9E6B' } : {}}>{s.cat === 'pcwp' ? 'PCWP' : s.cat === 'lvedp' ? 'LVEDP' : s.cat.toUpperCase()}</span></div>
              {s.doi ? <a href={s.doi} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--f-mono)', fontSize: 12, textAlign: 'right' }} className="ilink evidence-doi">DOI →</a> : <div />}
            </div>
          ))}
        </div>
      </Section>

    </div>
  );
}
