import * as THREE from 'three';
import { EnemyType, ENEMY_STATS, COLLISION_LAYERS } from '../constants';
import { FiniteStateMachine, AIState } from './ai/FiniteStateMachine';
import { collisionSystem } from '../collision/CollisionSystem';
import { projectilePool } from '../projectiles/ProjectilePool';
import { audioEngine } from '../audio/AudioEngine';
import { useGameStore } from '../../stores/gameStore';

export class EnemyBase {
  public id: string;
  public type: EnemyType;
  public position: THREE.Vector3;
  public velocity: THREE.Vector3;
  public rotation: THREE.Euler;
  public health: number;
  public maxHealth: number;
  public active: boolean = true;
  public fsm: FiniteStateMachine;

  private lastFireTime: number = 0;
  public isShielded: boolean = false;

  constructor(id: string, type: EnemyType, startPos: THREE.Vector3) {
    this.id = id;
    this.type = type;
    this.position = startPos.clone();
    this.velocity = new THREE.Vector3();
    this.rotation = new THREE.Euler();

    const stats = ENEMY_STATS[type];
    this.health = stats.maxHealth;
    this.maxHealth = stats.maxHealth;
    this.fsm = new FiniteStateMachine('SPAWN');

    this.registerCollision();
  }

  private registerCollision(): void {
    const stats = ENEMY_STATS[this.type];
    collisionSystem.registerEntity({
      id: this.id,
      layer: COLLISION_LAYERS.ENEMY,
      mask: COLLISION_LAYERS.PLAYER | COLLISION_LAYERS.PLAYER_PROJECTILE,
      position: this.position,
      radius: stats.collisionRadius,
      active: true,
      data: this,
      onCollision: (other) => {
        if (other.layer === COLLISION_LAYERS.PLAYER) {
          const { takePlayerDamage } = useGameStore.getState();
          takePlayerDamage(20);
          audioEngine.playHit(false);

          if (this.type === 'MINE' || this.type === 'SCOUT_DRONE') {
            this.destroy();
          }
        }
      },
      takeDamage: (amount: number) => {
        this.takeDamage(amount);
      },
    });
  }

  public takeDamage(amount: number): void {
    if (!this.active || this.fsm.getState() === 'DESTROYED') return;
    if (this.isShielded) {
      audioEngine.playHit(true);
      return;
    }

    this.health -= amount;
    audioEngine.playHit(false);

    if (this.health <= 0) {
      this.destroy();
    }
  }

  public update(delta: number, playerPos: THREE.Vector3): void {
    if (!this.active || this.fsm.getState() === 'DESTROYED') return;

    this.fsm.update(delta);
    const stats = ENEMY_STATS[this.type];
    const distToPlayer = this.position.distanceTo(playerPos);

    // AI State Transitions
    switch (this.fsm.getState()) {
      case 'SPAWN':
        if (this.fsm.getStateTime() > 0.5) {
          this.fsm.transitionTo('CHASE');
        }
        break;

      case 'CHASE':
        const dir = new THREE.Vector3().subVectors(playerPos, this.position).normalize();
        this.velocity.lerp(dir.multiplyScalar(stats.speed), delta * 3);
        this.position.addScaledVector(this.velocity, delta);

        if (distToPlayer < 40) {
          this.fsm.transitionTo('ATTACK');
        }
        break;

      case 'ATTACK':
        this.attack(delta, playerPos);
        if (distToPlayer > 60) {
          this.fsm.transitionTo('CHASE');
        }
        break;
    }
  }

  private attack(delta: number, playerPos: THREE.Vector3): void {
    const now = performance.now() / 1000;
    const stats = ENEMY_STATS[this.type];

    if (now - this.lastFireTime >= 1.5) {
      const dir = new THREE.Vector3().subVectors(playerPos, this.position).normalize();

      if (this.type === 'INTERCEPTOR' || this.type === 'ELITE_FIGHTER') {
        projectilePool.spawn(this.position, dir, 70, 10, '#ff3366', true, 0.7);
        audioEngine.playLaser('LASER');
      } else if (this.type === 'HEAVY_BOMBER') {
        projectilePool.spawn(this.position, dir, 45, 25, '#ff9900', true, 1.2, 5.0, playerPos);
        audioEngine.playMissileLaunch();
      } else if (this.type === 'TURRET') {
        projectilePool.spawn(this.position, dir, 80, 15, '#cc00ff', true, 0.9);
        audioEngine.playLaser('LASER');
      }

      this.lastFireTime = now;
    }
  }

  public destroy(): void {
    if (!this.active) return;

    this.active = false;
    this.fsm.transitionTo('DESTROYED');
    collisionSystem.unregisterEntity(this.id);

    const stats = ENEMY_STATS[this.type];
    const { registerKill } = useGameStore.getState();
    registerKill(stats.scoreValue);

    audioEngine.playExplosion(this.type === 'HEAVY_BOMBER' || this.type === 'ELITE_FIGHTER');
  }
}
