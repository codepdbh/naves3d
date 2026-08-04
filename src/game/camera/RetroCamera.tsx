import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSettingsStore } from '../../stores/settingsStore';

interface RetroCameraProps {
  targetPosition: THREE.Vector3;
  targetRotation: THREE.Euler;
  isBoosting: boolean;
  shakeImpulse: number;
}

export const RetroCamera: React.FC<RetroCameraProps> = ({
  targetPosition,
  targetRotation,
  isBoosting,
  shakeImpulse,
}) => {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3(0, 5, 12));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, -20));

  useFrame((_, delta) => {
    const { cameraShakeIntensity, reducedMotion } = useSettingsStore.getState();

    // Desired camera offset behind and slightly above the ship
    const offset = new THREE.Vector3(0, 3.5, 10).applyEuler(targetRotation);
    const desiredPos = targetPosition.clone().add(offset);

    // Dynamic camera shake
    if (shakeImpulse > 0 && !reducedMotion) {
      const intensity = shakeImpulse * cameraShakeIntensity * 0.5;
      desiredPos.x += (Math.random() * 2 - 1) * intensity;
      desiredPos.y += (Math.random() * 2 - 1) * intensity;
      desiredPos.z += (Math.random() * 2 - 1) * intensity;
    }

    // Smooth lerp camera position
    currentPos.current.lerp(desiredPos, delta * 8);
    camera.position.copy(currentPos.current);

    // Look at point slightly in front of ship
    const lookTarget = targetPosition.clone().add(new THREE.Vector3(0, 0, -20).applyEuler(targetRotation));
    currentLookAt.current.lerp(lookTarget, delta * 10);
    camera.lookAt(currentLookAt.current);

    // FOV shift on boost
    const perspCam = camera as THREE.PerspectiveCamera;
    const targetFOV = isBoosting ? 75 : 60;
    perspCam.fov += (targetFOV - perspCam.fov) * delta * 5;
    perspCam.updateProjectionMatrix();
  });

  return null;
};
