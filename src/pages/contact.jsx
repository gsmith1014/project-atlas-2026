import React, { useState } from 'react';
import { Eyebrow, Section, NavA } from '../components.jsx';

export function ContactPage() {
  const [intent, setIntent] = useState('demo');
  const [sent, setSent] = useState(false);
  const intents = [
    { id: 'demo', label: 'Request a demo' },
    { id: 'order', label: 'Order a kit' },
    { id: 'partner', label: 'Partner with us' },
    { id: 'press', label: 'Press / media' },
    { id: 'careers', label: 'Careers' },
    { id: 'general', label: 'General' },
  ];

  return (
    <div className="page-fade" data-screen-label="09 Contact" data-page="contact">
      <div className="subhero">
        <div className="container">
          <Eyebrow>Contact</Eyebrow>
          <h1 style={{ marginTop: 28 }}>
            Let's <span className="em">talk.</span>
          </h1>
          <p className="lead">
            Whether you're a clinician, a health system, an investor, or a journalist — pick a path below and we'll route your message to the right person.
          </p>
        </div>
      </div>

      <Section>
        <div className="row row-2" style={{ gridTemplateColumns: '1fr 1.4fr', gap: 64, alignItems: 'start' }}>
          <div style={{ position: 'sticky', top: 100 }}>
            <Eyebrow>I'm reaching out to</Eyebrow>
            <div style={{ marginTop: 24, display: 'grid', gap: 4 }}>
              {intents.map(it => (
                <button
                  key={it.id}
                  onClick={() => setIntent(it.id)}
                  style={{
                    textAlign: 'left',
                    padding: '14px 18px',
                    background: intent === it.id ? 'var(--ink)' : 'transparent',
                    color: intent === it.id ? '#F4F6F9' : 'var(--fg)',
                    border: '1px solid ' + (intent === it.id ? 'var(--ink)' : 'var(--rule)'),
                    fontFamily: 'var(--f-sans)',
                    fontSize: 16,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 160ms ease'
                  }}>
                  <span>{it.label}</span>
                  <span style={{ fontFamily: 'var(--f-mono)' }}>{intent === it.id ? '●' : '○'}</span>
                </button>
              ))}
            </div>
            <div style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid var(--rule)' }}>
              <Eyebrow>Headquarters</Eyebrow>
              <div style={{ marginTop: 18, fontSize: 17, lineHeight: 1.6, color: 'var(--fg)' }}>
                CorVista Health, Inc.<br />
                Toronto, Ontario, Canada<br />
                <span className="meta">+1 (416) 555-0188</span>
              </div>
              <div style={{ marginTop: 24 }}>
                <div className="meta">General inquiries</div>
                <div className="ilink" style={{ fontSize: 16, marginTop: 4, display: 'inline-block' }}>hello@corvista.com</div>
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            style={{ display: 'grid', gap: 22 }}
          >
            {!sent ? (
              <>
                <h3 style={{ fontSize: 'clamp(28px, 3vw, 44px)', marginBottom: 8 }}>
                  {intents.find(i => i.id === intent).label}
                </h3>
                <p style={{ color: 'var(--fg-muted)', marginBottom: 16, maxWidth: '52ch' }}>
                  {intent === 'demo' && "Tell us a bit about your practice and we'll set up a 30-minute walkthrough."}
                  {intent === 'order' && "Send us your shipping details and we'll get a starter kit out to you within 48 hours."}
                  {intent === 'partner' && "We work with health systems, payers, and global distributors. Tell us where you fit."}
                  {intent === 'press' && "Reach our media team for interviews, statements, or background briefings."}
                  {intent === 'careers' && "Tell us where you'd like to make an impact — we'll send back open roles."}
                  {intent === 'general' && "We read every note. We'll get back within two business days."}
                </p>
                <div className="row row-2" style={{ gap: 22 }}>
                  <div className="field"><label>First name</label><input type="text" /></div>
                  <div className="field"><label>Last name</label><input type="text" /></div>
                </div>
                <div className="row row-2" style={{ gap: 22 }}>
                  <div className="field"><label>Work email</label><input type="email" placeholder="you@hospital.org" /></div>
                  <div className="field"><label>Organization</label><input type="text" /></div>
                </div>
                {intent === 'demo' && (
                  <div className="row row-2" style={{ gap: 22 }}>
                    <div className="field">
                      <label>Role</label>
                      <select>
                        <option>Cardiologist</option>
                        <option>Primary care</option>
                        <option>Practice administrator</option>
                        <option>Health system executive</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>Practice volume</label>
                      <select>
                        <option>1–5 providers</option>
                        <option>6–20 providers</option>
                        <option>21–100 providers</option>
                        <option>100+ providers</option>
                      </select>
                    </div>
                  </div>
                )}
                <div className="field">
                  <label>Tell us more</label>
                  <textarea rows="5" placeholder="What would you like to discuss?"></textarea>
                </div>
                <label style={{ display: 'flex', gap: 12, alignItems: 'start', fontSize: 13, color: 'var(--fg-muted)', maxWidth: '64ch' }}>
                  <input type="checkbox" style={{ marginTop: 4 }} />
                  <span>I agree to CorVista's privacy policy and consent to being contacted about my inquiry.</span>
                </label>
                <div style={{ marginTop: 12 }}>
                  <button type="submit" className="btn btn-primary">Send message<span className="arrow">→</span></button>
                </div>
              </>
            ) : (
              <div style={{ padding: 64, border: '1px solid var(--rule)', textAlign: 'center' }}>
                <Eyebrow>Message sent</Eyebrow>
                <h3 style={{ marginTop: 18, fontSize: 'clamp(28px, 3vw, 40px)' }}>Thank you — we'll be in touch.</h3>
                <p className="lead" style={{ margin: '20px auto 0', maxWidth: 460 }}>
                  We typically respond within two business days. A confirmation has been sent to your email.
                </p>
                <button onClick={() => setSent(false)} className="btn btn-ghost" style={{ marginTop: 32 }}>
                  Send another<span className="arrow">→</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </Section>
    </div>
  );
}
