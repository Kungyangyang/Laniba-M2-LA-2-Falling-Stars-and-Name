//Christian C. Laniba - A224
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  10,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
let textMesh = null;
let stars, starGeo;
let starMaterial;
let colorChangeTime = 0;
let currentColorIndex = 0;

const starColors = [
  0xffb6c1, // original
  0xffffff, // White
  0xff0000, // Red
  0xfffc00, // Yellow
  0x00ffff, // Cyan
  0x009400, // Green
  0xffa500, // Orange
  0xa800ff  // Purple
];

lighting();
createText();
particles();

function particles() {
  const points = [];

  for (let i = 0; i < 6000; i++) {
    let star = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    points.push(star);
  }

  starGeo = new THREE.BufferGeometry().setFromPoints(points);

  let sprite = new THREE.TextureLoader().load("assets/images/star.png");
  starMaterial = new THREE.PointsMaterial({
    color: starColors[currentColorIndex],
    size: 0.7,
    map: sprite,
  });

  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);
}

function animateParticles() {
  const positions = starGeo.attributes.position.array;
  
  for (let i = 1; i < positions.length; i += 3) {
    positions[i] -= 0.9;
    
    if (positions[i] < -300) {
      positions[i] = 300;
    }
  }
  
  starGeo.attributes.position.needsUpdate = true;
}

function updateStarColor() {
  currentColorIndex = (currentColorIndex + 1) % starColors.length;
  starMaterial.color.setHex(starColors[currentColorIndex]);
}

function createText() {
  const fontLoader = new THREE.FontLoader();
  fontLoader.load('assets/fonts/roboto_regular.json', function(font) {
    const textGeometry = new THREE.TextGeometry('Christian Laniba', {
      font: font,
      size: 2.5,
      height: 0.5,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5
    });

    textGeometry.computeBoundingBox();
    const boundingBox = textGeometry.boundingBox;
    const centerX = (boundingBox.max.x + boundingBox.min.x) / 2;
    const centerY = (boundingBox.max.y + boundingBox.min.y) / 2;
    textGeometry.translate(-centerX, -centerY, 0);

    const textMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: 0xffffff,
      shininess: 100
    });

    textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.z = -10;
    camera.position.z = 20;
    scene.add(textMesh);
    
  }, undefined, function(error) {
    console.error('Error loading font:', error);
    const geometry = new THREE.BoxGeometry(8, 2, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    textMesh = new THREE.Mesh(geometry, material);
    textMesh.position.z = -10;
    scene.add(textMesh);
  });
}

function lighting() {
  const light = new THREE.HemisphereLight(0x780a44, 0x1c3020, 1);
  scene.add(light);

  const spotLight = new THREE.SpotLight(0xffffff, 1.5);
  spotLight.position.set(0, 0, 20);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 0.5;
  spotLight.shadow.camera.far = 50;
  spotLight.shadow.camera.fov = 30;
  scene.add(spotLight);

  const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
  scene.add(ambientLight);
}

function animate() {
  requestAnimationFrame(animate);
  
  if (starGeo) {
    animateParticles();
  }

  colorChangeTime += 16;
  
  // 3-seconds color change
  if (colorChangeTime >= 3000) {
    updateStarColor();
    colorChangeTime = 0;
  }

    textMesh.rotation.x += 0.008;
    textMesh.rotation.y += 0.008;
  renderer.render(scene, camera);
}

animate();