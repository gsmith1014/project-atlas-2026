/**
 * CorVistaPatient3D — 3D patient visualization for CorVista Science section.
 *
 * Models: Human Reference Atlas Visible Human Male, CC BY 4.0.
 * Attribution: Patient skin and heart adapted from HuBMAP HRA reference objects,
 * based on the Visible Human Project (U.S. National Library of Medicine).
 * Materials modified for CorVista Health.
 *
 * CALIBRATION MODE (dev only):
 *   Press F2 to enter. Select an electrode, drag its TransformControls handle,
 *   then "Copy Config" to get formatted JSON. Paste into ELECTRODES_DEFAULT below.
 *   All positions were derived from model geometry (bounds, anatomical landmarks)
 *   and must be verified against the CorVista electrode-placement reference image.
 *   Calibration UI is stripped from production builds via import.meta.env.DEV.
 */

import * as THREE from 'three';
import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, TransformControls } from '@react-three/drei';

const IS_DEV = import.meta.env.DEV;

// ── Model paths ───────────────────────────────────────────────────────────────
const PATIENT_GLB = '/corvista_reference_patient.glb';
const HEART_GLB   = '/corvista_reference_heart.glb';

// ── Electrode definitions ─────────────────────────────────────────────────────
// Colors follow AHA / IEC 61215 clinical standard — do not change.
// Positions calibrated from model bounding box and anatomical landmarks
// (patient: X ±0.524, Y −0.915→+0.915, Z −0.161→+0.156).
// Verify and adjust each position against the CorVista placement reference image
// using calibration mode (F2 in dev).
export const ELECTRODES_DEFAULT = [
  {
    id: 'ra', label: 'RA', clinicalLabel: 'Right Arm (Right Subclavicular)',
    color: '#C8C8C8',
    position: [-0.310, 0.745, 0.108],
    normal:   [-0.782, 0.100, 0.615],
    side: 'front',
  },
  {
    id: 'la', label: 'LA', clinicalLabel: 'Left Arm (Left Subclavicular)',
    color: '#A0A0A0',
    position: [ 0.310, 0.745, 0.108],
    normal:   [ 0.782, 0.100, 0.615],
    side: 'front',
  },
  {
    id: 'rl', label: 'RL', clinicalLabel: 'Right Leg (Right Lower Abdomen)',
    color: '#2BC48A',
    position: [-0.295, 0.085, 0.128],
    normal:   [-0.770, -0.100, 0.629],
    side: 'front',
  },
  {
    id: 'll', label: 'LL', clinicalLabel: 'Left Leg (Left Lower Abdomen)',
    color: '#D85528',
    position: [ 0.295, 0.085, 0.128],
    normal:   [ 0.770, -0.100, 0.629],
    side: 'front',
  },
  {
    id: 'v1', label: 'V1', clinicalLabel: '4th ICS, Right Sternal Border',
    color: '#8B6545',
    position: [-0.042, 0.562, 0.144],
    normal:   [-0.152, 0.000, 0.988],
    side: 'front',
  },
  {
    id: 'v6', label: 'V6', clinicalLabel: '5th ICS, Mid-Axillary Line',
    color: '#F3B51A',
    position: [ 0.428, 0.512, 0.048],
    normal:   [ 0.902, -0.050, 0.430],
    side: 'front',
  },
  {
    id: 'ppg', label: 'PPG', clinicalLabel: 'Posterior (Upper Back)',
    color: '#5BAFE8',
    position: [ 0.000, 0.618, -0.138],
    normal:   [ 0.000, 0.050, -0.999],
    side: 'back',
  },
];

// ── WebGL availability check ──────────────────────────────────────────────────
function webGLAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl'));
  } catch { return false; }
}

// ── Patient body (real GLB) ───────────────────────────────────────────────────
// Applies a translucent blue-gray shell material driven by site tokens.
// Clones the scene so material mutations don't affect the cached original.
function GltfBody({ opacity }) {
  const { scene } = useGLTF(PATIENT_GLB);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((obj) => {
      if (!obj.isMesh) return;
      obj.castShadow = false;
      obj.receiveShadow = false;
      obj.material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#7BA8C4'),
        transparent: true,
        opacity,
        roughness: 0.55,
        metalness: 0,
        transmission: 0.06,
        thickness: 0.18,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
    });
    return clone;
  }, [scene]);

  // Update opacity without remounting
  useEffect(() => {
    model.traverse((obj) => {
      if (obj.isMesh) obj.material.opacity = opacity;
    });
  }, [model, opacity]);

  return <primitive object={model} />;
}

// ── Anatomical heart (real GLB) ───────────────────────────────────────────────
// Heart and patient share the same coordinate system — do NOT apply an
// independent position offset; the GLB is already placed correctly relative
// to the patient mesh.
// Preserves warm emissive material from GLB; adds transparency for fade control.
// Pulse is atmospheric storytelling only — not anatomically exact or diagnostic.
function GltfHeart({ visible, reduced }) {
  const ref = useRef();
  const { scene } = useGLTF(HEART_GLB);

  const heartScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((obj) => {
      if (!obj.isMesh) return;
      const src = obj.material;
      obj.material = src.clone();
      obj.material.transparent = true;
      obj.material.depthWrite = false;
      // Warm emissive contribution — preserve GLB intent, tone to site palette
      obj.material.emissive = new THREE.Color('#3A0808');
      obj.material.emissiveIntensity = 0.30;
      obj.material.opacity = 0;
    });
    return clone;
  }, [scene]);

  // Smooth opacity fade + atmospheric pulse
  useFrame(({ clock }, delta) => {
    if (!ref.current) return;
    const targetOpacity = visible ? 1 : 0;

    ref.current.traverse((obj) => {
      if (!obj.isMesh) return;
      obj.material.opacity = THREE.MathUtils.damp(
        obj.material.opacity, targetOpacity, 4, delta,
      );
    });

    if (visible && !reduced) {
      const wave = Math.max(0, Math.sin(clock.elapsedTime * Math.PI * 1.25));
      const s = 1 + Math.pow(wave, 8) * 0.035;
      ref.current.scale.setScalar(s);
    } else {
      ref.current.scale.setScalar(1);
    }
  });

  return <primitive ref={ref} object={heartScene} />;
}

useGLTF.preload(PATIENT_GLB);
useGLTF.preload(HEART_GLB);

// ── 3D electrode puck ─────────────────────────────────────────────────────────
// Surface-aligned cylinder. Local +Y is aligned to the outward surface normal.
function Electrode3D({ electrode, visible, active, reduced, groupRef }) {
  const innerRef = useRef();

  const quaternion = useMemo(() => {
    const up = new THREE.Vector3(0, 1, 0);
    const n = new THREE.Vector3(...electrode.normal).normalize();
    return new THREE.Quaternion().setFromUnitVectors(up, n);
  }, [electrode.normal]);

  useFrame(({ clock }) => {
    if (!innerRef.current || !active || reduced) return;
    const p = 1 + Math.sin(clock.elapsedTime * 3) * 0.035;
    innerRef.current.scale.setScalar(p);
  });

  return (
    <group ref={groupRef} position={electrode.position} quaternion={quaternion}>
      <group ref={innerRef}>
        {/* Adhesive backing disc */}
        <mesh>
          <cylinderGeometry args={[0.022, 0.022, 0.005, 36]} />
          <meshPhysicalMaterial
            color="#CDD6DE" roughness={0.70} metalness={0}
            transparent opacity={visible ? 0.90 : 0}
          />
        </mesh>
        {/* Colored clinical connector hub */}
        <mesh position={[0, 0.0045, 0]}>
          <cylinderGeometry args={[0.013, 0.013, 0.007, 36]} />
          <meshPhysicalMaterial
            color={electrode.color} roughness={0.35} metalness={0.08}
            transparent opacity={visible ? 1 : 0}
          />
        </mesh>
        {/* Active selection halo */}
        {active && (
          <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.026, 0.030, 36]} />
            <meshBasicMaterial
              color={electrode.color} transparent opacity={visible ? 0.55 : 0}
              depthWrite={false} side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </group>
    </group>
  );
}

// ── Conceptual electrical field ───────────────────────────────────────────────
// Translucent wireframe shells suggesting dimensional cardiac observation.
// Not a literal rendering of any CorVista proprietary process.
function ElectricalField({ active, color, reduced }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current || !active || reduced) return;
    const t = clock.elapsedTime;
    ref.current.children.forEach((child, i) => {
      const ph = i * 0.65;
      child.rotation.x = Math.sin(t * 0.25 + ph) * 0.16;
      child.rotation.y = t * (0.035 + i * 0.008);
      child.scale.setScalar(1 + Math.sin(t * 1.2 + ph) * 0.025);
    });
  });

  // Centered on heart's anatomical position in the shared coordinate system
  return (
    <group ref={ref} position={[0.019, 0.476, 0.038]} visible={active}>
      {[
        { s: [0.10, 0.13, 0.10], opacity: 0.090 },
        { s: [0.13, 0.16, 0.12], opacity: 0.065 },
        { s: [0.16, 0.19, 0.15], opacity: 0.047 },
        { s: [0.19, 0.22, 0.18], opacity: 0.032 },
      ].map(({ s, opacity }, i) => (
        <mesh key={i} scale={s}>
          <sphereGeometry args={[1, 36, 36]} />
          <meshBasicMaterial
            color={color} wireframe transparent opacity={opacity} depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── Scene camera ──────────────────────────────────────────────────────────────
// Frames from head (Y≈0.91) to upper pelvis (Y≈−0.20), portrait crop.
function SceneCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const compact = size.width < 480;
    // Portrait crop: look at Y=0.40 (mid-range of head-to-pelvis), stand back Z=3.0
    camera.position.set(0, 0.40, compact ? 3.6 : 3.0);
    camera.fov = compact ? 30 : 28;
    camera.lookAt(0, 0.40, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width]);

  return null;
}

// ── Patient assembly ──────────────────────────────────────────────────────────
function PatientAssembly({
  sceneState, view, electrodes, reduced,
  calibMode, selectedCalibId, onCalibMove,
}) {
  const groupRef = useRef();
  const electrodeGroupRefs = useRef({});

  // Scroll-state → visual targets
  const STATE = {
    patient:   { bodyOpacity: 0.14, showHeart: false, showField: false, elecVisible: false, elecActive: false },
    capture:   { bodyOpacity: 0.22, showHeart: false, showField: false, elecVisible: true,  elecActive: true  },
    dataset:   { bodyOpacity: 0.22, showHeart: true,  showField: false, elecVisible: true,  elecActive: false },
    algorithm: { bodyOpacity: 0.10, showHeart: true,  showField: true,  elecVisible: true,  elecActive: false },
    result:    { bodyOpacity: 0.15, showHeart: false,  showField: false, elecVisible: true,  elecActive: false },
  };
  const s = STATE[sceneState] ?? STATE.patient;

  // Smooth Y-axis rotation between front and back views
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const target = view === 'back' ? Math.PI : 0;
    if (reduced) {
      groupRef.current.rotation.y = target;
    } else {
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y, target, 5, delta,
      );
    }
  });

  const frontElectrodes = electrodes.filter(e => e.side === 'front');
  const backElectrodes  = electrodes.filter(e => e.side === 'back');
  const selectedObj = selectedCalibId ? electrodeGroupRefs.current[selectedCalibId] : null;

  return (
    <group ref={groupRef}>
      {/* Patient and heart share the same coordinate system — no offsets */}
      <GltfBody opacity={calibMode ? 0.18 : s.bodyOpacity} />
      <GltfHeart visible={s.showHeart} reduced={reduced} />
      <ElectricalField active={s.showField} color="#5BAFE8" reduced={reduced} />

      {[...frontElectrodes, ...backElectrodes].map(e => (
        <Electrode3D
          key={e.id}
          electrode={e}
          visible={calibMode ? true : s.elecVisible}
          active={s.elecActive && e.side === (view === 'back' ? 'back' : 'front')}
          reduced={reduced}
          groupRef={(node) => { electrodeGroupRefs.current[e.id] = node; }}
        />
      ))}

      {/* Calibration TransformControls — dev only, tree-shaken in production */}
      {IS_DEV && calibMode && selectedObj && (
        <TransformControls
          object={selectedObj}
          mode="translate"
          size={0.5}
          onObjectChange={() => {
            if (selectedObj) onCalibMove(selectedCalibId, selectedObj.position.toArray());
          }}
        />
      )}
    </group>
  );
}

// ── Calibration DOM panel ─────────────────────────────────────────────────────
function CalibrationPanel({ electrodes, selectedId, onSelect, onPositionChange, onExport }) {
  const selected = electrodes.find(e => e.id === selectedId);

  return (
    <div style={{
      position: 'absolute', top: 0, right: -282, width: 272, zIndex: 100,
      background: '#0B1320', border: '1px solid #2A3A50', borderRadius: 4,
      padding: 16, fontFamily: 'var(--f-mono)', fontSize: 11, color: '#8B96A3',
    }}>
      <div style={{ color: '#5BAFE8', fontSize: 9, letterSpacing: '0.14em', marginBottom: 14, textTransform: 'uppercase' }}>
        Electrode Calibration · F2 to exit
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
        {electrodes.map(e => (
          <button key={e.id} onClick={() => onSelect(e.id)} style={{
            padding: '4px 9px', cursor: 'pointer', borderRadius: 3, fontSize: 10,
            border: `1px solid ${e.id === selectedId ? e.color : '#1F2A3D'}`,
            background: e.id === selectedId ? `${e.color}18` : 'transparent',
            color: e.id === selectedId ? e.color : '#4A5568',
          }}>{e.label}</button>
        ))}
      </div>

      {selected && (
        <>
          <div style={{ color: '#3A4A5C', fontSize: 9, letterSpacing: '0.1em', marginBottom: 8, textTransform: 'uppercase' }}>Position</div>
          {['x', 'y', 'z'].map((axis, ai) => (
            <label key={axis} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ color: '#5BAFE8', width: 12 }}>{axis.toUpperCase()}</span>
              <input type="number" step="0.002"
                value={selected.position[ai].toFixed(4)}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  if (!isNaN(v)) onPositionChange(selected.id, 'pos', ai, v);
                }}
                style={{
                  background: '#091629', border: '1px solid #1F2A3D', borderRadius: 3,
                  color: '#C0D0E0', padding: '3px 7px', fontSize: 11,
                  fontFamily: 'var(--f-mono)', width: '100%',
                }}
              />
            </label>
          ))}
          <div style={{ color: '#3A4A5C', fontSize: 9, letterSpacing: '0.1em', margin: '10px 0 8px', textTransform: 'uppercase' }}>Normal</div>
          {['x', 'y', 'z'].map((axis, ai) => (
            <label key={axis} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ color: '#4A5568', width: 12 }}>{axis.toUpperCase()}</span>
              <input type="number" step="0.01"
                value={selected.normal[ai].toFixed(4)}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  if (!isNaN(v)) onPositionChange(selected.id, 'norm', ai, v);
                }}
                style={{
                  background: '#091629', border: '1px solid #1F2A3D', borderRadius: 3,
                  color: '#8B96A3', padding: '3px 7px', fontSize: 11,
                  fontFamily: 'var(--f-mono)', width: '100%',
                }}
              />
            </label>
          ))}
        </>
      )}

      <button onClick={onExport} style={{
        width: '100%', marginTop: 12, padding: '7px 12px',
        background: 'rgba(91,175,232,0.12)', border: '1px solid #5BAFE8',
        borderRadius: 3, color: '#5BAFE8', cursor: 'pointer',
        fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
      }}>
        Copy Config JSON
      </button>
      <div style={{ marginTop: 8, color: '#2A3A50', fontSize: 9, lineHeight: 1.6 }}>
        Paste into ELECTRODES_DEFAULT in CorVistaPatient3D.jsx.
        Verify all 7 positions against the CorVista placement image.
      </div>
    </div>
  );
}

// ── Static fallback ───────────────────────────────────────────────────────────
function StaticFallback() {
  return (
    <div style={{
      width: '100%', aspectRatio: '3/4', background: '#091629',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: '1px solid #1F2A3D', borderRadius: 4,
    }}>
      <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: '#3A4A5C', letterSpacing: '0.1em' }}>
        3D VISUALIZATION UNAVAILABLE
      </span>
    </div>
  );
}

// ── Public component ──────────────────────────────────────────────────────────
export default function CorVistaPatient3D({ sceneState = 'patient', view = 'front', reduced = false }) {
  const [hasWebGL] = useState(webGLAvailable);
  const [electrodes, setElectrodes] = useState(ELECTRODES_DEFAULT);
  const [calibMode, setCalibMode] = useState(false);
  const [selectedCalibId, setSelectedCalibId] = useState(null);

  useEffect(() => {
    if (!IS_DEV) return;
    const onKey = (e) => { if (e.key === 'F2') setCalibMode(m => !m); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleCalibMove = useCallback((id, newPos) => {
    setElectrodes(prev => prev.map(e => e.id === id ? { ...e, position: newPos } : e));
  }, []);

  const handleFieldChange = useCallback((id, field, axisIndex, value) => {
    setElectrodes(prev => prev.map(e => {
      if (e.id !== id) return e;
      if (field === 'pos') {
        const p = [...e.position]; p[axisIndex] = value; return { ...e, position: p };
      }
      const n = [...e.normal]; n[axisIndex] = value; return { ...e, normal: n };
    }));
  }, []);

  const exportConfig = useCallback(() => {
    const json = JSON.stringify(
      electrodes.map(({ id, position, normal }) => ({
        id,
        position: position.map(v => +v.toFixed(4)),
        normal:   normal.map(v => +v.toFixed(4)),
      })),
      null, 2,
    );
    navigator.clipboard?.writeText(json).catch(() => {});
    console.log('[CorVista Calib Config]\n', json);
  }, [electrodes]);

  if (!hasWebGL) return <StaticFallback />;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{ width: '100%', aspectRatio: '3/4' }}
        role="img"
        aria-label="CorVista 3D patient sensor placement visualization"
      >
        <Canvas
          camera={{ position: [0, 0.40, 3.0], fov: 28, near: 0.01, far: 50 }}
          dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ width: '100%', height: '100%' }}
        >
          <SceneCamera />
          <ambientLight intensity={0.55} />
          <directionalLight position={[3, 4, 6]} intensity={2.0} />
          <directionalLight position={[-4, 1, -2]} intensity={0.85} />
          <pointLight position={[0, 2, 3]} intensity={0.35} color="#5BAFE8" />

          <PatientAssembly
            sceneState={sceneState}
            view={view}
            electrodes={electrodes}
            reduced={reduced}
            calibMode={calibMode}
            selectedCalibId={selectedCalibId}
            onCalibMove={handleCalibMove}
          />
        </Canvas>
      </div>

      {IS_DEV && calibMode && (
        <CalibrationPanel
          electrodes={electrodes}
          selectedId={selectedCalibId}
          onSelect={setSelectedCalibId}
          onPositionChange={handleFieldChange}
          onExport={exportConfig}
        />
      )}

      <p className="sr-only">
        Front view shows six CorVista electrodes on the anterior torso: RA (right arm),
        LA (left arm), RL (right leg), LL (left leg), V1 (4th intercostal space, right
        sternal border) and V6 (5th intercostal space, mid-axillary line). Back view
        shows one PPG electrode on the upper posterior surface. The electrical field is
        a conceptual visualization of dimensional cardiac observation and does not
        represent any literal CorVista proprietary measurement.
        Patient skin and heart models adapted from HuBMAP Human Reference Atlas
        Visible Human Male (CC BY 4.0).
      </p>
    </div>
  );
}
