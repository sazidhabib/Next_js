"use client";

import { Suspense, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { MotionValue } from "motion/react";

// ─── Interactive Data Mesh ────────────────────────────────────────────────────

const VERTEX_COUNT = 200;

function DataMesh({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const meshRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const { mouse } = useThree();
  const progressRef = useRef(scrollProgress.get());
  const timeRef = useRef(0);

  useEffect(() => {
    const unsubscribe = scrollProgress.on("change", (v) => {
      progressRef.current = v;
    });
    return () => unsubscribe();
  }, [scrollProgress]);

  // Generate three geometry targets
  // Generate four geometry targets
  const { icoPositions, torusPositions, spherePositions, knotPositions, edges } = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(2.5, 3);
    const torus = new THREE.TorusGeometry(2, 0.8, 16, 32);
    const sphere = new THREE.SphereGeometry(2.2, 16, 16);
    const knot = new THREE.TorusKnotGeometry(1.6, 0.4, 64, 8);

    const icoArr = new Float32Array(VERTEX_COUNT * 3);
    const torusArr = new Float32Array(VERTEX_COUNT * 3);
    const sphereArr = new Float32Array(VERTEX_COUNT * 3);
    const knotArr = new Float32Array(VERTEX_COUNT * 3);

    const icoPos = ico.attributes.position;
    const torusPos = torus.attributes.position;
    const spherePos = sphere.attributes.position;
    const knotPos = knot.attributes.position;

    for (let i = 0; i < VERTEX_COUNT; i++) {
      const i3 = i * 3;
      icoArr[i3] = icoPos.getX(i % icoPos.count);
      icoArr[i3 + 1] = icoPos.getY(i % icoPos.count);
      icoArr[i3 + 2] = icoPos.getZ(i % icoPos.count);

      torusArr[i3] = torusPos.getX(i % torusPos.count);
      torusArr[i3 + 1] = torusPos.getY(i % torusPos.count);
      torusArr[i3 + 2] = torusPos.getZ(i % torusPos.count);

      sphereArr[i3] = spherePos.getX(i % spherePos.count);
      sphereArr[i3 + 1] = spherePos.getY(i % spherePos.count);
      sphereArr[i3 + 2] = spherePos.getZ(i % spherePos.count);

      knotArr[i3] = knotPos.getX(i % knotPos.count);
      knotArr[i3 + 1] = knotPos.getY(i % knotPos.count);
      knotArr[i3 + 2] = knotPos.getZ(i % knotPos.count);
    }

    // Generate edge connections (connect nearby vertices)
    const edgePairs: number[] = [];
    for (let i = 0; i < VERTEX_COUNT; i++) {
      for (let j = i + 1; j < Math.min(i + 5, VERTEX_COUNT); j++) {
        const dx = icoArr[i * 3] - icoArr[j * 3];
        const dy = icoArr[i * 3 + 1] - icoArr[j * 3 + 1];
        const dz = icoArr[i * 3 + 2] - icoArr[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 1.5) {
          edgePairs.push(i, j);
        }
      }
    }

    ico.dispose();
    torus.dispose();
    sphere.dispose();
    knot.dispose();

    return {
      icoPositions: icoArr,
      torusPositions: torusArr,
      spherePositions: sphereArr,
      knotPositions: knotArr,
      edges: edgePairs,
    };
  }, []);

  // Stable position buffer — initialized with correct morph state, survives re-renders
  const positionBuffer = useMemo(() => {
    const t = Math.min(Math.max(scrollProgress.get(), 0), 1);
    const arr = new Float32Array(VERTEX_COUNT * 3);
    for (let i = 0; i < VERTEX_COUNT; i++) {
      const i3 = i * 3;
      let x: number, y: number, z: number;
      if (t < 0.33) {
        const lt = t / 0.33;
        x = THREE.MathUtils.lerp(icoPositions[i3], torusPositions[i3], lt);
        y = THREE.MathUtils.lerp(icoPositions[i3 + 1], torusPositions[i3 + 1], lt);
        z = THREE.MathUtils.lerp(icoPositions[i3 + 2], torusPositions[i3 + 2], lt);
      } else if (t < 0.66) {
        const lt = (t - 0.33) / 0.33;
        x = THREE.MathUtils.lerp(torusPositions[i3], spherePositions[i3], lt);
        y = THREE.MathUtils.lerp(torusPositions[i3 + 1], spherePositions[i3 + 1], lt);
        z = THREE.MathUtils.lerp(torusPositions[i3 + 2], spherePositions[i3 + 2], lt);
      } else {
        const lt = Math.min((t - 0.66) / 0.34, 1);
        x = THREE.MathUtils.lerp(spherePositions[i3], knotPositions[i3], lt);
        y = THREE.MathUtils.lerp(spherePositions[i3 + 1], knotPositions[i3 + 1], lt);
        z = THREE.MathUtils.lerp(spherePositions[i3 + 2], knotPositions[i3 + 2], lt);
      }
      arr[i3] = x;
      arr[i3 + 1] = y;
      arr[i3 + 2] = z;
    }
    return arr;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [icoPositions, torusPositions, spherePositions, knotPositions]);

  const positionArgs = useMemo<[Float32Array, number]>(() => [positionBuffer, 3], [positionBuffer]);

  useFrame((state, delta) => {
    if (!meshRef.current || !linesRef.current) return;

    timeRef.current += delta;
    const t = Math.min(Math.max(progressRef.current, 0), 1);
    const time = timeRef.current;

    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    const linePositions = linesRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < VERTEX_COUNT; i++) {
      const i3 = i * 3;

      // Morph: ico -> torus (0–0.33) -> sphere (0.33–0.66) -> knot (0.66-1.0)
      let targetX: number, targetY: number, targetZ: number;

      if (t < 0.33) {
        const localT = t / 0.33;
        targetX = THREE.MathUtils.lerp(icoPositions[i3], torusPositions[i3], localT);
        targetY = THREE.MathUtils.lerp(icoPositions[i3 + 1], torusPositions[i3 + 1], localT);
        targetZ = THREE.MathUtils.lerp(icoPositions[i3 + 2], torusPositions[i3 + 2], localT);
      } else if (t < 0.66) {
        const localT = (t - 0.33) / 0.33;
        targetX = THREE.MathUtils.lerp(torusPositions[i3], spherePositions[i3], localT);
        targetY = THREE.MathUtils.lerp(torusPositions[i3 + 1], spherePositions[i3 + 1], localT);
        targetZ = THREE.MathUtils.lerp(torusPositions[i3 + 2], spherePositions[i3 + 2], localT);
      } else {
        const localT = Math.min((t - 0.66) / 0.34, 1);
        targetX = THREE.MathUtils.lerp(spherePositions[i3], knotPositions[i3], localT);
        targetY = THREE.MathUtils.lerp(spherePositions[i3 + 1], knotPositions[i3 + 1], localT);
        targetZ = THREE.MathUtils.lerp(spherePositions[i3 + 2], knotPositions[i3 + 2], localT);
      }

      // Add subtle oscillation
      const osc = Math.sin(time * 0.8 + i * 0.3) * 0.05;
      positions[i3] = THREE.MathUtils.lerp(positions[i3], targetX + osc, 0.06);
      positions[i3 + 1] = THREE.MathUtils.lerp(positions[i3 + 1], targetY + osc, 0.06);
      positions[i3 + 2] = THREE.MathUtils.lerp(positions[i3 + 2], targetZ, 0.06);
    }

    // Update edge line positions
    for (let i = 0; i < edges.length; i += 2) {
      const a = edges[i];
      const b = edges[i + 1];
      const li = i * 3;
      linePositions[li] = positions[a * 3];
      linePositions[li + 1] = positions[a * 3 + 1];
      linePositions[li + 2] = positions[a * 3 + 2];
      linePositions[li + 3] = positions[b * 3];
      linePositions[li + 4] = positions[b * 3 + 1];
      linePositions[li + 5] = positions[b * 3 + 2];
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;
    linesRef.current.geometry.attributes.position.needsUpdate = true;

    // Cursor-driven rotation
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, mouse.y * 0.3, 0.02);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mouse.x * 0.3, 0.02);
    linesRef.current.rotation.x = meshRef.current.rotation.x;
    linesRef.current.rotation.y = meshRef.current.rotation.y;

    // Slow auto-rotation
    meshRef.current.rotation.z += 0.001;
    linesRef.current.rotation.z = meshRef.current.rotation.z;
  });

  const linePositionsArray = useMemo(() => {
    return new Float32Array(edges.length * 3);
  }, [edges]);

  const lineArgs = useMemo<[Float32Array, number]>(() => [linePositionsArray, 3], [linePositionsArray]);

  return (
    <>
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={positionArgs}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#A1A1AA"
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={lineArgs}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#3F3F46"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </>
  );
}

// ─── Depth-Based Parallax Background ──────────────────────────────────────────

const BG_PARTICLE_COUNT = 300;

function ParallaxBackground({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const pointsRef1 = useRef<THREE.Points>(null);
  const pointsRef2 = useRef<THREE.Points>(null);
  const { mouse } = useThree();
  const progressRef = useRef(scrollProgress.get());

  useEffect(() => {
    const unsubscribe = scrollProgress.on("change", (v) => {
      progressRef.current = v;
    });
    return () => unsubscribe();
  }, [scrollProgress]);

  // Layer 1: Midground (closer, faster parallax)
  const layer1Positions = useMemo(() => {
    const arr = new Float32Array(BG_PARTICLE_COUNT * 3);
    for (let i = 0; i < BG_PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      arr[i3] = (Math.random() - 0.5) * 12;      // X
      arr[i3 + 1] = (Math.random() - 0.5) * 12;  // Y
      arr[i3 + 2] = -2 - Math.random() * 3;      // Z: -2 to -5
    }
    return arr;
  }, []);

  // Layer 2: Background (farther, slower parallax)
  const layer2Positions = useMemo(() => {
    const arr = new Float32Array(BG_PARTICLE_COUNT * 3);
    for (let i = 0; i < BG_PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      arr[i3] = (Math.random() - 0.5) * 20;      // X
      arr[i3 + 1] = (Math.random() - 0.5) * 20;  // Y
      arr[i3 + 2] = -5 - Math.random() * 5;      // Z: -5 to -10
    }
    return arr;
  }, []);

  useFrame(() => {
    const t = progressRef.current;

    // Midground (Layer 1) parallax translations
    if (pointsRef1.current) {
      const targetX = mouse.x * -0.8;
      const targetY = mouse.y * -0.8 + (t - 0.5) * -1.5;
      pointsRef1.current.position.x = THREE.MathUtils.lerp(pointsRef1.current.position.x, targetX, 0.05);
      pointsRef1.current.position.y = THREE.MathUtils.lerp(pointsRef1.current.position.y, targetY, 0.05);
    }

    // Background (Layer 2) parallax translations (slower multipliers)
    if (pointsRef2.current) {
      const targetX = mouse.x * -0.3;
      const targetY = mouse.y * -0.3 + (t - 0.5) * -0.5;
      pointsRef2.current.position.x = THREE.MathUtils.lerp(pointsRef2.current.position.x, targetX, 0.05);
      pointsRef2.current.position.y = THREE.MathUtils.lerp(pointsRef2.current.position.y, targetY, 0.05);
    }
  });

  return (
    <>
      {/* Midground Layer */}
      <points ref={pointsRef1}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[layer1Positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color="#3F3F46"
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Deep Background Layer */}
      <points ref={pointsRef2}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[layer2Positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color="#27272A"
          transparent
          opacity={0.4}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </>
  );
}

// ─── Scene Wrapper for Signature Section ──────────────────────────────────────

export default function SignatureScene({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={0.3} color="#A1A1AA" />
        <ParallaxBackground scrollProgress={scrollProgress} />
        <DataMesh scrollProgress={scrollProgress} />
      </Suspense>
    </Canvas>
  );
}
