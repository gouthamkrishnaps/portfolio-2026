"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- SCENE, CAMERA, RENDERER ---
    const scene = new THREE.Scene();

    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    // Angled 3D perspective looking down at the liquid mesh landscape
    camera.position.set(0, -7, 16);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);

    // --- CONTINUOUS DEFORMABLE 3D WIREFRAME MESH GRID ---
    // High-resolution grid plane (NOT particles)
    const gridWidth = 42;
    const gridHeight = 28;
    const gridSegsX = 90;
    const gridSegsY = 60;

    const planeGeom = new THREE.PlaneGeometry(
      gridWidth,
      gridHeight,
      gridSegsX,
      gridSegsY
    );

    // UNIFORMS
    const uniforms = {
      uTime: { value: 0.0 },
      uMouse: { value: new THREE.Vector2(99999.0, 99999.0) },
      uMouseRadius: { value: 7.5 },
      uMouseStrength: { value: 4.2 },
      uIsDark: { value: 1.0 },
    };

    // VERTEX SHADER: Continuous Mesh Waves + Smooth Magnetic Dome Elevation
    const vertexShader = /* glsl */ `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uMouseRadius;
      uniform float uMouseStrength;

      varying vec2 vUv;
      varying vec3 vWorldPos;
      varying float vDistToMouse;
      varying float vMouseProximity;
      varying float vElevation;

      void main() {
        vUv = uv;

        vec3 pos = position;

        // --- MULTI-OCTAVE CONTINUOUS LIQUID WAVES ---
        float wave1 = sin(pos.x * 0.22 + uTime * 0.75) * 1.1;
        float wave2 = cos(pos.y * 0.28 + uTime * 0.55) * 0.85;
        float wave3 = sin((pos.x * 0.16 + pos.y * 0.18) + uTime * 0.4) * 0.6;
        float elevation = wave1 + wave2 + wave3;

        pos.z += elevation;

        // --- SMOOTH MAGNETIC CURSOR HOVER ELEVATION ---
        vec2 diff = pos.xy - uMouse;
        float dist = length(diff);
        vDistToMouse = dist;

        // Smooth Gaussian bell-curve falloff (zero grid pinching, zero distortion)
        float force = exp(-dist * dist * 0.035);
        vMouseProximity = force;

        // Lifts the mesh up gently toward the cursor in a smooth 3D dome
        pos.z += force * 2.2;
        vElevation = pos.z;

        vWorldPos = pos;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    // FRAGMENT SHADER: Clean Ambient Spotlight Illumination
    const fragmentShader = /* glsl */ `
      varying vec2 vUv;
      varying vec3 vWorldPos;
      varying float vDistToMouse;
      varying float vMouseProximity;
      varying float vElevation;

      uniform float uTime;
      uniform float uIsDark;

      void main() {
        // --- WIREFRAME GRID PATTERN ---
        vec2 gridUv = fract(vUv * vec2(90.0, 60.0));
        vec2 lineSmooth = smoothstep(vec2(0.08), vec2(0.0), gridUv) +
                          smoothstep(vec2(0.92), vec2(1.0), gridUv);
        float gridLine = max(lineSmooth.x, lineSmooth.y);

        // --- ELEGANT COLOR PALETTE ---
        // Dark mode: Soft Slate Cyan & Muted Indigo
        vec3 cyanD   = vec3(0.08, 0.52, 0.65);   // Soft Slate Cyan
        vec3 indigoD = vec3(0.22, 0.26, 0.58);   // Soft Slate Indigo
        vec3 purpleD = vec3(0.42, 0.22, 0.65);   // Soft Slate Purple
        vec3 pinkD   = vec3(0.55, 0.25, 0.50);

        // Light mode: Bright soft sky cyan -> indigo -> soft violet pastel line colors
        vec3 cyanL   = vec3(0.20, 0.68, 0.90);   // Bright Soft Sky Cyan
        vec3 indigoL  = vec3(0.40, 0.45, 0.92);   // Bright Soft Indigo
        vec3 purpleL  = vec3(0.65, 0.42, 0.92);   // Bright Soft Violet
        vec3 pinkL    = vec3(0.90, 0.45, 0.72);   // Bright Soft Rose

        vec3 cyan   = uIsDark > 0.5 ? cyanD   : cyanL;
        vec3 indigo = uIsDark > 0.5 ? indigoD  : indigoL;
        vec3 purple = uIsDark > 0.5 ? purpleD  : purpleL;

        // Vertical landscape gradient
        float normY = (vWorldPos.y + 14.0) / 28.0;
        normY = clamp(normY, 0.0, 1.0);

        vec3 baseColor = mix(cyan, purple, normY);

        // --- AMBIENT SPOTLIGHT GLOW ON HOVER ---
        vec3 spotLightColor = uIsDark > 0.5 ? vec3(0.20, 0.70, 0.85) : vec3(0.15, 0.75, 0.95);
        vec3 lineColor = mix(baseColor, spotLightColor, vMouseProximity * (uIsDark > 0.5 ? 0.7 : 0.45));

        // Soft grid line intensity (Zero dark surface fill between lines)
        vec3 finalColor = lineColor;

        // Height luminance modulation
        float heightHighlight = smoothstep(-1.0, 3.0, vElevation) * (uIsDark > 0.5 ? 0.12 : 0.05);
        finalColor += heightHighlight * cyan;

        // Boundary vignette fade
        float boundX = smoothstep(21.0, 14.0, abs(vWorldPos.x));
        float boundY = smoothstep(14.0, 9.5, abs(vWorldPos.y));
        float boundary = boundX * boundY;

        // Alpha calculation: Zero alpha when not on a grid line (prevents any background darkening)
        float baseAlpha = uIsDark > 0.5 ? 0.35 : 0.18;
        float alpha = boundary * gridLine * (baseAlpha + vMouseProximity * (uIsDark > 0.5 ? 0.25 : 0.15));

        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      wireframe: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(planeGeom, shaderMaterial);
    scene.add(mesh);

    // --- RAYCASTING & INTERACTION ---
    const raycaster = new THREE.Raycaster();
    const gridPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    const targetWorldPos = new THREE.Vector3(99999.0, 99999.0, 0.0);
    const currentMouse = new THREE.Vector2(99999.0, 99999.0);
    const ndc = new THREE.Vector2(99999.0, 99999.0);

    let isPointerInBounds = false;
    let motionReduced = false;
    if (typeof window !== "undefined") {
      motionReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
    }

    // Camera parallax targets
    let targetCamX = 0;
    let targetCamY = -7;
    const baseCamY = -7;

    const handlePointerMove = (e: MouseEvent) => {
      if (motionReduced) return;
      const rect = container.getBoundingClientRect();

      if (
        e.clientX >= rect.left - 200 &&
        e.clientX <= rect.right + 200 &&
        e.clientY >= rect.top - 200 &&
        e.clientY <= rect.bottom + 200
      ) {
        isPointerInBounds = true;
        ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = -(e.clientY / window.innerHeight) * 2 + 1;
        targetCamX = nx * 2.2;
        targetCamY = baseCamY + ny * 1.5;
      } else {
        isPointerInBounds = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (motionReduced || e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      if (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
      ) {
        isPointerInBounds = true;
        ndc.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        ndc.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
      } else {
        isPointerInBounds = false;
      }
    };

    const handlePointerLeave = () => {
      isPointerInBounds = false;
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("mouseleave", handlePointerLeave);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handlePointerLeave);

    // --- RESIZE ---
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // --- ANIMATION TICK LOOP ---
    const startTime = performance.now() * 0.001;
    let animId: number;

    const tick = () => {
      const elapsed = performance.now() * 0.001 - startTime;
      uniforms.uTime.value = elapsed;

      // Dynamic theme detection
      const isDark = document.documentElement.classList.contains("dark");
      uniforms.uIsDark.value = isDark ? 1.0 : 0.0;
      shaderMaterial.blending = isDark
        ? THREE.AdditiveBlending
        : THREE.NormalBlending;

      // Camera parallax smooth interpolation
      camera.position.x += (targetCamX - camera.position.x) * 0.04;
      camera.position.y += (targetCamY - camera.position.y) * 0.04;
      camera.lookAt(0, 1, 0);

      // Perform raycasting with updated camera position
      if (isPointerInBounds && Math.abs(ndc.x) <= 2.0 && Math.abs(ndc.y) <= 2.0) {
        raycaster.setFromCamera(ndc, camera);
        raycaster.ray.intersectPlane(gridPlane, targetWorldPos);

        // Fluid LERP mouse follower
        currentMouse.x += (targetWorldPos.x - currentMouse.x) * 0.12;
        currentMouse.y += (targetWorldPos.y - currentMouse.y) * 0.12;
      } else {
        // Smoothly fade offscreen when pointer leaves
        currentMouse.x += (99999.0 - currentMouse.x) * 0.05;
        currentMouse.y += (99999.0 - currentMouse.y) * 0.05;
      }

      uniforms.uMouse.value.copy(currentMouse);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    tick();

    // --- CLEANUP ---
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseleave", handlePointerLeave);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handlePointerLeave);

      renderer.dispose();
      planeGeom.dispose();
      shaderMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-auto bg-transparent"
    />
  );
}
