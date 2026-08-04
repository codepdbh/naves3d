import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '../../stores/settingsStore';
import { useGameStore } from '../../stores/gameStore';
import { collisionSystem } from '../collision/CollisionSystem';
import { projectilePool } from '../projectiles/ProjectilePool';
import { enemyFactory } from '../enemies/EnemyFactory';
import { bossManager } from '../bosses/BossManager';
import { playerController } from '../player/PlayerController';

export const DebugOverlay: React.FC = () => {
  const {
    showFPS,
    godMode,
    toggleGodMode,
    gameSpeed,
    setGameSpeed,
    toggleShowColliders,
    toggleShowSpatialHash,
  } = useSettingsStore();

  const { currentSector, setSector, startGame } = useGameStore();

  const [fps, setFps] = useState(60);

  useEffect(() => {
    let lastTime = performance.now();
    let frames = 0;

    const interval = setInterval(() => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      setFps(Math.round(frames / delta));
      frames = 0;
      lastTime = now;
    }, 500);

    const handleFrame = () => {
      frames++;
      requestAnimationFrame(handleFrame);
    };
    const animId = requestAnimationFrame(handleFrame);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (import.meta.env.PROD && !showFPS) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'rgba(0, 0, 0, 0.85)',
        border: '2px solid #00ff00',
        padding: '10px',
        fontSize: '9px',
        color: '#00ff00',
        fontFamily: 'monospace',
        zIndex: 999,
        pointerEvents: 'auto',
      }}
    >
      <div>=== DEV DEBUG PANEL ===</div>
      <div>FPS: {fps}</div>
      <div>ENTIDADES COLISIÓN: {collisionSystem.getEntityCount()}</div>
      <div>ENEMIGOS ACTIVOS: {enemyFactory.getActiveEnemies().length}</div>
      <div>PROYECTILES: {projectilePool.getActive().length}</div>
      <div>
        POS NAVE: [{playerController.position.x.toFixed(1)}, {playerController.position.y.toFixed(1)}, {playerController.position.z.toFixed(1)}]
      </div>

      <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <button onClick={toggleGodMode} style={btnStyle}>
          MODO DIOS: {godMode ? 'ON' : 'OFF'}
        </button>
        <button onClick={toggleShowColliders} style={btnStyle}>
          VER COLISIONES
        </button>
        <button onClick={toggleShowSpatialHash} style={btnStyle}>
          VER SPATIAL HASH
        </button>

        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              onClick={() => {
                setSector(s);
                startGame();
              }}
              style={btnStyle}
            >
              WARP S{s}
            </button>
          ))}
        </div>

        <button
          onClick={() => bossManager.spawnBoss('ASTEROID_DEVOURER')}
          style={btnStyle}
        >
          SPAWN JEFE S1
        </button>
      </div>
    </div>
  );
};

const btnStyle: React.CSSProperties = {
  background: '#112211',
  color: '#00ff00',
  border: '1px solid #00ff00',
  fontSize: '8px',
  fontFamily: 'monospace',
  padding: '2px 4px',
  cursor: 'pointer',
};
