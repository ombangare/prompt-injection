// =========================================================
// CINEMATIC 3D HORROR AI ENTITY — THREE.JS ENGINE
// Full 3D Articulated Demon Cyber-Skull Model
// Mouth Articulation, Saccadic Eyes, Real-time Speech Sync
// =========================================================

(function () {
  const mount = document.getElementById('three-bg');
  if (!mount || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x040405, 0.035);

  const camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 7.5);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.7;
  mount.innerHTML = '';
  mount.appendChild(renderer.domElement);

  // 3D LIGHTING RIG
  const ambient = new THREE.AmbientLight(0x280505, 1.4);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xff4444, 4.2);
  keyLight.position.set(2.5, 4.5, 5.0);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x667799, 1.8);
  fillLight.position.set(-3.5, 2.0, 3.5);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(0x19ff6e, 4.5, 25);
  rimLight.position.set(-4.5, -2.5, 3.5);
  scene.add(rimLight);

  const leftEyeLight = new THREE.PointLight(0xff1100, 9, 10);
  const rightEyeLight = new THREE.PointLight(0xff1100, 9, 10);
  scene.add(leftEyeLight);
  scene.add(rightEyeLight);

  const root = new THREE.Group();
  scene.add(root);

  // ==========================================
  // TRUE 3D ARTICULATED DEMON CYBER-SKULL MODEL
  // ==========================================
  const skullRoot = new THREE.Group();

  const darkObsidianMat = new THREE.MeshStandardMaterial({
    color: 0x14161c,
    metalness: 0.92,
    roughness: 0.22,
    flatShading: true
  });

  const cyberArmorMat = new THREE.MeshStandardMaterial({
    color: 0x2e3340,
    metalness: 0.88,
    roughness: 0.28,
    flatShading: true
  });

  const chromeFangMat = new THREE.MeshStandardMaterial({
    color: 0xe8e8e8,
    metalness: 0.95,
    roughness: 0.12
  });

  const glowingRuneWireMat = new THREE.MeshBasicMaterial({
    color: 0xff2020,
    wireframe: true,
    transparent: true,
    opacity: 0.75
  });

  const lavaCoreMat = new THREE.MeshBasicMaterial({ color: 0xff2600 });
  const ocularPupilMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const deepVoidMat = new THREE.MeshBasicMaterial({ color: 0x020204 });

  // 1. CRANIUM & MULTI-SEGMENT ARMOR DOME
  const craniumGeo = new THREE.SphereGeometry(1.68, 28, 22);
  const craniumPos = craniumGeo.attributes.position;
  for (let i = 0; i < craniumPos.count; i++) {
    let x = craniumPos.getX(i);
    let y = craniumPos.getY(i);
    let z = craniumPos.getZ(i);
    x *= 0.92;
    if (z < 0) z *= 1.2;
    if (y < 0) y *= 0.86;
    craniumPos.setXYZ(i, x, y, z);
  }
  craniumGeo.computeVertexNormals();

  const craniumMesh = new THREE.Mesh(craniumGeo, darkObsidianMat);
  craniumMesh.position.set(0, 0.45, -0.1);
  skullRoot.add(craniumMesh);

  const craniumCircuits = new THREE.Mesh(craniumGeo, glowingRuneWireMat);
  craniumCircuits.scale.set(1.02, 1.02, 1.02);
  craniumCircuits.position.copy(craniumMesh.position);
  skullRoot.add(craniumCircuits);

  // Forehead Center Cyber Rune Plate (ΣΧΘ)
  const foreheadPlate = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.15), cyberArmorMat);
  foreheadPlate.position.set(0, 0.95, 1.32);
  foreheadPlate.rotation.x = -0.32;
  skullRoot.add(foreheadPlate);

  // 2. DEMONIC HORNS
  const hornGroup = new THREE.Group();
  for (let side of [-1, 1]) {
    const mainHorn = new THREE.Group();
    for (let s = 0; s < 6; s++) {
      const radius = 0.32 - s * 0.048;
      const segGeo = new THREE.ConeGeometry(radius, 0.52, 8);
      const seg = new THREE.Mesh(segGeo, cyberArmorMat);
      seg.position.set(0, s * 0.4, -s * 0.1);
      seg.rotation.x = -s * 0.14;
      seg.rotation.z = side * s * 0.09;
      mainHorn.add(seg);
    }
    mainHorn.position.set(side * 1.05, 1.25, 0.12);
    mainHorn.rotation.set(-0.38, 0, -side * 0.42);
    hornGroup.add(mainHorn);

    const subSpike = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.65, 6), darkObsidianMat);
    subSpike.position.set(side * 1.45, 0.7, 0.3);
    subSpike.rotation.set(-0.2, 0, -side * 0.95);
    hornGroup.add(subSpike);
  }
  skullRoot.add(hornGroup);

  // 3. ANGULAR BROW RIDGE
  const browGeo = new THREE.BoxGeometry(1.68, 0.42, 0.7);
  const brow = new THREE.Mesh(browGeo, cyberArmorMat);
  brow.position.set(0, 0.64, 0.98);
  brow.rotation.x = -0.16;
  skullRoot.add(brow);

  // 4. DEEP EYE SOCKETS & TRACKING OCULARS
  const socketGeo = new THREE.SphereGeometry(0.46, 16, 16);
  const leftSocket = new THREE.Mesh(socketGeo, deepVoidMat);
  leftSocket.position.set(-0.54, 0.35, 0.94);
  skullRoot.add(leftSocket);

  const rightSocket = new THREE.Mesh(socketGeo, deepVoidMat);
  rightSocket.position.set(0.54, 0.35, 0.94);
  skullRoot.add(rightSocket);

  const eyeGroup = new THREE.Group();
  const eyeOrbGeo = new THREE.SphereGeometry(0.2, 18, 18);
  const pupilGeo = new THREE.SphereGeometry(0.07, 10, 10);

  const leftEye = new THREE.Mesh(eyeOrbGeo, lavaCoreMat);
  leftEye.position.set(-0.54, 0.35, 1.22);
  const leftPupil = new THREE.Mesh(pupilGeo, ocularPupilMat);
  leftPupil.position.set(0, 0, 0.16);
  leftEye.add(leftPupil);
  eyeGroup.add(leftEye);

  const rightEye = new THREE.Mesh(eyeOrbGeo, lavaCoreMat);
  rightEye.position.set(0.54, 0.35, 1.22);
  const rightPupil = new THREE.Mesh(pupilGeo, ocularPupilMat);
  rightPupil.position.set(0, 0, 0.16);
  rightEye.add(rightPupil);
  eyeGroup.add(rightEye);

  skullRoot.add(eyeGroup);

  // 5. NOSE & CHEEKBONES
  const noseGeo = new THREE.ConeGeometry(0.24, 0.52, 3);
  const nose = new THREE.Mesh(noseGeo, deepVoidMat);
  nose.rotation.x = Math.PI;
  nose.position.set(0, -0.06, 1.18);
  skullRoot.add(nose);

  const cheekGeo = new THREE.BoxGeometry(0.52, 0.42, 0.8);
  for (let side of [-1, 1]) {
    const cheek = new THREE.Mesh(cheekGeo, darkObsidianMat);
    cheek.position.set(side * 0.82, 0.08, 0.78);
    cheek.rotation.set(0.22, side * 0.34, -side * 0.16);
    skullRoot.add(cheek);
  }

  // 6. UPPER MAXILLA & FANGS
  const maxillaGeo = new THREE.BoxGeometry(1.08, 0.4, 0.65);
  const maxilla = new THREE.Mesh(maxillaGeo, darkObsidianMat);
  maxilla.position.set(0, -0.36, 0.98);
  skullRoot.add(maxilla);

  const fangGeo = new THREE.ConeGeometry(0.09, 0.32, 5);
  for (let i = -3; i <= 3; i++) {
    if (i === 0) continue;
    const fang = new THREE.Mesh(fangGeo, chromeFangMat);
    fang.rotation.x = Math.PI;
    const isCanine = Math.abs(i) === 2;
    fang.scale.set(isCanine ? 1.5 : 1.0, isCanine ? 1.8 : 1.1, isCanine ? 1.5 : 1.0);
    fang.position.set(i * 0.14 - Math.sign(i) * 0.04, -0.58, 1.15 - Math.abs(i) * 0.05);
    skullRoot.add(fang);
  }

  // 7. ARTICULATED MANDIBLE
  const mandible = new THREE.Group();
  const jawMesh = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.38, 0.85), darkObsidianMat);
  jawMesh.position.set(0, -0.22, 0.22);
  mandible.add(jawMesh);

  const chin = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.58, 4), cyberArmorMat);
  chin.rotation.x = Math.PI * 0.82;
  chin.position.set(0, -0.28, 0.72);
  mandible.add(chin);

  for (let i = -3; i <= 3; i++) {
    if (i === 0) continue;
    const fang = new THREE.Mesh(fangGeo, chromeFangMat);
    const isCanine = Math.abs(i) === 2;
    fang.scale.set(isCanine ? 1.4 : 0.95, isCanine ? 1.6 : 1.0, isCanine ? 1.4 : 0.95);
    fang.position.set(i * 0.13 - Math.sign(i) * 0.04, -0.02, 0.6 - Math.abs(i) * 0.05);
    mandible.add(fang);
  }

  mandible.position.set(0, -0.7, 0.48);
  skullRoot.add(mandible);

  // 8. CERVICAL SPINE & CONDUITS
  const spineGroup = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const vert = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.42, 0.26, 8), darkObsidianMat);
    vert.position.set(0, -1.15 - i * 0.3, -0.18 - i * 0.06);
    spineGroup.add(vert);
  }
  for (let side of [-1, 1]) {
    for (let j = 0; j < 4; j++) {
      const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 2.0, 7), darkObsidianMat);
      cable.position.set(side * (0.48 + j * 0.22), -1.25, -0.1 + j * 0.12);
      cable.rotation.z = side * (0.22 + j * 0.1);
      cable.rotation.x = j * 0.16;
      spineGroup.add(cable);
    }
  }
  skullRoot.add(spineGroup);

  skullRoot.position.set(2.4, 0.1, -0.8);
  root.add(skullRoot);

  // 9. EMBER PARTICLES
  const pCount = window.innerWidth < 768 ? 350 : 800;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(pCount * 3);
  const pCol = new Float32Array(pCount * 3);
  const colRed = new THREE.Color(0xff2222);
  const colGreen = new THREE.Color(0x19ff6e);
  const colBlood = new THREE.Color(0x770011);

  for (let i = 0; i < pCount; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 24;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 18;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 16 - 2;

    const r = Math.random();
    const c = r < 0.72 ? colRed : (r < 0.88 ? colBlood : colGreen);
    pCol[i * 3] = c.r;
    pCol[i * 3 + 1] = c.g;
    pCol[i * 3 + 2] = c.b;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
  const points = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 0.048, vertexColors: true, transparent: true, opacity: 0.85 }));
  scene.add(points);

  // ANIMATION LOOP
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  let glitchPower = 0;
  let saccadeTargetX = 0, saccadeTargetY = 0, nextSaccadeTime = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.trigger3DGlitch = (power = 1.0) => {
    glitchPower = Math.min(glitchPower + power, 4.0);
  };

  window.addEventListener('click', () => window.trigger3DGlitch(0.9));
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

    targetX += (mouseX * 0.9 - targetX) * 0.05;
    targetY += (-mouseY * 0.7 - targetY) * 0.05;
    camera.position.x = targetX;
    camera.position.y = targetY;
    camera.lookAt(0, 0, 0);

    const isMobile = window.innerWidth < 900;
    const targetSkullX = isMobile ? 0 : (2.4 - scrollProgress * 3.6);
    const targetSkullY = isMobile ? (0.8 - scrollProgress * 1.2) : (0.1 - scrollProgress * 0.4);
    const targetSkullZ = isMobile ? -2.2 : (-0.8 + scrollProgress * 1.8);
    const targetScale = (isMobile ? 0.75 : 1.05) * (1 + scrollProgress * 0.55);

    skullRoot.position.x += (targetSkullX - skullRoot.position.x) * 0.06;
    skullRoot.position.y += (targetSkullY - skullRoot.position.y) * 0.06;
    skullRoot.position.z += (targetSkullZ - skullRoot.position.z) * 0.06;

    const breathing = Math.sin(time * 3.2) * 0.035 + Math.sin(time * 6.4) * 0.015;
    skullRoot.scale.setScalar(targetScale * (1 + breathing));

    const targetRotY = mouseX * 0.78 + (scrollProgress - 0.5) * 0.5;
    const targetRotX = -mouseY * 0.58 + scrollProgress * 0.3;
    skullRoot.rotation.y += (targetRotY - skullRoot.rotation.y) * 0.07;
    skullRoot.rotation.x += (targetRotX - skullRoot.rotation.x) * 0.07;
    skullRoot.rotation.z = Math.sin(time * 1.5) * 0.035 + mouseX * 0.08;

    // Talking jaw
    if (window.skullSpeaking) {
      const speechOpen = (window.skullSpeechIntensity || 0.6) * 0.4 + Math.sin(time * 32) * 0.12;
      mandible.position.y = -0.7 - Math.max(0, speechOpen);
      mandible.rotation.x = Math.max(0, speechOpen) * 0.95;
    } else {
      mandible.position.y = -0.7 + Math.sin(time * 3) * 0.025;
      mandible.rotation.x = Math.sin(time * 3) * 0.035;
    }

    // Saccadic eyes
    if (time > nextSaccadeTime) {
      saccadeTargetX = mouseX + (Math.random() - 0.5) * 0.6;
      saccadeTargetY = mouseY + (Math.random() - 0.5) * 0.4;
      nextSaccadeTime = time + 0.6 + Math.random() * 1.2;
    }
    const pupilOffsetX = (saccadeTargetX * 0.04);
    const pupilOffsetY = (-saccadeTargetY * 0.03);
    leftPupil.position.set(pupilOffsetX, pupilOffsetY, 0.16);
    rightPupil.position.set(pupilOffsetX, pupilOffsetY, 0.16);

    leftEyeLight.position.set(skullRoot.position.x - 0.54, skullRoot.position.y + 0.35, skullRoot.position.z + 1.25);
    rightEyeLight.position.set(skullRoot.position.x + 0.54, skullRoot.position.y + 0.35, skullRoot.position.z + 1.25);

    const eyePulse = Math.sin(time * 12) > 0.4 ? 1.35 : 0.85;
    leftEyeLight.intensity = (window.skullSpeaking ? 14 : 8) * eyePulse;
    rightEyeLight.intensity = (window.skullSpeaking ? 14 : 8) * eyePulse;

    points.rotation.y = time * 0.025;

    if (glitchPower > 0.01) {
      root.position.set((Math.random() - 0.5) * glitchPower * 0.35, (Math.random() - 0.5) * glitchPower * 0.35, 0);
      glitchPower *= 0.91;
    } else {
      root.position.set(0, 0, 0);
      glitchPower = 0;
    }

    renderer.render(scene, camera);
  }

  animate();
})();
