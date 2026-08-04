import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
  sphereIntersectsSphere,
  sphereIntersectsAABB,
  segmentIntersectsSphere,
} from '../game/collision/intersections';

describe('3D Collision Intersections Math', () => {
  it('detects sphere vs sphere overlap correctly', () => {
    const s1 = { center: new THREE.Vector3(0, 0, 0), radius: 5 };
    const s2 = { center: new THREE.Vector3(3, 0, 0), radius: 3 };
    const s3 = { center: new THREE.Vector3(20, 0, 0), radius: 2 };

    expect(sphereIntersectsSphere(s1, s2)).toBe(true);
    expect(sphereIntersectsSphere(s1, s3)).toBe(false);
  });

  it('detects sphere vs AABB intersection correctly', () => {
    const sphere = { center: new THREE.Vector3(5, 5, 5), radius: 3 };
    const boxHit = { min: new THREE.Vector3(0, 0, 0), max: new THREE.Vector3(4, 4, 4) };
    const boxMiss = { min: new THREE.Vector3(20, 20, 20), max: new THREE.Vector3(25, 25, 25) };

    expect(sphereIntersectsAABB(sphere, boxHit)).toBe(true);
    expect(sphereIntersectsAABB(sphere, boxMiss)).toBe(false);
  });

  it('detects line segment vs sphere raycast intersection correctly', () => {
    const sphere = { center: new THREE.Vector3(0, 0, 10), radius: 4 };

    // Direct hit through sphere
    const segmentHit = { start: new THREE.Vector3(0, 0, 0), end: new THREE.Vector3(0, 0, 20) };
    // Segment stops before reaching sphere
    const segmentShort = { start: new THREE.Vector3(0, 0, 0), end: new THREE.Vector3(0, 0, 4) };

    expect(segmentIntersectsSphere(segmentHit, sphere)).toBe(true);
    expect(segmentIntersectsSphere(segmentShort, sphere)).toBe(false);
  });
});
