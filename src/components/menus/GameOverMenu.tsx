import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { menuContainerStyle, menuBoxStyle, primaryBtnStyle, secondaryBtnStyle } from './MainMenu';

export const GameOverMenu: React.FC = () => {
  const { score, highScore, currentSector, currentWave, startGame, setStatus } = useGameStore();

  return (
    <div style={menuContainerStyle}>
      <div style={menuBoxStyle}>
        <h2 style={{ fontSize: '28px', color: '#ff0055', textShadow: '2px 2px 0 #000' }}>GAME OVER</h2>
        <div style={{ fontSize: '10px', color: '#aaaaaa', margin: '10px 0' }}>NAVE DESTRUIDA</div>

        <div style={{ background: '#111122', padding: '12px', border: '2px solid #fff', margin: '16px 0', fontSize: '10px' }}>
          <div style={{ color: '#ffdd00', marginBottom: '6px' }}>
            PUNTUACIÓN FINAL: {score}
          </div>
          <div style={{ color: '#00ffff', marginBottom: '6px' }}>
            RÉCORD PERSONAL: {highScore}
          </div>
          <div>SECTOR ALCANZADO: {currentSector} (OLEADA {currentWave})</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={startGame} style={primaryBtnStyle}>
            REINTENTAR
          </button>
          <button onClick={() => setStatus('MAIN_MENU')} style={secondaryBtnStyle}>
            MENÚ PRINCIPAL
          </button>
        </div>
      </div>
    </div>
  );
};
