// Вычисление габаритного контейнера модели
import { Box3, BufferGeometry, Vector3 } from 'three';

// Возвращает границы (bounding box) буферной геометрии
export function boundingBox(geometry: BufferGeometry): Box3 {
  // Если геометрия индексированная, преобразуем её
  const g = geometry.index ? geometry.toNonIndexed() : geometry;
  const box = new Box3();
  const pos = g.getAttribute('position');
  const v = new Vector3();
  // Проходим по всем вершинам и расширяем коробку
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    box.expandByPoint(v);
  }
  return box;
}
