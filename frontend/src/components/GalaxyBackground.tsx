"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three/webgpu";
import {
  color,
  cos,
  float,
  mix,
  range,
  sin,
  time,
  uniform,
  uv,
  vec3,
  vec4,
  PI2,
} from "three/tsl";
import { OrbitControls } from "three-stdlib";

const GalaxyBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let renderer: THREE.WebGPURenderer;
    let controls: OrbitControls;

    // Camera
    camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(4, 2, 5);

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x201919);

    // Galaxy Material
    const material = new THREE.SpriteNodeMaterial({
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const size = uniform(0.008);
    material.scaleNode = range(0, 1).mul(size);

    const radiusRatio = range(0, 1);
    const radius = radiusRatio.pow(1.5).mul(5).toVar();

    const branches = 3;
    const branchAngle = range(0, branches)
      .floor()
      .mul(PI2.div(branches));
    const angle = branchAngle.add(time.mul(radiusRatio.oneMinus()));

    const position = vec3(cos(angle), 0, sin(angle)).mul(radius);

    const randomOffset = range(vec3(-1), vec3(1))
      .pow(3)
      .mul(radiusRatio)
      .add(0.2);

    material.positionNode = position.add(randomOffset);

    const colorInside = uniform(color("#ffffff"));
    const colorOutside = uniform(color("#fcfcfc"));
    const colorFinal = mix(
      colorInside,
      colorOutside,
      radiusRatio.oneMinus().pow(2).oneMinus()
    );
    const alpha = float(0.1)
      .div(uv().sub(0.5).length())
      .sub(0.2);
    material.colorNode = vec4(colorFinal, alpha);

    // Stars
    const mesh = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(1, 1),
      material,
      10000
    );
    scene.add(mesh);

    // Renderer
    renderer = new THREE.WebGPURenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 0.1;
    controls.maxDistance = 50;

    // Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // Animate
    function animate() {
      controls.update();
      renderer.render(scene, camera);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
};

export default GalaxyBackground;
