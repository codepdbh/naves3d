import * as THREE from 'three';

export interface CollidableEntity {
  id: string;
  layer: number;
  mask: number;
  position: THREE.Vector3;
  prevPosition?: THREE.Vector3;
  radius: number;
  active: boolean;
  onCollision?: (other: CollidableEntity) => void;
  takeDamage?: (amount: number) => void;
  data?: any;
}

export class SpatialHash {
  private cellSize: number;
  private grid: Map<string, CollidableEntity[]>;

  constructor(cellSize: number = 20) {
    this.cellSize = cellSize;
    this.grid = Map ? new Map() : ({} as any);
  }

  private getKey(x: number, y: number, z: number): string {
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);
    const cz = Math.floor(z / this.cellSize);
    return `${cx},${cy},${cz}`;
  }

  public clear(): void {
    this.grid.clear();
  }

  public insert(entity: CollidableEntity): void {
    if (!entity.active) return;

    const minX = entity.position.x - entity.radius;
    const maxX = entity.position.x + entity.radius;
    const minY = entity.position.y - entity.radius;
    const maxY = entity.position.y + entity.radius;
    const minZ = entity.position.z - entity.radius;
    const maxZ = entity.position.z + entity.radius;

    const startX = Math.floor(minX / this.cellSize);
    const endX = Math.floor(maxX / this.cellSize);
    const startY = Math.floor(minY / this.cellSize);
    const endY = Math.floor(maxY / this.cellSize);
    const startZ = Math.floor(minZ / this.cellSize);
    const endZ = Math.floor(maxZ / this.cellSize);

    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        for (let z = startZ; z <= endZ; z++) {
          const key = `${x},${y},${z}`;
          let bucket = this.grid.get(key);
          if (!bucket) {
            bucket = [];
            this.grid.set(key, bucket);
          }
          bucket.push(entity);
        }
      }
    }
  }

  public getNearby(entity: CollidableEntity): Set<CollidableEntity> {
    const nearby = new Set<CollidableEntity>();

    const minX = entity.position.x - entity.radius;
    const maxX = entity.position.x + entity.radius;
    const minY = entity.position.y - entity.radius;
    const maxY = entity.position.y + entity.radius;
    const minZ = entity.position.z - entity.radius;
    const maxZ = entity.position.z + entity.radius;

    const startX = Math.floor(minX / this.cellSize);
    const endX = Math.floor(maxX / this.cellSize);
    const startY = Math.floor(minY / this.cellSize);
    const endY = Math.floor(maxY / this.cellSize);
    const startZ = Math.floor(minZ / this.cellSize);
    const endZ = Math.floor(maxZ / this.cellSize);

    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        for (let z = startZ; z <= endZ; z++) {
          const key = `${x},${y},${z}`;
          const bucket = this.grid.get(key);
          if (bucket) {
            for (let i = 0; i < bucket.length; i++) {
              const other = bucket[i];
              if (other.id !== entity.id && (entity.mask & other.layer) !== 0) {
                nearby.add(other);
              }
            }
          }
        }
      }
    }

    return nearby;
  }

  public getActiveCellKeys(): string[] {
    return Array.from(this.grid.keys());
  }
}
