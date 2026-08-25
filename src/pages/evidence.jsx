import React, { useState } from 'react';
import { Eyebrow, Section, SectionHeader, Tabs, NavA, Stat } from '../components.jsx';

export function EvidencePage() {
  const [filter, setFilter] = useState('all');
  const studies = [
    { y: '2026', cat: 'cad', title: 'Utility of a Novel Point-of-Care Test in Detecting Coronary Artery Disease Following Negative Nuclear Testing: A Case Series', journal: 'European Heart Journal — Case Reports', n: 'n = 5 cases', meta: 'Case series', doi: 'https://doi.org/10.1093/ehjcr/ytag016' },
    { y: '2026', cat: 'cad', title: 'Noninvasive Detection of Ischemia in Patients with Functionally Significant Coronary Artery Disease (ACC.26)', journal: 'JACC Supplements', n: '', meta: 'Conference abstract · ACC 2026', doi: '' },
    { y: '2026', cat: 'cad', title: 'CorVista CAD Algorithm Identifies Patients with Ischemia with Non-Obstructive Coronary Arteries (INOCA) (ACC.26)', journal: 'JACC Supplements', n: '', meta: 'Conference abstract · ACC 2026', doi: '' },
    { y: '2026', cat: 'ph', title: 'Improving Trust in AI Diagnosis of Pulmonary Hypertension with Patient-Specific Insight', journal: 'Intelligence-Based Medicine', n: 'n = 252', meta: 'Explainability study · PHLEX/PHGEX', doi: 'https://doi.org/10.1016/j.ibmed.2026.100390' },
    { y: '2025', cat: 'cad', title: 'Efficacy of a US-Developed Machine-Learned Coronary Artery Disease Algorithm in China', journal: 'Discover Medicine', n: 'n = 458', meta: 'International validation', doi: 'https://doi.org/10.1007/s44337-025-00255-3' },
    { y: '2025', cat: 'ph', title: 'Facilitating Earlier Diagnosis of Pulmonary Hypertension Using a Novel Noninvasive Diagnostic', journal: 'JACC: Case Reports', n: 'n = 4 cases', meta: 'Case series', doi: 'https://doi.org/10.1016/j.jaccas.2025.104876' },
    { y: '2025', cat: 'ph', title: 'Clinical Validation of a Machine-Learned, Point-of-Care System to IDENTIFY Pulmonary Hypertension', journal: 'ERJ Open Research', n: 'n = 462', meta: 'Prospective · 18 sites', doi: 'https://doi.org/10.1183/23120541.01287-2024' },
    { y: '2025', cat: 'pcwp', title: 'Development of a Machine-Learned Algorithm for Noninvasive Assessment of Pulmonary Capillary Wedge Pressure (ACC.25)', journal: 'JACC Supplements', n: 'n = 283', meta: 'Conference abstract · ACC 2025', doi: '' },
    { y: '2025', cat: 'pcwp', title: 'Validation of a Noninvasive Machine-Learned Algorithm for PCWP Assessment in Symptomatic Patients (AHA 2025)', journal: 'Circulation Supplements', n: 'n = 255', meta: 'Conference abstract · AHA 2025', doi: 'https://doi.org/10.1161/circ.152.suppl_3.4365733' },
    { y: '2025', cat: 'pcwp', title: 'Noninvasive PCWP Algorithm for Identifying Heart Failure Populations in Clinical Settings (HFSA 2025)', journal: 'Journal of Cardiac Failure', n: '', meta: 'Conference abstract · HFSA 2025', doi: '' },
    { y: '2025', cat: 'pcwp', title: 'Physiological Insights into a Machine-Learned Algorithm for Noninvasive PCWP Detection (HFSA 2025)', journal: 'Journal of Cardiac Failure', n: 'n = 283', meta: 'Conference abstract · HFSA 2025', doi: '' },
    { y: '2024', cat: 'cad', title: 'Clinical Validation of a Machine-Learned, Point-of-Care System to IDENTIFY Functionally Significant Coronary Artery Disease', journal: 'Diagnostics', n: 'n = 1,816', meta: 'IDENTIFY trial · 18 sites', doi: 'https://doi.org/10.3390/diagnostics14100987' },
    { y: '2024', cat: 'cad', title: 'Signal Acquisition, Score Interpretation, and Economics of a Non-Invasive Point-of-Care Test for Coronary Artery Disease', journal: 'Journal of Visualized Experiments', n: '', meta: 'Methods & economics', doi: 'https://doi.org/10.3791/66933' },
  ];
  const filtered = filter === 'all' ? studies : studies.filter(s => s.cat === filter);

  return (
    <div className="page-fade" data-screen-label="05 Evidence" data-page="evidence">
      <div className="subhero">
        <div className="container">
          <Eyebrow>Clinical Evidence</Eyebrow>
          <h1 style={{ marginTop: 28 }}>
            The science <span className="em">behind</span> every report.
          </h1>
          <p className="lead">
            CorVista is supported by more than 50 peer-reviewed publications, abstracts, and posters — and continues to be validated through real-world deployment across leading cardiology programs.
          </p>
        </div>
      </div>

      <Section>
        <div className="row row-4">
          <Stat label="Peer-reviewed" value="50" unit="+" desc="Publications and conference abstracts." />
          <Stat label="Patients studied" value="20K" unit="+" desc="Across CAD, PH, and PCWP cohorts." />
          <Stat label="Clinical sites" value="40" unit="+" desc="In the US, EU, Canada, and China." />
          <Stat label="Years of data" value="9" unit="" desc="Spanning CAD, PH, and heart failure." />
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Publications" title="Browse the evidence." />
        <Tabs
          value={filter}
          onChange={setFilter}
          items={[
            { id: 'all', label: 'All studies' },
            { id: 'cad', label: 'CAD' },
            { id: 'ph', label: 'Pulmonary hypertension' },
            { id: 'pcwp', label: 'PCWP · Heart failure' },
          ]}
        />
        <div>
          {filtered.map((s, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 240px 140px 80px', gap: 32, padding: '24px 0', borderTop: '1px solid var(--rule)', alignItems: 'center' }}>
              <div className="meta">{s.y}</div>
              <div>
                <div style={{ fontSize: 19, lineHeight: 1.25, letterSpacing: '-0.015em', fontWeight: 500, textWrap: 'pretty' }}>{s.title}</div>
                <div className="meta" style={{ marginTop: 6 }}>{s.journal} · {s.meta}</div>
              </div>
              <div className="meta">{s.n}</div>
              <div><span className={`chip chip-blue`} style={s.cat === 'pcwp' ? { color: '#7C5CFC', borderColor: '#7C5CFC' } : s.cat === 'ph' ? { color: '#2E9E6B', borderColor: '#2E9E6B' } : {}}>{s.cat === 'pcwp' ? 'PCWP' : s.cat.toUpperCase()}</span></div>
              {s.doi ? <a href={s.doi} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--f-mono)', fontSize: 12, textAlign: 'right' }} className="ilink">DOI →</a> : <div />}
            </div>
          ))}
        </div>
      </Section>

      <Section dark>
        <SectionHeader eyebrow={<span style={{ color: '#98A2B3' }}>Clinical trials</span>} title={<span style={{ color: '#F4F6F9' }}>Active studies and regulatory milestones.</span>} />
        <div style={{ borderTop: '1px solid #1F2A3D', borderBottom: '1px solid #1F2A3D' }}>
          {[
            ['CV-PRIDE', 'Pivotal — CAD assessment', 'Completed', '2024'],
            ['CV-PH-VALIDATE', 'PH detection in symptomatic patients', 'Enrolling', '2025'],
            ['CV-HF-EARLY', 'Reduced LVEF screening in primary care', 'Initiated', '2026'],
            ['FDA 510(k)', 'CAD indication clearance', 'Cleared', '2023'],
            ['CE Mark', 'EU MDR certification', 'Active', '2024'],
          ].map(([name, desc, status, year], i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '220px 1fr 160px 100px', gap: 32, padding: '24px 0', borderBottom: i < 4 ? '1px solid #1F2A3D' : 0, alignItems: 'center', color: '#F4F6F9' }}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: '#5BAFE8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{name}</div>
              <div style={{ fontSize: 18 }}>{desc}</div>
              <div className="chip" style={{ color: status === 'Cleared' || status === 'Completed' ? '#5BAFE8' : '#98A2B3', borderColor: status === 'Cleared' || status === 'Completed' ? '#5BAFE8' : '#1F2A3D' }}>{status}</div>
              <div className="meta" style={{ color: '#98A2B3', textAlign: 'right' }}>{year}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
