import React, { useEffect, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSettingsStore } from '../../stores/settingsStore';

export const RetroRenderPass: React.FC = () => {
  const { gl, scene, camera, size } = useThree();
  const resolution = useSettingsStore((s) => s.resolution);

  const { width, height } = useMemo(() => {
    switch (resolution) {
      case '320x180':
        return { width: 320, height: 180 };
      case '480x270':
        return { width: 480, height: 270 };
      case '640x360':
        return { width: 640, height: 360 };
      default:
        return { width: size.width, height: size.height };
    }
  }, [resolution, size]);

  const target = useMemo(() => {
    const renderTarget = new THREE.WebGLRenderTarget(width, height, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
    });
    return renderTarget;
  }, [width, height]);

  useEffect(() => {
    target.setSize(width, height);
  }, [target, width, height]);

  useEffect(() => {
    return () => {
      target.dispose();
    };
  }, [target]);

  useFrame(() => {
    if (resolution !== 'NATIVE') {
      gl.setRenderTarget(target);
      gl.render(scene, camera);
      gl.setRenderTarget(null);

      // Render offscreen texture to screen canvas quad with nearest filtering
      gl.render(scene, camera);
    }
  }, 1);

  return null;
};
