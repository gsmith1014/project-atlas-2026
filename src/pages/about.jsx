import React from 'react';
import { Eyebrow, Section, SectionHeader, ImgPh, NavA, Stat } from '../components.jsx';

const TEAM = [
  { name: 'Adrian Lam',                        role: 'President & Chief Executive Officer', group: 'leadership', photo: '/team-adrian-lam.jpg' },
  { name: 'Charles R. Bridges, M.D., Sc.D.',   role: 'EVP & Chief Scientific Officer',      group: 'leadership', photo: '/team-charles-bridges.jpg' },
  { name: 'Nikki Troiano Gainey',               role: 'Chief Customer Officer',              group: 'leadership', photo: '/team-nikki-gainey.jpg' },
  { name: 'Shyam Ramchandani, Ph.D., MBA',      role: 'VP of Research',                      group: 'leadership', photo: '/team-shyam-ramchandani.jpg' },
  { name: 'Karen McCord',                       role: 'VP, Chief of Staff',                  group: 'leadership', photo: '/team-karen-mccord.jpg' },
  { name: 'Ian Shadforth, MBA',                 role: 'Chief Strategy Officer',              group: 'leadership', photo: '/team-ian-shadforth.jpg' },
  { name: 'Jonathan Woodward',                  role: 'CTO & General Manager, A4L',          group: 'leadership', photo: '/team-jonathan-woodward.jpg' },
  { name: 'Horace R. Gillins',                  role: 'VP of Clinical Affairs',              group: 'leadership', photo: '/team-horace-gillins.jpg' },
  { name: 'Grant Smith',                        role: 'VP, Marketing & Communication',       group: 'leadership', photo: '/team-grant-smith.jpg' },
  { name: 'Vallerie V. McLaughlin, M.D.',       role: 'Medical Advisory Board',              group: 'mab',        photo: '/team-vallerie-mclaughlin.jpg' },
  { name: 'Derek V. Exner, M.D.',               role: 'Medical Advisory Board',              group: 'mab',        photo: '/team-derek-exner.jpg' },
  { name: 'Junbo Ge, M.D.',                     role: 'Medical Advisory Board',              group: 'mab',        photo: '/team-junbo-ge.jpg' },
  { name: 'Puneet K. Khanna, M.D.',             role: 'Medical Advisory Board',              group: 'mab',        photo: '/team-puneet-khanna.jpg' },
  { name: 'Rodney Raabe, M.D.',                 role: 'Medical Advisory Board',              group: 'mab',        photo: '/team-rodney-raabe.jpg' },
  { name: 'Mark Rabbat, M.D.',                  role: 'Medical Advisory Board',              group: 'mab',        photo: '/team-mark-rabbat.jpg' },
  { name: 'Anjali Tiku Owens, M.D.',            role: 'Medical Advisory Board',              group: 'mab',        photo: '/team-anjali-owens.jpg' },
  { name: 'Tim Attebery',                       role: 'Board of Directors',                  group: 'board',      photo: '/team-tim-attebery.jpg' },
  { name: 'Adrian Lam',                         role: 'President & Chief Executive Officer', group: 'board',      photo: '/team-adrian-lam.jpg' },
  { name: 'Aaron L. Berez, M.D.',               role: 'Board of Directors',                  group: 'board',      photo: '/team-aaron-berez.jpg' },
  { name: 'James McLaren',                      role: 'Board of Directors',                  group: 'board',      photo: '/team-james-mclaren.jpg' },
  { name: 'Elspeth Murray',                     role: 'Board of Directors',                  group: 'board',      photo: '/team-elspeth-murray.jpg' },
  { name: 'Guido Neels',                        role: 'Board of Directors',                  group: 'board',      photo: '/team-guido-neels.jpg' },
  { name: 'Dino Trevisani',                     role: 'Board of Directors',                  group: 'board',      photo: '/team-dino-trevisani.jpg' },
];

export function AboutPage() {
  const groups = [
    { id: 'leadership', label: 'Leadership' },
    { id: 'mab', label: 'Medical Advisory Board' },
    { id: 'board', label: 'Board of Directors' },
  ];

  return (
    <div className="page-fade" data-screen-label="06 About" data-page="about">
      <div className="subhero">
        <div className="container">
          <Eyebrow>About</Eyebrow>
          <h1 style={{ marginTop: 28 }}>
            We built CorVista to make the <span className="em">first</span> conversation about heart disease the most informative one.
          </h1>
          <p className="lead">
            Cardiovascular disease is still the world's leading cause of death — and the tools we use to find it at the front line of care haven't fundamentally changed in forty years. We're changing that.
          </p>
        </div>
      </div>

      <Section>
        <div className="row row-2" style={{ gridTemplateColumns: '1fr 1.4fr', gap: 80, alignItems: 'start' }}>
          <div><Eyebrow>Our mission</Eyebrow></div>
          <div>
            <h2 style={{ fontSize: 'clamp(34px, 4vw, 56px)' }}>
              Bring comprehensive cardiovascular testing into the first office visit — for every patient, everywhere.
            </h2>
            <p className="lead" style={{ marginTop: 36 }}>
              Founded as Analytics 4 Life and rebuilt as CorVista Health, our company exists to put a new generation of diagnostic intelligence in the hands of front-line clinicians — using machine-learned algorithms, novel signal processing, and a rigorous evidence base.
            </p>
          </div>
        </div>
      </Section>

      <Section dark>
        <SectionHeader eyebrow={<span style={{ color: '#98A2B3' }}>What we stand for</span>} title={<span style={{ color: '#F4F6F9' }}>Three principles.</span>} />
        <div className="row row-3">
          {[
            { n: '01', t: 'Evidence first', c: 'Every claim we make is backed by peer-reviewed research and validated against gold-standard truth.' },
            { n: '02', t: 'Access by design', c: 'The first conversation about heart disease should happen in primary care — not after months of referrals.' },
            { n: '03', t: 'Built with clinicians', c: 'Our system is designed alongside the cardiologists, primary care physicians, and PH specialists who use it every day.' },
          ].map(v => (
            <div key={v.n} style={{ borderTop: '1px solid #1F2A3D', paddingTop: 24 }}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: '#5BAFE8', letterSpacing: '0.14em' }}>{v.n}</div>
              <h4 style={{ marginTop: 14, color: '#F4F6F9' }}>{v.t}</h4>
              <p style={{ marginTop: 12, color: '#C8D0DC', fontSize: 15 }}>{v.c}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="People" title="The team behind the system." />
        {groups.map(g => (
          <div key={g.id} style={{ marginBottom: 80 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32, borderBottom: '1px solid var(--rule)', paddingBottom: 18 }}>
              <h3 style={{ fontSize: 28 }}>{g.label}</h3>
              <span className="meta">{TEAM.filter(t => t.group === g.id).length} members</span>
            </div>
            <div className="team-grid">
              {TEAM.filter(t => t.group === g.id).map(t => (
                <div key={t.name + t.group} className="team-card">
                  {t.photo
                    ? <img src={t.photo} alt={t.name} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', objectPosition: 'top', display: 'block', borderRadius: '20%' }} />
                    : <div style={{ width: '100%', aspectRatio: '1/1', background: 'var(--card-bg)', borderRadius: '20%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontFamily: 'var(--f-sans)', fontSize: 28, fontWeight: 600, color: 'var(--mid)', letterSpacing: '-0.01em' }}>
                          {t.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                        </span>
                      </div>
                  }
                  <div className="name" style={{ marginTop: 14 }}>{t.name}</div>
                  <div className="role">{t.role}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Section>

      <Section dark>
        <SectionHeader eyebrow={<span style={{ color: '#98A2B3' }}>Our timeline</span>} title={<span style={{ color: '#F4F6F9' }}>Nine years. One mission.</span>} />
        <div style={{ borderTop: '1px solid #1F2A3D' }}>
          {[
            ['2017', 'Analytics 4 Life named one of FierceMedTech\'s Fierce 15.'],
            ['2018', 'Research agreement with Johnson & Johnson (Actelion) for PH diagnostics.'],
            ['2020', 'CADLAD study — early coronary artery disease analysis published.'],
            ['2022', 'FDA grants Breakthrough Device Designation to CorVista PH'],
            ['2023', 'FDA 510(k) clearance for CAD indication.'],
            ['2024', 'FDA 510(k) clearance for PH indication.'],
            ['2025', 'FDA 510(k) submitted for PCWP (HF) indication.'],
            ['2026', 'CorVista and Mayo Clinic announce new collaboration for next gen PH diagnostics'],
          ].map(([y, d], i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 64, padding: '32px 0', borderBottom: '1px solid #1F2A3D', alignItems: 'baseline', color: '#F4F6F9' }}>
              <div className="display" style={{ fontSize: 'clamp(48px, 5vw, 76px)', color: '#F4F6F9', letterSpacing: '-0.04em' }}>{y}</div>
              <div style={{ fontSize: 22, lineHeight: 1.3, color: '#C8D0DC', maxWidth: '52ch' }}>{d}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
