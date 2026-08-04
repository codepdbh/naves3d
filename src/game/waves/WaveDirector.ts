import * as THREE from 'three';
import { EnemyType } from '../constants';
import { enemyFactory } from '../enemies/EnemyFactory';
import { bossManager, BossType } from '../bosses/BossManager';
import { useGameStore } from '../../stores/gameStore';

export interface WaveConfig {
  waveIndex: number;
  enemies: { type: EnemyType; count: number }[];
  isBossWave?: boolean;
  bossType?: BossType;
}

export class WaveDirector {
  private currentWaveIndex: number = 1;
  private isWaveInProgress: boolean = false;
  private spawnTimer: number = 0;

  public startWave(sectorId: number, waveIndex: number): void {
    this.currentWaveIndex = waveIndex;
    this.isWaveInProgress = true;
    this.spawnTimer = 0;

    enemyFactory.clear();

    const config = this.getWaveConfig(sectorId, waveIndex);

    if (config.isBossWave && config.bossType) {
      bossManager.spawnBoss(config.bossType);
    } else {
      // Spawn wave enemies in spatial formation
      config.enemies.forEach((group) => {
        for (let i = 0; i < group.count; i++) {
          const angle = (i / group.count) * Math.PI * 2;
          const pos = new THREE.Vector3(
            Math.cos(angle) * (20 + i * 5),
            (Math.sin(i) * 15),
            -150 - i * 10
          );
          enemyFactory.spawnEnemy(group.type, pos);
        }
      });
    }
  }

  public update(delta: number): void {
    if (!this.isWaveInProgress) return;

    // Check completion condition
    if (bossManager.active) {
      // Waiting for boss defeat
      return;
    }

    const activeEnemies = enemyFactory.getActiveEnemies();
    if (activeEnemies.length === 0) {
      this.isWaveInProgress = false;
      const { nextWave } = useGameStore.getState();
      nextWave();
    }
  }

  private getWaveConfig(sectorId: number, waveIndex: number): WaveConfig {
    if (waveIndex === 5) {
      // Boss wave
      let bType: BossType = 'ASTEROID_DEVOURER';
      if (sectorId === 2) bType = 'SWARM_CORE';
      else if (sectorId >= 3) bType = 'VOID_ARCHITECT';

      return {
        waveIndex,
        enemies: [],
        isBossWave: true,
        bossType: bType,
      };
    }

    // Standard wave groups
    if (sectorId === 1) {
      return {
        waveIndex,
        enemies: [
          { type: 'SCOUT_DRONE', count: 3 + waveIndex * 2 },
          { type: 'MINE', count: 2 },
        ],
      };
    } else if (sectorId === 2) {
      return {
        waveIndex,
        enemies: [
          { type: 'SCOUT_DRONE', count: 4 },
          { type: 'INTERCEPTOR', count: 2 + waveIndex },
        ],
      };
    } else if (sectorId === 3) {
      return {
        waveIndex,
        enemies: [
          { type: 'INTERCEPTOR', count: 3 },
          { type: 'TURRET', count: 2 },
          { type: 'HEAVY_BOMBER', count: 1 },
        ],
      };
    } else if (sectorId === 4) {
      return {
        waveIndex,
        enemies: [
          { type: 'SCOUT_DRONE', count: 6 },
          { type: 'SHIELD_DRONE', count: 2 },
          { type: 'REPAIR_DRONE', count: 1 },
        ],
      };
    } else {
      return {
        waveIndex,
        enemies: [
          { type: 'ELITE_FIGHTER', count: 2 },
          { type: 'HEAVY_BOMBER', count: 2 },
          { type: 'TURRET', count: 3 },
        ],
      };
    }
  }

  public reset(): void {
    this.isWaveInProgress = false;
    enemyFactory.clear();
    bossManager.active = false;
  }
}

export const waveDirector = new WaveDirector();
