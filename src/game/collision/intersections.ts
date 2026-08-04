import * as THREE from 'three';

export interface BoundingSphere {
  center: THREE.Vector3;
  radius: number;
}

export interface BoundingAABB {
  min: THREE.Vector3;
  max: THREE.Vector3;
}

export interface LineSegment {
  start: THREE.Vector3;
  end: THREE.Vector3;
}

/**
 * Sphere vs Sphere intersection check
 */
export function sphereIntersectsSphere(s1: BoundingSphere, s2: BoundingSphere): boolean {
  const dx = s1.center.x - s2.center.x;
  const dy = s1.center.y - s2.center.y;
  const dz = s1.center.z - s2.center.z;
  const distSq = dx * dx + dy * dy + dz * dz;
  const radiusSum = s1.radius + s2.radius;
  return distSq <= radiusSum * radiusSum;
}

/**
 * Sphere vs AABB intersection check
 */
export function sphereIntersectsAABB(sphere: BoundingSphere, aabb: BoundingAABB): boolean {
  // Find closest point on AABB to sphere center
  const x = Math.max(aabb.min.x, Math.min(sphere.center.x, aabb.max.x));
  const y = Math.max(aabb.min.y, Math.min(sphere.center.y, aabb.max.y));
  const z = Math.max(aabb.min.z, Math.min(sphere.center.z, aabb.max.z));

  const dx = x - sphere.center.x;
  const dy = y - sphere.center.y;
  const dz = z - sphere.center.z;

  return dx * dx + dy * dy + dz * dz <= sphere.radius * sphere.radius;
}

/**
 * Segment vs Sphere intersection (Continuous Ray/Bullet check against a moving or static target)
 */
export function segmentIntersectsSphere(segment: LineSegment, sphere: BoundingSphere): boolean {
  const d = new THREE.Vector3().subVectors(segment.end, segment.start);
  const f = new THREE.Vector3().subVectors(segment.start, sphere.center);

  const a = d.dot(d);
  const b = 2 * f.dot(d);
  const c = f.dot(f) - sphere.radius * sphere.radius;

  if (a === 0) {
    // Segment is a single point
    return f.lengthSq() <= sphere.radius * sphere.radius;
  }

  let discriminant = b * b - 4 * a * c;
  if (discriminant < 0) {
    return false;
  }

  discriminant = Math.sqrt(discriminant);
  const t1 = (-b - discriminant) / (2 * a);
  const t2 = (-b + discriminant) / (2 * a);

  // Check if intersection point lies on the line segment [0, 1]
  return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1) || (t1 < 0 && t2 > 1);
}

/**
 * Swept Sphere vs Sphere (Continuous collision detection between two moving spheres)
 */
export function sweptSphereIntersectsSphere(
  posAStart: THREE.Vector3,
  posAEnd: THREE.Vector3,
  radiusA: number,
  posBStart: THREE.Vector3,
  posBEnd: THREE.Vector3,
  radiusB: number
): boolean {
  // Relative displacement of A relative to B
  const va = new THREE.Vector3().subVectors(posAEnd, posAStart);
  const vb = new THREE.Vector3().subVectors(posBEnd, posBStart);
  const vr = new THREE.Vector3().subVectors(va, vb);

  const ab = new THREE.Vector3().subVectors(posAStart, posBStart);
  const totalRadius = radiusA + radiusB;

  const a = vr.dot(vr);
  const b = 2 * ab.dot(vr);
  const c = ab.dot(ab) - totalRadius * totalRadius;

  if (c <= 0) return true; // Already overlapping at start
  if (a === 0) return false;

  const disc = b * b - 4 * a * c;
  if (disc < 0) return false;

  const t = (-b - Math.sqrt(disc)) / (2 * a);
  return t >= 0 && t <= 1;
}
