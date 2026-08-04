import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { SpatialHash } from '../game/collision/SpatialHash';

describe('SpatialHash Broadphase Grid', () => {
  it('correctly partitions and queries nearby spatial entities', () => {
    const hash = new SpatialHash(20);

    const entityA = {
      id: 'A',
      layer: 1,
      mask: 4,
      position: new THREE.Vector3(5, 5, 5),
      radius: 2,
      active: true,
    };

    const entityB = {
      id: 'B',
      layer: 4,
      mask: 1,
      position: new THREE.Vector3(8, 5, 5),
      radius: 2,
      active: true,
    };

    const entityFar = {
      id: 'FAR',
      layer: 4,
      mask: 1,
      position: new THREE.Vector3(500, 500, 500),
      radius: 2,
      active: true,
    };

    hash.insert(entityA);
    hash.insert(entityB);
    hash.insert(entityFar);

    const nearbyA = Array.from(hash.getNearby(entityA));

    expect(nearbyA).toContain(entityB);
    expect(nearbyA).not.toContain(entityFar);
  });
});
