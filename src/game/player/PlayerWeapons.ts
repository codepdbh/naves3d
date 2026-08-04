import * as THREE from 'three';
import { useGameStore } from '../../stores/gameStore';
import { WEAPON_CONFIGS, WeaponType } from '../constants';
import { projectilePool } from '../projectiles/ProjectilePool';
import { audioEngine } from '../audio/AudioEngine';

export class PlayerWeapons {
  private lastFireTime: number = 0;
  private lastMissileTime: number = 0;

  public update(
    delta: number,
    position: THREE.Vector3,
    rotation: THREE.Euler,
    isFiringPrimary: boolean,
    isFiringMissile: boolean,
    isFiringBomb: boolean,
    isCyclingWeapon: boolean,
    nearestEnemyPos?: THREE.Vector3
  ): void {
    const now = performance.now() / 1000;
    const {
      currentWeapon,
      setWeapon,
      isOverheated,
      addHeat,
      coolDownHeat,
      useMissile,
      useBomb,
      consumeEnergy,
      tripleShotPowerupTime,
    } = useGameStore.getState();

    // Heat dissipation tick
    if (!isFiringPrimary || isOverheated) {
      coolDownHeat(35 * delta);
    }

    // Cycle Weapons (R key)
    if (isCyclingWeapon) {
      const weapons: WeaponType[] = ['LASER', 'TRIPLE', 'PIERCING'];
      const nextIdx = (weapons.indexOf(currentWeapon) + 1) % weapons.length;
      setWeapon(weapons[nextIdx]);
    }

    // Primary Weapon Firing
    if (isFiringPrimary && !isOverheated) {
      const activeWeapon = tripleShotPowerupTime > 0 ? 'TRIPLE' : currentWeapon;
      const config = WEAPON_CONFIGS[activeWeapon];

      if (now - this.lastFireTime >= 1 / config.fireRate) {
        if (config.energyCost === 0 || consumeEnergy(config.energyCost)) {
          this.firePrimary(position, rotation, activeWeapon);
          addHeat(config.heatPerShot);
          this.lastFireTime = now;
        }
      }
    }

    // Secondary Missile Firing (RMB)
    if (isFiringMissile && now - this.lastMissileTime >= 0.5) {
      if (useMissile()) {
        this.fireMissile(position, rotation, nearestEnemyPos);
        this.lastMissileTime = now;
      }
    }

    // EMP Bomb Trigger (F key)
    if (isFiringBomb) {
      if (useBomb()) {
        this.triggerBomb(position);
      }
    }
  }

  private firePrimary(position: THREE.Vector3, rotation: THREE.Euler, type: WeaponType): void {
    const forward = new THREE.Vector3(0, 0, -1).applyEuler(rotation);

    if (type === 'LASER') {
      const muzzlePos = position.clone().addScaledVector(forward, 2);
      projectilePool.spawn(muzzlePos, forward, 130, 18, '#00ffcc', false, 0.8);
      audioEngine.playLaser('LASER');
    } else if (type === 'TRIPLE') {
      const leftDir = forward.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.15);
      const rightDir = forward.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), -0.15);

      projectilePool.spawn(position, forward, 110, 12, '#ffdd00', false, 0.7);
      projectilePool.spawn(position, leftDir, 110, 12, '#ffdd00', false, 0.7);
      projectilePool.spawn(position, rightDir, 110, 12, '#ffdd00', false, 0.7);
      audioEngine.playLaser('TRIPLE');
    } else if (type === 'PIERCING') {
      const muzzlePos = position.clone().addScaledVector(forward, 2.5);
      projectilePool.spawn(muzzlePos, forward, 170, 45, '#ff00ff', false, 1.4);
      audioEngine.playLaser('PIERCING');
    }
  }

  private fireMissile(position: THREE.Vector3, rotation: THREE.Euler, targetPos?: THREE.Vector3): void {
    const forward = new THREE.Vector3(0, 0, -1).applyEuler(rotation);
    projectilePool.spawn(position, forward, 80, 75, '#ff9900', false, 1.5, 4.0, targetPos);
    audioEngine.playMissileLaunch();
  }

  private triggerBomb(position: THREE.Vector3): void {
    audioEngine.playBomb();

    // Clear all active enemy projectiles
    const activeProjs = projectilePool.getActive();
    for (let i = activeProjs.length - 1; i >= 0; i--) {
      if (activeProjs[i].isEnemy) {
        projectilePool.despawn(activeProjs[i].id);
      }
    }
  }
}

export const playerWeapons = new PlayerWeapons();
