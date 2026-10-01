import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeSkullScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040405, 0.04);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    // Ambient Lighting & Cyber Atmospheric Rim
    const ambient = new THREE.AmbientLight(0x220505, 1.2);
    scene.add(ambient);

    const redRim = new THREE.PointLight(0xff1818, 4, 25);
    redRim.position.set(4, 2, 4);
    scene.add(redRim);

    const greenRim = new THREE.PointLight(0x19ff6e, 3, 20);
    greenRim.position.set(-4, -2, 3);
    scene.add(greenRim);

    // Floating Atmospheric Ember Storm
    const pCount = window.innerWidth < 768 ? 300 : 700;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pCol = new Float32Array(pCount * 3);

    const colRed = new THREE.Color(0xff2222);
    const colGreen = new THREE.Color(0x19ff6e);
    const colBlood = new THREE.Color(0x660011);

    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 26;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 16 - 2;

      const r = Math.random();
      const c = r < 0.7 ? colRed : (r < 0.88 ? colBlood : colGreen);
      pCol[i * 3] = c.r;
      pCol[i * 3 + 1] = c.g;
      pCol[i * 3 + 2] = c.b;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
    const points = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({ size: 0.045, vertexColors: true, transparent: true, opacity: 0.8 })
    );
    scene.add(points);

    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    let glitchPower = 0;

    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    window.trigger3DGlitch = (power = 1.0) => {
      glitchPower = Math.min(glitchPower + power, 3.5);
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    let clock = new THREE.Clock();
    let frameId;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      targetX += (mouseX * 0.7 - targetX) * 0.04;
      targetY += (-mouseY * 0.5 - targetY) * 0.04;
      camera.position.x = targetX;
      camera.position.y = targetY;
      camera.lookAt(0, 0, 0);

      points.rotation.y = time * 0.02;
      points.rotation.x = Math.sin(time * 0.01) * 0.03;

      if (glitchPower > 0.01) {
        scene.position.set(
          (Math.random() - 0.5) * glitchPower * 0.3,
          (Math.random() - 0.5) * glitchPower * 0.3,
          0
        );
        glitchPower *= 0.92;
      } else {
        scene.position.set(0, 0, 0);
        glitchPower = 0;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      mount.innerHTML = '';
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} id="three-bg" style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }} />;
}
