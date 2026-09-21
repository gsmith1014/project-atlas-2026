/**
 * CorVistaPatient3D — 3D patient visualization for CorVista Science section.
 *
 * PLACEHOLDER BODY: Uses a LatheGeometry torso until corvista-patient.glb is
 * available. To switch to the real model, replace <ProceduralBody> with a
 * <primitive object={useGLTF('/models/corvista-patient.glb').scene} /> inside
 * PatientAssembly, then re-calibrate every electrode position and normal using
 * the calibration mode described below.
 *
 * CALIBRATION MODE (dev only):
 *   Press F2 (or add ?calib to the URL) to enter calibration mode.
 *   Select an electrode, drag it with TransformControls, then "Copy Config"
 *   to get formatted JSON to paste back into ELECTRODES below.
 *   Calibration mode is stripped in production builds via import.meta.env.DEV.
 */

import * as THREE from 'three';
import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { TransformControls } from '@react-three/drei';

const IS_DEV = import.meta.env.DEV;

// ── Electrode definitions ────────────────────────────────────────────────────
// Colors follow AHA / IEC 61215 clinical standard — do not change.
// Positions and normals are PLACEHOLDERS calibrated to the procedural torso.
// They MUST be recalibrated when corvista-patient.glb is supplied, using
// the CorVista electrode-placement reference image as anatomical truth.
export const ELECTRODES_DEFAULT = [
  {
    id: 'ra', label: 'RA', clinicalLabel: 'Right Arm',
    color: '#C8C8C8',
    position: [-0.185, 0.660, 0.130],
    normal:   [-0.820, 0.000, 0.572],
    side: 'front',
  },
  {
    id: 'la', label: 'LA', clinicalLabel: 'Left Arm',
    color: '#A0A0A0',
    position: [ 0.185, 0.660, 0.130],
    normal:   [ 0.820, 0.000, 0.572],
    side: 'front',
  },
  {
    id: 'rl', label: 'RL', clinicalLabel: 'Right Leg',
    color: '#2BC48A',
    position: [-0.170, -0.375, 0.095],
    normal:   [-0.868, 0.000, 0.496],
    side: 'front',
  },
  {
    id: 'll', label: 'LL', clinicalLabel: 'Left Leg',
    color: '#D85528',
    position: [ 0.170, -0.375, 0.095],
    normal:   [ 0.868, 0.000, 0.496],
    side: 'front',
  },
  {
    id: 'v1', label: 'V1', clinicalLabel: '4th ICS, Right Sternal Border',
    color: '#8B6545',
    position: [-0.042, 0.345, 0.248],
    normal:   [-0.165, 0.000, 0.986],
    side: 'front',
  },
  {
    id: 'v6', label: 'V6', clinicalLabel: '5th ICS, Mid-Axillary Line',
    color: '#F3B51A',
    position: [ 0.210, 0.218, 0.115],
    normal:   [ 0.908, -0.050, 0.416],
    side: 'front',
  },
  {
    id: 'ppg', label: 'PPG', clinicalLabel: 'Posterior Hemodynamic',
    color: '#5BAFE8',
    position: [ 0.000, 0.450, -0.268],
    normal:   [ 0.000, 0.000, -1.000],
    side: 'back',
  },
];

// Lathe profile: [radius, y]. Revolves around Y axis. Open at top and bottom.
// Replace with GLB mesh when model is available.
const TORSO_PROFILE_PTS = [
  [0.00,  0.90],
  [0.09,  0.86],
  [0.12,  0.80],
  [0.24,  0.70],
  [0.27,  0.56],
  [0.27,  0.36],
  [0.25,  0.16],
  [0.20,  0.00],
  [0.18, -0.20],
  [0.21, -0.38],
  [0.18, -0.55],
  [0.13, -0.60],
];

// ── WebGL availability check ─────────────────────────────────────────────────
function webGLAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl'));
  } catch { return false; }
}

// ── Procedural torso placeholder ─────────────────────────────────────────────
function ProceduralBody({ opacity }) {
  const geometry = useMemo(() => {
    const profile = TORSO_PROFILE_PTS.map(([r, y]) => new THREE.Vector2(r, y));
    return new THREE.LatheGeometry(profile, 56);
  }, []);

  return (
    <mesh geometry={geometry}>
      <meshPhysicalMaterial
        color="#7BA8C4"
        transparent
        opacity={opacity}
        roughness={0.55}
        metalness={0}
        transmission={0.08}
        thickness={0.15}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ── 3D electrode puck ─────────────────────────────────────────────────────────
// Surface-aligned cylinder. Local +Y is the outward normal direction.
function Electrode3D({ electrode, visible, active, reduced, onSelect, groupRef }) {
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
    <group
      ref={groupRef}
      position={electrode.position}
      quaternion={quaternion}
    >
      <group ref={innerRef}>
        {/* Adhesive backing */}
        <mesh
          onClick={(e) => { e.stopPropagation(); onSelect?.(electrode); }}
        >
          <cylinderGeometry args={[0.058, 0.058, 0.013, 40]} />
          <meshPhysicalMaterial
            color="#CDD6DE"
            roughness={0.70}
            metalness={0}
            transparent
            opacity={visible ? 0.9 : 0}
          />
        </mesh>
        {/* Colored clinical connector */}
        <mesh position={[0, 0.012, 0]}>
          <cylinderGeometry args={[0.034, 0.034, 0.018, 40]} />
          <meshPhysicalMaterial
            color={electrode.color}
            roughness={0.35}
            metalness={0.08}
            transparent
            opacity={visible ? 1 : 0}
          />
        </mesh>
        {/* Active selection halo */}
        {active && (
          <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.070, 0.080, 40]} />
            <meshBasicMaterial
              color={electrode.color}
              transparent
              opacity={visible ? 0.55 : 0}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </group>
    </group>
  );
}

// ── Procedural heart placeholder ──────────────────────────────────────────────
// Replace with useGLTF('/models/anatomical-heart.glb') when available.
// Pulse is atmospheric only — not anatomically exact or diagnostically meaningful.
function ProceduralHeart({ visible, reduced }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current || !visible || reduced) return;
    const wave = Math.max(0, Math.sin(clock.elapsedTime * Math.PI * 1.25));
    const s = 1 + Math.pow(wave, 8) * 0.040;
    ref.current.scale.set(s, s * 1.05, s);
  });

  return (
    <group
      ref={ref}
      position={[-0.040, 0.320, 0.165]}
      scale={[0.080, 0.080, 0.080]}
      visible={visible}
    >
      <mesh>
        <sphereGeometry args={[1, 28, 28]} />
        <meshPhysicalMaterial
          color="#C03828"
          transparent
          opacity={0.55}
          roughness={0.42}
          metalness={0.08}
          emissive="#3A0A08"
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
}

// ── Conceptual electrical field ───────────────────────────────────────────────
// Translucent wireframe shells communicating dimensional observation.
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
      const s = 1 + Math.sin(t * 1.2 + ph) * 0.025;
      child.scale.setScalar(s);
    });
  });

  const shells = [
    { s: [0.52, 0.65, 0.42], opacity: 0.090 },
    { s: [0.62, 0.76, 0.50], opacity: 0.068 },
    { s: [0.72, 0.87, 0.58], opacity: 0.050 },
    { s: [0.82, 0.98, 0.66], opacity: 0.034 },
  ];

  return (
    <group ref={ref} position={[-0.04, 0.32, 0.04]} visible={active}>
      {shells.map(({ s, opacity }, i) => (
        <mesh key={i} scale={s}>
          <sphereGeometry args={[1, 36, 36]} />
          <meshBasicMaterial
            color={color}
            wireframe
            transparent
            opacity={opacity}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── Scene camera ──────────────────────────────────────────────────────────────
function SceneCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const cam = camera;
    const compact = size.width < 480;
    cam.position.set(0, 0.18, compact ? 4.8 : 4.3);
    cam.fov = compact ? 32 : 28;
    cam.lookAt(0, 0.18, 0);
    cam.updateProjectionMatrix();
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
  const calibControlRef = useRef();

  // Scroll-state → scene target values
  const stateMap = {
    patient:   { bodyOpacity: 0.15, showHeart: false, showField: false, elecVisible: false, elecActive: false },
    capture:   { bodyOpacity: 0.22, showHeart: false, showField: false, elecVisible: true,  elecActive: true  },
    dataset:   { bodyOpacity: 0.22, showHeart: true,  showField: false, elecVisible: true,  elecActive: false },
    algorithm: { bodyOpacity: 0.10, showHeart: true,  showField: true,  elecVisible: true,  elecActive: false },
    result:    { bodyOpacity: 0.15, showHeart: false,  showField: false, elecVisible: true,  elecActive: false },
  };
  const s = stateMap[sceneState] ?? stateMap.patient;

  // Smooth Y-axis rotation (front ↔ back). Uses delta-time damp for framerate stability.
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

  const selectedObj = selectedCalibId
    ? electrodeGroupRefs.current[selectedCalibId]
    : null;

  return (
    <group ref={groupRef}>
      <ProceduralBody opacity={calibMode ? 0.18 : s.bodyOpacity} />
      <ProceduralHeart visible={s.showHeart} reduced={reduced} />
      <ElectricalField active={s.showField} color="#5BAFE8" reduced={reduced} />

      {[...frontElectrodes, ...backElectrodes].map(e => (
        <Electrode3D
          key={e.id}
          electrode={e}
          visible={calibMode ? true : s.elecVisible}
          active={s.elecActive && e.side === (view === 'back' ? 'back' : 'front')}
          reduced={reduced}
          groupRef={(node) => { electrodeGroupRefs.current[e.id] = node; }}
          onSelect={() => {}}
        />
      ))}

      {/* Calibration TransformControls — dev only, never in production */}
      {IS_DEV && calibMode && selectedObj && (
        <TransformControls
          ref={calibControlRef}
          object={selectedObj}
          mode="translate"
          size={0.6}
          onObjectChange={() => {
            if (selectedObj) {
              onCalibMove(selectedCalibId, selectedObj.position.toArray());
            }
          }}
        />
      )}
    </group>
  );
}

// ── Static SVG fallback ───────────────────────────────────────────────────────
function StaticFallback() {
  return (
    <div style={{
      width: '100%', aspectRatio: '3/4', background: '#091629',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: '1px solid #1F2A3D', borderRadius: 4,
    }}>
      <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: '#3A4A5C', letterSpacing: '0.1em', textAlign: 'center' }}>
        3D VISUALIZATION<br />UNAVAILABLE
      </div>
    </div>
  );
}

// ── Calibration DOM panel ─────────────────────────────────────────────────────
function CalibrationPanel({ electrodes, selectedId, onSelect, onPositionChange, onExport }) {
  const selected = electrodes.find(e => e.id === selectedId);

  return (
    <div style={{
      position: 'absolute', top: 0, right: -280, width: 270, zIndex: 100,
      background: '#0B1320', border: '1px solid #2A3A50', borderRadius: 4,
      padding: 16, fontFamily: 'var(--f-mono)', fontSize: 11, color: '#8B96A3',
    }}>
      <div style={{ color: '#5BAFE8', fontSize: 9, letterSpacing: '0.14em', marginBottom: 14, textTransform: 'uppercase' }}>
        Electrode Calibration · F2 to exit
      </div>

      {/* Electrode selector */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
        {electrodes.map(e => (
          <button key={e.id} onClick={() => onSelect(e.id)} style={{
            padding: '5px 10px', border: `1px solid ${e.id === selectedId ? e.color : '#1F2A3D'}`,
            background: e.id === selectedId ? `${e.color}18` : 'transparent',
            color: e.id === selectedId ? e.color : '#4A5568',
            borderRadius: 3, cursor: 'pointer', fontSize: 10, letterSpacing: '0.08em',
          }}>{e.label}</button>
        ))}
      </div>

      {/* Position inputs */}
      {selected && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: '#3A4A5C', fontSize: 9, letterSpacing: '0.1em', marginBottom: 10, textTransform: 'uppercase' }}>
            Position (drag in canvas or type)
          </div>
          {['x', 'y', 'z'].map((axis, ai) => (
            <label key={axis} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ color: '#5BAFE8', width: 14 }}>{axis.toUpperCase()}</span>
              <input
                type="number"
                step="0.005"
                value={selected.position[ai].toFixed(4)}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  if (!isNaN(v)) onPositionChange(selected.id, ai, v);
                }}
                style={{
                  background: '#091629', border: '1px solid #1F2A3D', borderRadius: 3,
                  color: '#C0D0E0', padding: '4px 8px', fontSize: 11,
                  fontFamily: 'var(--f-mono)', width: '100%',
                }}
              />
            </label>
          ))}
          <div style={{ marginTop: 6, color: '#3A4A5C', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
            Normal
          </div>
          {['x', 'y', 'z'].map((axis, ai) => (
            <label key={axis} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ color: '#4A5568', width: 14 }}>{axis.toUpperCase()}</span>
              <input
                type="number"
                step="0.01"
                value={selected.normal[ai].toFixed(4)}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  if (!isNaN(v)) {
                    const norm = [...selected.normal];
                    norm[ai] = v;
                    onPositionChange(selected.id, 'normal', norm);
                  }
                }}
                style={{
                  background: '#091629', border: '1px solid #1F2A3D', borderRadius: 3,
                  color: '#8B96A3', padding: '4px 8px', fontSize: 11,
                  fontFamily: 'var(--f-mono)', width: '100%',
                }}
              />
            </label>
          ))}
        </div>
      )}

      <button onClick={onExport} style={{
        width: '100%', padding: '8px 12px', background: 'rgba(91,175,232,0.12)',
        border: '1px solid #5BAFE8', borderRadius: 3, color: '#5BAFE8',
        cursor: 'pointer', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
      }}>
        Copy Config JSON
      </button>

      <div style={{ marginTop: 10, color: '#2A3A50', fontSize: 9, lineHeight: 1.6 }}>
        Paste output into ELECTRODES_DEFAULT in CorVistaPatient3D.jsx.
        Calibrate all 7 electrodes against corvista-patient.glb using the
        CorVista placement image as anatomical reference.
      </div>
    </div>
  );
}

// ── Public component ──────────────────────────────────────────────────────────
export default function CorVistaPatient3D({ sceneState = 'patient', view = 'front', reduced = false }) {
  const [hasWebGL] = useState(webGLAvailable);
  const [localElectrodes, setLocalElectrodes] = useState(ELECTRODES_DEFAULT);
  const [calibMode, setCalibMode] = useState(false);
  const [selectedCalibId, setSelectedCalibId] = useState(null);

  // Toggle calibration with F2 (dev only)
  useEffect(() => {
    if (!IS_DEV) return;
    const onKey = (e) => {
      if (e.key === 'F2') setCalibMode(m => !m);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleCalibMove = useCallback((id, newPos) => {
    setLocalElectrodes(prev =>
      prev.map(e => e.id === id ? { ...e, position: newPos } : e),
    );
  }, []);

  const handlePositionChange = useCallback((id, axisOrKey, value) => {
    setLocalElectrodes(prev =>
      prev.map(e => {
        if (e.id !== id) return e;
        if (axisOrKey === 'normal') return { ...e, normal: value };
        const pos = [...e.position];
        pos[axisOrKey] = value;
        return { ...e, position: pos };
      }),
    );
  }, []);

  const exportConfig = useCallback(() => {
    const json = JSON.stringify(
      localElectrodes.map(({ id, position, normal }) => ({
        id,
        position: position.map(v => parseFloat(v.toFixed(4))),
        normal:   normal.map(v => parseFloat(v.toFixed(4))),
      })),
      null, 2,
    );
    navigator.clipboard.writeText(json).catch(() => {});
    console.log('[CorVista Calib]', json);
  }, [localElectrodes]);

  if (!hasWebGL) return <StaticFallback />;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div
        style={{ width: '100%', aspectRatio: '3/4' }}
        aria-label="CorVista 3D patient sensor placement"
        role="img"
      >
        <Canvas
          camera={{ position: [0, 0.18, 4.3], fov: 28, near: 0.05, far: 50 }}
          dpr={[1, IS_DEV ? 2 : Math.min(window.devicePixelRatio, 2)]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ width: '100%', height: '100%' }}
        >
          <SceneCamera />
          <ambientLight intensity={0.60} />
          <directionalLight position={[3, 4, 6]} intensity={2.0} />
          <directionalLight position={[-4, 1, -2]} intensity={0.90} />
          <pointLight position={[0, 2, 3]} intensity={0.40} color="#5BAFE8" />

          <PatientAssembly
            sceneState={sceneState}
            view={view}
            electrodes={localElectrodes}
            reduced={reduced}
            calibMode={calibMode}
            selectedCalibId={selectedCalibId}
            onCalibMove={handleCalibMove}
          />
        </Canvas>
      </div>

      {/* Calibration panel — rendered outside canvas, dev only */}
      {IS_DEV && calibMode && (
        <CalibrationPanel
          electrodes={localElectrodes}
          selectedId={selectedCalibId}
          onSelect={setSelectedCalibId}
          onPositionChange={handlePositionChange}
          onExport={exportConfig}
        />
      )}

      {/* Screen-reader description */}
      <p className="sr-only">
        Front view shows six CorVista electrodes on the anterior torso surface:
        RA (right arm), LA (left arm), RL (right leg), LL (left leg), V1 and V6.
        Back view shows one PPG electrode on the upper posterior surface.
        The electrical field is a conceptual visualization of dimensional cardiac
        observation and does not represent any literal proprietary measurement.
      </p>
    </div>
  );
}
