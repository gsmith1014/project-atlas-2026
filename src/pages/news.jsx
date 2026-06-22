import React, { useState } from 'react';
import { Eyebrow, Section, NavA, Tabs } from '../components.jsx';

const modules = import.meta.glob('../content/news/*.mdx', { eager: true });

const ARTICLES = Object.entries(modules)
  .map(([path, mod]) => ({
    slug: path.split('/').pop().replace('.mdx', ''),
    Component: mod.default,
    ...mod.frontmatter,
  }))
  .sort((a, b) => new Date(b.date) - new Date(a.date));

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function ArticleView({ slug }) {
  const article = ARTICLES.find(a => a.slug === slug);
  if (!article) return (
    <div className="page-fade" data-page="news">
      <Section>
        <p>Article not found.</p>
        <NavA to="news" className="btn btn-ghost" style={{ marginTop: 20, display: 'inline-flex' }}>← Back to News</NavA>
      </Section>
    </div>
  );
  const { Component, title, date, category } = article;
  return (
    <div className="page-fade" data-page="news-article">
      <div className="subhero">
        <div className="container">
          <NavA to="news" className="btn btn-ghost" style={{ marginBottom: 32, display: 'inline-flex', fontSize: 14 }}>
            ← Back to News
          </NavA>
          <div className="meta" style={{ marginBottom: 16 }}>{formatDate(date)} · {category}</div>
          <h1 style={{ maxWidth: '24ch' }}>{title}</h1>
        </div>
      </div>
      <Section>
        <div className="article-body">
          <Component />
        </div>
      </Section>
    </div>
  );
}

export function NewsPage({ articleSlug }) {
  const [filter, setFilter] = useState('all');

  if (articleSlug) return <ArticleView slug={articleSlug} />;

  const filtered = filter === 'all' ? ARTICLES : ARTICLES.filter(a => a.category === filter);
  const featured = ARTICLES[0];

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

      {featured && (
        <Section>
          <div className="row row-2" style={{ gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
            <div style={{ borderTop: '3px solid var(--blue)', paddingTop: 24 }}>
              <div className="meta">{formatDate(featured.date)} · {featured.category}</div>
              <h2 style={{ marginTop: 18, fontSize: 'clamp(28px, 3vw, 44px)', letterSpacing: '-0.02em' }}>
                {featured.title}
              </h2>
              <p className="lead" style={{ marginTop: 24, fontSize: 18, color: 'var(--fg-muted)' }}>
                {featured.excerpt}
              </p>
              <NavA to={`news/${featured.slug}`} className="btn btn-ghost" style={{ marginTop: 28, display: 'inline-flex' }}>
                Read the full story<span className="arrow">→</span>
              </NavA>
            </div>
            <div>
              <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--rule)' }}>
                <Eyebrow>Latest</Eyebrow>
              </div>
              {ARTICLES.slice(1, 4).map(a => (
                <NavA key={a.slug} to={`news/${a.slug}`} style={{ display: 'block', padding: '16px 0', borderBottom: '1px solid var(--rule)', textDecoration: 'none', color: 'inherit' }}>
                  <div className="meta">{formatDate(a.date)} · {a.category}</div>
                  <div style={{ marginTop: 6, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.4 }}>{a.title}</div>
                </NavA>
              ))}
            </div>
          </div>
        </Section>
      )}

      <Section>
        <Tabs
          value={filter}
          onChange={setFilter}
          items={[
            { id: 'all', label: 'All' },
            { id: 'Press release', label: 'Press releases' },
            { id: 'Article', label: 'Articles' },
          ]}
        />
        <div>
          {filtered.map((a) => (
            <NavA key={a.slug} to={`news/${a.slug}`} className="news-card hover-lift">
              <div className="news-date">{formatDate(a.date)}</div>
              <div>
                <div className="news-cat">{a.category}</div>
                <div className="news-title" style={{ marginTop: 8 }}>{a.title}</div>
              </div>
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 22 }}>↗</span>
            </NavA>
          ))}
        </div>
      </Section>

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
                borderRadius: 0,
              }}
            />
            <button type="submit" className="btn btn-primary">Subscribe<span className="arrow">→</span></button>
          </form>
        </div>
      </Section>
    </div>
  );
}
