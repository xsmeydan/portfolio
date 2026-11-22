import {
  AmbientLight,
  Group,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';

/**
 * Floating "neural network" particles behind the experience robot.
 * Lives in its own module so it is code-split and only downloaded on demand.
 * Returns a cleanup function.
 */
export function mountNetworkScene(container: HTMLDivElement): () => void {
  const scene = new Scene();
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;
  const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
  const renderer = new WebGLRenderer({ alpha: true, antialias: true });

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const group = new Group();
  scene.add(group);

  const particleCount = 40;
  const spheres: { mesh: Mesh; velocity: Vector3 }[] = [];
  const geometry = new SphereGeometry(0.08, 16, 16);
  const material = new MeshPhongMaterial({
    color: 0x4f46e5,
    emissive: 0x4f46e5,
    emissiveIntensity: 0.5,
    shininess: 100,
  });

  for (let i = 0; i < particleCount; i++) {
    const mesh = new Mesh(geometry, material);
    mesh.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
    );
    const velocity = new Vector3(
      (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.01,
    );
    spheres.push({ mesh, velocity });
    group.add(mesh);
  }

  // Since r155 lights use physical units; multiply by PI and disable distance
  // decay to keep the look of the original (r125) scene.
  scene.add(new AmbientLight(0xffffff, 0.5 * Math.PI));

  const pointLight = new PointLight(0x818cf8, 2 * Math.PI, 0, 0);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  const blueLight = new PointLight(0x3b82f6, 2 * Math.PI, 0, 0);
  blueLight.position.set(-5, -5, 2);
  scene.add(blueLight);

  camera.position.z = 8;

  let rafId = 0;
  let isOnScreen = true;

  const animate = () => {
    rafId = requestAnimationFrame(animate);
    if (!isOnScreen) return;

    group.rotation.y += 0.002;
    group.rotation.x += 0.001;

    for (const { mesh, velocity } of spheres) {
      mesh.position.add(velocity);
      if (Math.abs(mesh.position.x) > 5) velocity.x *= -1;
      if (Math.abs(mesh.position.y) > 5) velocity.y *= -1;
      if (Math.abs(mesh.position.z) > 5) velocity.z *= -1;
    }

    renderer.render(scene, camera);
  };

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
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
