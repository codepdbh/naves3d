import { create } from 'zustand';

export interface ProgressionState {
  unlockedSectors: number;
  sectorHighScores: Record<number, number>;
  totalEnemiesKilled: number;
  totalBossesDefeated: number;
  totalPlayTimeSeconds: number;

  unlockSector: (sectorId: number) => void;
  recordSectorScore: (sectorId: number, score: number) => void;
  incrementKills: (count?: number) => void;
  incrementBossKills: () => void;
  addPlayTime: (seconds: number) => void;
}

const LOCAL_STORAGE_PROGRESSION = 'nebula8_progression_v1';

const loadProgression = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_PROGRESSION);
    if (data) return JSON.parse(data);
  } catch {
    // ignore
  }
  return null;
};

const saved = loadProgression();

export const useProgressionStore = create<ProgressionState>((set, get) => ({
  unlockedSectors: saved?.unlockedSectors ?? 1,
  sectorHighScores: saved?.sectorHighScores ?? { 1: 0 },
  totalEnemiesKilled: saved?.totalEnemiesKilled ?? 0,
  totalBossesDefeated: saved?.totalBossesDefeated ?? 0,
  totalPlayTimeSeconds: saved?.totalPlayTimeSeconds ?? 0,

  unlockSector: (sectorId) => {
    const { unlockedSectors } = get();
    if (sectorId > unlockedSectors) {
      set({ unlockedSectors: sectorId });
      saveProgression(get());
    }
  },

  recordSectorScore: (sectorId, score) => {
    const { sectorHighScores } = get();
    const currentBest = sectorHighScores[sectorId] || 0;
    if (score > currentBest) {
      const updated = { ...sectorHighScores, [sectorId]: score };
      set({ sectorHighScores: updated });
      saveProgression(get());
    }
  },

  incrementKills: (count = 1) => {
    set((s) => ({ totalEnemiesKilled: s.totalEnemiesKilled + count }));
    saveProgression(get());
  },

  incrementBossKills: () => {
    set((s) => ({ totalBossesDefeated: s.totalBossesDefeated + 1 }));
    saveProgression(get());
  },

  addPlayTime: (seconds) => {
    set((s) => ({ totalPlayTimeSeconds: s.totalPlayTimeSeconds + seconds }));
    saveProgression(get());
  },
}));

function saveProgression(state: ProgressionState) {
  try {
    const data = {
      unlockedSectors: state.unlockedSectors,
      sectorHighScores: state.sectorHighScores,
      totalEnemiesKilled: state.totalEnemiesKilled,
      totalBossesDefeated: state.totalBossesDefeated,
      totalPlayTimeSeconds: state.totalPlayTimeSeconds,
    };
    localStorage.setItem(LOCAL_STORAGE_PROGRESSION, JSON.stringify(data));
  } catch {
    // ignore
  }
}
