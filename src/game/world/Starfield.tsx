import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TextureGenerator } from '../rendering/TextureGenerator';
import { useGameStore } from '../../stores/gameStore';
import { SECTORS } from '../constants';

export const Starfield: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null!);
  const currentSector = useGameStore((s) => s.currentSector);
  const sectorConfig = SECTORS.find((s) => s.id === currentSector) || SECTORS[0];

  const starTexture = useMemo(() => {
    return TextureGenerator.createPixelTexture(
      8,
      8,
      (ctx, w, h) => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(2, 2, 4, 4);
      },
      'pixel_star'
    );
  }, []);

  const { positions, colors } = useMemo(() => {
    const count = 1200;
    const posArr = new Float32Array(count * 3);
    const colArr = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#88ccff'),
      new THREE.Color('#ffcc88'),
      new THREE.Color('#ff88cc'),
    ];

    for (let i = 0; i < count; i++) {
      const radius = 200 + Math.random() * 600;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      posArr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      posArr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      posArr[i * 3 + 2] = radius * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      colArr[i * 3] = color.r;
      colArr[i * 3 + 1] = color.g;
      colArr[i * 3 + 2] = color.b;
    }

    return { positions: posArr, colors: colArr };
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.01;
      pointsRef.current.rotation.x += delta * 0.005;
    }
  });

  return (
    <group>
      {/* Background Ambient Fog & Color */}
      <color attach="background" args={[sectorConfig.bgColor]} />
      <fog attach="fog" args={[sectorConfig.fogColor, 150, 700]} />

      {/* Star Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={4.0}
          map={starTexture}
          vertexColors
          transparent
          alphaTest={0.5}
          sizeAttenuation={true}
        />
      </points>
    </group>
  );
};
