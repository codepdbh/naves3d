import React from 'react';
import * as THREE from 'three';
import { playerController } from '../../game/player/PlayerController';
import { enemyFactory } from '../../game/enemies/EnemyFactory';
import { bossManager } from '../../game/bosses/BossManager';

export const Radar: React.FC = () => {
  const playerPos = playerController.position;
  const enemies = enemyFactory.getActiveEnemies();
  const range = 200;

  const getRadarCoords = (pos: THREE.Vector3) => {
    const relX = (pos.x - playerPos.x) / range;
    const relZ = (pos.z - playerPos.z) / range;

    const radarX = 50 + relX * 45;
    const radarY = 50 + relZ * 45;

    return {
      x: Math.max(5, Math.min(95, radarX)),
      y: Math.max(5, Math.min(95, radarY)),
    };
  };

  return (
    <div
      style={{
        width: '110px',
        height: '110px',
        background: 'rgba(0, 20, 10, 0.85)',
        border: '3px solid #00ffcc',
        borderRadius: '50%',
        position: 'relative',
        boxShadow: '0 0 10px rgba(0, 255, 204, 0.4)',
        overflow: 'hidden',
      }}
    >
      {/* Radar Crosshair */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '1px',
          background: 'rgba(0, 255, 204, 0.3)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: '1px',
          background: 'rgba(0, 255, 204, 0.3)',
        }}
      />

      {/* Player Blip */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '6px',
          height: '6px',
          transform: 'translate(-50%, -50%)',
          background: '#00ffff',
          boxShadow: '0 0 4px #00ffff',
        }}
      />

      {/* Enemy Blips */}
      {enemies.map((enemy) => {
        const coords = getRadarCoords(enemy.position);
        return (
          <div
            key={enemy.id}
            style={{
              position: 'absolute',
              left: `${coords.x}%`,
              top: `${coords.y}%`,
              width: '4px',
              height: '4px',
              transform: 'translate(-50%, -50%)',
              background: '#ff0055',
            }}
          />
        );
      })}

      {/* Boss Blip */}
      {bossManager.active && (
        <div
          style={{
            position: 'absolute',
            left: `${getRadarCoords(bossManager.position).x}%`,
            top: `${getRadarCoords(bossManager.position).y}%`,
            width: '8px',
            height: '8px',
            transform: 'translate(-50%, -50%)',
            background: '#ffcc00',
            boxShadow: '0 0 6px #ffcc00',
          }}
        />
      )}
    </div>
  );
};
