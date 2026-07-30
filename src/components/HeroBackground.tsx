"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- RENDERER, SCENE, CAMERA SETUP ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 18; // Pull back to view the field

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // --- INSTANCED DASHES GEOMETRY (antigravity.google style) ---
    const count = 2200;
    const geometry = new THREE.PlaneGeometry(0.04, 0.42); // Thin rectangular dashes

    const aInstancePos = new Float32Array(count * 3);
    const aInstanceAngle = new Float32Array(count);
    const aInstanceRand = new Float32Array(count * 2);

    for (let i = 0; i < count; i++) {
      // Distribute randomly across the visible field
      const x = (Math.random() - 0.5) * 44;
      const y = (Math.random() - 0.5) * 26;
      const z = (Math.random() - 0.5) * 2.0;

      aInstancePos[i * 3] = x;
      aInstancePos[i * 3 + 1] = y;
      aInstancePos[i * 3 + 2] = z;

      aInstanceAngle[i] = Math.random() * Math.PI * 2; // Random initial rotation

      aInstanceRand[i * 2] = Math.random(); // Wave phase offset
      aInstanceRand[i * 2 + 1] = Math.random(); // Scale multiplier
    }

    geometry.setAttribute("aInstancePos", new THREE.InstancedBufferAttribute(aInstancePos, 3));
    geometry.setAttribute("aInstanceAngle", new THREE.InstancedBufferAttribute(aInstanceAngle, 1));
    geometry.setAttribute("aInstanceRand", new THREE.InstancedBufferAttribute(aInstanceRand, 2));

    // --- SHADER MATERIAL ---
    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(99999.0, 99999.0) },
      uMouseStrength: { value: 3.2 },
      uMouseRadius: { value: 5.2 },
      uIsDark: { value: 1.0 },
    };

    const vertexShader = `
      attribute vec3 aInstancePos;
      attribute float aInstanceAngle;
      attribute vec2 aInstanceRand;

      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uMouseStrength;
      uniform float uMouseRadius;

      varying vec2 vUv;
      varying vec3 vInstancePos;
      varying float vDistToMouse;

      void main() {
        vUv = uv;
        vInstancePos = aInstancePos;

        // Base vertex position of this dash geometry
        vec3 pos = position;

        // Scale variations per instance
        pos.xy *= (0.75 + aInstanceRand.y * 0.5);

        // Vector from mouse uniform to instance coordinate center
        vec2 diff = aInstancePos.xy - uMouse;
        float dist = length(diff);
        vDistToMouse = dist;

        // Base idle rotation + small wave wobble over time
        float angle = aInstanceAngle + sin(uTime * 0.4 + aInstanceRand.x * 6.28) * 0.3;

        vec3 instancePos = aInstancePos;

        // Idle floating motion drift
        instancePos.x += sin(uTime * 0.5 + aInstanceRand.x * 6.28) * 0.2;
        instancePos.y += cos(uTime * 0.4 + aInstanceRand.x * 6.28) * 0.2;

        if (dist < uMouseRadius) {
          vec2 dir = normalize(diff);
          // Inverse bell curve for smooth organic force falloff
          float force = 1.0 - (dist / uMouseRadius);
          force = smoothstep(0.0, 1.0, force);

          // Pushes center position away from mouse coordinates (repulsion)
          instancePos.xy += dir * force * uMouseStrength;
          // Warp depth in Z axis (gravity indentation)
          instancePos.z -= force * uMouseStrength * 1.5;

          // Rotate dash to align tangentially to the mouse
          float mouseAngle = atan(diff.y, diff.x);
          angle = mix(angle, mouseAngle + 1.5708, force * 0.85);
        }

        // Apply instance rotation
        float cosA = cos(angle);
        float sinA = sin(angle);
        vec2 rotated = vec2(
          pos.x * cosA - pos.y * sinA,
          pos.x * sinA + pos.y * cosA
        );
        pos.xy = rotated;

        // Displace vertex
        pos += instancePos;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      varying vec3 vInstancePos;
      varying float vDistToMouse;

      uniform float uTime;
      uniform float uIsDark;

      void main() {
        // Soft capsule line shape fade (along length)
        float fadeY = smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);
        // Soft cross-section edge fade (along width)
        float fadeX = smoothstep(0.0, 0.25, vUv.x) * smoothstep(1.0, 0.75, vUv.x);
        float alpha = fadeY * fadeX;

        // Dark mode neon colors (Cyan, Purple, Pink)
        vec3 cyanDark = vec3(0.06, 0.71, 0.85);   // Cyan
        vec3 purpleDark = vec3(0.66, 0.33, 0.97); // Purple
        vec3 pinkDark = vec3(0.96, 0.25, 0.44);   // Pink/Red

        // Light mode high-contrast colors
        vec3 cyanLight = vec3(0.03, 0.57, 0.7);    // Deep Cyan
        vec3 purpleLight = vec3(0.49, 0.23, 0.93); // Deep Purple
        vec3 pinkLight = vec3(0.88, 0.17, 0.33);   // Rich Rose/Pink

        vec3 colorCyan = uIsDark > 0.5 ? cyanDark : cyanLight;
        vec3 colorPurple = uIsDark > 0.5 ? purpleDark : purpleLight;
        vec3 colorPink = uIsDark > 0.5 ? pinkDark : pinkLight;

        // Distribute colors based on the vertical position of the dash
        // Normalized Y index between -13.0 and 13.0
        float normY = (vInstancePos.y + 13.0) / 26.0;
        normY = clamp(normY, 0.0, 1.0);

        vec3 color;
        if (normY > 0.5) {
          // Upper screen gradient: Cyan to Purple
          color = mix(colorCyan, colorPurple, (normY - 0.5) * 2.0);
        } else {
          // Lower screen gradient: Pink to Cyan
          color = mix(colorPink, colorCyan, normY * 2.0);
        }

        // Vignette borders boundary culling/fade out
        float boundaryFadeX = smoothstep(22.0, 15.0, abs(vInstancePos.x));
        float boundaryFadeY = smoothstep(13.0, 9.0, abs(vInstancePos.y));
        float boundaryFade = boundaryFadeX * boundaryFadeY;

        gl_FragColor = vec4(color, alpha * boundaryFade * (uIsDark > 0.5 ? 0.75 : 0.95));
      }
    `;

    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // Set identity matrix on all instances
    const dummy = new THREE.Object3D();
    const instMesh = new THREE.InstancedMesh(geometry, shaderMaterial, count);
    for (let i = 0; i < count; i++) {
      instMesh.setMatrixAt(i, dummy.matrix);
    }
    instMesh.instanceMatrix.needsUpdate = true;
    scene.add(instMesh);

    // --- RAYCASTING & INTERACTION ---
    const raycaster = new THREE.Raycaster();
    const gridPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    const targetMouse = new THREE.Vector3(99999.0, 99999.0, 0.0);
    const currentMouse = new THREE.Vector2(99999.0, 99999.0);

    let motionReduced = false;
    if (typeof window !== "undefined") {
      motionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    const updateMouseCoords = (clientX: number, clientY: number) => {
      if (motionReduced) return;
      const rect = container.getBoundingClientRect();
      const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
      raycaster.ray.intersectPlane(gridPlane, targetMouse);
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateMouseCoords(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateMouseCoords(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleMouseLeave = () => {
      targetMouse.set(99999.0, 99999.0, 0.0);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleMouseLeave);

    // --- RESIZE HANDLER ---
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // --- ANIMATION TICK LOOP ---
    const startTime = clockTime();
    let animationFrameId: number;

    function clockTime() {
      return performance.now() * 0.001;
    }

    const tick = () => {
      const elapsed = clockTime() - startTime;
      uniforms.uTime.value = elapsed;

      // Toggle theme colors & blending styles dynamically
      const isDark = document.documentElement.classList.contains("dark");
      uniforms.uIsDark.value = isDark ? 1.0 : 0.0;
      shaderMaterial.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;

      // Linear interpolation (lerp) for smooth cursor physics inertia
      if (targetMouse.x > 90000.0) {
        currentMouse.x += (99999.0 - currentMouse.x) * 0.08;
        currentMouse.y += (99999.0 - currentMouse.y) * 0.08;
      } else {
        currentMouse.x += (targetMouse.x - currentMouse.x) * 0.08;
        currentMouse.y += (targetMouse.y - currentMouse.y) * 0.08;
      }

      uniforms.uMouse.value.copy(currentMouse);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    // --- CLEANUP ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleMouseLeave);

      renderer.dispose();
      geometry.dispose();
      shaderMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full -z-10 overflow-hidden pointer-events-auto bg-transparent"
    />
  );
}
