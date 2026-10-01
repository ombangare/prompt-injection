import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function CyberBiometricScanner3D({ clearanceProgress = 0 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 320;
    const height = mount.clientHeight || 240;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    const scannerGroup = new THREE.Group();
    scene.add(scannerGroup);

    // 1. Generate Biometric Fingerprint / Cyber Handprint Contour Lattice
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Draw high-tech biometric fingerprint ridges
    ctx.strokeStyle = '#ff2222';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 8;

    const cx = 256, cy = 256;
    for (let r = 20; r < 210; r += 16) {
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 2; a += 0.08) {
        // Organic fingerprint whorl waves
        const wave = Math.sin(a * 7 + r * 0.1) * 6 + Math.cos(a * 3) * 4;
        const rad = r + wave;
        const x = cx + Math.cos(a) * rad * 0.85;
        const y = cy + Math.sin(a) * rad * 1.1;
        if (a === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Reticle brackets & corner HUD markers
    ctx.strokeStyle = '#ff4444';
    ctx.lineWidth = 4;
    // Corners
    ctx.strokeRect(30, 30, 60, 60);
    ctx.strokeRect(422, 30, 60, 60);
    ctx.strokeRect(30, 422, 60, 60);
    ctx.strokeRect(422, 422, 60, 60);

    const printTexture = new THREE.CanvasTexture(canvas);
    const printGeo = new THREE.PlaneGeometry(2.4, 2.4);
    const printMat = new THREE.MeshBasicMaterial({
      map: printTexture,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    });
    const printMesh = new THREE.Mesh(printGeo, printMat);
    scannerGroup.add(printMesh);

    // 2. 3D Laser Scanning Sweep Plane
    const laserGeo = new THREE.PlaneGeometry(2.8, 0.06);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0xff1f1f,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95
    });
    const laser = new THREE.Mesh(laserGeo, laserMat);
    scannerGroup.add(laser);

    // Laser glow halo
    const laserHaloGeo = new THREE.PlaneGeometry(2.8, 0.35);
    const laserHaloMat = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    const laserHalo = new THREE.Mesh(laserHaloGeo, laserHaloMat);
    scannerGroup.add(laserHalo);

    // 3. Biometric Verification Node Points (Nodal Dots)
    const nodeCount = 36;
    const nodeGeo = new THREE.BufferGeometry();
    const nodePos = new Float32Array(nodeCount * 3);
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 0.4 + (i % 4) * 0.22;
      nodePos[i * 3] = Math.cos(angle) * radius * 0.9;
      nodePos[i * 3 + 1] = Math.sin(angle) * radius * 1.1;
      nodePos[i * 3 + 2] = 0.04;
    }
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3));
    const nodeMat = new THREE.PointsMaterial({
      size: 0.06,
      color: 0xff4444,
      transparent: true,
      opacity: 0.9
    });
    const nodes = new THREE.Points(nodeGeo, nodeMat);
    scannerGroup.add(nodes);

    // 4. Subtle Outer Bounding Grid Lines
    const gridHelper = new THREE.GridHelper(2.6, 8, 0xff2222, 0x330000);
    gridHelper.rotation.x = Math.PI / 2;
    gridHelper.position.z = -0.05;
    scannerGroup.add(gridHelper);

    // Lighting
    const pointLight = new THREE.PointLight(0xff1f1f, 3.5, 8);
    pointLight.position.set(0, 0, 1.8);
    scene.add(pointLight);

    let clock = new THREE.Clock();
    let frameId;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Laser sweep motion
      const sweepY = Math.sin(time * 2.8) * 1.1;
      laser.position.y = sweepY;
      laserHalo.position.y = sweepY;

      // React to clearance progress
      const isAuthorized = clearanceProgress >= 80;
      const targetColor = isAuthorized ? 0x19ff6e : (clearanceProgress > 30 ? 0xffaa00 : 0xff1f1f);

      laserMat.color.setHex(targetColor);
      laserHaloMat.color.setHex(targetColor);
      nodeMat.color.setHex(targetColor);
      pointLight.color.setHex(targetColor);

      // Gentle interactive tilt
      scannerGroup.rotation.y = Math.sin(time * 0.7) * 0.08;
      scannerGroup.rotation.x = Math.cos(time * 0.5) * 0.06;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      mount.innerHTML = '';
      renderer.dispose();
    };
  }, [clearanceProgress]);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '240px',
        position: 'relative',
        borderRadius: '8px',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 50%, rgba(30, 4, 4, 0.45) 0%, rgba(4, 4, 5, 0.9) 100%)',
        border: '1px solid var(--line-blood)'
      }}
    />
  );
}
