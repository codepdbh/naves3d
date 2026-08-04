import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { menuContainerStyle, menuBoxStyle, titleStyle, primaryBtnStyle, secondaryBtnStyle } from './MainMenu';

interface PauseMenuProps {
  onOpenSettings: () => void;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({ onOpenSettings }) => {
  const { setStatus, startGame } = useGameStore();

  return (
    <div style={menuContainerStyle}>
      <div style={menuBoxStyle}>
        <h2 style={{ ...titleStyle, fontSize: '24px' }}>PAUSA</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
          <button onClick={() => setStatus('PLAYING')} style={primaryBtnStyle}>
            CONTINUAR
          </button>
          <button onClick={() => startGame()} style={secondaryBtnStyle}>
            REINICIAR SECTOR
          </button>
          <button onClick={onOpenSettings} style={secondaryBtnStyle}>
            OPCIONES
          </button>
          <button onClick={() => setStatus('MAIN_MENU')} style={{ ...secondaryBtnStyle, color: '#ff5555' }}>
            MENÚ PRINCIPAL
          </button>
        </div>
      </div>
    </div>
  );
};
