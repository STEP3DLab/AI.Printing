import * as THREE from './lib/three.module.min.js';
export function signedVolumeOfTriangle(p1,p2,p3){
  return p1.dot(p2.clone().cross(p3)) / 6.0;
}
export function computeVolume(geometry){
  if(geometry.index) geometry = geometry.toNonIndexed();
  const pos = geometry.attributes.position;
  let volume=0;
  for(let i=0;i<pos.count;i+=3){
    const p1=new THREE.Vector3().fromBufferAttribute(pos,i);
    const p2=new THREE.Vector3().fromBufferAttribute(pos,i+1);
    const p3=new THREE.Vector3().fromBufferAttribute(pos,i+2);
    volume+=signedVolumeOfTriangle(p1,p2,p3);
  }
  return Math.abs(volume);
}
