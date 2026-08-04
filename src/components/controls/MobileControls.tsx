import React, { useState, useEffect } from 'react';
import { playerController } from '../../game/player/PlayerController';
import { useGameStore } from '../../stores/gameStore';

export const MobileControls: React.FC = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const status = useGameStore((s) => s.status);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();
  }, []);

  if (!isTouchDevice || status !== 'PLAYING') return null;

  const handleJoystickMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = (touch.clientX - centerX) / (rect.width / 2);
    const dy = (touch.clientY - centerY) / (rect.height / 2);

    playerController.setVirtualJoystick(
      Math.max(-1, Math.min(1, dx)),
      Math.max(-1, Math.min(1, dy))
    );
  };

  const handleJoystickEnd = () => {
    playerController.setVirtualJoystick(0, 0);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      {/* Left Virtual Joystick Area */}
      <div
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.15)',
          border: '3px solid rgba(0, 255, 204, 0.6)',
          pointerEvents: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#00ffcc',
          }}
        />
      </div>

      {/* Right Action Buttons */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          pointerEvents: 'auto',
        }}
      >
        <button
          onTouchStart={() => playerController.setTouchAction('FIRE', true)}
          onTouchEnd={() => playerController.setTouchAction('FIRE', false)}
          style={btnStyle('#00ffcc')}
        >
          DISPARO
        </button>
        <button
          onTouchStart={() => playerController.setTouchAction('MISSILE', true)}
          onTouchEnd={() => playerController.setTouchAction('MISSILE', false)}
          style={btnStyle('#ff9900')}
        >
          MISIL
        </button>
        <button
          onTouchStart={() => playerController.setTouchAction('BOOST', true)}
          onTouchEnd={() => playerController.setTouchAction('BOOST', false)}
          style={btnStyle('#ffff00')}
        >
          IMPULSO
        </button>
        <button
          onTouchStart={() => playerController.setTouchAction('BOMB', true)}
          onTouchEnd={() => playerController.setTouchAction('BOMB', false)}
          style={btnStyle('#ff0055')}
        >
          BOMBA
        </button>
      </div>
    </div>
  );
};

const btnStyle = (color: string): React.CSSProperties => ({
  padding: '12px 16px',
  background: 'rgba(0,0,0,0.8)',
  border: `2px solid ${color}`,
  color: color,
  fontFamily: "'Press Start 2P', monospace",
  fontSize: '10px',
  borderRadius: '6px',
});
