import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useProgressionStore } from '../../stores/progressionStore';
import { menuContainerStyle, menuBoxStyle, primaryBtnStyle, secondaryBtnStyle } from './MainMenu';

export const VictoryMenu: React.FC = () => {
  const { score, currentSector, setStatus, setSector, startGame } = useGameStore();
  const { unlockSector } = useProgressionStore();

  const handleNextSector = () => {
    if (currentSector < 5) {
      unlockSector(currentSector + 1);
      setSector(currentSector + 1);
      startGame();
    } else {
      setStatus('MAIN_MENU');
    }
  };

  return (
    <div style={menuContainerStyle}>
      <div style={menuBoxStyle}>
        <h2 style={{ fontSize: '24px', color: '#00ffcc', textShadow: '2px 2px 0 #000' }}>
          ¡SECTOR LIMPIADO!
        </h2>
        <div style={{ fontSize: '10px', color: '#ffcc00', margin: '10px 0' }}>
          AMENAZA ENEMIGA ELIMINADA
        </div>

        <div style={{ background: '#112211', padding: '12px', border: '2px solid #00ff66', margin: '16px 0', fontSize: '10px' }}>
          <div style={{ color: '#ffffff', marginBottom: '6px' }}>PUNTOS ACUMULADOS: {score}</div>
          <div style={{ color: '#00ff66' }}>SECTOR {currentSector} COMPLETADO</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {currentSector < 5 ? (
            <button onClick={handleNextSector} style={primaryBtnStyle}>
              SIGUIENTE SECTOR
            </button>
          ) : (
            <button onClick={() => setStatus('MAIN_MENU')} style={primaryBtnStyle}>
              VICTORIA COMPLETA - MENÚ
            </button>
          )}
          <button onClick={() => setStatus('MAIN_MENU')} style={secondaryBtnStyle}>
            MENÚ PRINCIPAL
          </button>
        </div>
      </div>
    </div>
  );
};
