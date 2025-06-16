// Подключаем библиотеки Three.js и вспомогательные модули
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Функции для работы с STL-файлом
import { volume } from './domain/stl/volume';
import { boundingBox } from './domain/stl/boundingBox';

// Расчёт стоимости печати
import { calculateCost } from './domain/cost';
import type { CostParams } from './domain/types';

// UI-компоненты
import { CostCard } from './ui/CostCard';
import { showAlert } from './ui/Alert';

// Общие стили приложения
import './styles/main.scss';

// Находим контейнер для приложения и сразу вставляем HTML-разметку
const app = document.getElementById('app') as HTMLElement;
// Вставляем форму с параметрами печати и область для результатов
app.innerHTML = `
<div class="row g-4">
  <div class="col-lg-4">
    <label class="form-label">STL-файл</label>
    <input class="form-control" type="file" id="fileInput" accept=".stl" />
    <input class="form-control mt-2" type="url" id="fileUrl" placeholder="URL" />
  </div>
  <div class="col-lg-4">
    <label class="form-label">Целевой наибольший габарит, мм</label>
    <input class="form-control" type="number" step="0.1" min="0" id="targetMax" value="100" />
  </div>
  <div class="col-lg-4 align-self-end">
    <button id="calcBtn" class="btn btn-primary w-100">Рассчитать</button>
  </div>
</div>
<hr class="my-4" />
<div class="row g-3">
  <div class="col-6 col-lg-2"><label class="form-label small">Цена филамента ₽/см³</label><input id="priceFilament" class="form-control" type="number" step="0.1" value="4"></div>
  <div class="col-6 col-lg-2"><label class="form-label small">Цена смолы ₽/см³</label><input id="priceResin" class="form-control" type="number" step="0.1" value="14"></div>
  <div class="col-6 col-lg-2"><label class="form-label small">Время FDM ч/см³</label><input id="timeCoefFdm" class="form-control" type="number" step="0.001" value="0.04"></div>
  <div class="col-6 col-lg-2"><label class="form-label small">Время DLP ч/см³</label><input id="timeCoefDlp" class="form-control" type="number" step="0.001" value="0.02"></div>
  <div class="col-6 col-lg-2"><label class="form-label small">Стоимость часа ₽/ч</label><input id="priceMachine" class="form-control" type="number" step="1" value="150"></div>
  <div class="col-6 col-lg-2"><label class="form-label small">Инфил, %</label><input id="infill" class="form-control" type="number" step="1" value="100"></div>
  <div class="col-6 col-lg-2"><label class="form-label small">Поддержки, %</label><input id="supportPct" class="form-control" type="number" step="1" value="10"></div>
  <div class="col-6 col-lg-2"><label class="form-label small">Копий</label><input id="copies" class="form-control" type="number" step="1" value="1"></div>
  <div class="col-6 col-lg-2"><label class="form-label small">Упаковка, ₽</label><input id="packCost" class="form-control" type="number" step="1" value="0"></div>
</div>
<div id="progress" class="my-3 text-muted"></div>
<div id="results" class="my-4" style="display:none;">
  <h4>Результаты</h4>
  <div class="row g-3 mb-3">
    <div class="col-6 col-lg-3"><div class="card text-center result-card"><div class="card-body"><h5 class="card-title">Цена FDM</h5><p id="costFdm" class="fs-4 mb-0"></p></div></div></div>
    <div class="col-6 col-lg-3"><div class="card text-center result-card"><div class="card-body"><h5 class="card-title">Цена DLP</h5><p id="costDlp" class="fs-4 mb-0"></p></div></div></div>
    <div class="col-6 col-lg-3"><div class="card text-center result-card"><div class="card-body"><h5 class="card-title">Масштаб</h5><p id="scaleOut" class="fs-4 mb-0"></p></div></div></div>
    <div class="col-6 col-lg-3"><div class="card text-center result-card"><div class="card-body"><h5 class="card-title">Объём, см³</h5><p id="volOut" class="fs-4 mb-0"></p></div></div></div>
  </div>
</div>
<canvas id="previewCanvas" class="mt-4"></canvas>
`;

// Берём значение из поля ввода и преобразуем его в число
function getNumber(id: string): number {
  const el = document.getElementById(id) as HTMLInputElement;
  return parseFloat(el.value) || 0;
}

// Загружает модель либо из файла, либо по URL
async function loadFromInput(): Promise<THREE.BufferGeometry | null> {
  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  const fileUrl = document.getElementById('fileUrl') as HTMLInputElement;
  if (fileInput.files && fileInput.files[0]) {
    // Читаем файл из input type="file"
    const buf = await fileInput.files[0].arrayBuffer();
    return new STLLoader().parse(buf);
  }
  if (fileUrl.value) {
    // Скачиваем файл по указанному URL
    const resp = await fetch(fileUrl.value);
    const buf = await resp.arrayBuffer();
    return new STLLoader().parse(buf);
  }
  // Ничего не выбрано
  return null;
}

// Основная функция расчёта и отображения результатов
async function runCalc(geom: THREE.BufferGeometry) {
  const tgtMax = getNumber('targetMax');
  if (!geom || !tgtMax) {
    showAlert('Загрузите STL и задайте габарит.');
    return;
  }

  // Определяем габариты модели и её объём
  const box = boundingBox(geom);
  const size = box.getSize(new THREE.Vector3());
  const rawVol = volume(geom);

  // Рассчитываем масштаб для достижения заданного максимального размера
  const scale = tgtMax / Math.max(size.x, size.y, size.z);
  const scaledSize = size.clone().multiplyScalar(scale);
  const scaledVol = rawVol * Math.pow(scale, 3);
  const volCm3 = scaledVol / 1000.0;

  // Собираем параметры для расчёта стоимости
  const params: CostParams = {
    priceFilament: getNumber('priceFilament'),
    priceResin: getNumber('priceResin'),
    timeCoefFdm: getNumber('timeCoefFdm'),
    timeCoefDlp: getNumber('timeCoefDlp'),
    priceMachine: getNumber('priceMachine'),
    infill: Math.max(0, Math.min(100, getNumber('infill'))) / 100,
    supportPct: Math.max(0, getNumber('supportPct')) / 100,
    copies: Math.max(1, getNumber('copies')),
    packCost: getNumber('packCost')
  };

  // Выполняем расчёт стоимости печати
  const costs = calculateCost(volCm3, params);

  // Отображаем расчётные значения на странице
  (document.getElementById('scaleOut') as HTMLElement).textContent = scale.toFixed(3);
  (document.getElementById('volOut') as HTMLElement).textContent = volCm3.toFixed(2);
  new CostCard(document.getElementById('costFdm') as HTMLElement).value = costs.fdm.toFixed(2) + ' ₽';
  new CostCard(document.getElementById('costDlp') as HTMLElement).value = costs.dlp.toFixed(2) + ' ₽';
  (document.getElementById('results') as HTMLElement).style.display = '';

  const canvas = document.getElementById('previewCanvas') as HTMLCanvasElement;
  const width = canvas.parentElement!.clientWidth;
  canvas.width = width;
  canvas.height = width * 0.75;

  // Создаём сцену Three.js для предварительного просмотра модели
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf8f9fa);
  const camera = new THREE.PerspectiveCamera(45, width / (width * 0.75), 1, 10000);
  camera.position.set(0, 0, Math.max(...scaledSize.toArray()) * 2);
  const light = new THREE.DirectionalLight(0xffffff, 1);
  const controls = new OrbitControls(camera, canvas);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x888888));
  const mesh = new THREE.Mesh(geom.clone(), new THREE.MeshStandardMaterial({ color: 0x999999 }));
  mesh.scale.set(scale, scale, scale);
  scene.add(mesh);
  function animate() {
    (controls as any).update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}

// Обработчик кнопки "Рассчитать"
(document.getElementById('calcBtn') as HTMLButtonElement).addEventListener('click', async () => {
  // Загружаем геометрию и запускаем расчёт
  const geom = await loadFromInput();
  if (!geom) {
    showAlert('Выберите файл или URL');
    return;
  }
  await runCalc(geom);
});
