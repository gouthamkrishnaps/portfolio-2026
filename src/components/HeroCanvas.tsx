"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);

    const uniforms = {
      uTime: { value: 0.0 },
      uResolution: { value: new THREE.Vector2(w, h) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseActive: { value: 0.0 },
      uIsDark: { value: 1.0 },
    };

    const vertexShader = /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = /* glsl */ `
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform float uMouseActive;
      uniform float uIsDark;

      varying vec2 vUv;

      // Simplex-style 2D hash & smooth value noise
      vec2 hash2(vec2 p) {
        p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
        return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);

        return mix(
          mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
              dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
          mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
              dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      float fbm(vec2 p) {
        float val = 0.0;
        float amp = 0.5;
        mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
        for (int i = 0; i < 4; i++) {
          val += amp * noise(p);
          p = rot * p * 2.02;
          amp *= 0.5;
        }
        return val;
      }

      void main() {
        vec2 uv = vUv;
        float aspect = uResolution.x / max(uResolution.y, 1.0);
        vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
        vec2 m = (uMouse - 0.5) * vec2(aspect, 1.0);

        // Cursor fluid warp & gentle ripple
        float dist = length(p - m);
        float influence = exp(-dist * 2.6) * uMouseActive;
        vec2 dir = normalize(p - m + 0.0001);
        p += dir * sin(dist * 9.0 - uTime * 2.4) * 0.035 * influence;

        float t = uTime * 0.16;

        // Domain-warped fluid ribbons
        vec2 q = vec2(
          fbm(p * 1.4 + vec2(t, t * 0.6)),
          fbm(p * 1.4 + vec2(-t * 0.7, t * 0.9) + vec2(5.2, 1.3))
        );

        float flow = fbm(p * 1.6 + q * 1.35 + vec2(t * 0.5, -t * 0.4));
        float ribbon1 = smoothstep(-0.12, 0.48, flow);
        float ribbon2 = smoothstep(0.02, 0.62, fbm(p * 2.1 - q * 1.1 + vec2(-t * 0.35, t * 0.5)));
        float crest = pow(ribbon1 * ribbon2, 1.35);

        // Balanced moody Indigo + Cyan-Slate palette
        vec3 deepIndigo = vec3(0.240, 0.265, 0.720);
        vec3 mutedCyan  = vec3(0.080, 0.450, 0.620);

        vec3 aurora = mix(deepIndigo, mutedCyan, ribbon1 * 0.6 + ribbon2 * 0.25);

        // Soft edge vignette so the aurora fades naturally into the dark background
        float vignette = 1.0 - smoothstep(0.24, 0.95, length((uv - 0.5) * vec2(1.14, 1.24)));

        // Subtle, refined cursor glow highlight
        vec3 cursorGlow = mix(deepIndigo, mutedCyan, 0.5) * influence * 0.38;

        float darkAlpha = (0.035 + ribbon1 * 0.13 + ribbon2 * 0.08 + crest * 0.07) * vignette;
        float lightAlpha = (0.035 + ribbon1 * 0.10 + ribbon2 * 0.06) * vignette;
        float alpha = mix(lightAlpha, darkAlpha, uIsDark) + influence * 0.16;

        vec3 finalColor = aurora + cursorGlow;

        gl_FragColor = vec4(finalColor, clamp(alpha, 0.0, 0.42));
      }
    `;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // --- POINTER TRACKING ---
    const targetMouse = new THREE.Vector2(0.5, 0.5);
    const currentMouse = new THREE.Vector2(0.5, 0.5);
    let targetActive = 0.0;
    let currentActive = 0.0;

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      targetMouse.x = (clientX - rect.left) / rect.width;
      targetMouse.y = 1.0 - (clientY - rect.top) / rect.height;
      targetActive = 1.0;
    };

    const handleMouseMove = (e: MouseEvent) => updatePointer(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const handlePointerLeave = () => {
      targetActive = 0.0;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handlePointerLeave);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handlePointerLeave);

    const handleResize = () => {
      if (!container) return;
      const nw = container.clientWidth || window.innerWidth;
      const nh = container.clientHeight || window.innerHeight;
      uniforms.uResolution.value.set(nw, nh);
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", handleResize);

    // --- ANIMATION TICK LOOP (Viewport-gated & Reduced-Motion aware) ---
    const startTime = performance.now() * 0.001;
    let animId: number | null = null;
    let isVisible = true;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderFrame = (elapsed: number) => {
      uniforms.uTime.value = elapsed;
      uniforms.uIsDark.value = document.documentElement.classList.contains("dark") ? 1.0 : 0.0;

      currentMouse.lerp(targetMouse, 0.08);
      currentActive += (targetActive - currentActive) * 0.06;

      uniforms.uMouse.value.copy(currentMouse);
      uniforms.uMouseActive.value = currentActive;

      renderer.render(scene, camera);
    };

    const tick = () => {
      if (!isVisible || prefersReducedMotion) {
        animId = null;
        return;
      }
      const elapsed = performance.now() * 0.001 - startTime;
      renderFrame(elapsed);
      animId = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && animId === null && !prefersReducedMotion) {
          tick();
        }
      },
      { threshold: 0 }
    );
    observer.observe(container);

    if (prefersReducedMotion) {
      renderFrame(0);
    } else {
      tick();
    }

    return () => {
      if (animId !== null) cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handlePointerLeave);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handlePointerLeave);

      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none bg-transparent"
    />
  );
}
