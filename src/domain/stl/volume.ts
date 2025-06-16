// Функции для вычисления объёма трехмерной модели
import { BufferGeometry, Vector3 } from 'three';

// Подсчёт ориентированного объёма для одного треугольника
export function signedVolumeOfTriangle(p1: Vector3, p2: Vector3, p3: Vector3): number {
  return p1.dot(p2.clone().cross(p3)) / 6;
}

// Вычисляет общий объём буферной геометрии
export function volume(geometry: BufferGeometry): number {
  const geom = geometry.index ? geometry.toNonIndexed() : geometry;
  const pos = geom.getAttribute('position');
  let vol = 0;
  const v1 = new Vector3();
  const v2 = new Vector3();
  const v3 = new Vector3();
  // Идём по вершинам тройками и суммируем объём
  for (let i = 0; i < pos.count; i += 3) {
    v1.fromBufferAttribute(pos, i);
    v2.fromBufferAttribute(pos, i + 1);
    v3.fromBufferAttribute(pos, i + 2);
    vol += signedVolumeOfTriangle(v1, v2, v3);
  }
  // Результат берём по модулю
  return Math.abs(vol);
}
