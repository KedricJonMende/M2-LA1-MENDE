import * as THREE from "three";

/* ------------------------------------------------------------------
   Fixed 800x800 stage. The orthographic camera maps world units
   1-to-1 with pixels, with the origin at the center of the screen —
   so position (0,0,0) really is the middle of the canvas.
------------------------------------------------------------------- */
const SIZE = 800;
const HALF = SIZE / 2; // 400 — the screen bound on each axis

const stage = document.getElementById("stage");
const hud = document.getElementById("hud");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0e0e0e);

const camera = new THREE.OrthographicCamera(-HALF, HALF, HALF, -HALF, 0.1, 10);
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(SIZE, SIZE);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
stage.appendChild(renderer.domElement);

const BASE_WIDTH = 120;
const BASE_HEIGHT = 70;

const COLORS = [
  0xff2b4d, 
  0x2bb3ff, 
  0x3ddc84, 
  0xffd400, 
  0xff8a00, 
  0xb06bff, 
  0x2be8c9, 
  0xffffff, 
];
let colorIndex = 0;

const geometry = new THREE.PlaneGeometry(BASE_WIDTH, BASE_HEIGHT);
const material = new THREE.MeshBasicMaterial({ color: COLORS[colorIndex] });
const plane = new THREE.Mesh(geometry, material);
plane.position.set(0, 0, 0); 
scene.add(plane);

const velocity = new THREE.Vector2(220, 170);

const SHRINK_FACTOR = 0.5; 
let scale = 1;
let bounceCount = 0;

function onBounce() {
  bounceCount += 1;
  scale *= SHRINK_FACTOR;
  plane.scale.set(scale, scale, 1);

  colorIndex = (colorIndex + 1) % COLORS.length;
  material.color.setHex(COLORS[colorIndex]);

  const pixelSize = Math.round(Math.max(BASE_WIDTH, BASE_HEIGHT) * scale);
  hud.textContent =
    pixelSize < 2
      ? `Bounces: ${bounceCount} — too small to see now`
      : `Bounces: ${bounceCount} — size: ${pixelSize}px`;
}


const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  plane.position.x += velocity.x * delta;
  plane.position.y += velocity.y * delta;

  const halfW = (BASE_WIDTH / 2) * scale;
  const halfH = (BASE_HEIGHT / 2) * scale;


  if (plane.position.x + halfW > HALF) {
    plane.position.x = HALF - halfW;
    velocity.x *= -1;
    onBounce();
  } else if (plane.position.x - halfW < -HALF) {
    plane.position.x = -HALF + halfW;
    velocity.x *= -1;
    onBounce();
  }

  if (plane.position.y + halfH > HALF) {
    plane.position.y = HALF - halfH;
    velocity.y *= -1;
    onBounce();
  } else if (plane.position.y - halfH < -HALF) {
    plane.position.y = -HALF + halfH;
    velocity.y *= -1;
    onBounce();
  }

  renderer.render(scene, camera);
}

animate();