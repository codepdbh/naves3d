/**
 * NEBULA-8 Web Audio Procedural NES Chiptune Engine
 * Generates pure 8-bit sound effects & procedural background music
 * with zero external file dependencies.
 */

import { useSettingsStore } from '../../stores/settingsStore';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isUnlocked: boolean = false;
  private currentTrack: string | null = null;
  private musicTimer: number | null = null;
  private stepCounter: number = 0;

  constructor() {
    // Lazy initialization on first user gesture
  }

  private initCtx() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx();

    this.masterGain = this.ctx.createGain();
    this.musicGain = this.ctx.createGain();
    this.sfxGain = this.ctx.createGain();

    this.musicGain.connect(this.masterGain);
    this.sfxGain.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    this.updateVolumes();
  }

  public unlock(): void {
    this.initCtx();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => {
        this.isUnlocked = true;
      });
    } else {
      this.isUnlocked = true;
    }
  }

  public updateVolumes(): void {
    if (!this.masterGain || !this.musicGain || !this.sfxGain) return;
    const { masterVolume, musicVolume, sfxVolume, isMuted } = useSettingsStore.getState();

    if (isMuted) {
      this.masterGain.gain.value = 0;
    } else {
      this.masterGain.gain.value = masterVolume;
      this.musicGain.gain.value = musicVolume * 0.4; // Soft background music
      this.sfxGain.gain.value = sfxVolume * 0.6;
    }
  }

  // --- SOUND EFFECTS (SFX) ---

  // 1. Primary Laser Pulse (Square Wave Pitch Sweep)
  public playLaser(type: 'LASER' | 'TRIPLE' | 'PIERCING' = 'LASER'): void {
    if (!this.ctx || !this.isUnlocked || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';

    if (type === 'LASER') {
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'TRIPLE') {
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.06);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'PIERCING') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(1200, now + 0.15);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.18);
    }
  }

  // 2. Missile Launch (Low Frequency Sweep)
  public playMissileLaunch(): void {
    if (!this.ctx || !this.isUnlocked || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.2);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  // 3. Explosion Noise (Custom 8-bit Noise Burst)
  public playExplosion(large: boolean = false): void {
    if (!this.ctx || !this.isUnlocked || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const duration = large ? 0.4 : 0.2;

    // Buffer noise
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(large ? 400 : 800, now);
    filter.frequency.linearRampToValueAtTime(100, now + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(large ? 0.6 : 0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
  }

  // 4. Hit Impact / Shield Sound
  public playHit(shieldHit: boolean = false): void {
    if (!this.ctx || !this.isUnlocked || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (shieldHit) {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.12);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    }

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  // 5. Pickup Item Chime (Arpeggio)
  public playPickup(): void {
    if (!this.ctx || !this.isUnlocked || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);
      gain.gain.setValueAtTime(0.2, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.04 + 0.05);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.05);
    });
  }

  // 6. EMP Special Bomb
  public playBomb(): void {
    if (!this.ctx || !this.isUnlocked || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.linearRampToValueAtTime(1500, now + 0.4);
    osc.frequency.linearRampToValueAtTime(50, now + 0.8);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.8);
  }

  // --- PROCEDURAL NES CHIPTUNE BACKGROUND MUSIC ---

  public playMusic(track: string): void {
    if (this.currentTrack === track && this.musicTimer !== null) return;
    this.stopMusic();

    this.currentTrack = track;
    this.stepCounter = 0;

    // 130 BPM Chiptune loop step
    const intervalMs = 120;
    this.musicTimer = window.setInterval(() => {
      this.stepChiptuneTrack(track);
    }, intervalMs);
  }

  public stopMusic(): void {
    if (this.musicTimer !== null) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
    this.currentTrack = null;
  }

  private stepChiptuneTrack(track: string): void {
    if (!this.ctx || !this.isUnlocked || !this.musicGain) return;

    const now = this.ctx.currentTime;
    this.stepCounter++;

    // Scale frequencies for 8-bit NES feel
    // A minor / C major scales
    const bassScale = [110, 130.81, 146.83, 164.81, 196, 220]; // A2, C3, D3, E3, G3, A3
    const leadScale = [440, 523.25, 587.33, 659.25, 783.99, 880]; // A4, C5, D5, E5, G5, A6

    // Bassline (Triangle Wave)
    const bassIdx = (this.stepCounter * 2 + (track === 'boss' ? 3 : 1)) % bassScale.length;
    const bassOsc = this.ctx.createOscillator();
    const bassGain = this.ctx.createGain();
    bassOsc.type = 'triangle';
    bassOsc.frequency.setValueAtTime(bassScale[bassIdx], now);
    bassGain.gain.setValueAtTime(0.3, now);
    bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    bassOsc.connect(bassGain);
    bassGain.connect(this.musicGain);
    bassOsc.start(now);
    bassOsc.stop(now + 0.1);

    // Lead Arpeggio (Pulse Wave)
    if (this.stepCounter % 2 === 0 || track === 'boss') {
      const leadIdx = (this.stepCounter * 3) % leadScale.length;
      const leadOsc = this.ctx.createOscillator();
      const leadGain = this.ctx.createGain();
      leadOsc.type = 'square';
      leadOsc.frequency.setValueAtTime(leadScale[leadIdx], now);
      leadGain.gain.setValueAtTime(0.15, now);
      leadGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      leadOsc.connect(leadGain);
      leadGain.connect(this.musicGain);
      leadOsc.start(now);
      leadOsc.stop(now + 0.08);
    }
  }
}

export const audioEngine = new AudioEngine();
