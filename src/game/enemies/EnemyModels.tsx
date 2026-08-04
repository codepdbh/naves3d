import React, { useMemo } from 'react';
import * as THREE from 'three';
import { EnemyType, ENEMY_STATS } from '../constants';
import { TextureGenerator } from '../rendering/TextureGenerator';

interface EnemyMeshProps {
  type: EnemyType;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  healthRatio: number;
}

export const EnemyMesh: React.FC<EnemyMeshProps> = ({ type, position, rotation, healthRatio }) => {
  const stats = ENEMY_STATS[type];

  const enemyTexture = useMemo(() => {
    return TextureGenerator.createShipHullTexture(stats.color, '#111122');
  }, [stats]);

  return (
    <group position={position} rotation={rotation}>
      {/* SCOUT DRONE - Diamond Spike */}
      {type === 'SCOUT_DRONE' && (
        <mesh>
          <octahedronGeometry args={[1.2, 0]} />
          <meshStandardMaterial map={enemyTexture} color={stats.color} flatShading />
        </mesh>
      )}

      {/* INTERCEPTOR - Arrowhead Wing */}
      {type === 'INTERCEPTOR' && (
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[1.2, 2.5, 4]} />
            <meshStandardMaterial map={enemyTexture} color={stats.color} flatShading />
          </mesh>
          <mesh position={[0, 0, 0.5]}>
            <boxGeometry args={[2.5, 0.2, 0.8]} />
            <meshStandardMaterial color="#222" flatShading />
          </mesh>
        </group>
      )}

      {/* HEAVY BOMBER - Large Armored Dreadnought */}
      {type === 'HEAVY_BOMBER' && (
        <group>
          <mesh>
            <boxGeometry args={[3.0, 1.8, 4.0]} />
            <meshStandardMaterial map={enemyTexture} color={stats.color} flatShading />
          </mesh>
          <mesh position={[0, 1.0, 0]}>
            <cylinderGeometry args={[0.8, 1.0, 1.2, 6]} />
            <meshStandardMaterial color="#ff3300" emissive="#aa1100" flatShading />
          </mesh>
        </group>
      )}

      {/* TURRET - Hexagonal Defense Gun */}
      {type === 'TURRET' && (
        <group>
          <mesh>
            <cylinderGeometry args={[1.5, 1.8, 1.0, 6]} />
            <meshStandardMaterial color="#444455" flatShading />
          </mesh>
          <mesh position={[0, 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.4, 2.2, 8]} />
            <meshStandardMaterial color={stats.color} flatShading />
          </mesh>
        </group>
      )}

      {/* MINE - Spiky Red Sphere */}
      {type === 'MINE' && (
        <mesh>
          <dodecahedronGeometry args={[1.0, 0]} />
          <meshStandardMaterial color="#ff0000" emissive="#880000" flatShading />
        </mesh>
      )}

      {/* SHIELD DRONE - Cyan Prism */}
      {type === 'SHIELD_DRONE' && (
        <mesh>
          <cylinderGeometry args={[1.2, 1.2, 0.6, 3]} />
          <meshStandardMaterial color="#00ffff" emissive="#0066aa" flatShading />
        </mesh>
      )}

      {/* REPAIR DRONE - Green Cross Pod */}
      {type === 'REPAIR_DRONE' && (
        <mesh>
          <boxGeometry args={[1.4, 1.4, 1.4]} />
          <meshStandardMaterial color="#00ff66" emissive="#006622" flatShading />
        </mesh>
      )}

      {/* ELITE FIGHTER - Double-Wing Ace Fighter */}
      {type === 'ELITE_FIGHTER' && (
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[1.5, 3.2, 5]} />
            <meshStandardMaterial map={enemyTexture} color={stats.color} flatShading />
          </mesh>
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[3.6, 0.3, 1.2]} />
            <meshStandardMaterial color="#ffcc00" flatShading />
          </mesh>
          <mesh position={[0, -0.4, 0]}>
            <boxGeometry args={[3.6, 0.3, 1.2]} />
            <meshStandardMaterial color="#ffcc00" flatShading />
          </mesh>
        </group>
      )}

      {/* Simple Health Indicator Bar above damaged units */}
      {healthRatio < 1.0 && (
        <mesh position={[0, 2.2, 0]}>
          <planeGeometry args={[2.0 * healthRatio, 0.2]} />
          <meshBasicMaterial color={healthRatio > 0.4 ? '#00ff00' : '#ff0000'} />
        </mesh>
      )}
    </group>
  );
};
