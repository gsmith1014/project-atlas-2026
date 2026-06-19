import React from 'react';
import { Eyebrow, Section, SectionHeader, ImgPh, Btn, Stat, NavA } from '../components.jsx';

export function PatientsPage() {
  return (
    <div className="page-fade" data-screen-label="04 Patients" data-page="patients">
      <div className="subhero">
        <div className="container">
          <div className="row row-2" style={{ gridTemplateColumns: '1.3fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <Eyebrow>For Patients</Eyebrow>
              <h1 style={{ marginTop: 28 }}>
                The test takes <span className="em">minutes.</span><br />
                The answer can change your life.
              </h1>
              <p className="lead">
                If your doctor is looking into chest discomfort, shortness of breath, or unexplained fatigue, CorVista can help find — or rule out — heart disease quickly, comfortably, and without radiation or contrast.
              </p>
            </div>
            <ImgPh label="Patient portrait — warm" ratio="3/4" />
          </div>
        </div>
      </div>

      <Section>
        <SectionHeader eyebrow="Your visit" title="What to expect." />
        <div className="row row-4">
          {[
            { n: '01', t: 'Before you arrive', c: 'Wear comfortable clothing. No fasting required, no medication changes.' },
            { n: '02', t: 'In the office', c: 'A medical assistant places small adhesive sensors on your chest and back, similar to an ECG.' },
            { n: '03', t: 'During the scan', c: 'You rest quietly for about four minutes. There\'s no radiation, no injection, no exercise.' },
            { n: '04', t: 'After your visit', c: 'Your doctor receives a physician-reviewed report — usually within minutes — and will go over results with you.' },
          ].map(s => (
            <div key={s.n}>
              <ImgPh label={`Step ${s.n}`} ratio="4/5" />
              <div style={{ marginTop: 18, fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--mid)', letterSpacing: '0.14em' }}>{s.n}</div>
              <h5 style={{ marginTop: 8 }}>{s.t}</h5>
              <p style={{ marginTop: 10, color: 'var(--fg-muted)', fontSize: 14 }}>{s.c}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section dark>
        <div className="row row-2" style={{ gridTemplateColumns: '1.3fr 1fr', gap: 64, alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 6, overflow: 'hidden', background: '#000' }}>
            <iframe
              src="https://player.vimeo.com/video/1058659213?badge=0&autopause=0&player_id=0&app_id=58479"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              title="Why it matters — CorVista"
            />
          </div>
          <div>
            <Eyebrow><span style={{ color: '#98A2B3' }}>Why it matters</span></Eyebrow>
            <h2 style={{ color: '#F4F6F9', marginTop: 24, fontSize: 'clamp(36px, 4.4vw, 64px)' }}>
              Heart disease is the leading cause of death. It doesn't have to be.
            </h2>
            <p className="lead" style={{ color: '#C8D0DC', marginTop: 24 }}>
              Half of all heart attacks happen without prior symptoms. Front-line cardiovascular tests have stayed largely unchanged for forty years. CorVista is bringing a new standard of testing into ordinary office visits — so disease is found earlier and people get the care they need sooner.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Common questions" title="Things people ask." />
        <div style={{ borderTop: '1px solid var(--rule)' }}>
          {[
            ['Is CorVista safe?', 'Yes. The CorVista test uses only resting biosignals — there is no radiation, no contrast injection, no exercise, no needles. All sensors are FDA-cleared and removed at the end of the visit.'],
            ['How long does the test take?', 'The acquisition itself takes about four minutes. The full visit, including sensor placement and the upload, is typically under thirty minutes.'],
            ['How accurate is it?', 'CorVista has been validated against gold-standard tests (cardiac catheterization, right-heart catheterization, cardiac CT) in peer-reviewed studies. Your doctor uses the report alongside your overall clinical picture.'],
            ['Will my insurance cover it?', 'Coverage varies by plan and indication. Your provider\'s billing team can tell you what to expect.'],
            ['Where can I get one?', 'Ask your primary care provider or cardiologist. If they don\'t yet offer CorVista, they can request a kit from our team.'],
          ].map(([q, a], i) => (
            <details key={i} style={{ borderBottom: '1px solid var(--rule)', padding: '24px 0' }}>
              <summary style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', listStyle: 'none', fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em' }}>
                <span>{q}</span>
                <span style={{ fontFamily: 'var(--f-mono)', color: 'var(--blue-deep)', fontSize: 22 }}>+</span>
              </summary>
              <p style={{ marginTop: 16, color: 'var(--fg-muted)', maxWidth: '72ch', lineHeight: 1.55 }}>{a}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section dark>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 40 }}>
          <h2 style={{ color: '#F4F6F9', maxWidth: '16ch', fontSize: 'clamp(40px, 5vw, 80px)' }}>
            Ready to talk to your doctor about CorVista?
          </h2>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <a href="#" className="btn btn-primary">Find a clinician<span className="arrow">→</span></a>
            <a href="#" className="btn btn-ghost">Download a one-pager<span className="arrow">→</span></a>
          </div>
        </div>
      </Section>
    </div>
  );
}
