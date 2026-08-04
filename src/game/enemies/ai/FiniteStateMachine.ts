export type AIState =
  | 'SPAWN'
  | 'PATROL'
  | 'SEARCH'
  | 'CHASE'
  | 'AIM'
  | 'ATTACK'
  | 'EVADE'
  | 'RETREAT'
  | 'STUNNED'
  | 'DESTROYED';

export class FiniteStateMachine {
  private currentState: AIState;
  private stateTimer: number = 0;

  constructor(initialState: AIState = 'SPAWN') {
    this.currentState = initialState;
  }

  public getState(): AIState {
    return this.currentState;
  }

  public transitionTo(newState: AIState): void {
    if (this.currentState !== newState) {
      this.currentState = newState;
      this.stateTimer = 0;
    }
  }

  public update(delta: number): void {
    this.stateTimer += delta;
  }

  public getStateTime(): number {
    return this.stateTimer;
  }
}
