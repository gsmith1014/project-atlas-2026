import React, { useId, useState } from 'react';

export function EmailSignup() {
  const id = useId();
  const [attempted, setAttempted] = useState(false);
  return (
    <form className="email-signup" onSubmit={event => { event.preventDefault(); setAttempted(true); }}>
      <label htmlFor={id}>Email address for updates</label>
      <div className="signup-controls">
        <input id={id} name="email" type="email" autoComplete="email" required
          placeholder="you@example.com" aria-describedby={`${id}-help`} />
        <button type="submit" className="btn btn-primary">Subscribe</button>
      </div>
      <p id={`${id}-help`}>Online subscriptions are not available yet.</p>
      <p role="status">{attempted && <>Your email has not been submitted. Please contact <a href="mailto:info@corvista.com">info@corvista.com</a> for updates.</>}</p>
    </form>
  );
}
