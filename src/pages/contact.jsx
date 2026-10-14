import React, { useState } from 'react';
import { Eyebrow, Section, NavA } from '../components.jsx';

export function ContactPage() {
  const [intent, setIntent] = useState('demo');
  const [sent, setSent] = useState(false);
  const intents = [
    { id: 'demo', label: 'Request a demo' },
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
          <div className="contact-sticky" style={{ position: 'sticky', top: 100 }}>
            <Eyebrow>I'm reaching out to</Eyebrow>
            <div style={{ marginTop: 24, display: 'grid', gap: 4 }}>
              {intents.map(it => (
                <button
                  key={it.id}
                  aria-pressed={intent === it.id}
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
                Bethesda, MD, USA<br />
                <span className="meta">+1 (833) 267-8478</span>
              </div>
              <div style={{ marginTop: 24 }}>
                <div className="meta">General inquiries</div>
                <div className="ilink" style={{ fontSize: 16, marginTop: 4, display: 'inline-block' }}>info@corvista.com</div>
              </div>
            </div>
          </div>

          <form aria-describedby="contact-availability"
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            style={{ display: 'grid', gap: 22 }}
          >
            <>
                <p id="contact-availability">Online messages are not available yet. Please email <a href="mailto:info@corvista.com">info@corvista.com</a>.</p>
                <h3 style={{ fontSize: 'clamp(28px, 3vw, 44px)', marginBottom: 8 }}>
                  {intents.find(i => i.id === intent).label}
                </h3>
                <p style={{ color: 'var(--fg-muted)', marginBottom: 16, maxWidth: '52ch' }}>
                  {intent === 'demo' && "Tell us a bit about your practice and we'll set up a 30-minute walkthrough."}
                  {intent === 'partner' && "We work with health systems, payers, and global distributors. Tell us where you fit."}
                  {intent === 'press' && "Reach our media team for interviews, statements, or background briefings."}
                  {intent === 'careers' && "Tell us where you'd like to make an impact — we'll send back open roles."}
                  {intent === 'general' && "We read every note. We'll get back within two business days."}
                </p>
                <div className="row row-2" style={{ gap: 22 }}>
                  <div className="field"><label htmlFor="first-name">First name</label><input id="first-name" name="first-name" type="text" autoComplete="given-name" /></div>
                  <div className="field"><label htmlFor="last-name">Last name</label><input id="last-name" name="last-name" type="text" autoComplete="family-name" /></div>
                </div>
                <div className="row row-2" style={{ gap: 22 }}>
                  <div className="field"><label htmlFor="work-email">Work email</label><input id="work-email" name="email" autoComplete="email" type="email" placeholder="you@hospital.org" /></div>
                  <div className="field"><label htmlFor="organization">Organization</label><input id="organization" name="organization" type="text" autoComplete="organization" /></div>
                </div>
                {intent === 'demo' && (
                  <div className="row row-2" style={{ gap: 22 }}>
                    <div className="field">
                      <label htmlFor="contact-role">Role</label>
                      <select id="contact-role" name="contact-role">
                        <option>Cardiologist</option>
                        <option>Primary care</option>
                        <option>Practice administrator</option>
                        <option>Health system executive</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="practice-volume">Practice volume</label>
                      <select id="practice-volume" name="practice-volume">
                        <option>1–5 providers</option>
                        <option>6–20 providers</option>
                        <option>21–100 providers</option>
                        <option>100+ providers</option>
                      </select>
                    </div>
                  </div>
                )}
                <div className="field">
                  <label htmlFor="message">Tell us more</label>
                  <textarea id="message" name="message" rows="5" placeholder="What would you like to discuss?"></textarea>
                </div>
                <label style={{ display: 'flex', gap: 12, alignItems: 'start', fontSize: 13, color: 'var(--fg-muted)', maxWidth: '64ch' }}>
                  <input type="checkbox" style={{ marginTop: 4 }} />
                  <span>I agree to CorVista's privacy policy and consent to being contacted about my inquiry.</span>
                </label>
                <div style={{ marginTop: 12 }}>
                  <button type="submit" className="btn btn-primary">Send message<span className="arrow">→</span></button>
                </div>
              </>
            <p role="status">{sent && 'Your message has not been sent. Please email info@corvista.com.'}</p>
          </form>
        </div>
      </Section>
    </div>
  );
}
