import React from 'react';
import { TweaksPanel, TweakSection, TweakRadio, TweakColor, TweakToggle, TweakSelect } from './tweaks-panel.jsx';

export function SiteTweaks({ tweaks, setTweak }) {
  return (
    <TweaksPanel>
      <TweakSection label="Hero" />
      <TweakSelect
        label="Hero variant"
        value={tweaks.heroVariant}
        options={[
          { value: 'editorial', label: 'Editorial (default)' },
          { value: 'split', label: 'Split — copy + dark stats' },
          { value: 'dataviz', label: 'Big stat — data forward' },
          { value: 'patient', label: 'Patient — full-bleed image' },
        ]}
        onChange={(v) => setTweak('heroVariant', v)}
      />

      <TweakSection label="Theme" />
      <TweakRadio
        label="Theme"
        value={tweaks.theme}
        options={['light', 'dark']}
        onChange={(v) => setTweak('theme', v)}
      />
      <TweakColor
        label="Accent"
        value={tweaks.accentHue}
        options={['#5BAFE8', '#2E7DC1', '#7A5AE0', '#1F8A5B', '#D97757']}
        onChange={(v) => setTweak('accentHue', v)}
      />
      <TweakRadio
        label="Density"
        value={tweaks.density}
        options={['compact', 'spacious']}
        onChange={(v) => setTweak('density', v)}
      />
      <TweakToggle
        label="ECG accents"
        value={tweaks.showECG}
        onChange={(v) => setTweak('showECG', v)}
      />
    </TweaksPanel>
  );
}
