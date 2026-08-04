import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TextureGenerator } from '../rendering/TextureGenerator';
import { useGameStore } from '../../stores/gameStore';

interface PlayerShipProps {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  rollAngle: number;
  isHitFlashing: boolean;
}

export const PlayerShip: React.FC<PlayerShipProps> = ({
  position,
  rotation,
  rollAngle,
  isHitFlashing,
}) => {
  const groupRef = useRef<THREE.Group>(null!);
  const engineGlowRef = useRef<THREE.Mesh>(null!);

  const hullTexture = useMemo(
    () => TextureGenerator.createShipHullTexture('#00a8f8', '#0038a8'),
    []
  );

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.copy(position);
      groupRef.current.rotation.copy(rotation);
      groupRef.current.rotation.z = rollAngle;
    }

    if (engineGlowRef.current) {
      const scale = 0.8 + Math.sin(state.clock.elapsedTime * 20) * 0.2;
      engineGlowRef.current.scale.set(scale, scale, scale * 1.5);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ship Hull (Low-Poly Arcade Wings) */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[1.2, 3.5, 5]} />
        <meshStandardMaterial
          map={hullTexture}
          color={isHitFlashing ? '#ff3333' : '#ffffff'}
          flatShading
          roughness={0.4}
        />
      </mesh>

      {/* Cockpit Canopy */}
      <mesh position={[0, 0.4, -0.2]}>
        <boxGeometry args={[0.7, 0.5, 1.2]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#0088cc"
          emissiveIntensity={0.6}
          flatShading
        />
      </mesh>

      {/* Left Wing */}
      <mesh position={[-1.2, 0, 0.5]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[1.8, 0.2, 1.5]} />
        <meshStandardMaterial map={hullTexture} flatShading />
      </mesh>

      {/* Right Wing */}
      <mesh position={[1.2, 0, 0.5]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[1.8, 0.2, 1.5]} />
        <meshStandardMaterial map={hullTexture} flatShading />
      </mesh>

      {/* Thruster Nozzle & Engine Fire */}
      <mesh position={[0, 0, 1.8]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 0.6, 6]} />
        <meshStandardMaterial color="#222233" flatShading />
      </mesh>

      <mesh ref={engineGlowRef} position={[0, 0, 2.3]}>
        <coneGeometry args={[0.4, 1.2, 6]} />
        <meshBasicMaterial color="#ff9900" wireframe={false} />
      </mesh>
    </group>
  );
};
