import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PickupType } from '../constants';
import { TextureGenerator } from '../rendering/TextureGenerator';

interface PickupMeshProps {
  type: PickupType;
  position: THREE.Vector3;
}

export const PickupMesh: React.FC<PickupMeshProps> = ({ type, position }) => {
  const meshRef = React.useRef<THREE.Mesh>(null!);

  const { color, symbol } = useMemo(() => {
    switch (type) {
      case 'HEALTH':
        return { color: '#00ff66', symbol: 'HP' };
      case 'SHIELD':
        return { color: '#00ccff', symbol: 'SH' };
      case 'ENERGY':
        return { color: '#ffff00', symbol: 'NR' };
      case 'MISSILE':
        return { color: '#ff9900', symbol: 'MS' };
      case 'BOMB':
        return { color: '#ff0055', symbol: 'BM' };
      case 'TRIPLE_SHOT':
        return { color: '#ff33ff', symbol: '3X' };
      default:
        return { color: '#ffffff', symbol: 'PX' };
    }
  }, [type]);

  const texture = useMemo(() => {
    return TextureGenerator.createPickupTexture(symbol, color);
  }, [symbol, color]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 3;
      meshRef.current.position.y = position.y + Math.sin(state.clock.elapsedTime * 4) * 0.4;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial map={texture} color={color} flatShading emissive={color} emissiveIntensity={0.4} />
    </mesh>
  );
};
