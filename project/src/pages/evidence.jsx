/* global React, Eyebrow, Section, SectionHeader, Tabs, NavA, Stat */

const { useState: useStateEv } = React;

function EvidencePage() {
  const [filter, setFilter] = useStateEv('all');
  const studies = [
    { y: '2024', cat: 'cad', title: 'Diagnostic Accuracy of Machine-Learned Algorithms Utilizing Cardiac Phase Tomography vs SPECT in the Assessment of CAD', journal: 'JACC: Cardiovascular Imaging', n: 'n = 1,968', meta: 'Pivotal study · PRIDE-CAD' },
    { y: '2024', cat: 'ph', title: 'Noninvasive Detection of Pulmonary Hypertension Using Resting Phase Signals and Advanced Machine Learning', journal: 'Pulmonary Circulation', n: 'n = 524', meta: 'Multi-center · 9 sites' },
    { y: '2023', cat: 'cad', title: 'Coronary Artery Disease Learning and Algorithm Development Study (CADLAD)', journal: 'Mayo Clinic Proceedings', n: 'n = 2,209', meta: 'Development cohort' },
    { y: '2023', cat: 'ph', title: 'Cardiac Phase Space Tomography: A Novel Method of Assessing Coronary Artery Disease Utilizing Machine Learning', journal: 'European Heart Journal — Digital Health', n: 'n = 712', meta: 'Validation' },
    { y: '2022', cat: 'cad', title: 'Gender-Based Assessment of CAD by Cardiac Phase Tomography Using Machine-Learned Algorithms (TCT-154)', journal: 'TCT Scientific Symposium', n: 'n = 1,486', meta: 'Sub-analysis' },
    { y: '2022', cat: 'lvef', title: 'Assessing Reduced LVEF Using Resting Biosignals and Machine Learning', journal: 'JACC: Heart Failure', n: 'n = 612', meta: 'First-in-human' },
    { y: '2021', cat: 'cad', title: 'Assessing CAD by Cardiac Phase Tomography in Obese and Elderly Subjects (TCT-177)', journal: 'TCT Scientific Symposium', n: 'n = 824', meta: 'Sub-analysis' },
    { y: '2021', cat: 'cad', title: 'Machine-Learned Algorithms Utilizing Novel Tomography for Evaluating CAD (TCT-233)', journal: 'TCT Scientific Symposium', n: 'n = 1,124', meta: 'Abstract' },
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

      {/* Headline stats */}
      <Section>
        <div className="row row-4">
          <Stat label="Peer-reviewed" value="50" unit="+" desc="Publications and conference abstracts." />
          <Stat label="Patients studied" value="20K" unit="+" desc="Across CAD, PH, and LVEF cohorts." />
          <Stat label="Clinical sites" value="40" unit="+" desc="In the US, EU, and Canada." />
          <Stat label="Years of data" value="9" unit="" desc="Since the founding CADLAD study." />
        </div>
      </Section>

      {/* Filterable publication list */}
      <Section>
        <SectionHeader eyebrow="Publications" title="Browse the evidence." />
        <Tabs
          value={filter}
          onChange={setFilter}
          items={[
            { id: 'all', label: 'All studies' },
            { id: 'cad', label: 'CAD' },
            { id: 'ph', label: 'Pulmonary hypertension' },
            { id: 'lvef', label: 'LVEF · Heart failure' },
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
              <div><span className="chip chip-blue">{s.cat.toUpperCase()}</span></div>
              <a href="#" style={{ fontFamily: 'var(--f-mono)', fontSize: 12, textAlign: 'right' }} className="ilink">PDF →</a>
            </div>
          ))}
        </div>
      </Section>

      {/* Trial table */}
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

Object.assign(window, { EvidencePage });
