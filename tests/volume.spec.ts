import { describe, it, expect } from "vitest";
import { BoxGeometry } from 'three';
import { volume } from '../src/domain/stl/volume';

describe('volume', () => {
  it('unit cube', () => {
    const geom = new BoxGeometry(1,1,1);
    expect(volume(geom)).toBeCloseTo(1);
  });
});
