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
  const progressRef = useRef(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const unsubscribe = scrollProgress.on("change", (v) => {
      progressRef.current = v;
    });
    return () => unsubscribe();
  }, [scrollProgress]);

  // Generate three geometry targets
  const { icoPositions, torusPositions, spherePositions, edges } = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(2.5, 3);
    const torus = new THREE.TorusGeometry(2, 0.8, 16, 32);
    const sphere = new THREE.SphereGeometry(2.2, 16, 16);

    const icoArr = new Float32Array(VERTEX_COUNT * 3);
    const torusArr = new Float32Array(VERTEX_COUNT * 3);
    const sphereArr = new Float32Array(VERTEX_COUNT * 3);

    const icoPos = ico.attributes.position;
    const torusPos = torus.attributes.position;
    const spherePos = sphere.attributes.position;

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

    return {
      icoPositions: icoArr,
      torusPositions: torusArr,
      spherePositions: sphereArr,
      edges: edgePairs,
    };
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current || !linesRef.current) return;

    timeRef.current += delta;
    const t = progressRef.current;
    const time = timeRef.current;

    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    const linePositions = linesRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < VERTEX_COUNT; i++) {
      const i3 = i * 3;

      // Morph: ico → torus (0–0.5) → sphere (0.5–1.0)
      let targetX: number, targetY: number, targetZ: number;

      if (t < 0.5) {
        const localT = t * 2; // 0 to 1
        targetX = THREE.MathUtils.lerp(icoPositions[i3], torusPositions[i3], localT);
        targetY = THREE.MathUtils.lerp(icoPositions[i3 + 1], torusPositions[i3 + 1], localT);
        targetZ = THREE.MathUtils.lerp(icoPositions[i3 + 2], torusPositions[i3 + 2], localT);
      } else {
        const localT = (t - 0.5) * 2; // 0 to 1
        targetX = THREE.MathUtils.lerp(torusPositions[i3], spherePositions[i3], localT);
        targetY = THREE.MathUtils.lerp(torusPositions[i3 + 1], spherePositions[i3 + 1], localT);
        targetZ = THREE.MathUtils.lerp(torusPositions[i3 + 2], spherePositions[i3 + 2], localT);
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

  return (
    <>
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(icoPositions), 3]}
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
            args={[linePositionsArray, 3]}
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
        <DataMesh scrollProgress={scrollProgress} />
      </Suspense>
    </Canvas>
  );
}
