import React from 'react';
import { useSettingsStore, RetroResolution } from '../../stores/settingsStore';
import { audioEngine } from '../../game/audio/AudioEngine';
import { menuContainerStyle, menuBoxStyle, titleStyle, secondaryBtnStyle } from './MainMenu';

interface SettingsMenuProps {
  onClose: () => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({ onClose }) => {
  const {
    masterVolume,
    musicVolume,
    sfxVolume,
    isMuted,
    resolution,
    mouseSensitivity,
    invertYAxis,
    crtScanlines,
    reducedMotion,
    setMasterVolume,
    setMusicVolume,
    setSfxVolume,
    toggleMute,
    setResolution,
    setMouseSensitivity,
    toggleInvertYAxis,
    toggleCrtScanlines,
    toggleReducedMotion,
  } = useSettingsStore();

  const handleVolumeChange = (type: 'master' | 'music' | 'sfx', val: number) => {
    if (type === 'master') setMasterVolume(val);
    if (type === 'music') setMusicVolume(val);
    if (type === 'sfx') setSfxVolume(val);
    audioEngine.updateVolumes();
  };

  return (
    <div style={menuContainerStyle}>
      <div style={{ ...menuBoxStyle, maxWidth: '520px', textAlign: 'left' }}>
        <h2 style={{ ...titleStyle, fontSize: '20px', textAlign: 'center' }}>CONFIGURACIÓN</h2>

        {/* Audio Controls */}
        <div style={sectionStyle}>
          <div style={sectionHeader}>AUDIO</div>
          <label style={labelStyle}>
            MASTER: {Math.round(masterVolume * 100)}%
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={masterVolume}
              onChange={(e) => handleVolumeChange('master', parseFloat(e.target.value))}
            />
          </label>
          <label style={labelStyle}>
            MÚSICA: {Math.round(musicVolume * 100)}%
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={musicVolume}
              onChange={(e) => handleVolumeChange('music', parseFloat(e.target.value))}
            />
          </label>
          <label style={labelStyle}>
            EFECTOS (SFX): {Math.round(sfxVolume * 100)}%
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={sfxVolume}
              onChange={(e) => handleVolumeChange('sfx', parseFloat(e.target.value))}
            />
          </label>
          <button onClick={toggleMute} style={{ ...secondaryBtnStyle, padding: '4px 8px', fontSize: '9px' }}>
            {isMuted ? 'SILENCIADO: SÍ' : 'SILENCIADO: NO'}
          </button>
        </div>

        {/* Retro Graphics */}
        <div style={sectionStyle}>
          <div style={sectionHeader}>GRÁFICOS RETRO</div>
          <div style={{ fontSize: '9px', color: '#aaa', marginBottom: '4px' }}>RESOLUCIÓN INTERNA:</div>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
            {(['320x180', '480x270', '640x360', 'NATIVE'] as RetroResolution[]).map((res) => (
              <button
                key={res}
                onClick={() => setResolution(res)}
                style={{
                  padding: '4px 8px',
                  background: resolution === res ? '#00ffcc' : '#222',
                  color: resolution === res ? '#000' : '#fff',
                  border: '1px solid #fff',
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '8px',
                }}
              >
                {res}
              </button>
            ))}
          </div>

          <button onClick={toggleCrtScanlines} style={{ ...secondaryBtnStyle, padding: '4px 8px', fontSize: '9px' }}>
            LÍNEAS CRT: {crtScanlines ? 'ACTIVADO' : 'DESACTIVADO'}
          </button>
        </div>

        {/* Controls */}
        <div style={sectionStyle}>
          <div style={sectionHeader}>CONTROLES Y CÁMARA</div>
          <label style={labelStyle}>
            SENSIBILIDAD RATÓN: {mouseSensitivity.toFixed(1)}
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.1"
              value={mouseSensitivity}
              onChange={(e) => setMouseSensitivity(parseFloat(e.target.value))}
            />
          </label>
          <button onClick={toggleInvertYAxis} style={{ ...secondaryBtnStyle, padding: '4px 8px', fontSize: '9px' }}>
            INVERTIR EJE Y: {invertYAxis ? 'SÍ' : 'NO'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button onClick={onClose} style={secondaryBtnStyle}>
            VOLVER
          </button>
        </div>
      </div>
    </div>
  );
};

const sectionStyle: React.CSSProperties = {
  marginBottom: '14px',
  borderBottom: '1px solid #333',
  paddingBottom: '10px',
};

const sectionHeader: React.CSSProperties = {
  fontSize: '11px',
  color: '#ffdd00',
  marginBottom: '6px',
};

const labelStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '9px',
  margin: '4px 0',
};
