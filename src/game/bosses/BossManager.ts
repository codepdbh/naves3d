import * as THREE from 'three';
import { collisionSystem } from '../collision/CollisionSystem';
import { COLLISION_LAYERS } from '../constants';
import { projectilePool } from '../projectiles/ProjectilePool';
import { enemyFactory } from '../enemies/EnemyFactory';
import { audioEngine } from '../audio/AudioEngine';
import { useGameStore } from '../../stores/gameStore';

export type BossType = 'ASTEROID_DEVOURER' | 'SWARM_CORE' | 'VOID_ARCHITECT';

export class BossManager {
  public active: boolean = false;
  public bossType: BossType = 'ASTEROID_DEVOURER';
  public position: THREE.Vector3 = new THREE.Vector3(0, 0, -200);
  public health: number = 1000;
  public maxHealth: number = 1000;
  public phase: number = 1;
  public isInvincible: boolean = false;

  private attackTimer: number = 0;

  public spawnBoss(type: BossType): void {
    this.active = true;
    this.bossType = type;
    this.phase = 1;
    this.position.set(0, 0, -220);
    this.attackTimer = 0;
    this.isInvincible = false;

    if (type === 'ASTEROID_DEVOURER') {
      this.maxHealth = 1200;
      this.health = 1200;
      useGameStore.getState().setBossInfo(true, 'Devorador de Asteroides', 1200, 1200);
    } else if (type === 'SWARM_CORE') {
      this.maxHealth = 2000;
      this.health = 2000;
      useGameStore.getState().setBossInfo(true, 'Núcleo del Enjambre', 2000, 2000);
    } else if (type === 'VOID_ARCHITECT') {
      this.maxHealth = 3500;
      this.health = 3500;
      useGameStore.getState().setBossInfo(true, 'Arquitecto del Vacío', 3500, 3500);
    }

    audioEngine.playMusic('boss');

    // Register 3D Boss Collision
    collisionSystem.registerEntity({
      id: 'boss_entity',
      layer: COLLISION_LAYERS.BOSS,
      mask: COLLISION_LAYERS.PLAYER | COLLISION_LAYERS.PLAYER_PROJECTILE,
      position: this.position,
      radius: 8.0,
      active: true,
      data: this,
      takeDamage: (amount: number) => this.takeDamage(amount),
    });
  }

  public takeDamage(amount: number): void {
    if (!this.active || this.isInvincible) return;

    this.health = Math.max(0, this.health - amount);
    useGameStore.getState().updateBossHealth(this.health);

    audioEngine.playHit(false);

    // Phase Transitions
    const ratio = this.health / this.maxHealth;
    if (ratio < 0.33 && this.phase < 3) {
      this.phase = 3;
    } else if (ratio < 0.66 && this.phase < 2) {
      this.phase = 2;
    }

    if (this.health <= 0) {
      this.destroy();
    }
  }

  public update(delta: number, playerPos: THREE.Vector3): void {
    if (!this.active) return;

    this.attackTimer += delta;

    // Movement toward player area
    const targetZ = -120 + Math.sin(this.attackTimer) * 20;
    this.position.z += (targetZ - this.position.z) * delta * 2;
    this.position.x = Math.sin(this.attackTimer * 0.8) * 30;

    // Boss Attack Patterns
    if (this.bossType === 'ASTEROID_DEVOURER') {
      this.updateAsteroidDevourer(delta, playerPos);
    } else if (this.bossType === 'SWARM_CORE') {
      this.updateSwarmCore(delta, playerPos);
    } else if (this.bossType === 'VOID_ARCHITECT') {
      this.updateVoidArchitect(delta, playerPos);
    }
  }

  private updateAsteroidDevourer(delta: number, playerPos: THREE.Vector3): void {
    if (this.attackTimer >= 2.0) {
      this.attackTimer = 0;

      // Phase 1: Fragment Scatter
      const count = this.phase * 6;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const dir = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 1).normalize();
        projectilePool.spawn(this.position, dir, 50, 15, '#ff6600', true, 1.2);
      }

      // Phase 2+: Summon Scout Drones
      if (this.phase >= 2) {
        enemyFactory.spawnEnemy('SCOUT_DRONE', this.position.clone().add(new THREE.Vector3(-15, 0, 0)));
        enemyFactory.spawnEnemy('SCOUT_DRONE', this.position.clone().add(new THREE.Vector3(15, 0, 0)));
      }
    }
  }

  private updateSwarmCore(delta: number, playerPos: THREE.Vector3): void {
    if (this.attackTimer >= 1.5) {
      this.attackTimer = 0;

      // Bullet Hell Spiral Barrage
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + performance.now() * 0.002;
        const dir = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0.8).normalize();
        projectilePool.spawn(this.position, dir, 60, 12, '#33ffff', true, 0.8);
      }
    }
  }

  private updateVoidArchitect(delta: number, playerPos: THREE.Vector3): void {
    if (this.attackTimer >= 1.0) {
      this.attackTimer = 0;

      // Direct Aim Laser + Homing Missiles
      const dir = new THREE.Vector3().subVectors(playerPos, this.position).normalize();
      projectilePool.spawn(this.position, dir, 90, 20, '#ff00ff', true, 1.0);

      if (this.phase === 3) {
        projectilePool.spawn(this.position, dir, 50, 30, '#ff9900', true, 1.4, 4.0, playerPos);
      }
    }
  }

  public destroy(): void {
    if (!this.active) return;
    this.active = false;

    collisionSystem.unregisterEntity('boss_entity');
    audioEngine.playExplosion(true);

    const { addScore, nextWave, setBossInfo } = useGameStore.getState();
    addScore(5000);
    setBossInfo(false);

    nextWave();
  }
}

export const bossManager = new BossManager();
