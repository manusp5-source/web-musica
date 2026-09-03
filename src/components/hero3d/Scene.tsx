"use client";

import { Canvas } from "@react-three/fiber";
import Particles from "./Particles";

export default function Scene({
  analyserRef,
  paused,
}: {
  analyserRef: React.RefObject<AnalyserNode | null>;
  paused: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={paused ? "never" : "always"}
      camera={{ position: [0, 0, 6], fov: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Particles analyserRef={analyserRef} />
    </Canvas>
  );
}