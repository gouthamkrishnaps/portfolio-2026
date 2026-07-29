"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeBg() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Performance Optimization: Disable on small mobile screens to save battery/resources
    if (window.innerWidth < 480) {
      containerRef.current.classList.add("mobile-bg-radial");
      return;
    }

    const container = containerRef.current;
    
    // Scene Setup
    const scene = new THREE.Scene();
    
    // Camera & Renderer size fallback (handles early mount/hydration layout)
    const initialWidth = container.clientWidth || window.innerWidth;
    const initialHeight = container.clientHeight || window.innerHeight;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      initialWidth / initialHeight,
      0.1,
      100
    );
    camera.position.z = 10;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(initialWidth, initialHeight);
    container.appendChild(renderer.domElement);

    // Main Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // --- Plexus Network Configuration ---
    const particleCount = 170;
    const maxConnections = 1200;
    const connectionThreshold = 2.8;

    // Bounds for motion
    const xRange = 16;
    const yRange = 10;
    const zRange = 4;

    // Buffers for points
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const pointsColors = new Float32Array(particleCount * 3);

    // Theme Color Palette
    const colorCyan = new THREE.Color(0x06b6d4);   // Cyan
    const colorIndigo = new THREE.Color(0x4f46e5); // Indigo
    const colorPurple = new THREE.Color(0x9333ea); // Purple

    // Initialize Particle coordinates and attributes
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      positions[i3] = (Math.random() - 0.5) * xRange;
      positions[i3 + 1] = (Math.random() - 0.5) * yRange;
      positions[i3 + 2] = (Math.random() - 0.5) * zRange;

      velocities[i3] = (Math.random() - 0.5) * 0.012;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.012;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.006;

      // Color mapping: generate gradients across particles
      const t = Math.random();
      const mixedColor = new THREE.Color();
      if (t < 0.5) {
        mixedColor.lerpColors(colorCyan, colorIndigo, t * 2);
      } else {
        mixedColor.lerpColors(colorIndigo, colorPurple, (t - 0.5) * 2);
      }
      
      pointsColors[i3] = mixedColor.r;
      pointsColors[i3 + 1] = mixedColor.g;
      pointsColors[i3 + 2] = mixedColor.b;
    }

    // Points Geometry & Material
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute("color", new THREE.BufferAttribute(pointsColors, 3));

    // Circular glowing sprite texture
    const createCircleTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, "rgba(255, 255, 255, 1)");
        grad.addColorStop(0.3, "rgba(255, 255, 255, 0.8)");
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 16, 16);
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.22,
      map: createCircleTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    mainGroup.add(points);

    // --- Connecting Lines Geometry & Material ---
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(maxConnections * 2 * 3);
    const lineColors = new Float32Array(maxConnections * 2 * 3);

    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    mainGroup.add(lineSegments);

    // Mouse coordinates tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;
    const mouse3D = new THREE.Vector3(0, 0, 0);

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Window Resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // --- Animation Frame ---
    let animationFrameId: number;

    const animate = () => {
      // Smooth mouse coordinates LERP
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;
      
      // Map mouse to 3D coords matching camera projections
      mouse3D.set(mouseX * 9.5, mouseY * 5.5, 0);

      // Subtle group parallax tilt
      mainGroup.rotation.y = mouseX * 0.15;
      mainGroup.rotation.x = -mouseY * 0.15;

      const posArr = positions;
      const velArr = velocities;

      let lineIdx = 0;
      const linePosArr = lineGeometry.attributes.position.array as Float32Array;
      const lineColorArr = lineGeometry.attributes.color.array as Float32Array;

      // 1. Update particle velocities & coordinates
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        let px = posArr[i3];
        let py = posArr[i3 + 1];
        let pz = posArr[i3 + 2];
        
        let vx = velArr[i3];
        let vy = velArr[i3 + 1];
        let vz = velArr[i3 + 2];

        // Gentle attraction to the cursor coordinates
        const dx = mouse3D.x - px;
        const dy = mouse3D.y - py;
        const dz = mouse3D.z - pz;
        const distToMouse = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.1;
        
        if (distToMouse < 4.0) {
          const forceStrength = (4.0 - distToMouse) * 0.0006;
          vx += dx * forceStrength;
          vy += dy * forceStrength;
          vz += dz * forceStrength;
        }

        // Apply friction damping
        vx *= 0.98;
        vy *= 0.98;
        vz *= 0.98;
        
        // Subtle drift/noise
        vx += (Math.random() - 0.5) * 0.0008;
        vy += (Math.random() - 0.5) * 0.0008;
        vz += (Math.random() - 0.5) * 0.0004;

        px += vx;
        py += vy;
        pz += vz;

        // Wrap particles around borders
        const boundaryX = xRange / 2 + 1;
        const boundaryY = yRange / 2 + 1;

        if (px > boundaryX) px = -boundaryX;
        else if (px < -boundaryX) px = boundaryX;
        
        if (py > boundaryY) py = -boundaryY;
        else if (py < -boundaryY) py = boundaryY;
        
        if (pz > zRange) vz = -Math.abs(vz);
        else if (pz < -zRange) vz = Math.abs(vz);

        posArr[i3] = px;
        posArr[i3 + 1] = py;
        posArr[i3 + 2] = pz;
        
        velArr[i3] = vx;
        velArr[i3 + 1] = vy;
        velArr[i3 + 2] = vz;
      }

      pointsGeometry.attributes.position.needsUpdate = true;

      // 2. Compute particle-to-particle connections for Plexus Lines
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const piX = posArr[i3];
        const piY = posArr[i3 + 1];
        const piZ = posArr[i3 + 2];
        
        for (let j = i + 1; j < particleCount; j++) {
          const j3 = j * 3;
          const pjX = posArr[j3];
          const pjY = posArr[j3 + 1];
          const pjZ = posArr[j3 + 2];
          
          const dx = piX - pjX;
          const dy = piY - pjY;
          const dz = piZ - pjZ;
          const distSq = dx * dx + dy * dy + dz * dz;
          
          if (distSq < connectionThreshold * connectionThreshold) {
            if (lineIdx >= maxConnections) break;
            
            const dist = Math.sqrt(distSq);
            // Opacity scales up as nodes get closer
            const proximityAlpha = 1.0 - dist / connectionThreshold;
            
            const lIdx = lineIdx * 6;
            
            // Connect coordinates of point i and point j
            linePosArr[lIdx] = piX;
            linePosArr[lIdx + 1] = piY;
            linePosArr[lIdx + 2] = piZ;
            
            linePosArr[lIdx + 3] = pjX;
            linePosArr[lIdx + 4] = pjY;
            linePosArr[lIdx + 5] = pjZ;

            // Gradient line calculation matching connecting nodes
            const rA = pointsColors[i3];
            const gA = pointsColors[i3 + 1];
            const bA = pointsColors[i3 + 2];
            
            const rB = pointsColors[j3];
            const gB = pointsColors[j3 + 1];
            const bB = pointsColors[j3 + 2];
            
            lineColorArr[lIdx] = rA * proximityAlpha;
            lineColorArr[lIdx + 1] = gA * proximityAlpha;
            lineColorArr[lIdx + 2] = bA * proximityAlpha;
            
            lineColorArr[lIdx + 3] = rB * proximityAlpha;
            lineColorArr[lIdx + 4] = gB * proximityAlpha;
            lineColorArr[lIdx + 5] = bB * proximityAlpha;
            
            lineIdx++;
          }
        }
      }

      lineGeometry.setDrawRange(0, lineIdx * 2);
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup resources on unmount
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      renderer.dispose();
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none -z-10 bg-transparent overflow-hidden"
    />
  );
}
