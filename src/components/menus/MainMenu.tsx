import React, { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useProgressionStore } from '../../stores/progressionStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { audioEngine } from '../../game/audio/AudioEngine';
import { SECTORS } from '../../game/constants';

interface MainMenuProps {
  onOpenSettings: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onOpenSettings }) => {
  const { startGame, setSector, setDifficulty, difficulty } = useGameStore();
  const unlockedSectors = useProgressionStore((s) => s.unlockedSectors);
  const [selectedSector, setSelectedSector] = useState(1);

  const handleStart = () => {
    audioEngine.unlock();
    audioEngine.playMusic('menu');
    setSector(selectedSector);
    startGame();
  };

  return (
    <div style={menuContainerStyle}>
      <div style={menuBoxStyle}>
        <h1 style={titleStyle}>NEBULA-8</h1>
        <h2 style={subtitleStyle}>GUARDIANES DEL VACÍO</h2>

        {/* Sector Selection Slider */}
        <div style={{ margin: '20px 0', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#ffdd00', marginBottom: '8px' }}>
            SELECCIONAR SECTOR:
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {SECTORS.map((sec) => {
              const isUnlocked = sec.id <= unlockedSectors;
              const isSelected = sec.id === selectedSector;
              return (
                <button
                  key={sec.id}
                  disabled={!isUnlocked}
                  onClick={() => setSelectedSector(sec.id)}
                  style={{
                    padding: '8px 12px',
                    background: isSelected ? '#00ffcc' : isUnlocked ? '#222233' : '#111',
                    color: isSelected ? '#000' : isUnlocked ? '#fff' : '#555',
                    border: '2px solid #fff',
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '10px',
                    cursor: isUnlocked ? 'pointer' : 'not-allowed',
                  }}
                >
                  S{sec.id}
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: '9px', color: '#aaa', marginTop: '6px' }}>
            {SECTORS[selectedSector - 1].name}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#ffdd00', marginBottom: '6px' }}>
            DIFICULTAD:
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {(['EASY', 'NORMAL', 'HARD'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                style={{
                  padding: '6px 10px',
                  background: difficulty === diff ? '#ff0055' : '#222233',
                  color: '#fff',
                  border: '2px solid #fff',
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '9px',
                  cursor: 'pointer',
                }}
              >
                {diff === 'EASY' ? 'FÁCIL' : diff === 'NORMAL' ? 'NORMAL' : 'DIFÍCIL'}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button onClick={handleStart} style={primaryBtnStyle}>
            INICIAR MISIÓN
          </button>
          <button onClick={onOpenSettings} style={secondaryBtnStyle}>
            OPCIONES Y CONTROLES
          </button>
        </div>
      </div>
    </div>
  );
};

export const menuContainerStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(5, 5, 12, 0.92)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 100,
};

export const menuBoxStyle: React.CSSProperties = {
  background: '#0a0a16',
  border: '4px solid #00ffcc',
  padding: '30px 40px',
  textAlign: 'center',
  maxWidth: '480px',
  boxShadow: '0 0 20px rgba(0, 255, 204, 0.5)',
};

export const titleStyle: React.CSSProperties = {
  fontSize: '32px',
  color: '#00ffcc',
  textShadow: '3px 3px 0 #ff0055, -3px -3px 0 #00ffff',
  marginBottom: '6px',
};

export const subtitleStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#ffcc00',
  letterSpacing: '2px',
  marginBottom: '16px',
};

export const primaryBtnStyle: React.CSSProperties = {
  padding: '14px 20px',
  background: '#00ffcc',
  color: '#000000',
  border: '3px solid #ffffff',
  fontFamily: "'Press Start 2P', monospace",
  fontSize: '12px',
  cursor: 'pointer',
  boxShadow: '4px 4px 0 #ff0055',
};

export const secondaryBtnStyle: React.CSSProperties = {
  padding: '10px 16px',
  background: '#222233',
  color: '#ffffff',
  border: '2px solid #ffffff',
  fontFamily: "'Press Start 2P', monospace",
  fontSize: '10px',
  cursor: 'pointer',
};
