import React from 'react';
import { Eyebrow, Section, SectionHeader, Stat, NavA, navTo } from '../components.jsx';

function useReveal(threshold = 0.15) {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

const MILESTONES = [
  { status: 'done', date: '2023', title: 'FDA Clearance — CAD', detail: 'CorVista System cleared for coronary artery disease indication.', code: null },
  { status: 'done', date: '2024', title: 'FDA Clearance — PH', detail: 'Pulmonary hypertension indication cleared. CPT unlisted code 93799 enabled case-by-case reimbursement.', code: null },
  { status: 'done', date: 'Jul 2026', title: 'FDA Clearance — PCWP', detail: 'Pulmonary capillary wedge pressure / heart failure indication cleared.', code: null },
  { status: 'done', date: 'May 2026', title: 'CPT Category III Code Accepted', detail: 'AMA Editorial Panel accepted CPT 1104T with ACC endorsement. The first trackable reimbursement path for CorVista.', code: 'CPT 1104T' },
  { status: 'active', date: '2026–2027', title: 'Novitas MAC Pricing + Medicare Revenue', detail: '3–4 months post Category III acceptance. Nominal Medicare coverage enables first reimbursed scaling.', code: null },
  { status: 'future', date: '1H 2027', title: 'First Commercial Payor Contracts', detail: 'Technology assessment and medical coverage review underway with commercial health plans.', code: null },
  { status: 'future', date: '4Q 2028', title: 'CPT Category I Code Submission', detail: 'Durable Medicare and commercial coverage — the permanent standard. Industry median for this step is 5.7 years; CorVista is tracking 2+ years ahead.', code: null },
];

export function ReimbursementPage() {
  const [barRef, barVisible] = useReveal(0.2);

  return (
    <div className="page-fade" data-screen-label="Reimbursement" data-page="reimbursement">
      <div className="subhero">
        <div className="container">
          <Eyebrow>Reimbursement</Eyebrow>
          <h1 style={{ marginTop: 28 }}>
            Coverage that keeps <span className="em">pace.</span>
          </h1>
          <p className="lead">
            CorVista is tracking more than two years ahead of the industry median for FDA clearance to Medicare coverage — structured to scale in step with reimbursement, not ahead of it.
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 36, flexWrap: 'wrap' }}>
            <NavA to="contact" className="btn btn-primary">Speak with our reimbursement team<span className="arrow">→</span></NavA>
          </div>
        </div>
      </div>

      <Section>
        <div className="row row-3" style={{ gap: 0, borderTop: '1px solid var(--rule)' }}>
          <div style={{ padding: '32px 32px 32px 0', borderRight: '1px solid var(--rule)' }}>
            <div className="stat-label">CPT code</div>
            <div style={{ fontFamily: 'var(--f-sans)', fontSize: 'clamp(36px, 4.5vw, 60px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--blue)', marginTop: 8, lineHeight: 1 }}>
              1104T
            </div>
            <p style={{ marginTop: 12, fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.5 }}>CPT Category III code accepted May 2026, ACC-endorsed. The active reimbursement pathway for CorVista today.</p>
          </div>
          <div style={{ padding: '32px', borderRight: '1px solid var(--rule)' }}>
            <div className="stat-label">Pricing benchmark range</div>
            <div style={{ fontFamily: 'var(--f-sans)', fontSize: 'clamp(28px, 3.5vw, 46px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--blue)', marginTop: 8, lineHeight: 1 }}>
              $150–$1,350
            </div>
            <p style={{ marginTop: 12, fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.5 }}>Per test. HeartFlow CPT comparator: $950. Advanced AI cardiac diagnostics: $877–$950. Benchmark reflects comparable cardiac AI procedures.</p>
          </div>
          <div style={{ padding: '32px 0 32px 32px' }}>
            <div className="stat-label">Ahead of industry median</div>
            <div style={{ fontFamily: 'var(--f-sans)', fontSize: 'clamp(36px, 4.5vw, 60px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--blue)', marginTop: 8, lineHeight: 1 }}>
              2+ <span style={{ fontSize: '0.5em', verticalAlign: 'middle', fontWeight: 700 }}>yrs</span>
            </div>
            <p style={{ marginTop: 12, fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.5 }}>Industry median: 5.7 years from FDA clearance to Medicare coverage (JAMA Health Forum, 2023). CorVista projected: 3.5 years.</p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="row row-2" style={{ gap: 80, alignItems: 'start' }}>
          <div>
            <SectionHeader eyebrow="Coverage timeline" title="Milestone by milestone." />
            <div className="reimb-timeline">
              {MILESTONES.map((m, i) => (
                <div key={i} className="reimb-item">
                  <div className={`reimb-dot ${m.status}`}>
                    {m.status === 'done' ? (
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    ) : m.status === 'active' ? (
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--blue)' }} />
                    ) : (
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--mid)' }} />
                    )}
                  </div>
                  <div className="reimb-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <div className="reimb-content-title">{m.title}</div>
                      {m.code && (
                        <span style={{
                          fontFamily: 'var(--f-mono)', fontSize: 10, padding: '2px 8px',
                          border: '1px solid var(--blue)', color: 'var(--blue)',
                          borderRadius: 999, letterSpacing: '0.1em'
                        }}>{m.code}</span>
                      )}
                    </div>
                    <div className="reimb-content-meta">{m.detail}</div>
                    <div className="reimb-content-date">{m.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader eyebrow="Speed comparison" title="2+ years ahead of the industry." />
            <p style={{ fontSize: 15, color: 'var(--fg-muted)', lineHeight: 1.65, marginBottom: 32 }}>
              The JAMA Health Forum (2023) found the median time from FDA clearance to Medicare coverage for novel medical technologies is 5.7 years. CorVista is on track to reach durable Medicare coverage in approximately 3.5 years — enabling commercial scale timed to reimbursement, not ahead of it.
            </p>
            <div ref={barRef} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { label: 'Industry median', years: 5.7, total: 7, color: 'var(--mid)' },
                { label: 'CorVista projected', years: 3.5, total: 7, color: 'var(--blue)' },
              ].map((bar, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-muted)' }}>{bar.label}</span>
                    <span style={{ fontFamily: 'var(--f-sans)', fontSize: 13, fontWeight: 700, color: bar.color }}>{bar.years} yrs</span>
                  </div>
                  <div style={{ background: 'var(--paper-2)', borderRadius: 3, height: 10, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 3, background: bar.color,
                      width: barVisible ? `${(bar.years / bar.total) * 100}%` : '0%',
                      transition: `width 1.2s cubic-bezier(.16,1,.3,1) ${i * 200}ms`
                    }} />
                  </div>
                </div>
              ))}
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--mid-2)', letterSpacing: '0.04em', marginTop: 4 }}>
                Source: Sexton ZA, et al. Time From FDA Authorization to Medicare Coverage for Novel Technologies. JAMA Health Forum. 2023.
              </div>
            </div>

            <div style={{ marginTop: 48, padding: 28, background: 'var(--blue-tint)', border: '1px solid #A8D4EF', borderRadius: 6 }}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--blue-deep)', marginBottom: 12 }}>For clinicians — today</div>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--ink)' }}>
                CorVista is billable today under CPT 1104T (Category III). Our reimbursement team provides practice-specific billing guidance, documentation support, and prior authorization templates. Case-by-case reimbursement is available pending commercial coverage decisions.
              </p>
              <NavA to="contact" className="btn btn-ghost" style={{ marginTop: 16, display: 'inline-flex', fontSize: 14 }}>
                Talk to our billing team<span className="arrow">→</span>
              </NavA>
            </div>
          </div>
        </div>
      </Section>

      <Section dark>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 40 }}>
          <div style={{ maxWidth: '30ch' }}>
            <Eyebrow><span style={{ color: '#98A2B3' }}>Get started</span></Eyebrow>
            <h2 style={{ color: '#F4F6F9', marginTop: 20, fontSize: 'clamp(36px, 4.5vw, 64px)' }}>
              Questions about <span className="serif-i" style={{ color: 'var(--blue)' }}>billing?</span>
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <NavA to="contact" className="btn btn-primary">Contact reimbursement team<span className="arrow">→</span></NavA>
            <NavA to="evidence" className="btn btn-ghost">Clinical evidence<span className="arrow">→</span></NavA>
          </div>
        </div>
      </Section>
    </div>
  );
}
