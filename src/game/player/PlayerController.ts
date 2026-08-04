import * as THREE from 'three';
import { useGameStore } from '../../stores/gameStore';
import { useSettingsStore } from '../../stores/settingsStore';

export interface PlayerInputState {
  moveForward: boolean; // W
  moveBackward: boolean; // S
  moveLeft: boolean; // A
  moveRight: boolean; // D
  moveUp: boolean; // E
  moveDown: boolean; // Q
  primaryFire: boolean; // Mouse left / K
  missileFire: boolean; // Mouse right / L
  boost: boolean; // Space
  specialBomb: boolean; // F
  cycleWeapon: boolean; // R
  mouseDeltaX: number;
  mouseDeltaY: number;

  // Mobile Touch Overrides
  virtualJoyX: number;
  virtualJoyY: number;
}

export class PlayerController {
  public position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  public velocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  public rotation: THREE.Euler = new THREE.Euler(0, 0, 0, 'YXZ');
  public rollAngle: number = 0;

  public isHitFlashing: boolean = false;
  private hitFlashTimer: number = 0;
  public invulnerableTimer: number = 0;

  private input: PlayerInputState = {
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    moveUp: false,
    moveDown: false,
    primaryFire: false,
    missileFire: false,
    boost: false,
    specialBomb: false,
    cycleWeapon: false,
    mouseDeltaX: 0,
    mouseDeltaY: 0,
    virtualJoyX: 0,
    virtualJoyY: 0,
  };

  private boundKeyDown: (e: KeyboardEvent) => void;
  private boundKeyUp: (e: KeyboardEvent) => void;
  private boundMouseMove: (e: MouseEvent) => void;
  private boundMouseDown: (e: MouseEvent) => void;
  private boundMouseUp: (e: MouseEvent) => void;

  constructor() {
    this.boundKeyDown = this.handleKeyDown.bind(this);
    this.boundKeyUp = this.handleKeyUp.bind(this);
    this.boundMouseMove = this.handleMouseMove.bind(this);
    this.boundMouseDown = this.handleMouseDown.bind(this);
    this.boundMouseUp = this.handleMouseUp.bind(this);

    this.attachEventListeners();
  }

  public attachEventListeners(): void {
    window.addEventListener('keydown', this.boundKeyDown);
    window.addEventListener('keyup', this.boundKeyUp);
    window.addEventListener('mousemove', this.boundMouseMove);
    window.addEventListener('mousedown', this.boundMouseDown);
    window.addEventListener('mouseup', this.boundMouseUp);
  }

  public detachEventListeners(): void {
    window.removeEventListener('keydown', this.boundKeyDown);
    window.removeEventListener('keyup', this.boundKeyUp);
    window.removeEventListener('mousemove', this.boundMouseMove);
    window.removeEventListener('mousedown', this.boundMouseDown);
    window.removeEventListener('mouseup', this.boundMouseUp);
  }

  private handleKeyDown(e: KeyboardEvent): void {
    const code = e.code;
    if (code === 'KeyW' || code === 'ArrowUp') this.input.moveForward = true;
    if (code === 'KeyS' || code === 'ArrowDown') this.input.moveBackward = true;
    if (code === 'KeyA' || code === 'ArrowLeft') this.input.moveLeft = true;
    if (code === 'KeyD' || code === 'ArrowRight') this.input.moveRight = true;
    if (code === 'KeyE') this.input.moveUp = true;
    if (code === 'KeyQ') this.input.moveDown = true;
    if (code === 'Space') this.input.boost = true;
    if (code === 'KeyF') this.input.specialBomb = true;
    if (code === 'KeyR') this.input.cycleWeapon = true;
    if (code === 'KeyK') this.input.primaryFire = true;
    if (code === 'KeyL') this.input.missileFire = true;
  }

  private handleKeyUp(e: KeyboardEvent): void {
    const code = e.code;
    if (code === 'KeyW' || code === 'ArrowUp') this.input.moveForward = false;
    if (code === 'KeyS' || code === 'ArrowDown') this.input.moveBackward = false;
    if (code === 'KeyA' || code === 'ArrowLeft') this.input.moveLeft = false;
    if (code === 'KeyD' || code === 'ArrowRight') this.input.moveRight = false;
    if (code === 'KeyE') this.input.moveUp = false;
    if (code === 'KeyQ') this.input.moveDown = false;
    if (code === 'Space') this.input.boost = false;
    if (code === 'KeyF') this.input.specialBomb = false;
    if (code === 'KeyR') this.input.cycleWeapon = false;
    if (code === 'KeyK') this.input.primaryFire = false;
    if (code === 'KeyL') this.input.missileFire = false;
  }

  private handleMouseMove(e: MouseEvent): void {
    if (document.pointerLockElement) {
      const { mouseSensitivity, invertYAxis } = useSettingsStore.getState();
      this.input.mouseDeltaX += e.movementX * 0.002 * mouseSensitivity;
      this.input.mouseDeltaY += e.movementY * 0.002 * mouseSensitivity * (invertYAxis ? -1 : 1);
    }
  }

  private handleMouseDown(e: MouseEvent): void {
    if (e.button === 0) this.input.primaryFire = true;
    if (e.button === 2) this.input.missileFire = true;
  }

  private handleMouseUp(e: MouseEvent): void {
    if (e.button === 0) this.input.primaryFire = false;
    if (e.button === 2) this.input.missileFire = false;
  }

  public setVirtualJoystick(x: number, y: number): void {
    this.input.virtualJoyX = x;
    this.input.virtualJoyY = y;
  }

  public setTouchAction(action: 'FIRE' | 'MISSILE' | 'BOOST' | 'BOMB', active: boolean): void {
    if (action === 'FIRE') this.input.primaryFire = active;
    if (action === 'MISSILE') this.input.missileFire = active;
    if (action === 'BOOST') this.input.boost = active;
    if (action === 'BOMB') this.input.specialBomb = active;
  }

  public update(delta: number): void {
    // Check Gamepad API input
    this.pollGamepad();

    const { consumeEnergy, addEnergy } = useGameStore.getState();

    // Invulnerability and flash timers
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= delta;
      this.hitFlashTimer += delta;
      this.isHitFlashing = Math.floor(this.hitFlashTimer * 15) % 2 === 0;
    } else {
      this.isHitFlashing = false;
    }

    // Flight Dynamics & Boost
    let speedMult = 25;
    if (this.input.boost) {
      if (consumeEnergy(25 * delta)) {
        speedMult = 45;
      }
    } else {
      addEnergy(15 * delta); // Passive energy recovery
    }

    // Directional Movement Vector
    const moveDir = new THREE.Vector3();

    if (this.input.moveForward) moveDir.z -= 1;
    if (this.input.moveBackward) moveDir.z += 1;
    if (this.input.moveLeft || this.input.virtualJoyX < -0.3) moveDir.x -= 1;
    if (this.input.moveRight || this.input.virtualJoyX > 0.3) moveDir.x += 1;
    if (this.input.moveUp) moveDir.y += 1;
    if (this.input.moveDown || this.input.virtualJoyY > 0.3) moveDir.y -= 1;
    if (this.input.virtualJoyY < -0.3) moveDir.z -= 1;

    moveDir.normalize();

    // Roll banking angle
    const targetRoll = -moveDir.x * 0.45;
    this.rollAngle += (targetRoll - this.rollAngle) * delta * 10;

    // Apply pitch/yaw from mouse or touch
    this.rotation.y -= this.input.mouseDeltaX;
    this.rotation.x -= this.input.mouseDeltaY;

    // Clamp pitch angle to avoid flipping loops
    this.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.rotation.x));

    // Reset mouse accumulation deltas
    this.input.mouseDeltaX = 0;
    this.input.mouseDeltaY = 0;

    // Accelerate ship velocity
    const worldMove = moveDir.applyEuler(this.rotation).multiplyScalar(speedMult);
    this.velocity.lerp(worldMove, delta * 8);
    this.position.addScaledVector(this.velocity, delta);

    // Keep player clamped within playable sector bounds (-200 to 200)
    this.position.x = Math.max(-250, Math.min(250, this.position.x));
    this.position.y = Math.max(-120, Math.min(120, this.position.y));
    this.position.z = Math.max(-400, Math.min(100, this.position.z));
  }

  private pollGamepad(): void {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const pad = gamepads[0];
    if (pad) {
      // Left stick movement
      if (Math.abs(pad.axes[0]) > 0.2) this.input.virtualJoyX = pad.axes[0];
      if (Math.abs(pad.axes[1]) > 0.2) this.input.virtualJoyY = pad.axes[1];

      // Right stick camera aiming
      if (Math.abs(pad.axes[2]) > 0.2) this.input.mouseDeltaX = pad.axes[2] * 0.05;
      if (Math.abs(pad.axes[3]) > 0.2) this.input.mouseDeltaY = pad.axes[3] * 0.05;

      // Triggers and buttons
      this.input.primaryFire = pad.buttons[7]?.pressed || pad.buttons[0]?.pressed;
      this.input.missileFire = pad.buttons[6]?.pressed || pad.buttons[1]?.pressed;
      this.input.boost = pad.buttons[2]?.pressed;
      this.input.specialBomb = pad.buttons[3]?.pressed;
    }
  }

  public getInput(): PlayerInputState {
    return this.input;
  }

  public triggerHit(invulnerableTime: number = 1.2): void {
    this.invulnerableTimer = invulnerableTime;
    this.hitFlashTimer = 0;
  }
}

export const playerController = new PlayerController();
