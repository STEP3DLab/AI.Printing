function signedVolumeOfTriangle(p1, p2, p3){
  return p1.dot(p2.clone().cross(p3)) / 6.0;
}

function computeVolume(geometry){
  const pos = geometry.attributes.position;
  let volume = 0;
  for(let i=0; i<pos.count; i+=3){
    const p1 = new THREE.Vector3().fromBufferAttribute(pos, i);
    const p2 = new THREE.Vector3().fromBufferAttribute(pos, i+1);
    const p3 = new THREE.Vector3().fromBufferAttribute(pos, i+2);
    volume += signedVolumeOfTriangle(p1,p2,p3);
  }
  return Math.abs(volume);
}

document.getElementById('calcBtn').addEventListener('click', async () => {
  const file = document.getElementById('fileInput').files[0];
  const tgtMax = parseFloat(document.getElementById('targetMax').value);
  if(!file || !tgtMax){ alert('Загрузите STL и задайте габарит.'); return; }

  const arrayBuffer = await file.arrayBuffer();
  const loader = new STLLoader();
  let geometry;
  try{
    geometry = loader.parse(arrayBuffer);
  }catch(e){
    alert('Не удалось прочитать STL: '+e.message);
    return;
  }

  geometry.computeBoundingBox();
  const size = geometry.boundingBox.getSize(new THREE.Vector3());
  const rawVol = computeVolume(geometry);

  const scale = tgtMax / Math.max(size.x, size.y, size.z);
  const scaledSize = size.clone().multiplyScalar(scale);
  const scaledVol  = rawVol * Math.pow(scale,3);
  const volCm3     = scaledVol / 1000.0;

  const pf  = parseFloat(priceFilament.value);
  const pr  = parseFloat(priceResin.value);
  const tcf = parseFloat(timeCoefFdm.value);
  const tcd = parseFloat(timeCoefDlp.value);
  const pmh = parseFloat(priceMachine.value);

  const costFdm = volCm3*pf + volCm3*tcf*pmh;
  const costDlp = volCm3*pr + volCm3*tcd*pmh;

  const f = n => n.toFixed(2);
  sx.textContent = f(size.x);  sy.textContent = f(size.y);  sz.textContent = f(size.z);
  gx.textContent = f(scaledSize.x); gy.textContent = f(scaledSize.y); gz.textContent = f(scaledSize.z);
  scaleOut.textContent = scale.toFixed(3);
  volOut.textContent   = f(volCm3);
  costFdmElem.textContent  = f(costFdm)+' ₽';
  costDlpElem.textContent  = f(costDlp)+' ₽';
  results.style.display = '';

  const canvas = previewCanvas;
  const width  = canvas.parentElement.clientWidth;
  canvas.width = width; canvas.height = width*0.75;
  const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0xf8f9fa);
  const camera = new THREE.PerspectiveCamera(45, width/(width*0.75), 1, 10000);
  camera.position.set(0,0, Math.max(...scaledSize.toArray())*2);
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1,1,1); scene.add(light);
  scene.add(new THREE.AmbientLight(0x888888));
  const mesh = new THREE.Mesh(geometry.clone(), new THREE.MeshStandardMaterial({color:0x999999}));
  mesh.scale.set(scale, scale, scale); scene.add(mesh);
  renderer.render(scene, camera);
});
