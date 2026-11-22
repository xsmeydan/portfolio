import { useEffect, useRef } from 'react';

const THREE_SRC = 'https://ajax.googleapis.com/ajax/libs/threejs/r125/three.min.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    THREE?: any;
  }
}

let threeLoader: Promise<any> | null = null;

// Load Three.js once and share it between mounts
function loadThree(): Promise<any> {
  if (window.THREE) return Promise.resolve(window.THREE);
  if (threeLoader) return threeLoader;

  threeLoader = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = THREE_SRC;
    script.async = true;
    script.onload = () => resolve(window.THREE);
    script.onerror = () => {
      threeLoader = null;
      reject(new Error('Failed to load Three.js'));
    };
    document.head.appendChild(script);
  });

  return threeLoader;
}

function initThreeJS(container: HTMLDivElement, THREE: any): () => void {
  const isSmallScreen = window.innerWidth < 768;
  const scene = new THREE.Scene();
  const containerWidth = container.clientWidth || window.innerWidth;
  const containerHeight = container.clientHeight || window.innerHeight;
  const camera = new THREE.PerspectiveCamera(75, containerWidth / containerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isSmallScreen });

  renderer.setSize(containerWidth, containerHeight);
  // High-DPR phones would otherwise render 9x the pixels
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmallScreen ? 1.5 : 2));
  container.appendChild(renderer.domElement);

  // AI & System Design Theme: A "Brain" or "Neural Network" of interconnected spheres
  const group = new THREE.Group();
  scene.add(group);

  const particleCount = isSmallScreen ? 24 : 40;
  const spheres: any[] = [];
  const sphereGeometry = new THREE.SphereGeometry(0.08, 16, 16);
  const sphereMaterial = new THREE.MeshPhongMaterial({
    color: 0x4f46e5,
    emissive: 0x4f46e5,
    emissiveIntensity: 0.5,
    shininess: 100,
  });

  for (let i = 0; i < particleCount; i++) {
    const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    mesh.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    );
    mesh.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.01
    );
    spheres.push(mesh);
    group.add(mesh);
  }

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  const pointLight = new THREE.PointLight(0x818cf8, 2);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  const blueLight = new THREE.PointLight(0x3b82f6, 2);
  blueLight.position.set(-5, -5, 2);
  scene.add(blueLight);

  camera.position.z = 8;

  let rafId = 0;
  let isOnScreen = true;

  function animate() {
    rafId = requestAnimationFrame(animate);
    if (!isOnScreen) return;

    group.rotation.y += 0.002;
    group.rotation.x += 0.001;

    spheres.forEach((s: any) => {
      s.position.add(s.velocity);
      if (Math.abs(s.position.x) > 5) s.velocity.x *= -1;
      if (Math.abs(s.position.y) > 5) s.velocity.y *= -1;
      if (Math.abs(s.position.z) > 5) s.velocity.z *= -1;
    });

    renderer.render(scene, camera);
  }

  // Pause rendering while the section is off screen
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    isOnScreen = entry.isIntersecting;
  });
  visibilityObserver.observe(container);

  const handleResize = () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };

  window.addEventListener('resize', handleResize);
  animate();

  return () => {
    cancelAnimationFrame(rafId);
    visibilityObserver.disconnect();
    window.removeEventListener('resize', handleResize);
    sphereGeometry.dispose();
    sphereMaterial.dispose();
    renderer.dispose();
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
  };
}

export default function AboutThreeJS() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    loadThree()
      .then((THREE) => {
        if (!cancelled && THREE) cleanup = initThreeJS(container, THREE);
      })
      .catch(() => {
        // Decorative only: ignore load failures
      });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      aria-hidden="true"
    />
  );
}
