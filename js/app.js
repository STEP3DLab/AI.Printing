import { computeVolume } from './volume.js';

const fileInput = document.getElementById('fileInput');
const fileUrl   = document.getElementById('fileUrl');
const dropZone  = document.getElementById('dropZone');
const calcBtn   = document.getElementById('calcBtn');
const progress  = document.getElementById('progress');
const targetMax = document.getElementById('targetMax');
const priceFilament = document.getElementById('priceFilament');
const priceResin    = document.getElementById('priceResin');
const timeCoefFdm   = document.getElementById('timeCoefFdm');
const timeCoefDlp   = document.getElementById('timeCoefDlp');
const priceMachine  = document.getElementById('priceMachine');
const infill        = document.getElementById('infill');
const supportPct    = document.getElementById('supportPct');
const copies        = document.getElementById('copies');
const packCost      = document.getElementById('packCost');
const results       = document.getElementById('results');
const scaleOut      = document.getElementById('scaleOut');
const volOut        = document.getElementById('volOut');
const sx = document.getElementById('sx');
const sy = document.getElementById('sy');
const sz = document.getElementById('sz');
const gx = document.getElementById('gx');
const gy = document.getElementById('gy');
const gz = document.getElementById('gz');
const costFdmElem = document.getElementById('costFdmElem');
const costDlpElem = document.getElementById('costDlpElem');
const previewCanvas = document.getElementById('previewCanvas');

function validate(el){
  if(isNaN(parseFloat(el.value))) el.classList.add('is-invalid');
  else el.classList.remove('is-invalid');
}
document.querySelectorAll('input[type=number],input[type=url]').forEach(el=>{
  el.addEventListener('input',()=>validate(el));
});

async function loadGeometry(file){
  progress.textContent = 'Загрузка...';
  const arrayBuffer = await file.arrayBuffer();
  const loader = new STLLoader();
  return loader.parse(arrayBuffer);
}

async function loadGeometryFromUrl(url){
  progress.textContent = 'Загрузка из URL...';
  const resp = await fetch(url);
  const buf = await resp.arrayBuffer();
  const loader = new STLLoader();
  return loader.parse(buf);
}

async function runCalc(geometry){
  const tgtMax = parseFloat(targetMax.value);
  if(!geometry || !tgtMax){
    alert('Загрузите STL и задайте габарит.');
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
  const inf = Math.max(0, Math.min(100, parseFloat(infill.value))) / 100;
  const spc = Math.max(0, parseFloat(supportPct.value)) / 100;
  const copiesCnt = Math.max(1, parseInt(copies.value||1));
  const pack = parseFloat(packCost.value)||0;

  const materialVol = volCm3 * inf;
  const supportsVol = volCm3 * spc;

  const costFdm = (materialVol + supportsVol) * pf * copiesCnt +
                   (materialVol + supportsVol) * tcf * pmh * copiesCnt + pack;
  const costDlp = (materialVol + supportsVol) * pr * copiesCnt +
                   (materialVol + supportsVol) * tcd * pmh * copiesCnt + pack;

  const format = n => n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatScale = n => n.toLocaleString('ru-RU', { minimumFractionDigits: 3, maximumFractionDigits: 3 });

  sx.textContent = format(size.x);  sy.textContent = format(size.y);  sz.textContent = format(size.z);
  gx.textContent = format(scaledSize.x); gy.textContent = format(scaledSize.y); gz.textContent = format(scaledSize.z);
  scaleOut.textContent = formatScale(scale);
  volOut.textContent   = format(volCm3);
  costFdmElem.textContent  = format(costFdm)+' ₽';
  costDlpElem.textContent  = format(costDlp)+' ₽';
  results.style.display = '';

  const canvas = previewCanvas;
  const width  = canvas.parentElement.clientWidth;
  canvas.width = width; canvas.height = width*0.75;
  const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0xf8f9fa);
  const camera = new THREE.PerspectiveCamera(45, width/(width*0.75), 1, 10000);
  camera.position.set(0,0, Math.max(...scaledSize.toArray())*2);
  const controls = new OrbitControls(camera, canvas);
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1,1,1); scene.add(light);
  scene.add(new THREE.AmbientLight(0x888888));
  const mesh = new THREE.Mesh(geometry.clone(), new THREE.MeshStandardMaterial({color:0x999999}));
  mesh.scale.set(scale, scale, scale); scene.add(mesh);
  function animate(){
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
  canvas.addEventListener('wheel',e=>{
    e.preventDefault();
    const s = e.deltaY>0?0.95:1.05;
    mesh.scale.multiplyScalar(s);
 });
}

calcBtn.addEventListener('click', async () => {
  let geom;
  try{
    if(fileInput.files[0]) geom = await loadGeometry(fileInput.files[0]);
    else if(fileUrl.value) geom = await loadGeometryFromUrl(fileUrl.value);
    else{ alert('Выберите файл или URL'); return; }
    progress.textContent = '';
    await runCalc(geom);
  }catch(e){
    progress.textContent = '';
    alert('Ошибка чтения STL: '+e.message);
  }
});

dropZone.addEventListener('dragover',e=>{e.preventDefault(); dropZone.classList.add('dragover');});
dropZone.addEventListener('dragleave',()=>dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop',e=>{
  e.preventDefault();
  dropZone.classList.remove('dragover');
  fileInput.files = e.dataTransfer.files;
});
