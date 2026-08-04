import React, { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { GameCanvas } from '../game/GameCanvas';
import { RetroHUD } from '../components/hud/RetroHUD';
import { MainMenu } from '../components/menus/MainMenu';
import { PauseMenu } from '../components/menus/PauseMenu';
import { SettingsMenu } from '../components/menus/SettingsMenu';
import { GameOverMenu } from '../components/menus/GameOverMenu';
import { VictoryMenu } from '../components/menus/VictoryMenu';
import { MobileControls } from '../components/controls/MobileControls';
import { DebugOverlay } from '../game/debug/DebugOverlay';

export const GameRouter: React.FC = () => {
  const status = useGameStore((s) => s.status);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Esc key for pausing game
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        const store = useGameStore.getState();
        if (store.status === 'PLAYING') {
          store.setStatus('PAUSED');
        } else if (store.status === 'PAUSED') {
          store.setStatus('PLAYING');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Main 3D WebGL Canvas */}
      <GameCanvas />

      {/* Retro 8-bit Canvas/DOM HUD Overlay */}
      {status === 'PLAYING' && <RetroHUD />}

      {/* Mobile Touch Overlay */}
      <MobileControls />

      {/* Dev Debug Panel */}
      <DebugOverlay />

      {/* Menus & Overlays */}
      {(status === 'BOOT' || status === 'MAIN_MENU') && (
        <MainMenu onOpenSettings={() => setIsSettingsOpen(true)} />
      )}

      {status === 'PAUSED' && (
        <PauseMenu onOpenSettings={() => setIsSettingsOpen(true)} />
      )}

      {status === 'GAME_OVER' && <GameOverMenu />}

      {status === 'VICTORY' && <VictoryMenu />}

      {/* Settings Modal */}
      {isSettingsOpen && <SettingsMenu onClose={() => setIsSettingsOpen(false)} />}
    </div>
  );
};
