import { Box3, BufferGeometry, Vector3 } from 'three';

export function boundingBox(geometry: BufferGeometry): Box3 {
  const g = geometry.index ? geometry.toNonIndexed() : geometry;
  const box = new Box3();
  const pos = g.getAttribute('position');
  const v = new Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    box.expandByPoint(v);
  }
  return box;
}
