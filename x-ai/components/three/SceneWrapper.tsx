"use client";

import { Suspense, useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { MotionValue } from "motion/react";

// ─── Constants ────────────────────────────────────────────────────────────────

const PARTICLE_COUNT = 4000;
const GRID_SIZE = 18; // 18×18 = 324 positions, we cycle through for 4000

// ─── Particle Cloud Component ─────────────────────────────────────────────────

function ParticleCloud({ morphProgress }: { morphProgress: MotionValue<number> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { mouse } = useThree();
  const progressRef = useRef(morphProgress.get());

  // Subscribe to morph progress motion value
  useEffect(() => {
    const unsubscribe = morphProgress.on("change", (v) => {
      progressRef.current = v;
    });
    return () => unsubscribe();
  }, [morphProgress]);

  // Generate random and grid positions
  const { randomPositions, gridPositions } = useMemo(() => {
    const random = new Float32Array(PARTICLE_COUNT * 3);
    const grid = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Random cloud positions (sphere distribution)
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 2;
      random[i3] = r * Math.sin(phi) * Math.cos(theta);
      random[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      random[i3 + 2] = r * Math.cos(phi);

      // Grid positions (structured)
      const col = i % GRID_SIZE;
      const row = Math.floor(i / GRID_SIZE) % GRID_SIZE;
      const layer = Math.floor(i / (GRID_SIZE * GRID_SIZE));
      const spacing = 0.28;
      const offset = (GRID_SIZE * spacing) / 2;
      grid[i3] = col * spacing - offset;
      grid[i3 + 1] = row * spacing - offset;
      grid[i3 + 2] = layer * spacing * 0.5 - 1;
    }

    return { randomPositions: random, gridPositions: grid };
  }, []);

  // Time offset for floating animation
  const timeOffsets = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, () => Math.random() * Math.PI * 2);
  }, []);

  // Stable buffer arrays that survive React re-renders.
  // Initialized with the correct morph state based on current scroll progress.
  const positionBuffer = useMemo(() => {
    const t = Math.min(Math.max(morphProgress.get(), 0), 1);
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      arr[i3] = THREE.MathUtils.lerp(randomPositions[i3], gridPositions[i3], t);
      arr[i3 + 1] = THREE.MathUtils.lerp(randomPositions[i3 + 1], gridPositions[i3 + 1], t);
      arr[i3 + 2] = THREE.MathUtils.lerp(randomPositions[i3 + 2], gridPositions[i3 + 2], t);
    }
    return arr;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [randomPositions, gridPositions]);

  const colorBuffer = useMemo(() => {
    const t = Math.min(Math.max(morphProgress.get(), 0), 1);
    const colorT = Math.min(t * 1.2, 1);
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      arr[i3] = THREE.MathUtils.lerp(0.443, 0.95, colorT);
      arr[i3 + 1] = THREE.MathUtils.lerp(0.443, 0.95, colorT);
      arr[i3 + 2] = THREE.MathUtils.lerp(0.478, 0.95, colorT);
    }
    return arr;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stable args tuples — same reference across re-renders prevents R3F from recreating the BufferAttribute
  const positionArgs = useMemo<[Float32Array, number]>(() => [positionBuffer, 3], [positionBuffer]);
  const colorArgs = useMemo<[Float32Array, number]>(() => [colorBuffer, 3], [colorBuffer]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const colors = pointsRef.current.geometry.attributes.color.array as Float32Array;
    const t = Math.min(Math.max(progressRef.current, 0), 1);
    const time = state.clock.elapsedTime;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Lerp between random and grid
      const targetX = THREE.MathUtils.lerp(randomPositions[i3], gridPositions[i3], t);
      const targetY = THREE.MathUtils.lerp(randomPositions[i3 + 1], gridPositions[i3 + 1], t);
      const targetZ = THREE.MathUtils.lerp(randomPositions[i3 + 2], gridPositions[i3 + 2], t);

      // Add floating animation (stronger when in cloud form)
      const floatStrength = (1 - t) * 0.15;
      const floatY = Math.sin(time * 0.5 + timeOffsets[i]) * floatStrength;
      const floatX = Math.cos(time * 0.3 + timeOffsets[i] * 1.5) * floatStrength * 0.5;

      // Smooth interpolation to target
      positions[i3] = THREE.MathUtils.lerp(positions[i3], targetX + floatX, 0.04);
      positions[i3 + 1] = THREE.MathUtils.lerp(positions[i3 + 1], targetY + floatY, 0.04);
      positions[i3 + 2] = THREE.MathUtils.lerp(positions[i3 + 2], targetZ, 0.04);

      // Color: zinc-500 → white based on progress
      const colorT = Math.min(t * 1.2, 1);
      colors[i3] = THREE.MathUtils.lerp(0.443, 0.95, colorT);
      colors[i3 + 1] = THREE.MathUtils.lerp(0.443, 0.95, colorT);
      colors[i3 + 2] = THREE.MathUtils.lerp(0.478, 0.95, colorT);
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.color.needsUpdate = true;

    // Subtle cursor-driven rotation
    const targetRotX = mouse.y * 0.15;
    const targetRotY = mouse.x * 0.15;
    pointsRef.current.rotation.x = THREE.MathUtils.lerp(
      pointsRef.current.rotation.x,
      targetRotX,
      0.03
    );
    pointsRef.current.rotation.y = THREE.MathUtils.lerp(
      pointsRef.current.rotation.y,
      targetRotY,
      0.03
    );
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={positionArgs}
        />
        <bufferAttribute
          attach="attributes-color"
          args={colorArgs}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ─── Scene Wrapper ────────────────────────────────────────────────────────────

export default function SceneWrapper({ morphProgress }: { morphProgress: MotionValue<number> }) {
  return (
    <div className="absolute inset-0">
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-10"
        style={{
          backgroundImage:
            "linear-gradient(#FAFAFA 1px, transparent 1px), linear-gradient(90deg, #FAFAFA 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Corner labels */}
      <span className="absolute top-3 left-3 font-mono text-[9px] text-[#3F3F46] tracking-widest z-10">
        x:0 y:0 z:0
      </span>
      <span className="absolute top-3 right-3 font-mono text-[9px] text-[#3F3F46] tracking-widest z-10">
        1440×900
      </span>
      <span className="absolute bottom-3 left-3 font-mono text-[9px] text-[#3F3F46] tracking-widest z-10">
        WebGL 2.0
      </span>
      <span className="absolute bottom-3 right-3 font-mono text-[9px] text-[#3F3F46] tracking-widest z-10">
        60 FPS
      </span>

      {/* R3F Canvas */}
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <ParticleCloud morphProgress={morphProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
