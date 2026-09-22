/**
 * CorVistaPatient3D — scroll-driven patient visualization.
 *
 * Uses licensed x-ray medical illustration images (patient-front.webp,
 * patient-back.webp). mix-blend-mode: screen makes the black backgrounds
 * seamlessly transparent against the dark section ground.
 *
 * Images: licensed for CorVista Health product use.
 */

import React from 'react';

// sceneState: 'patient' | 'capture' | 'dataset' | 'algorithm' | 'result'
// view:       'front' | 'back'
// reduced:    prefers-reduced-motion
export default function CorVistaPatient3D({ sceneState = 'patient', view = 'front', reduced = false }) {
  const T = reduced ? 'none' : 'opacity 0.9s ease';

  // Images visible during body-sensor states, fade out at algorithm/result
  const bodyVisible = ['patient', 'capture', 'dataset'].includes(sceneState);
  const showFront   = bodyVisible && view === 'front';
  const showBack    = bodyVisible && view === 'back';

  return (
    <div
      role="img"
      aria-label="X-ray illustration of a patient with CorVista ECG and PPG sensors placed on the body"
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '3 / 4',
        overflow: 'hidden',
      }}
    >
      {/* Front view — all 6 electrodes + glowing heart */}
      <img
        src="/patient-front.webp"
        alt=""
        draggable="false"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center top',
          mixBlendMode: 'screen',
          opacity: showFront ? 1 : 0,
          transition: T,
          userSelect: 'none',
        }}
      />

      {/* Back view — PPG electrode only */}
      <img
        src="/patient-back.webp"
        alt=""
        draggable="false"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center top',
          mixBlendMode: 'screen',
          opacity: showBack ? 1 : 0,
          transition: T,
          userSelect: 'none',
        }}
      />
    </div>
  );
}
