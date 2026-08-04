import * as THREE from 'three';
import { EnemyBase } from './EnemyBase';
import { EnemyType } from '../constants';

export class EnemyFactory {
  private activeEnemies: EnemyBase[] = [];
  private spawnCounter: number = 0;

  public spawnEnemy(type: EnemyType, position: THREE.Vector3): EnemyBase {
    const id = `enemy_${type}_${++this.spawnCounter}`;
    const enemy = new EnemyBase(id, type, position);
    this.activeEnemies.push(enemy);
    return enemy;
  }

  public update(delta: number, playerPos: THREE.Vector3): void {
    for (let i = this.activeEnemies.length - 1; i >= 0; i--) {
      const enemy = this.activeEnemies[i];
      if (!enemy.active) {
        this.activeEnemies.splice(i, 1);
      } else {
        enemy.update(delta, playerPos);
      }
    }
  }

  public getActiveEnemies(): EnemyBase[] {
    return this.activeEnemies;
  }

  public getNearestEnemy(position: THREE.Vector3): EnemyBase | null {
    let nearest: EnemyBase | null = null;
    let minDist = Infinity;

    for (const enemy of this.activeEnemies) {
      if (enemy.active) {
        const dist = enemy.position.distanceTo(position);
        if (dist < minDist) {
          minDist = dist;
          nearest = enemy;
        }
      }
    }

    return nearest;
  }

  public clear(): void {
    for (const enemy of this.activeEnemies) {
      enemy.destroy();
    }
    this.activeEnemies = [];
  }
}

export const enemyFactory = new EnemyFactory();
