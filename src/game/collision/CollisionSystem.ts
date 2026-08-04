import * as THREE from 'three';
import { SpatialHash, CollidableEntity } from './SpatialHash';
import {
  sphereIntersectsSphere,
  segmentIntersectsSphere,
  sweptSphereIntersectsSphere,
} from './intersections';

export class CollisionSystem {
  private spatialHash: SpatialHash;
  private entities: Map<string, CollidableEntity> = new Map();

  constructor(cellSize: number = 25) {
    this.spatialHash = new SpatialHash(cellSize);
  }

  public registerEntity(entity: CollidableEntity): void {
    this.entities.set(entity.id, entity);
  }

  public unregisterEntity(id: string): void {
    this.entities.delete(id);
  }

  public clear(): void {
    this.entities.clear();
    this.spatialHash.clear();
  }

  public update(): void {
    this.spatialHash.clear();

    // Re-insert all active entities
    this.entities.forEach((entity) => {
      if (entity.active) {
        this.spatialHash.insert(entity);
      }
    });

    const checkedPairs = new Set<string>();

    this.entities.forEach((entityA) => {
      if (!entityA.active) return;

      const candidates = this.spatialHash.getNearby(entityA);

      candidates.forEach((entityB) => {
        if (!entityB.active) return;

        // Ensure unique pair check
        const pairKey =
          entityA.id < entityB.id
            ? `${entityA.id}:${entityB.id}`
            : `${entityB.id}:${entityA.id}`;

        if (checkedPairs.has(pairKey)) return;
        checkedPairs.add(pairKey);

        // Narrowphase collision check
        let isHit = false;

        // If entity has previous position (fast bullet / laser), perform continuous swept / segment collision
        if (entityA.prevPosition) {
          isHit = segmentIntersectsSphere(
            { start: entityA.prevPosition, end: entityA.position },
            { center: entityB.position, radius: entityB.radius }
          );
        } else if (entityB.prevPosition) {
          isHit = segmentIntersectsSphere(
            { start: entityB.prevPosition, end: entityB.position },
            { center: entityA.position, radius: entityA.radius }
          );
        } else {
          // Standard sphere-sphere check
          isHit = sphereIntersectsSphere(
            { center: entityA.position, radius: entityA.radius },
            { center: entityB.position, radius: entityB.radius }
          );
        }

        if (isHit) {
          // Dispatch collision responses
          if (entityA.onCollision) entityA.onCollision(entityB);
          if (entityB.onCollision) entityB.onCollision(entityA);
        }
      });
    });
  }

  public getSpatialHash(): SpatialHash {
    return this.spatialHash;
  }

  public getEntityCount(): number {
    return this.entities.size;
  }
}

export const collisionSystem = new CollisionSystem(25);
