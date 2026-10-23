import React, { useState } from 'react';
import { Eyebrow, Section, NavA } from '../components.jsx';

// To activate: create a free form at https://formspree.io, set the
// notification email to info@corvista.com, then paste the form ID below.
const FORMSPREE_ID = 'YOUR_FORM_ID';

export function ContactPage() {
  const [intent, setIntent] = useState('demo');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const intents = [
    { id: 'demo', label: 'Request a demo' },
    { id: 'partner', label: 'Partner with us' },
    { id: 'press', label: 'Press / media' },
    { id: 'careers', label: 'Careers' },
    { id: 'general', label: 'General' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(false);

    const data = new FormData(e.target);
    data.append('Inquiry type', intents.find(i => i.id === intent).label);

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setSent(true);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

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
                <a href="mailto:info@corvista.com" className="ilink" style={{ fontSize: 16, marginTop: 4, display: 'inline-block' }}>info@corvista.com</a>
              </div>
            </div>
          </div>

          {sent ? (
            <div style={{ padding: '56px 0' }}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--blue)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Message received</div>
              <h2 style={{ fontSize: 'clamp(28px, 3vw, 44px)', marginBottom: 16 }}>Thank you for reaching out.</h2>
              <p style={{ color: 'var(--fg-muted)', maxWidth: '48ch', lineHeight: 1.6, marginBottom: 32 }}>
                We've received your message and will follow up within two business days. For urgent matters, email <a href="mailto:info@corvista.com" style={{ color: 'var(--blue)' }}>info@corvista.com</a> directly.
              </p>
              <button
                onClick={() => { setSent(false); setIntent('demo'); }}
                className="btn btn-ghost"
                style={{ fontFamily: 'var(--f-sans)' }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 22 }}>
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
                <div className="field"><label htmlFor="first-name">First name</label><input id="first-name" name="First name" type="text" autoComplete="given-name" required /></div>
                <div className="field"><label htmlFor="last-name">Last name</label><input id="last-name" name="Last name" type="text" autoComplete="family-name" required /></div>
              </div>
              <div className="row row-2" style={{ gap: 22 }}>
                <div className="field"><label htmlFor="work-email">Work email</label><input id="work-email" name="_replyto" autoComplete="email" type="email" placeholder="you@hospital.org" required /></div>
                <div className="field"><label htmlFor="organization">Organization</label><input id="organization" name="Organization" type="text" autoComplete="organization" /></div>
              </div>
              {intent === 'demo' && (
                <div className="row row-2" style={{ gap: 22 }}>
                  <div className="field">
                    <label htmlFor="contact-role">Role</label>
                    <select id="contact-role" name="Role">
                      <option>Cardiologist</option>
                      <option>Primary care</option>
                      <option>Practice administrator</option>
                      <option>Health system executive</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="practice-volume">Practice volume</label>
                    <select id="practice-volume" name="Practice volume">
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
                <textarea id="message" name="Message" rows="5" placeholder="What would you like to discuss?"></textarea>
              </div>
              <label style={{ display: 'flex', gap: 12, alignItems: 'start', fontSize: 13, color: 'var(--fg-muted)', maxWidth: '64ch' }}>
                <input type="checkbox" required style={{ marginTop: 4 }} />
                <span>I agree to CorVista's privacy policy and consent to being contacted about my inquiry.</span>
              </label>
              {error && (
                <p role="alert" style={{ color: '#C0392B', fontSize: 14 }}>
                  Something went wrong sending your message. Please try again or email <a href="mailto:info@corvista.com" style={{ color: 'inherit' }}>info@corvista.com</a> directly.
                </p>
              )}
              <div style={{ marginTop: 12 }}>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Sending…' : 'Send message'}<span className="arrow">→</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </Section>
    </div>
  );
}
