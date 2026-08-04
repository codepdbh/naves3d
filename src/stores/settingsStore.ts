import { create } from 'zustand';

export type RetroResolution = '320x180' | '480x270' | '640x360' | 'NATIVE';

export interface SettingsState {
  // Volume Controls (0.0 to 1.0)
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  isMuted: boolean;

  // Controls Sensitivity
  mouseSensitivity: number;
  invertYAxis: boolean;

  // Graphics & Retro FX
  resolution: RetroResolution;
  cameraShakeIntensity: number; // 0.0 to 1.0
  crtScanlines: boolean;
  reducedMotion: boolean;
  highContrastHUD: boolean;

  // Debug Flags
  showFPS: boolean;
  showColliders: boolean;
  showSpatialHash: boolean;
  godMode: boolean;
  gameSpeed: number; // 0.5 to 2.0

  // Setter Actions
  setMasterVolume: (val: number) => void;
  setMusicVolume: (val: number) => void;
  setSfxVolume: (val: number) => void;
  toggleMute: () => void;
  setMouseSensitivity: (val: number) => void;
  toggleInvertYAxis: () => void;
  setResolution: (res: RetroResolution) => void;
  setCameraShakeIntensity: (val: number) => void;
  toggleCrtScanlines: () => void;
  toggleReducedMotion: () => void;
  toggleHighContrastHUD: () => void;
  toggleShowFPS: () => void;
  toggleShowColliders: () => void;
  toggleShowSpatialHash: () => void;
  toggleGodMode: () => void;
  setGameSpeed: (speed: number) => void;
}

const LOCAL_STORAGE_SETTINGS = 'nebula8_settings_v1';

const getSavedSettings = () => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_SETTINGS);
    if (saved) return JSON.parse(saved);
  } catch {
    // fallthrough
  }
  return null;
};

const saved = getSavedSettings();

export const useSettingsStore = create<SettingsState>((set, get) => ({
  masterVolume: saved?.masterVolume ?? 0.8,
  musicVolume: saved?.musicVolume ?? 0.7,
  sfxVolume: saved?.sfxVolume ?? 0.9,
  isMuted: saved?.isMuted ?? false,

  mouseSensitivity: saved?.mouseSensitivity ?? 1.0,
  invertYAxis: saved?.invertYAxis ?? false,

  resolution: saved?.resolution ?? '480x270',
  cameraShakeIntensity: saved?.cameraShakeIntensity ?? 1.0,
  crtScanlines: saved?.crtScanlines ?? true,
  reducedMotion: saved?.reducedMotion ?? false,
  highContrastHUD: saved?.highContrastHUD ?? false,

  showFPS: false,
  showColliders: false,
  showSpatialHash: false,
  godMode: false,
  gameSpeed: 1.0,

  setMasterVolume: (val) => {
    set({ masterVolume: val });
    saveCurrentSettings(get());
  },
  setMusicVolume: (val) => {
    set({ musicVolume: val });
    saveCurrentSettings(get());
  },
  setSfxVolume: (val) => {
    set({ sfxVolume: val });
    saveCurrentSettings(get());
  },
  toggleMute: () => {
    set((s) => ({ isMuted: !s.isMuted }));
    saveCurrentSettings(get());
  },

  setMouseSensitivity: (val) => {
    set({ mouseSensitivity: val });
    saveCurrentSettings(get());
  },
  toggleInvertYAxis: () => {
    set((s) => ({ invertYAxis: !s.invertYAxis }));
    saveCurrentSettings(get());
  },

  setResolution: (res) => {
    set({ resolution: res });
    saveCurrentSettings(get());
  },
  setCameraShakeIntensity: (val) => {
    set({ cameraShakeIntensity: val });
    saveCurrentSettings(get());
  },
  toggleCrtScanlines: () => {
    set((s) => ({ crtScanlines: !s.crtScanlines }));
    saveCurrentSettings(get());
  },
  toggleReducedMotion: () => {
    set((s) => ({ reducedMotion: !s.reducedMotion }));
    saveCurrentSettings(get());
  },
  toggleHighContrastHUD: () => {
    set((s) => ({ highContrastHUD: !s.highContrastHUD }));
    saveCurrentSettings(get());
  },

  toggleShowFPS: () => set((s) => ({ showFPS: !s.showFPS })),
  toggleShowColliders: () => set((s) => ({ showColliders: !s.showColliders })),
  toggleShowSpatialHash: () => set((s) => ({ showSpatialHash: !s.showSpatialHash })),
  toggleGodMode: () => set((s) => ({ godMode: !s.godMode })),
  setGameSpeed: (gameSpeed) => set({ gameSpeed }),
}));

function saveCurrentSettings(state: SettingsState) {
  try {
    const toSave = {
      masterVolume: state.masterVolume,
      musicVolume: state.musicVolume,
      sfxVolume: state.sfxVolume,
      isMuted: state.isMuted,
      mouseSensitivity: state.mouseSensitivity,
      invertYAxis: state.invertYAxis,
      resolution: state.resolution,
      cameraShakeIntensity: state.cameraShakeIntensity,
      crtScanlines: state.crtScanlines,
      reducedMotion: state.reducedMotion,
      highContrastHUD: state.highContrastHUD,
    };
    localStorage.setItem(LOCAL_STORAGE_SETTINGS, JSON.stringify(toSave));
  } catch {
    // ignore
  }
}
