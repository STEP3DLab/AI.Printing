import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { BufferGeometry } from 'three';

export async function loadStl(buffer: ArrayBuffer): Promise<BufferGeometry> {
  const loader = new STLLoader();
  return loader.parse(buffer);
}

export async function loadStlFile(file: File): Promise<BufferGeometry> {
  const buf = await file.arrayBuffer();
  return loadStl(buf);
}
