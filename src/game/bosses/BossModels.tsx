import React from 'react';
import * as THREE from 'three';
import { BossType } from './BossManager';

interface BossMeshProps {
  type: BossType;
  position: THREE.Vector3;
  phase: number;
}

export const BossMesh: React.FC<BossMeshProps> = ({ type, position, phase }) => {
  return (
    <group position={position}>
      {/* BOSS 1: ASTEROID DEVOURER - Voxel Rock Core with Glowing Maw */}
      {type === 'ASTEROID_DEVOURER' && (
        <group>
          <mesh>
            <dodecahedronGeometry args={[8.0, 1]} />
            <meshStandardMaterial color="#4a3b32" flatShading roughness={0.8} />
          </mesh>
          {/* Glowing Red Core Eye */}
          <mesh position={[0, 0, 7.5]}>
            <sphereGeometry args={[2.5, 8, 8]} />
            <meshBasicMaterial color={phase === 3 ? '#ff0000' : '#ff9900'} />
          </mesh>
        </group>
      )}

      {/* BOSS 2: SWARM CORE - Rotating Hexagonal Shield & Orb Core */}
      {type === 'SWARM_CORE' && (
        <group>
          <mesh>
            <icosahedronGeometry args={[6.5, 0]} />
            <meshStandardMaterial color="#00ffff" emissive="#005588" wireframe flatShading />
          </mesh>
          <mesh>
            <sphereGeometry args={[4.0, 12, 12]} />
            <meshBasicMaterial color="#33ffaa" />
          </mesh>
        </group>
      )}

      {/* BOSS 3: VOID ARCHITECT - Massive Dark Fortress Dreadnought */}
      {type === 'VOID_ARCHITECT' && (
        <group>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[20.0, 8.0, 16.0]} />
            <meshStandardMaterial color="#111122" flatShading roughness={0.2} />
          </mesh>
          {/* Main Cannon Array */}
          <mesh position={[0, 0, 8.5]}>
            <cylinderGeometry args={[2.0, 2.5, 6.0, 8]} />
            <meshStandardMaterial color="#ff0055" emissive="#990022" flatShading />
          </mesh>
          {/* Wing Turbines */}
          <mesh position={[-12.0, 0, 2.0]}>
            <cylinderGeometry args={[3.0, 3.5, 10.0, 6]} />
            <meshStandardMaterial color="#334466" flatShading />
          </mesh>
          <mesh position={[12.0, 0, 2.0]}>
            <cylinderGeometry args={[3.0, 3.5, 10.0, 6]} />
            <meshStandardMaterial color="#334466" flatShading />
          </mesh>
        </group>
      )}
    </group>
  );
};
