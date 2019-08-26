const THREE = require("three");
const fs = require("fs");
const util = require("./util.js");
const FPSCounter = require("three-fps-counter")(THREE);

let camera,
  renderer,
  fpsCounter,
  scene,
  car,
  coin,
  coinBox,
  carBox,
  ground,
  groundBox;

const wheels = [];

const initialCameraPosition = new THREE.Vector3(-100, 100, -100);

function initAnimation() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0xa0d9fe);
  renderer.setSize(window.innerWidth, window.innerHeight, true);
  renderer.setPixelRatio(window.devicePixelRatio || 1);

  const ratio =
    renderer.getContext().drawingBufferWidth /
    renderer.getContext().drawingBufferHeight;

  scene = new THREE.Scene();

  const height = 50;
  const width = ratio * height;
  camera = new THREE.OrthographicCamera(
    width / -2,
    width / 2,
    height / 2,
    height / -2,
    0.1,
    1000,
  );
  camera.position.copy(initialCameraPosition);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  document.body.appendChild(renderer.domElement);

  ground = makeGround();
  ground.position.y = 1;
  scene.add(ground);
  groundBox = new THREE.Box3().setFromObject(ground);

  car = makeCar();
  car.position.set(0, 3.4, 0);
  scene.add(car);

  coin = makeCoin();
  coin.position.set(10, 3, 10);
  scene.add(coin);

  const light = new THREE.DirectionalLight(0xffffff, 1.0);
  light.position.set(-1, 2.5, -2);
  scene.add(light);

  fpsCounter = new FPSCounter(renderer);
}

const coinGeometry = new THREE.CylinderGeometry(1, 1, 0.3, 16);

function makeCoin() {
  const texture = THREE.ImageUtils.loadTexture("orthographic-car/RR_logo.png");
  const coin = new THREE.Mesh(
    coinGeometry,
    new THREE.MeshBasicMaterial({ map: texture }),
  );
  coin.rotation.z = Math.PI / 2;
  return coin;
}

function makeCar() {
  const car = new THREE.Mesh(
    new THREE.BoxGeometry(2, 1.5, 4),
    new THREE.MeshLambertMaterial({ color: 0xd1d1d1 }),
  );

  wheels.push(makeWheel(-WHEEL_WIDTH - 1, -1, -1.5));
  wheels.push(makeWheel(WHEEL_WIDTH + 1, -1, -1.5));
  wheels.push(makeWheel(WHEEL_WIDTH + 1, -1, 1.5));
  wheels.push(makeWheel(-WHEEL_WIDTH - 1, -1, 1.5));

  const group = new THREE.Group();
  group.add(car);
  for (wheel of wheels) {
    group.add(wheel);
  }

  util.addKeyListeners(group);

  return group;
}

const WHEEL_WIDTH = 0.2;
const wheelGeometry = new THREE.CylinderGeometry(1, 1, WHEEL_WIDTH, 8);

function makeWheel(x, y, z) {
  const wheel = new THREE.Mesh(
    wheelGeometry,
    new THREE.MeshLambertMaterial({ color: 0xeeeeee }),
  );
  wheel.rotation.z = Math.PI / 2;
  wheel.position.set(x, y, z);
  util.addKeyListeners(wheel);
  return wheel;
}

function makeGround() {
  const ground = new THREE.Mesh(
    new THREE.BoxGeometry(100, 1, 100),
    new THREE.MeshLambertMaterial({ color: 0xffffff }),
  );
  return ground;
}

function spinWheels(direction) {
  for (wheel of wheels) {
    wheel.rotation.x = wheel.rotation.x + Math.PI * 0.02 * direction;
  }
}

function moveCar() {
  const direction = new THREE.Vector3();
  car.getWorldDirection(direction);

  function rotate(car) {
    if (car.right) {
      car.rotation.y = car.rotation.y - Math.PI * 0.01;
    } else if (car.left) {
      car.rotation.y = car.rotation.y + Math.PI * 0.01;
    }
  }

  if (car.up) {
    car.position.x = car.position.x + direction.x * 0.2;
    car.position.y = car.position.y + direction.y * 0.2;
    car.position.z = car.position.z + direction.z * 0.2;
    spinWheels(1);
    rotate(car);
  } else if (car.down) {
    car.position.x = car.position.x - direction.x * 0.2;
    car.position.y = car.position.y - direction.y * 0.2;
    car.position.z = car.position.z - direction.z * 0.2;
    rotate(car);
    spinWheels(-1);
  }
}

function moveCamera() {
  camera.lookAt(car.position);
}

function rotateCoins() {
  coin.rotation.y = coin.rotation.y + Math.PI * 0.01;
}

function checkIntersections() {
  carBox = new THREE.Box3().setFromObject(car);
  if (!carBox.intersectsBox(groundBox)) {
    console.log("OUTSIDE!");
    car.position.y = car.position.y - 1;
    camera.position.y = camera.position.y - 1;
  }

  if (coin.visible) {
    coinBox = new THREE.Box3().setFromObject(coin);
    if (carBox.intersectsBox(coinBox)) {
      console.log("CASH MONITAS");
      coin.visible = false;
    }
  }
}

function animate() {
  requestAnimationFrame(animate);

  moveCar();
  moveCamera();
  rotateCoins();
  checkIntersections();

  renderer.render(scene, camera);
  fpsCounter.render();
}

initAnimation();
animate();
