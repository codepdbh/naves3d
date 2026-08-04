import { create } from 'zustand';
import { WeaponType } from '../game/constants';

export type GameStatus =
  | 'BOOT'
  | 'MAIN_MENU'
  | 'LOADING'
  | 'PLAYING'
  | 'PAUSED'
  | 'SECTOR_COMPLETE'
  | 'GAME_OVER'
  | 'VICTORY';

export type DifficultyLevel = 'EASY' | 'NORMAL' | 'HARD';

export interface GameState {
  // Global Game Flow
  status: GameStatus;
  difficulty: DifficultyLevel;
  currentSector: number;
  currentWave: number;
  totalWavesInSector: number;
  isWaveActive: boolean;

  // Player Stats
  health: number;
  maxHealth: number;
  shield: number;
  maxShield: number;
  energy: number;
  maxEnergy: number;
  lives: number;
  missiles: number;
  maxMissiles: number;
  bombs: number;
  maxBombs: number;

  // Weapon & Overheat
  currentWeapon: WeaponType;
  overheatMeter: number; // 0 to 100
  isOverheated: boolean;
  tripleShotPowerupTime: number; // remaining seconds

  // Score & Combo
  score: number;
  highScore: number;
  comboStreak: number;
  comboMultiplier: number;
  comboTimer: number; // seconds remaining before combo drops

  // Active Boss Info
  bossActive: boolean;
  bossName: string;
  bossHealth: number;
  bossMaxHealth: number;

  // Actions
  setStatus: (status: GameStatus) => void;
  setDifficulty: (difficulty: DifficultyLevel) => void;
  startGame: () => void;
  resetPlayerState: () => void;
  takePlayerDamage: (amount: number) => boolean; // returns true if player destroyed
  healPlayer: (amount: number) => void;
  restoreShield: (amount: number) => void;
  consumeEnergy: (amount: number) => boolean;
  addEnergy: (amount: number) => void;
  useMissile: () => boolean;
  addMissiles: (count: number) => void;
  useBomb: () => boolean;
  addBombs: (count: number) => void;
  setWeapon: (weapon: WeaponType) => void;
  addHeat: (amount: number) => void;
  coolDownHeat: (amount: number) => void;
  addScore: (points: number) => void;
  registerKill: (baseScore: number) => void;
  setBossInfo: (active: boolean, name?: string, health?: number, maxHealth?: number) => void;
  updateBossHealth: (health: number) => void;
  nextWave: () => void;
  setSector: (sector: number) => void;
  tickCombo: (delta: number) => void;
  tickPowerups: (delta: number) => void;
}

const LOCAL_STORAGE_HIGH_SCORE = 'nebula8_high_score';

const getInitialHighScore = (): number => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_HIGH_SCORE);
    return saved ? parseInt(saved, 10) || 0 : 0;
  } catch {
    return 0;
  }
};

export const useGameStore = create<GameState>((set, get) => ({
  status: 'BOOT',
  difficulty: 'NORMAL',
  currentSector: 1,
  currentWave: 1,
  totalWavesInSector: 5,
  isWaveActive: false,

  health: 100,
  maxHealth: 100,
  shield: 50,
  maxShield: 50,
  energy: 100,
  maxEnergy: 100,
  lives: 3,
  missiles: 3,
  maxMissiles: 10,
  bombs: 1,
  maxBombs: 3,

  currentWeapon: 'LASER',
  overheatMeter: 0,
  isOverheated: false,
  tripleShotPowerupTime: 0,

  score: 0,
  highScore: getInitialHighScore(),
  comboStreak: 0,
  comboMultiplier: 1,
  comboTimer: 0,

  bossActive: false,
  bossName: '',
  bossHealth: 0,
  bossMaxHealth: 1000,

  setStatus: (status) => set({ status }),
  setDifficulty: (difficulty) => set({ difficulty }),

  startGame: () => {
    get().resetPlayerState();
    set({
      status: 'PLAYING',
      currentSector: 1,
      currentWave: 1,
      score: 0,
      bossActive: false,
    });
  },

  resetPlayerState: () => {
    set({
      health: 100,
      maxHealth: 100,
      shield: 50,
      maxShield: 50,
      energy: 100,
      maxEnergy: 100,
      lives: 3,
      missiles: 3,
      bombs: 1,
      currentWeapon: 'LASER',
      overheatMeter: 0,
      isOverheated: false,
      tripleShotPowerupTime: 0,
      comboStreak: 0,
      comboMultiplier: 1,
      comboTimer: 0,
    });
  },

  takePlayerDamage: (amount) => {
    const { shield, health, lives } = get();
    let remaining = amount;
    let newShield = shield;
    let newHealth = health;

    // Absorb with shield first
    if (newShield > 0) {
      if (newShield >= remaining) {
        newShield -= remaining;
        remaining = 0;
      } else {
        remaining -= newShield;
        newShield = 0;
      }
    }

    if (remaining > 0) {
      newHealth = Math.max(0, newHealth - remaining);
    }

    // Reset combo on hit
    set({
      shield: newShield,
      health: newHealth,
      comboStreak: 0,
      comboMultiplier: 1,
      comboTimer: 0,
    });

    if (newHealth <= 0) {
      const newLives = lives - 1;
      if (newLives > 0) {
        // Respawn player
        set({
          lives: newLives,
          health: 100,
          shield: 50,
          energy: 100,
        });
        return false;
      } else {
        // Game Over
        set({ status: 'GAME_OVER' });
        return true;
      }
    }

    return false;
  },

  healPlayer: (amount) =>
    set((state) => ({
      health: Math.min(state.maxHealth, state.health + amount),
    })),

  restoreShield: (amount) =>
    set((state) => ({
      shield: Math.min(state.maxShield, state.shield + amount),
    })),

  consumeEnergy: (amount) => {
    const { energy } = get();
    if (energy >= amount) {
      set({ energy: energy - amount });
      return true;
    }
    return false;
  },

  addEnergy: (amount) =>
    set((state) => ({
      energy: Math.min(state.maxEnergy, state.energy + amount),
    })),

  useMissile: () => {
    const { missiles } = get();
    if (missiles > 0) {
      set({ missiles: missiles - 1 });
      return true;
    }
    return false;
  },

  addMissiles: (count) =>
    set((state) => ({
      missiles: Math.min(state.maxMissiles, state.missiles + count),
    })),

  useBomb: () => {
    const { bombs } = get();
    if (bombs > 0) {
      set({ bombs: bombs - 1 });
      return true;
    }
    return false;
  },

  addBombs: (count) =>
    set((state) => ({
      bombs: Math.min(state.maxBombs, state.bombs + count),
    })),

  setWeapon: (weapon) => set({ currentWeapon: weapon }),

  addHeat: (amount) => {
    const { overheatMeter, isOverheated } = get();
    if (isOverheated) return;

    const next = Math.min(100, overheatMeter + amount);
    if (next >= 100) {
      set({ overheatMeter: 100, isOverheated: true });
    } else {
      set({ overheatMeter: next });
    }
  },

  coolDownHeat: (amount) => {
    const { overheatMeter, isOverheated } = get();
    const next = Math.max(0, overheatMeter - amount);
    if (isOverheated && next === 0) {
      set({ overheatMeter: 0, isOverheated: false });
    } else {
      set({ overheatMeter: next });
    }
  },

  addScore: (points) => {
    const { score, highScore } = get();
    const newScore = score + points;
    const newHighScore = Math.max(highScore, newScore);
    if (newHighScore > highScore) {
      try {
        localStorage.setItem(LOCAL_STORAGE_HIGH_SCORE, newHighScore.toString());
      } catch {
        // ignore storage error
      }
    }
    set({ score: newScore, highScore: newHighScore });
  },

  registerKill: (baseScore) => {
    const { comboStreak, addScore } = get();
    const nextStreak = comboStreak + 1;
    // Multipliers: 1x, 1.5x, 2x, 3x, 4x, 5x max
    let nextMult = 1;
    if (nextStreak >= 20) nextMult = 5;
    else if (nextStreak >= 15) nextMult = 4;
    else if (nextStreak >= 10) nextMult = 3;
    else if (nextStreak >= 5) nextMult = 2;
    else if (nextStreak >= 2) nextMult = 1.5;

    const awardedScore = Math.round(baseScore * nextMult);
    addScore(awardedScore);

    set({
      comboStreak: nextStreak,
      comboMultiplier: nextMult,
      comboTimer: 4.0, // 4 seconds to maintain combo streak
    });
  },

  setBossInfo: (active, name = '', health = 0, maxHealth = 1000) =>
    set({
      bossActive: active,
      bossName: name,
      bossHealth: health,
      bossMaxHealth: maxHealth,
    }),

  updateBossHealth: (health) => set({ bossHealth: Math.max(0, health) }),

  nextWave: () => {
    const { currentWave, totalWavesInSector, currentSector } = get();
    if (currentWave < totalWavesInSector) {
      set({ currentWave: currentWave + 1 });
    } else {
      // Sector complete
      if (currentSector < 5) {
        set({ status: 'SECTOR_COMPLETE' });
      } else {
        set({ status: 'VICTORY' });
      }
    }
  },

  setSector: (sector) => set({ currentSector: sector, currentWave: 1 }),

  tickCombo: (delta) => {
    const { comboTimer } = get();
    if (comboTimer > 0) {
      const nextTimer = comboTimer - delta;
      if (nextTimer <= 0) {
        set({ comboStreak: 0, comboMultiplier: 1, comboTimer: 0 });
      } else {
        set({ comboTimer: nextTimer });
      }
    }
  },

  tickPowerups: (delta) => {
    const { tripleShotPowerupTime } = get();
    if (tripleShotPowerupTime > 0) {
      set({ tripleShotPowerupTime: Math.max(0, tripleShotPowerupTime - delta) });
    }
  },
}));
