import * as THREE from 'three';
import { COLLISION_LAYERS } from '../constants';
import { collisionSystem } from '../collision/CollisionSystem';

export interface Projectile {
  id: string;
  position: THREE.Vector3;
  prevPosition: THREE.Vector3;
  velocity: THREE.Vector3;
  damage: number;
  radius: number;
  life: number;
  maxLife: number;
  color: string;
  isEnemy: boolean;
  active: boolean;
  target?: THREE.Vector3; // For homing missiles
}

export class ProjectilePool {
  private pool: Projectile[] = [];
  private activeProjectiles: Projectile[] = [];

  constructor(initialCapacity: number = 200) {
    for (let i = 0; i < initialCapacity; i++) {
      this.pool.push({
        id: `proj_${i}`,
        position: new THREE.Vector3(),
        prevPosition: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        damage: 10,
        radius: 0.8,
        life: 0,
        maxLife: 3.0,
        color: '#00ffcc',
        isEnemy: false,
        active: false,
      });
    }
  }

  public spawn(
    position: THREE.Vector3,
    direction: THREE.Vector3,
    speed: number,
    damage: number,
    color: string,
    isEnemy: boolean,
    radius: number = 0.8,
    maxLife: number = 3.0,
    target?: THREE.Vector3
  ): Projectile | null {
    let proj = this.pool.pop();
    if (!proj) {
      proj = {
        id: `proj_${Date.now()}_${Math.random()}`,
        position: new THREE.Vector3(),
        prevPosition: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        damage,
        radius,
        life: 0,
        maxLife,
        color,
        isEnemy,
        active: true,
      };
    }

    proj.active = true;
    proj.position.copy(position);
    proj.prevPosition.copy(position);
    proj.velocity.copy(direction).normalize().multiplyScalar(speed);
    proj.damage = damage;
    proj.radius = radius;
    proj.color = color;
    proj.isEnemy = isEnemy;
    proj.life = maxLife;
    proj.maxLife = maxLife;
    proj.target = target;

    this.activeProjectiles.push(proj);

    // Register with 3D Collision System
    collisionSystem.registerEntity({
      id: proj.id,
      layer: isEnemy ? COLLISION_LAYERS.ENEMY_PROJECTILE : COLLISION_LAYERS.PLAYER_PROJECTILE,
      mask: isEnemy ? COLLISION_LAYERS.PLAYER : COLLISION_LAYERS.ENEMY | COLLISION_LAYERS.BOSS | COLLISION_LAYERS.ASTEROID,
      position: proj.position,
      prevPosition: proj.prevPosition,
      radius: proj.radius,
      active: true,
      data: proj,
      onCollision: (other) => {
        if (other.takeDamage) {
          other.takeDamage(proj.damage);
        }
        this.despawn(proj.id);
      },
    });

    return proj;
  }

  public despawn(id: string): void {
    const idx = this.activeProjectiles.findIndex((p) => p.id === id);
    if (idx !== -1) {
      const proj = this.activeProjectiles[idx];
      proj.active = false;
      collisionSystem.unregisterEntity(proj.id);
      this.activeProjectiles.splice(idx, 1);
      this.pool.push(proj);
    }
  }

  public update(delta: number): void {
    for (let i = this.activeProjectiles.length - 1; i >= 0; i--) {
      const proj = this.activeProjectiles[i];
      proj.life -= delta;

      if (proj.life <= 0) {
        this.despawn(proj.id);
        continue;
      }

      proj.prevPosition.copy(proj.position);

      // Homing missile logic
      if (proj.target) {
        const toTarget = new THREE.Vector3().subVectors(proj.target, proj.position).normalize();
        proj.velocity.lerp(toTarget.multiplyScalar(proj.velocity.length()), delta * 4);
      }

      proj.position.addScaledVector(proj.velocity, delta);
    }
  }

  public getActive(): Projectile[] {
    return this.activeProjectiles;
  }

  public clear(): void {
    for (const proj of this.activeProjectiles) {
      collisionSystem.unregisterEntity(proj.id);
      proj.active = false;
      this.pool.push(proj);
    }
    this.activeProjectiles = [];
  }
}

export const projectilePool = new ProjectilePool(300);
