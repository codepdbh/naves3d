import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { HealthGauge } from './HealthGauge';
import { Radar } from './Radar';
import { WEAPON_CONFIGS, SECTORS } from '../../game/constants';

export const RetroHUD: React.FC = () => {
  const {
    health,
    maxHealth,
    shield,
    maxShield,
    energy,
    maxEnergy,
    lives,
    missiles,
    bombs,
    currentWeapon,
    overheatMeter,
    isOverheated,
    score,
    highScore,
    comboStreak,
    comboMultiplier,
    currentSector,
    currentWave,
    bossActive,
    bossName,
    bossHealth,
    bossMaxHealth,
  } = useGameStore();

  const sector = SECTORS.find((s) => s.id === currentSector) || SECTORS[0];
  const weaponConfig = WEAPON_CONFIGS[currentWeapon];

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: '#ffffff',
        fontFamily: "'Press Start 2P', monospace",
        textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
      }}
    >
      {/* Top Header: Gauges Left, Score & Sector Right */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Left Side: Health, Shield & Energy Gauges */}
        <div style={{ width: '220px', background: 'rgba(0,0,0,0.5)', padding: '10px', border: '2px solid #fff' }}>
          <HealthGauge label="ESCUDO" current={shield} max={maxShield} color="#00ccff" />
          <HealthGauge label="CASCO" current={health} max={maxHealth} color="#00ff66" />
          <HealthGauge label="ENERGÍA" current={energy} max={maxEnergy} color="#ffff00" />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginTop: '6px' }}>
            <span>VIDAS: {'♥'.repeat(lives)}</span>
            <span>MISIL: {missiles}</span>
            <span>BOMBA: {bombs}</span>
          </div>
        </div>

        {/* Center: Boss Health Bar */}
        {bossActive && (
          <div style={{ width: '40%', textAlign: 'center', background: 'rgba(0,0,0,0.7)', padding: '8px', border: '2px solid #ff0055' }}>
            <div style={{ fontSize: '12px', color: '#ffcc00', marginBottom: '4px' }}>
              JEFE: {bossName}
            </div>
            <div style={{ background: '#222', border: '2px solid #fff', height: '14px', position: 'relative' }}>
              <div
                style={{
                  width: `${(bossHealth / bossMaxHealth) * 100}%`,
                  height: '100%',
                  background: '#ff0055',
                  transition: 'width 0.2s linear',
                }}
              />
            </div>
          </div>
        )}

        {/* Right Side: Score, Sector & Wave */}
        <div style={{ textAlign: 'right', background: 'rgba(0,0,0,0.5)', padding: '10px', border: '2px solid #fff' }}>
          <div style={{ fontSize: '12px', color: '#ffdd00', marginBottom: '4px' }}>
            PUNTOS: {score.toString().padStart(7, '0')}
          </div>
          <div style={{ fontSize: '10px', color: '#aaaaaa', marginBottom: '6px' }}>
            RÉCORD: {highScore.toString().padStart(7, '0')}
          </div>
          <div style={{ fontSize: '10px', color: '#00ffff' }}>
            SECTOR {currentSector}: {sector.name}
          </div>
          <div style={{ fontSize: '10px', color: '#ffffff', marginTop: '2px' }}>
            OLEADA {currentWave}/5
          </div>

          {/* Combo Multiplier Streak */}
          {comboStreak >= 2 && (
            <div style={{ marginTop: '6px', fontSize: '12px', color: '#ff00ff' }}>
              COMBO {comboStreak}X! ({comboMultiplier}X PUNTOS)
            </div>
          )}
        </div>
      </div>

      {/* Bottom Footer: Overheat & Radar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        {/* Weapon Thermal Gauge */}
        <div style={{ width: '200px', background: 'rgba(0,0,0,0.5)', padding: '10px', border: '2px solid #fff' }}>
          <div style={{ fontSize: '10px', color: weaponConfig.color, marginBottom: '4px' }}>
            ARMA: {weaponConfig.name}
          </div>
          <div style={{ fontSize: '9px', marginBottom: '4px', color: isOverheated ? '#ff0000' : '#ffffff' }}>
            CALOR: {Math.round(overheatMeter)}% {isOverheated && '[SOBRECALENTADO!]'}
          </div>
          <div style={{ background: '#111', border: '1px solid #fff', height: '8px' }}>
            <div
              style={{
                width: `${overheatMeter}%`,
                height: '100%',
                background: isOverheated ? '#ff0000' : overheatMeter > 75 ? '#ff9900' : '#00ffcc',
              }}
            />
          </div>
        </div>

        {/* 2D Radar Minimap */}
        <Radar />
      </div>
    </div>
  );
};
