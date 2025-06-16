// Загрузка STL-файлов при помощи three.js
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { BufferGeometry } from 'three';

// Парсинг STL из массива байт
export async function loadStl(buffer: ArrayBuffer): Promise<BufferGeometry> {
  const loader = new STLLoader();
  return loader.parse(buffer);
}

// Загрузка STL из объекта File
export async function loadStlFile(file: File): Promise<BufferGeometry> {
  const buf = await file.arrayBuffer();
  return loadStl(buf);
}
