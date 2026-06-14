/* global React, Eyebrow, Section, SectionHeader, Stat, NavA, ImgPh */

function InvestorsPage() {
  return (
    <div className="page-fade" data-screen-label="08 Investors" data-page="investors">
      <div className="subhero">
        <div className="container">
          <Eyebrow>Investors</Eyebrow>
          <h1 style={{ marginTop: 28 }}>
            Building the new <span className="em">front line</span> of cardiovascular care.
          </h1>
          <p className="lead">
            CorVista is commercializing the world's most comprehensive front-line cardiovascular test — addressing a multi-billion-dollar gap in the diagnostic pathway for CAD, PH, and heart failure.
          </p>
        </div>
      </div>

      {/* Headline KPIs */}
      <Section>
        <div className="row row-4">
          <Stat label="Addressable population, US" value="50M" unit="+" desc="Adults symptomatic for cardiovascular disease." />
          <Stat label="Diagnostic market, US" value="$24B" desc="Annual spend on cardiovascular diagnostics." />
          <Stat label="PH care cost reduction" value="−44" unit="%" desc="Demonstrated with CorVista at the front line." />
          <Stat label="Capital raised" value="$110M" desc="Across Series A, B, and C." />
        </div>
      </Section>

      {/* Why now */}
      <Section dark>
        <div className="row row-2" style={{ gridTemplateColumns: '1fr 1.4fr', gap: 80, alignItems: 'start' }}>
          <div><Eyebrow><span style={{ color: '#98A2B3' }}>The thesis</span></Eyebrow></div>
          <div>
            <h2 style={{ color: '#F4F6F9', fontSize: 'clamp(36px, 4.4vw, 64px)' }}>
              The front-line cardiovascular test hasn't changed in 40 years. <span className="serif-i" style={{ color: '#5BAFE8' }}>It's time.</span>
            </h2>
            <ul className="bullets" style={{ marginTop: 36 }}>
              <li><span style={{ color: '#F4F6F9' }}>Half of all heart attacks happen without prior symptoms. The first conversation in primary care is the highest-leverage moment in the entire pathway.</span></li>
              <li><span style={{ color: '#F4F6F9' }}>Resting ECG, stress, and SPECT each address a fraction of the problem. CorVista is a single, comprehensive test.</span></li>
              <li><span style={{ color: '#F4F6F9' }}>Machine-learned signal reconstruction has crossed the accuracy threshold required to replace incumbent first-line tests.</span></li>
              <li><span style={{ color: '#F4F6F9' }}>FDA clearance, reimbursement, and a 50+ paper evidence base de-risk the commercial path.</span></li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Commercial momentum */}
      <Section>
        <SectionHeader eyebrow="Commercial momentum" title="What we're seeing in 2026." />
        <div className="row row-3">
          {[
            { t: 'Site activations', v: '40+', d: 'Cardiology and primary care sites operating CorVista as of Q1 2026.' },
            { t: 'Quarter-over-quarter growth', v: '+62%', d: 'Test volume growth Q4 2025 → Q1 2026.' },
            { t: 'Net revenue retention', v: '128%', d: 'From accounts active >12 months.' },
          ].map(s => (
            <div key={s.t} style={{ borderTop: '1px solid var(--ink)', paddingTop: 24 }}>
              <h6 style={{ fontFamily: 'var(--f-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--fg-muted)' }}>{s.t}</h6>
              <div className="stat-num" style={{ fontSize: 'clamp(56px, 6vw, 96px)', marginTop: 16 }}>{s.v}</div>
              <p style={{ marginTop: 14, color: 'var(--fg-muted)', fontSize: 14, maxWidth: 36 + 'ch' }}>{s.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Documents */}
      <Section>
        <SectionHeader eyebrow="Investor materials" title="Documents." />
        <div style={{ borderTop: '1px solid var(--rule)' }}>
          {[
            ['Investor update — May 2026', 'PDF · 12 pages', 'May 2026'],
            ['Pivotal CAD study summary', 'PDF · 4 pages', 'Apr 2026'],
            ['Corporate fact sheet', 'PDF · 2 pages', 'Mar 2026'],
            ['ESG & responsible AI policy', 'PDF · 6 pages', 'Feb 2026'],
          ].map(([t, m, d], i) => (
            <a key={i} href="#" style={{ display: 'grid', gridTemplateColumns: '1fr 200px 140px 60px', gap: 32, padding: '24px 0', borderBottom: '1px solid var(--rule)', alignItems: 'center' }} className="hover-lift">
              <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.01em' }}>{t}</div>
              <div className="meta">{m}</div>
              <div className="meta">{d}</div>
              <span style={{ textAlign: 'right', fontFamily: 'var(--f-mono)', fontSize: 14 }} className="ilink">PDF →</span>
            </a>
          ))}
        </div>
      </Section>

      {/* Contact */}
      <Section dark>
        <div className="row row-2" style={{ gap: 64, alignItems: 'end' }}>
          <h2 style={{ color: '#F4F6F9', maxWidth: '18ch', fontSize: 'clamp(36px, 5vw, 72px)' }}>
            Talk to <span className="serif-i" style={{ color: '#5BAFE8' }}>investor relations.</span>
          </h2>
          <div>
            <div style={{ marginBottom: 24 }}>
              <div className="meta" style={{ color: '#98A2B3' }}>Investor relations</div>
              <div style={{ color: '#F4F6F9', fontSize: 22, marginTop: 4 }}>ir@corvista.com</div>
            </div>
            <div>
              <div className="meta" style={{ color: '#98A2B3' }}>Media</div>
              <div style={{ color: '#F4F6F9', fontSize: 22, marginTop: 4 }}>press@corvista.com</div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

Object.assign(window, { InvestorsPage });
