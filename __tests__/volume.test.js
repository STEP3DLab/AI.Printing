import * as THREE from '../js/lib/three.module.min.js';
import { computeVolume } from '../js/volume.js';

test('compute volume of unit cube', () => {
  const geometry = new THREE.BoxGeometry(1,1,1);
  expect(computeVolume(geometry)).toBeCloseTo(1);
});
