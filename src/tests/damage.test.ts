import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../stores/gameStore';

describe('Player Damage & Energy System', () => {
  beforeEach(() => {
    useGameStore.getState().resetPlayerState();
  });

  it('absorbs damage using shield before health', () => {
    const store = useGameStore.getState();
    expect(store.shield).toBe(50);
    expect(store.health).toBe(100);

    store.takePlayerDamage(30);

    const updated = useGameStore.getState();
    expect(updated.shield).toBe(20);
    expect(updated.health).toBe(100);
  });

  it('overflows damage from shield to health', () => {
    const store = useGameStore.getState();
    store.takePlayerDamage(70); // 50 absorbed by shield, 20 to health

    const updated = useGameStore.getState();
    expect(updated.shield).toBe(0);
    expect(updated.health).toBe(80);
  });

  it('handles energy consumption and depletion', () => {
    const store = useGameStore.getState();
    expect(store.energy).toBe(100);

    const success = store.consumeEnergy(40);
    expect(success).toBe(true);
    expect(useGameStore.getState().energy).toBe(60);

    const fail = store.consumeEnergy(80);
    expect(fail).toBe(false);
    expect(useGameStore.getState().energy).toBe(60);
  });

  it('handles heat and overheating state', () => {
    const store = useGameStore.getState();
    expect(store.overheatMeter).toBe(0);
    expect(store.isOverheated).toBe(false);

    store.addHeat(100);
    const overheatedState = useGameStore.getState();
    expect(overheatedState.overheatMeter).toBe(100);
    expect(overheatedState.isOverheated).toBe(true);

    store.coolDownHeat(100);
    const cooledState = useGameStore.getState();
    expect(cooledState.overheatMeter).toBe(0);
    expect(cooledState.isOverheated).toBe(false);
  });
});
