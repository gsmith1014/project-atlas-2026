import React, { useState } from 'react';
import { Eyebrow, Section, SectionHeader, NavA } from '../components.jsx';

const CPT_CODE = {
  code: '1104T',
  category: 'Category III',
  effective: 'October 1, 2026',
  description: 'Noninvasive cardiopulmonary assessment, including quantitative parameters, respectively predictive of significant epicardial coronary artery disease, pulmonary hypertension, and/or elevated pulmonary capillary wedge pressure, derived by augmentative algorithmic analysis of orthogonal voltage gradient and photoplethysmography signals, with automated report',
  note: 'Category III codes track emerging technologies. A Medicare reimbursement rate has not been published. Coverage is available on a case-by-case basis; contact the CorVista reimbursement team for practice-specific billing support.',
};

const INDICATIONS = [
  {
    key: 'cad',
    abbr: 'CAD',
    label: 'Coronary Artery Disease',
    sublabel: 'CAD Add-on',
    codes: [
      { code: 'I25.1',   desc: 'Atherosclerotic heart disease of native coronary artery' },
      { code: 'I25.10',  desc: 'Atherosclerotic heart disease of native coronary artery without angina pectoris' },
      { code: 'I25.11',  desc: 'Atherosclerotic heart disease of native coronary artery with angina pectoris' },
      { code: 'I25.110', desc: 'Atherosclerotic heart disease of native coronary artery with unstable angina pectoris' },
      { code: 'I25.111', desc: 'Atherosclerotic heart disease of native coronary artery with angina pectoris with documented spasm' },
      { code: 'I25.112', desc: 'Atherosclerotic heart disease of native coronary artery with refractory angina pectoris' },
      { code: 'I25.118', desc: 'Atherosclerotic heart disease of native coronary artery with other forms of angina pectoris' },
      { code: 'I25.119', desc: 'Atherosclerotic heart disease of native coronary artery with unspecified angina pectoris' },
      { code: 'I25.5',   desc: 'Ischemic cardiomyopathy' },
      { code: 'I20.0',   desc: 'Unstable angina' },
      { code: 'I20.1',   desc: 'Angina pectoris with documented spasm' },
      { code: 'I20.81',  desc: 'Angina pectoris with coronary microvascular dysfunction' },
      { code: 'I20.89',  desc: 'Other forms of angina pectoris' },
      { code: 'I20.9',   desc: 'Angina pectoris, unspecified' },
      { code: 'I24.89',  desc: 'Other forms of acute ischemic heart disease' },
      { code: 'I24.9',   desc: 'Acute ischemic heart disease, unspecified' },
    ],
  },
  {
    key: 'ph',
    abbr: 'PH',
    label: 'Pulmonary Hypertension',
    sublabel: 'PH Add-on',
    codes: [
      { code: 'I27.0',   desc: 'Primary pulmonary hypertension' },
      { code: 'I27.2',   desc: 'Other secondary pulmonary hypertension' },
      { code: 'I27.20',  desc: 'Pulmonary hypertension, unspecified' },
      { code: 'I27.21',  desc: 'Secondary pulmonary arterial hypertension' },
      { code: 'I27.22',  desc: 'Pulmonary hypertension due to left heart disease' },
      { code: 'I27.23',  desc: 'Pulmonary hypertension due to lung diseases and hypoxia' },
      { code: 'I27.24',  desc: 'Chronic thromboembolic pulmonary hypertension' },
      { code: 'I27.29',  desc: 'Other secondary pulmonary hypertension' },
    ],
  },
  {
    key: 'pcwp',
    abbr: 'PCWP',
    label: 'Heart Failure',
    sublabel: 'PCWP Add-on',
    codes: [
      { code: 'I50.1',   desc: 'Left ventricular failure, unspecified' },
      { code: 'I50.20',  desc: 'Unspecified systolic (congestive) heart failure' },
      { code: 'I50.21',  desc: 'Acute systolic (congestive) heart failure' },
      { code: 'I50.22',  desc: 'Chronic systolic (congestive) heart failure' },
      { code: 'I50.23',  desc: 'Acute on chronic systolic (congestive) heart failure' },
      { code: 'I50.30',  desc: 'Unspecified diastolic (congestive) heart failure' },
      { code: 'I50.31',  desc: 'Acute diastolic (congestive) heart failure' },
      { code: 'I50.32',  desc: 'Chronic diastolic (congestive) heart failure' },
      { code: 'I50.33',  desc: 'Acute on chronic diastolic (congestive) heart failure' },
      { code: 'I50.810', desc: 'Right heart failure, unspecified' },
      { code: 'I50.812', desc: 'Chronic right heart failure' },
      { code: 'I50.813', desc: 'Acute on chronic right heart failure' },
      { code: 'I50.814', desc: 'Right heart failure due to left heart failure' },
      { code: 'I50.9',   desc: 'Heart failure, unspecified' },
      { code: 'I11.0',   desc: 'Hypertensive heart disease with heart failure' },
    ],
  },
];

const SHARED_CODES = [
  { code: 'I49.01',  desc: 'Ventricular fibrillation' },
  { code: 'I49.02',  desc: 'Ventricular flutter' },
  { code: 'I50.1',   desc: 'Left ventricular failure, unspecified' },
  { code: 'I51.89',  desc: 'Other ill-defined heart diseases' },
  { code: 'R06.00',  desc: 'Dyspnea, unspecified' },
  { code: 'R06.01',  desc: 'Orthopnea' },
  { code: 'R06.02',  desc: 'Shortness of breath' },
  { code: 'R06.09',  desc: 'Other forms of dyspnea' },
  { code: 'R06.1',   desc: 'Stridor' },
  { code: 'R06.2',   desc: 'Wheezing' },
  { code: 'R06.4',   desc: 'Hyperventilation' },
  { code: 'R07.2',   desc: 'Precordial pain' },
  { code: 'R07.82',  desc: 'Intercostal pain' },
  { code: 'R07.89',  desc: 'Other chest pain' },
  { code: 'R07.9',   desc: 'Chest pain, unspecified' },
  { code: 'R94.31',  desc: 'Abnormal electrocardiogram [ECG] [EKG]' },
  { code: 'Z01.810', desc: 'Encounter for preprocedural cardiovascular examination' },
];

function CodeTable({ codes }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--rule)' }}>
            <th style={{ textAlign: 'left', padding: '8px 20px 10px 0', fontFamily: 'var(--f-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-muted)', fontWeight: 500, width: 110, whiteSpace: 'nowrap' }}>ICD-10 Code</th>
            <th style={{ textAlign: 'left', padding: '8px 0 10px', fontFamily: 'var(--f-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-muted)', fontWeight: 500 }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {codes.map((row, i) => (
            <tr key={row.code + i} style={{ borderBottom: '1px solid var(--rule)' }}>
              <td style={{ padding: '11px 20px 11px 0', fontFamily: 'var(--f-mono)', fontSize: 13, color: 'var(--blue)', fontWeight: 600, whiteSpace: 'nowrap', verticalAlign: 'top' }}>{row.code}</td>
              <td style={{ padding: '11px 0', color: 'var(--fg)', lineHeight: 1.45, verticalAlign: 'top' }}>{row.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ReimbursementPage() {
  const [activeTab, setActiveTab] = useState('cad');
  const [sharedOpen, setSharedOpen] = useState(false);
  const active = INDICATIONS.find(i => i.key === activeTab);

  return (
    <div className="page-fade" data-screen-label="Reimbursement" data-page="reimbursement">
      <div className="subhero">
        <div className="container">
          <Eyebrow>Coding &amp; Coverage</Eyebrow>
          <h1 style={{ marginTop: 28 }}>
            Billing <span className="em">guidelines.</span>
          </h1>
          <p className="lead">
            For the CorVista System.
          </p>
        </div>
      </div>

      {/* CPT Code */}
      <Section>
        <SectionHeader eyebrow="CPT® Code" title="1104T" />
        <div style={{ border: '1px solid var(--rule)', borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'start' }}>
            <div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-muted)', marginBottom: 10 }}>CPT® Description</div>
              <p style={{ fontSize: 15, color: 'var(--fg)', lineHeight: 1.6, margin: 0 }}>{CPT_CODE.description}</p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-muted)', marginBottom: 8 }}>Effective Date</div>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--fg)', whiteSpace: 'nowrap' }}>{CPT_CODE.effective}</div>
              <div style={{ marginTop: 10 }}>
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, padding: '3px 10px', border: '1px solid var(--blue)', color: 'var(--blue)', borderRadius: 999 }}>
                  {CPT_CODE.category}
                </span>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--rule)', padding: '14px 24px', background: 'var(--blue-tint)' }}>
            <p style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.55, margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>Note: </strong>{CPT_CODE.note}
            </p>
          </div>
        </div>
      </Section>

      {/* ICD-10 by Indication */}
      <Section>
        <SectionHeader eyebrow="ICD-10-CM codes" title="Codes by indication." />
        <p style={{ marginTop: -16, marginBottom: 32, fontSize: 15, color: 'var(--fg-muted)', lineHeight: 1.6, maxWidth: '72ch' }}>
          Select the patient's primary indication to view commonly associated ICD-10 diagnosis codes drawn from the CorVista Clinical Dossier (Appendix A).
        </p>

        <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid var(--rule)', marginBottom: 32, overflowX: 'auto' }}>
          {INDICATIONS.map(ind => (
            <button
              key={ind.key}
              onClick={() => setActiveTab(ind.key)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === ind.key ? '2px solid var(--blue)' : '2px solid transparent',
                marginBottom: -2,
                padding: '10px 24px',
                cursor: 'pointer',
                fontFamily: 'var(--f-sans)',
                fontSize: 14,
                fontWeight: activeTab === ind.key ? 600 : 400,
                color: activeTab === ind.key ? 'var(--blue)' : 'var(--fg-muted)',
                whiteSpace: 'nowrap',
                transition: 'color 0.15s, border-color 0.15s',
              }}
            >
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, marginRight: 8, letterSpacing: '0.05em', opacity: 0.8 }}>{ind.abbr}</span>
              {ind.label}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 8 }}>
          <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-muted)' }}>
            ICD-10 codes commonly associated with a CorVista order — {active.sublabel}
          </span>
        </div>
        <CodeTable codes={active.codes} />
      </Section>

      {/* Shared codes accordion */}
      <Section>
        <div
          style={{ borderTop: '1px solid var(--rule)', borderBottom: sharedOpen ? 'none' : '1px solid var(--rule)' }}
        >
          <button
            onClick={() => setSharedOpen(o => !o)}
            style={{
              width: '100%', background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '20px 0', textAlign: 'left',
            }}
          >
            <div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-muted)', marginBottom: 4 }}>All indications</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--fg)', letterSpacing: '-0.01em' }}>ICD-10 codes applicable to any CorVista order</div>
            </div>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: 22, color: 'var(--blue)', flexShrink: 0, marginLeft: 24 }}>
              {sharedOpen ? '−' : '+'}
            </span>
          </button>
          {sharedOpen && (
            <div style={{ paddingBottom: 32, borderBottom: '1px solid var(--rule)' }}>
              <p style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.6, marginBottom: 24, maxWidth: '72ch' }}>
                The following codes may support medical necessity for a CorVista order regardless of the specific indication add-on ordered.
              </p>
              <CodeTable codes={SHARED_CODES} />
            </div>
          )}
        </div>

        <p style={{ marginTop: 24, fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.55 }}>
          Source: CorVista Clinical Dossier, Appendix A. This list is not exhaustive. Consult your compliance team for payer-specific documentation requirements.
        </p>
      </Section>

      {/* CTA */}
      <Section dark>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 40 }}>
          <div style={{ maxWidth: '36ch' }}>
            <Eyebrow><span style={{ color: '#98A2B3' }}>Billing support</span></Eyebrow>
            <h2 style={{ color: '#F4F6F9', marginTop: 20, fontSize: 'clamp(32px, 4vw, 56px)' }}>
              Questions about <span className="serif-i" style={{ color: 'var(--blue)' }}>coding?</span>
            </h2>
            <p style={{ color: '#C8D0DC', marginTop: 16, fontSize: 15, lineHeight: 1.6 }}>
              Our reimbursement team provides practice-specific billing guidance, documentation support, and prior authorization templates.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <NavA to="contact" className="btn btn-primary">Contact reimbursement team<span className="arrow">→</span></NavA>
            <NavA to="clinicians" className="btn btn-ghost">For clinicians<span className="arrow">→</span></NavA>
          </div>
        </div>
      </Section>
    </div>
  );
}
