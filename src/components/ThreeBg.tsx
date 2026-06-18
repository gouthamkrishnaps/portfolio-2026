"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeBg() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Performance Optimization: Disable on mobile screens to save battery
    if (window.innerWidth < 768) {
      containerRef.current.classList.add("mobile-bg-radial");
      return;
    }

    const container = containerRef.current;
    
    // Scene Setup
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 10;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // --- Create Particle Flow Field ---
    const count = 1500;
    const geometry = new THREE.BufferGeometry();
    
    const positions = new Float32Array(count * 3);
    const origins = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const isDark = document.documentElement.classList.contains("dark");
    const color1 = isDark ? new THREE.Color(0xf97316) : new THREE.Color(0x06b6d4); // Orange / Cyan
    const color2 = isDark ? new THREE.Color(0x7c2d12) : new THREE.Color(0x9333ea); // Deep red-orange / Purple
    const color3 = isDark ? new THREE.Color(0xeab308) : new THREE.Color(0x4f46e5); // Gold / Indigo

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Form a spiral disk distribution (galaxy layout)
      const theta = Math.random() * Math.PI * 2;
      const radius = Math.pow(Math.random(), 1.5) * 8 + 0.5; // denser in the center
      
      const x = Math.cos(theta) * radius;
      const y = Math.sin(theta) * radius;
      const z = (Math.random() - 0.5) * 3; // depth

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      origins[i3] = x;
      origins[i3 + 1] = y;
      origins[i3 + 2] = z;

      velocities[i3] = 0;
      velocities[i3 + 1] = 0;
      velocities[i3 + 2] = 0;

      // Color mapping based on distance from center
      const ratio = radius / 8.5;
      const mixedColor = new THREE.Color();
      if (ratio < 0.4) {
        mixedColor.lerpColors(color1, color3, ratio / 0.4);
      } else {
        mixedColor.lerpColors(color3, color2, (ratio - 0.4) / 0.6);
      }

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Custom Shader-like Material for Glowing Nodes
    const material = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    mainGroup.add(particles);

    // Mouse coordinates in NDC and projection tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;
    const mouse3D = new THREE.Vector3(0, 0, 0);

    const handleMouseMove = (e: MouseEvent) => {
      // Convert to normalized coordinates [-1, 1]
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const time = clock.getElapsedTime();

      // Smooth mouse coordinates LERP
      mouseX += (targetMouseX - mouseX) * 0.1;
      mouseY += (targetMouseY - mouseY) * 0.1;

      // Project mouse pointer coordinates into 3D space at plane z=0
      mouse3D.set(mouseX * 7.5, mouseY * 5.0, 0);

      // Subtle group parallax rotation
      mainGroup.rotation.z = time * 0.015;
      mainGroup.rotation.y = mouseX * 0.4;
      mainGroup.rotation.x = -mouseY * 0.4;

      const positionAttr = geometry.attributes.position;
      const posArr = positionAttr.array as Float32Array;

      // Loop through all points and apply vector physics forces
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        
        const px = posArr[i3];
        const py = posArr[i3 + 1];
        const pz = posArr[i3 + 2];

        const ox = origins[i3];
        const oy = origins[i3 + 1];
        const oz = origins[i3 + 2];

        let fx = 0;
        let fy = 0;
        let fz = 0;

        // Force 1: Natural spiral rotation force around Z axis
        const distFromCenter = Math.sqrt(px * px + py * py) || 0.1;
        const angle = Math.atan2(py, px);
        // Force direction perpendicular to radius vector
        const spiralSpeed = 0.004 / (distFromCenter * 0.3 + 0.5);
        fx += -Math.sin(angle) * spiralSpeed;
        fy += Math.cos(angle) * spiralSpeed;

        // Force 2: Soft drift wave field
        fx += Math.sin(time * 0.5 + py * 0.3) * 0.001;
        fy += Math.cos(time * 0.5 + px * 0.3) * 0.001;

        // Force 3: Drag & Repulsion force from Mouse
        const dx = px - mouse3D.x;
        const dy = py - mouse3D.y;
        const dz = pz - mouse3D.z;
        const distSq = dx * dx + dy * dy + dz * dz;
        const dist = Math.sqrt(distSq) || 0.1;

        if (dist < 2.5) {
          const pushFactor = (2.5 - dist) / 2.5; // 1 at mouse, 0 at boundary
          const forceStrength = pushFactor * 0.05;
          
          // Radial push away from cursor
          fx += (dx / dist) * forceStrength;
          fy += (dy / dist) * forceStrength;

          // Vortex swirl around cursor
          fx += (-dy / dist) * forceStrength * 2.0;
          fy += (dx / dist) * forceStrength * 2.0;
        }

        // Force 4: Spring return force to snap back to origin coordinates
        fx += (ox - px) * 0.015;
        fy += (oy - py) * 0.015;
        fz += (oz - pz) * 0.015;

        // Update velocity with friction damping (0.92)
        velocities[i3] = velocities[i3] * 0.92 + fx;
        velocities[i3 + 1] = velocities[i3 + 1] * 0.92 + fy;
        velocities[i3 + 2] = velocities[i3 + 2] * 0.92 + fz;

        // Update position
        posArr[i3] += velocities[i3];
        posArr[i3 + 1] += velocities[i3 + 1];
        posArr[i3 + 2] += velocities[i3 + 2];
      }

      positionAttr.needsUpdate = true;

      // Render
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none -z-10 bg-transparent overflow-hidden"
    />
  );
}
