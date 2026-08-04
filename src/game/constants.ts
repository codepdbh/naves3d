/**
 * NEBULA-8: Guardianes del Vacío
 * Game Constants and Definitions
 */

export const GAME_TITLE = 'NEBULA-8';
export const GAME_SUBTITLE = 'Guardianes del Vacío';

// Collision Layers (Bitmask)
export const COLLISION_LAYERS = {
  NONE: 0,
  PLAYER: 1 << 0,          // 1
  PLAYER_PROJECTILE: 1 << 1,// 2
  ENEMY: 1 << 2,           // 4
  ENEMY_PROJECTILE: 1 << 3, // 8
  ASTEROID: 1 << 4,        // 16
  PICKUP: 1 << 5,          // 32
  BOSS: 1 << 6,            // 64
  STRUCTURE: 1 << 7,       // 128
} as const;

export type WeaponType = 'LASER' | 'TRIPLE' | 'PIERCING';

export interface WeaponConfig {
  name: string;
  damage: number;
  fireRate: number; // shots per second
  energyCost: number;
  heatPerShot: number;
  speed: number;
  color: string;
}

export const WEAPON_CONFIGS: Record<WeaponType, WeaponConfig> = {
  LASER: {
    name: 'LÁSER ESTÁNDAR',
    damage: 15,
    fireRate: 8,
    energyCost: 0,
    heatPerShot: 8,
    speed: 120,
    color: '#00ffcc',
  },
  TRIPLE: {
    name: 'DISPARO TRIPLE',
    damage: 10,
    fireRate: 5,
    energyCost: 5,
    heatPerShot: 12,
    speed: 100,
    color: '#ffdd00',
  },
  PIERCING: {
    name: 'RAYO PERFORANTE',
    damage: 35,
    fireRate: 2.5,
    energyCost: 20,
    heatPerShot: 25,
    speed: 160,
    color: '#ff00ff',
  },
};

export type EnemyType =
  | 'SCOUT_DRONE'
  | 'INTERCEPTOR'
  | 'HEAVY_BOMBER'
  | 'TURRET'
  | 'MINE'
  | 'SHIELD_DRONE'
  | 'REPAIR_DRONE'
  | 'ELITE_FIGHTER';

export interface EnemyStats {
  name: string;
  maxHealth: number;
  speed: number;
  scoreValue: number;
  collisionRadius: number;
  color: string;
}

export const ENEMY_STATS: Record<EnemyType, EnemyStats> = {
  SCOUT_DRONE: {
    name: 'Drone Explorador',
    maxHealth: 25,
    speed: 18,
    scoreValue: 100,
    collisionRadius: 1.2,
    color: '#00e5ff',
  },
  INTERCEPTOR: {
    name: 'Caza Enemigo',
    maxHealth: 45,
    speed: 15,
    scoreValue: 200,
    collisionRadius: 1.5,
    color: '#ff3366',
  },
  HEAVY_BOMBER: {
    name: 'Bombardero Pesado',
    maxHealth: 150,
    speed: 8,
    scoreValue: 500,
    collisionRadius: 2.5,
    color: '#ff9900',
  },
  TURRET: {
    name: 'Torreta Flotante',
    maxHealth: 80,
    speed: 0,
    scoreValue: 300,
    collisionRadius: 1.8,
    color: '#cc00ff',
  },
  MINE: {
    name: 'Mina Espacial',
    maxHealth: 15,
    speed: 10,
    scoreValue: 75,
    collisionRadius: 1.0,
    color: '#ff0000',
  },
  SHIELD_DRONE: {
    name: 'Drone Escudo',
    maxHealth: 60,
    speed: 12,
    scoreValue: 350,
    collisionRadius: 1.4,
    color: '#33ffff',
  },
  REPAIR_DRONE: {
    name: 'Unidad Reparadora',
    maxHealth: 50,
    speed: 14,
    scoreValue: 400,
    collisionRadius: 1.3,
    color: '#33ff33',
  },
  ELITE_FIGHTER: {
    name: 'Nave de Élite',
    maxHealth: 250,
    speed: 20,
    scoreValue: 1000,
    collisionRadius: 2.0,
    color: '#ffff00',
  },
};

export type PickupType =
  | 'HEALTH'
  | 'SHIELD'
  | 'ENERGY'
  | 'MISSILE'
  | 'BOMB'
  | 'TRIPLE_SHOT'
  | 'DAMAGE_BOOST'
  | 'INVINCIBILITY'
  | 'MULTIPLIER';

export interface SectorConfig {
  id: number;
  name: string;
  description: string;
  bgColor: string;
  fogColor: string;
  asteroidDensity: number;
  musicTrack: string;
  bossName: string;
}

export const SECTORS: SectorConfig[] = [
  {
    id: 1,
    name: 'Frontera Estelar',
    description: 'Espacio profundo. Amenaza baja, asteroides dispersos.',
    bgColor: '#040714',
    fogColor: '#002244',
    asteroidDensity: 30,
    musicTrack: 'sector1',
    bossName: 'Devorador de Asteroides',
  },
  {
    id: 2,
    name: 'Nebulosa Carmesí',
    description: 'Polvo cósmico rojo, descargas estáticas y visibilidad reducida.',
    bgColor: '#1a0307',
    fogColor: '#4a0815',
    asteroidDensity: 25,
    musicTrack: 'sector2',
    bossName: 'Núcleo del Enjambre',
  },
  {
    id: 3,
    name: 'Cementerio Orbital',
    description: 'Restos de antiguas flotas, estructuras flotantes y emboscadas.',
    bgColor: '#0c0f12',
    fogColor: '#1e2830',
    asteroidDensity: 45,
    musicTrack: 'sector3',
    bossName: 'Arquitecto del Vacío (Fase 1)',
  },
  {
    id: 4,
    name: 'Enjambre Mecánico',
    description: 'Dominio de enjambre sintético. Alta frecuencia de cazas y reparadores.',
    bgColor: '#10001a',
    fogColor: '#38004a',
    asteroidDensity: 20,
    musicTrack: 'sector4',
    bossName: 'Arquitecto del Vacío (Fase 2)',
  },
  {
    id: 5,
    name: 'Fortaleza del Vacío',
    description: 'Bastión enemigo principal. Barreras energéticas y defensores de élite.',
    bgColor: '#020d18',
    fogColor: '#052b47',
    asteroidDensity: 15,
    musicTrack: 'sector5',
    bossName: 'Arquitecto del Vacío - Núcleo',
  },
];
