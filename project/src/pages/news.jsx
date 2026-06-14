/* global React, Eyebrow, Section, SectionHeader, ImgPh, NavA, Tabs */

const { useState: useStateNews } = React;

const NEWS = [
  { date: '2026-04-22', cat: 'Press release', title: 'CorVista Health appoints Adrian Lam as President & CEO to lead commercial expansion.' },
  { date: '2026-03-14', cat: 'Press release', title: 'CorVista System achieves CE Mark under EU MDR for cardiovascular disease assessment.' },
  { date: '2026-02-02', cat: 'Article', title: 'A new world of non-invasive cardiac diagnostics: What CorVista changes at the point of care.' },
  { date: '2025-11-30', cat: 'Press release', title: 'CorVista presents long-term PH validation data at AHA Scientific Sessions 2025.' },
  { date: '2025-09-18', cat: 'Article', title: 'I was worried about artificial intelligence — until it saved my life.' },
  { date: '2025-07-08', cat: 'Press release', title: 'Pivotal CAD diagnostic accuracy data published in JACC: Cardiovascular Imaging.' },
  { date: '2025-05-22', cat: 'Podcast', title: 'Straight from the heart: rebuilding the front line of cardiovascular diagnostics.' },
  { date: '2025-04-15', cat: 'Article', title: 'AI and new cardiac imaging technology assesses for CAD without radiation.' },
  { date: '2024-11-02', cat: 'Press release', title: 'CorVista announces 510(k) clearance for the CorVista System.' },
];

function NewsPage() {
  const [filter, setFilter] = useStateNews('all');
  const filtered = filter === 'all' ? NEWS : NEWS.filter(n => n.cat === filter);

  return (
    <div className="page-fade" data-screen-label="07 News" data-page="news">
      <div className="subhero">
        <div className="container">
          <Eyebrow>News & Insights</Eyebrow>
          <h1 style={{ marginTop: 28 }}>
            What's <span className="em">new</span> from CorVista.
          </h1>
          <p className="lead">
            Press releases, peer-reviewed announcements, and stories from clinicians using CorVista in everyday practice.
          </p>
        </div>
      </div>

      {/* Featured */}
      <Section>
        <div className="row row-2" style={{ gridTemplateColumns: '1.2fr 1fr', gap: 64, alignItems: 'center' }}>
          <ImgPh label="Featured story — hero image" ratio="16/10" />
          <div>
            <div className="meta">{NEWS[0].date} · {NEWS[0].cat}</div>
            <h2 style={{ marginTop: 18, fontSize: 'clamp(28px, 3vw, 44px)', letterSpacing: '-0.02em' }}>
              {NEWS[0].title}
            </h2>
            <p className="lead" style={{ marginTop: 24, fontSize: 18 }}>
              The company welcomes Adrian Lam as President & CEO to drive commercial growth, regulatory milestones, and continued investment in clinical evidence.
            </p>
            <a href="#" className="btn btn-ghost" style={{ marginTop: 28 }}>Read the announcement<span className="arrow">→</span></a>
          </div>
        </div>
      </Section>

      {/* Filter + list */}
      <Section>
        <Tabs
          value={filter}
          onChange={setFilter}
          items={[
            { id: 'all', label: 'All' },
            { id: 'Press release', label: 'Press releases' },
            { id: 'Article', label: 'Articles' },
            { id: 'Podcast', label: 'Podcasts' },
          ]}
        />
        <div>
          {filtered.map((n, i) => (
            <a key={i} href="#" className="news-card hover-lift">
              <div className="news-date">{n.date}</div>
              <div>
                <div className="news-cat">{n.cat}</div>
                <div className="news-title" style={{ marginTop: 8 }}>{n.title}</div>
              </div>
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 22 }}>↗</span>
            </a>
          ))}
        </div>
      </Section>

      {/* Subscribe */}
      <Section dark>
        <div className="row row-2" style={{ gridTemplateColumns: '1.3fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <Eyebrow><span style={{ color: '#98A2B3' }}>Stay informed</span></Eyebrow>
            <h2 style={{ color: '#F4F6F9', marginTop: 20, fontSize: 'clamp(32px, 4vw, 56px)' }}>
              Get CorVista updates in your inbox.
            </h2>
            <p className="lead" style={{ color: '#C8D0DC', marginTop: 18, maxWidth: '46ch' }}>
              Clinical updates, regulatory milestones, and conference presentations — once a month, no fluff.
            </p>
          </div>
          <form style={{ display: 'flex', gap: 12 }} onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="you@hospital.org"
              style={{
                flex: 1,
                padding: '16px 20px',
                background: 'transparent',
                border: '1px solid #1F2A3D',
                color: '#F4F6F9',
                fontFamily: 'var(--f-sans)',
                fontSize: 16,
                outline: 'none',
                borderRadius: 0
              }}
            />
            <button type="submit" className="btn btn-primary">Subscribe<span className="arrow">→</span></button>
          </form>
        </div>
      </Section>
    </div>
  );
}

Object.assign(window, { NewsPage });
