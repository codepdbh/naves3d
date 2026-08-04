import * as THREE from 'three';
import { PickupType, COLLISION_LAYERS } from '../constants';
import { collisionSystem } from '../collision/CollisionSystem';
import { useGameStore } from '../../stores/gameStore';
import { audioEngine } from '../audio/AudioEngine';

export interface PickupItem {
  id: string;
  type: PickupType;
  position: THREE.Vector3;
  active: boolean;
  life: number;
}

export class PickupManager {
  private pickups: PickupItem[] = [];
  private counter: number = 0;

  public spawnPickup(type: PickupType, position: THREE.Vector3): void {
    const id = `pickup_${++this.counter}`;
    const item: PickupItem = {
      id,
      type,
      position: position.clone(),
      active: true,
      life: 15.0, // 15 seconds lifetime
    };

    this.pickups.push(item);

    collisionSystem.registerEntity({
      id: item.id,
      layer: COLLISION_LAYERS.PICKUP,
      mask: COLLISION_LAYERS.PLAYER,
      position: item.position,
      radius: 1.5,
      active: true,
      data: item,
      onCollision: () => {
        this.collect(item);
      },
    });
  }

  public update(delta: number, playerPos: THREE.Vector3): void {
    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const item = this.pickups[i];
      item.life -= delta;

      if (item.life <= 0 || !item.active) {
        collisionSystem.unregisterEntity(item.id);
        this.pickups.splice(i, 1);
        continue;
      }

      // Magnetic attraction to player when close (< 35 units)
      const dist = item.position.distanceTo(playerPos);
      if (dist < 35) {
        const pullDir = new THREE.Vector3().subVectors(playerPos, item.position).normalize();
        item.position.addScaledVector(pullDir, delta * 25);
      }
    }
  }

  private collect(item: PickupItem): void {
    if (!item.active) return;
    item.active = false;
    collisionSystem.unregisterEntity(item.id);

    audioEngine.playPickup();

    const {
      healPlayer,
      restoreShield,
      addEnergy,
      addMissiles,
      addBombs,
      addScore,
    } = useGameStore.getState();

    switch (item.type) {
      case 'HEALTH':
        healPlayer(35);
        break;
      case 'SHIELD':
        restoreShield(30);
        break;
      case 'ENERGY':
        addEnergy(50);
        break;
      case 'MISSILE':
        addMissiles(2);
        break;
      case 'BOMB':
        addBombs(1);
        break;
      case 'TRIPLE_SHOT':
        useGameStore.setState({ tripleShotPowerupTime: 12.0 });
        break;
      case 'MULTIPLIER':
        addScore(1000);
        break;
    }
  }

  public getActivePickups(): PickupItem[] {
    return this.pickups;
  }

  public clear(): void {
    for (const item of this.pickups) {
      collisionSystem.unregisterEntity(item.id);
      item.active = false;
    }
    this.pickups = [];
  }
}

export const pickupManager = new PickupManager();
