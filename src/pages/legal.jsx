import React from 'react';
import { NavA, Section } from '../components.jsx';
import privacyPolicy from '../content/privacy-policy.json';
import termsOfUse from '../content/terms-of-use.json';

function LegalText({ text }) {
  return text.split(/(info@corvista\.com|analytics4life\.com\/privacy)/g).map((part, index) => {
    if (part === 'info@corvista.com') return <a key={index} href="mailto:info@corvista.com">{part}</a>;
    if (part === 'analytics4life.com/privacy') return <NavA key={index} to="privacy">{part}</NavA>;
    return part;
  });
}

export function LegalPage({ type }) {
  const document = type === 'privacy' ? privacyPolicy : termsOfUse;
  return (
    <div className="page-fade" data-page={type}>
      <Section>
        <article className="legal-document">
          <h1>{document.title}</h1>
          {document.blocks.map(({ tag: Tag, text }, index) => (
            <Tag key={index}><LegalText text={text} /></Tag>
          ))}
        </article>
      </Section>
    </div>
  );
}
