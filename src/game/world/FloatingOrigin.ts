import * as THREE from 'three';

export class FloatingOrigin {
  public static readonly THRESHOLD = 500;
  private static accumulatedOffset: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

  /**
   * Recenter world entities if reference position exceeds distance threshold.
   * Returns the applied shift vector if recentered, or null if no shift occurred.
   */
  public static update(referencePosition: THREE.Vector3, objectsToShift: THREE.Object3D[]): THREE.Vector3 | null {
    if (referencePosition.lengthSq() > this.THRESHOLD * this.THRESHOLD) {
      const shift = referencePosition.clone();
      referencePosition.sub(shift);
      this.accumulatedOffset.add(shift);

      objectsToShift.forEach((obj) => {
        if (obj) {
          obj.position.sub(shift);
        }
      });

      return shift;
    }
    return null;
  }

  public static getAccumulatedOffset(): THREE.Vector3 {
    return this.accumulatedOffset.clone();
  }

  public static reset(): void {
    this.accumulatedOffset.set(0, 0, 0);
  }
}
