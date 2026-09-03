"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 2000;
const RADIUS = 6.5;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uAudio;
  uniform float uSize;
  attribute float aScale;
  varying float vScale;
  void main() {
    vScale = aScale;
    vec3 p = position;
    float wave = sin(uTime * 0.25 + p.x * 1.2 + p.y) ;
    p += normalize(position) * wave * (0.06 + uAudio * 0.4);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aScale * (1.0 + uAudio * 0.7) * (115.0 / -mv.z);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uAudio;
  varying float vScale;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.0, d);
    float a = soft * (0.17 + uAudio * 0.28) * (0.35 + 0.65 * vScale);
    gl_FragColor = vec4(uColor + uAudio * 0.15, a);
  }
`;

export default function Particles({
  analyserRef,
}: {
  analyserRef: React.RefObject<AnalyserNode | null>;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const audioLevel = useRef(0);
  // fftSize=64 (ver Hero3D) → frequencyBinCount=32. Buffer fijo, una sola asignación.
  const freqData = useMemo(() => new Uint8Array(32), []);

  const geometry = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const scales = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      // Distribución esférica uniforme
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = RADIUS * Math.cbrt(Math.random());
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      scales[i] = 0.3 + Math.random() * 0.9;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    return g;
  }, []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uAudio: { value: 0 },
          uSize: { value: 2.8 },
          uColor: { value: new THREE.Color("#C9A86A") },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  // Libera memoria GPU al desmontar el canvas (three.js no lo hace solo).
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((_, delta) => {
    material.uniforms.uTime.value += delta;

    // Nivel de audio (0..1) suavizado
    let target = 0;
    const an = analyserRef.current;
    if (an) {
      an.getByteFrequencyData(freqData);
      let sum = 0;
      for (let i = 0; i < freqData.length; i++) sum += freqData[i];
      target = sum / freqData.length / 255;
    }
    audioLevel.current += (target - audioLevel.current) * 0.12;
    material.uniforms.uAudio.value = audioLevel.current;

    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * (0.04 + audioLevel.current * 0.15);
      pointsRef.current.rotation.x += delta * 0.012;
    }
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}