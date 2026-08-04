import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Starfield } from './world/Starfield';
import { SpaceWorld } from './world/SpaceWorld';
import { PlayerShip } from './player/PlayerShip';
import { playerController } from './player/PlayerController';
import { playerWeapons } from './player/PlayerWeapons';
import { collisionSystem } from './collision/CollisionSystem';
import { enemyFactory } from './enemies/EnemyFactory';
import { EnemyMesh } from './enemies/EnemyModels';
import { bossManager } from './bosses/BossManager';
import { BossMesh } from './bosses/BossModels';
import { waveDirector } from './waves/WaveDirector';
import { projectilePool, Projectile } from './projectiles/ProjectilePool';
import { pickupManager } from './pickups/PickupManager';
import { PickupMesh } from './pickups/PickupMesh';
import { RetroCamera } from './camera/RetroCamera';
import { FloatingOrigin } from './world/FloatingOrigin';
import { useGameStore } from '../stores/gameStore';

const GameScene: React.FC = () => {
  const status = useGameStore((s) => s.status);
  const currentSector = useGameStore((s) => s.currentSector);
  const currentWave = useGameStore((s) => s.currentWave);

  const [, setFrameTick] = useState(0);

  // Initialize sector wave on load
  React.useEffect(() => {
    if (status === 'PLAYING') {
      waveDirector.startWave(currentSector, currentWave);
    }
  }, [status, currentSector, currentWave]);

  useFrame((_, delta) => {
    if (status !== 'PLAYING') return;

    // 1. Update Player Input & Physics
    playerController.update(delta);

    // 2. Floating Origin check
    FloatingOrigin.update(playerController.position, []);

    // 3. Nearest Enemy query & Player Weapons dispatch
    const nearest = enemyFactory.getNearestEnemy(playerController.position);
    const input = playerController.getInput();
    playerWeapons.update(
      delta,
      playerController.position,
      playerController.rotation,
      input.primaryFire,
      input.missileFire,
      input.specialBomb,
      input.cycleWeapon,
      nearest?.position
    );

    // 4. Update Projectiles & Enemies
    projectilePool.update(delta);
    enemyFactory.update(delta, playerController.position);
    bossManager.update(delta, playerController.position);
    waveDirector.update(delta);
    pickupManager.update(delta, playerController.position);

    // 5. Run 3D Collision System Pass
    collisionSystem.update();

    // 6. Store Ticks
    const store = useGameStore.getState();
    store.tickCombo(delta);
    store.tickPowerups(delta);

    setFrameTick((t) => t + 1);
  });

  const activeEnemies = enemyFactory.getActiveEnemies();
  const activeProjectiles = projectilePool.getActive();
  const activePickups = pickupManager.getActivePickups();
  const input = playerController.getInput();

  return (
    <>
      <Starfield />
      <SpaceWorld />

      {/* Player Ship */}
      <PlayerShip
        position={playerController.position}
        rotation={playerController.rotation}
        rollAngle={playerController.rollAngle}
        isHitFlashing={playerController.isHitFlashing}
      />

      {/* Active Enemies */}
      {activeEnemies.map((enemy) => (
        <EnemyMesh
          key={enemy.id}
          type={enemy.type}
          position={enemy.position}
          rotation={enemy.rotation}
          healthRatio={enemy.health / enemy.maxHealth}
        />
      ))}

      {/* Active Boss */}
      {bossManager.active ? (
        <BossMesh
          type={bossManager.bossType}
          position={bossManager.position}
          phase={bossManager.phase}
        />
      ) : null}

      {/* Active Projectiles */}
      {activeProjectiles.map((proj) => (
        <mesh key={proj.id} position={proj.position}>
          <sphereGeometry args={[proj.radius, 6, 6]} />
          <meshBasicMaterial color={proj.color} />
        </mesh>
      ))}

      {/* Active Pickups */}
      {activePickups.map((item) => (
        <PickupMesh key={item.id} type={item.type} position={item.position} />
      ))}

      {/* Camera */}
      <RetroCamera
        targetPosition={playerController.position}
        targetRotation={playerController.rotation}
        isBoosting={input.boost}
        shakeImpulse={playerController.isHitFlashing ? 1.0 : 0.0}
      />
    </>
  );
};

export const GameCanvas: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        dpr={1}
        gl={{ antialias: false }}
        camera={{ position: [0, 5, 12], fov: 60 }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 15]} intensity={1.2} />
        <GameScene />
      </Canvas>
    </div>
  );
};
