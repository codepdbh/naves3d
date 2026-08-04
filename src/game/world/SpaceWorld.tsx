import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useGameStore } from '../../stores/gameStore';
import { SECTORS } from '../constants';
import { TextureGenerator } from '../rendering/TextureGenerator';

export const SpaceWorld: React.FC = () => {
  const currentSector = useGameStore((s) => s.currentSector);
  const sectorConfig = SECTORS.find((s) => s.id === currentSector) || SECTORS[0];

  const rockTexture = useMemo(() => TextureGenerator.createAsteroidTexture(), []);

  // Generate sector specific asteroid positions & sizes
  const asteroids = useMemo(() => {
    const list = [];
    const count = sectorConfig.asteroidDensity;
    const seed = sectorConfig.id * 100;

    for (let i = 0; i < count; i++) {
      const radius = 60 + Math.random() * 250;
      const angle = (i / count) * Math.PI * 2 + (seed % 10);
      const height = (Math.sin(i * 1.5) * 80);

      list.push({
        id: `ast_${i}`,
        position: new THREE.Vector3(
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius - 100
        ),
        scale: 1.5 + Math.random() * 4.5,
        rotation: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
      });
    }

    return list;
  }, [sectorConfig]);

  // Floating sector landmarks (Station Debris for Sector 3, Energy Beacons for Sector 5)
  const landmarks = useMemo(() => {
    const list = [];
    if (sectorConfig.id === 3) {
      // Wrecked Space Station Hub
      list.push({
        id: 'station_hub',
        type: 'WRECKAGE',
        position: new THREE.Vector3(0, 30, -250),
        scale: 12,
      });
    } else if (sectorConfig.id === 5) {
      // Void Citadel Pylons
      list.push({
        id: 'pylon_left',
        type: 'PYLON',
        position: new THREE.Vector3(-120, 0, -300),
        scale: 15,
      });
      list.push({
        id: 'pylon_right',
        type: 'PYLON',
        position: new THREE.Vector3(120, 0, -300),
        scale: 15,
      });
    }
    return list;
  }, [sectorConfig]);

  return (
    <group>
      {/* Voxel / Low-Poly Asteroid Field */}
      {asteroids.map((ast) => (
        <mesh
          key={ast.id}
          position={ast.position}
          rotation={ast.rotation}
          scale={ast.scale}
        >
          <dodecahedronGeometry args={[2, 0]} />
          <meshStandardMaterial
            map={rockTexture}
            flatShading
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      ))}

      {/* Sector Landmarks & Structures */}
      {landmarks.map((lm) => (
        <group key={lm.id} position={lm.position} scale={lm.scale}>
          {lm.type === 'WRECKAGE' && (
            <mesh>
              <boxGeometry args={[4, 2, 8]} />
              <meshStandardMaterial color="#334455" flatShading roughness={0.7} />
            </mesh>
          )}
          {lm.type === 'PYLON' && (
            <mesh>
              <cylinderGeometry args={[1, 2, 10, 6]} />
              <meshStandardMaterial color="#00ffff" emissive="#0044aa" flatShading />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
};
