"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { featuredProjects } from "../data/projects";

interface ProjectShowcase3DProps {
  imageUrl: string;
  title: string;
}

export default function ProjectShowcase3D({ imageUrl, title }: ProjectShowcase3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Track inputs in refs for change listeners inside tick loops
  const imageUrlRef = useRef(imageUrl);
  const nextTextureRef = useRef<THREE.Texture | null>(null);
  const isFlippingRef = useRef(false);
  const flipTargetRotationRef = useRef(0);
  const targetTiltRef = useRef({ x: 0, y: 0 });

  // Update ref on image URL change to trigger card flips
  useEffect(() => {
    imageUrlRef.current = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // --- THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.15, 7.8); // Moved closer (7.8 down from 9) for larger image projection

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- MODEL CREATION & LOADING ---
    const textureLoader = new THREE.TextureLoader();
    const textureCache: { [url: string]: THREE.Texture } = {};

    // Load initial texture
    const initialTexture = textureLoader.load(imageUrlRef.current);
    initialTexture.colorSpace = THREE.SRGBColorSpace;
    initialTexture.minFilter = THREE.LinearFilter;
    textureCache[imageUrlRef.current] = initialTexture;

    // Pre-cache all featured projects images to prevent race conditions in production
    featuredProjects.forEach((proj) => {
      const url = proj.image.src;
      if (url && url !== imageUrlRef.current) {
        textureLoader.load(url, (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.minFilter = THREE.LinearFilter;
          textureCache[url] = tex;
        });
      }
    });

    // Screen Mesh Geometry (Aspect ratio matching screenshots, e.g. 1.6:1) - Scaled up from 4.8x3.0
    const screenGeo = new THREE.PlaneGeometry(5.2, 3.25);
    const screenMat = new THREE.MeshBasicMaterial({
      map: initialTexture,
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide,
    });
    
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 0.5, 0); // Positioned above the emitter ring
    scene.add(screenMesh);

    // --- CYBER SCROLLING SCANLINES OVERLAY ---
    const createScanlineTexture = (isDark: boolean) => {
      const sCanvas = document.createElement("canvas");
      sCanvas.width = 64;
      sCanvas.height = 64;
      const sCtx = sCanvas.getContext("2d");
      if (sCtx) {
        sCtx.fillStyle = "rgba(0, 0, 0, 0)";
        sCtx.fillRect(0, 0, 64, 64);
        sCtx.fillStyle = isDark ? "rgba(6, 182, 212, 0.12)" : "rgba(14, 116, 144, 0.15)"; // Glowing cyan scanline
        sCtx.fillRect(0, 0, 64, 3);
      }
      const tex = new THREE.CanvasTexture(sCanvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(1, 12); // Repeat scanlines vertically
      return tex;
    };

    const scanlineTextureDark = createScanlineTexture(true);
    const scanlineTextureLight = createScanlineTexture(false);

    const scanlineMat = new THREE.MeshBasicMaterial({
      map: scanlineTextureDark,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const scanlineMesh = new THREE.Mesh(screenGeo, scanlineMat);
    scanlineMesh.position.z = 0.005; // Slightly in front of screen to prevent Z-fighting
    screenMesh.add(scanlineMesh);

    // --- HOLOGRAM EMITTER RING ---
    const ringGeo = new THREE.RingGeometry(1.2, 1.35, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -2.3;
    scene.add(ringMesh);

    // Emitter Base Solid Ring
    const baseGeo = new THREE.CylinderGeometry(1.25, 1.25, 0.05, 32, 1, true);
    const baseMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.15,
      wireframe: true,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -2.32;
    scene.add(baseMesh);

    // --- HOLOGRAM BEAM LINES (Dynamic laser coordinate tracks) ---
    const beamCount = 4;
    const beamGeometry = new THREE.BufferGeometry();
    const beamPositions = new Float32Array(beamCount * 2 * 3); // 4 lines, 2 vertices each (x, y, z)
    beamGeometry.setAttribute("position", new THREE.BufferAttribute(beamPositions, 3));

    const beamMat = new THREE.LineBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
    });
    const projectorBeams = new THREE.LineSegments(beamGeometry, beamMat);
    scene.add(projectorBeams);

    // Screen mesh local corner points - Updated for 5.2x3.25 geometry
    const screenCorners = [
      new THREE.Vector3(-2.6, -1.625, 0), // Bottom Left
      new THREE.Vector3(2.6, -1.625, 0),  // Bottom Right
      new THREE.Vector3(2.6, 1.625, 0),   // Top Right
      new THREE.Vector3(-2.6, 1.625, 0),  // Top Left
    ];

    // --- FLOATING NEON ENERGY SPARKS (Rising Particles) ---
    const pCount = 35;
    const pGeometry = new THREE.BufferGeometry();
    const pPositions = new Float32Array(pCount * 3);
    const pVelocities: number[] = [];

    for (let i = 0; i < pCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 2.2;
      pPositions[i * 3 + 1] = -2.3 + Math.random() * 4.3;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 2.2;
      pVelocities.push(0.008 + Math.random() * 0.016); // Rise speeds
    }

    pGeometry.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));

    const createSparkTexture = (isDark: boolean) => {
      const pCanvas = document.createElement("canvas");
      pCanvas.width = 16;
      pCanvas.height = 16;
      const pCtx = pCanvas.getContext("2d");
      if (pCtx) {
        const grad = pCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
        const color = isDark ? "rgba(34, 211, 238, " : "rgba(8, 145, 178, ";
        grad.addColorStop(0, color + "1)");
        grad.addColorStop(0.3, color + "0.4)");
        grad.addColorStop(1, color + "0)");
        pCtx.fillStyle = grad;
        pCtx.fillRect(0, 0, 16, 16);
      }
      return new THREE.CanvasTexture(pCanvas);
    };

    const sparkTextureDark = createSparkTexture(true);
    const sparkTextureLight = createSparkTexture(false);

    const pMat = new THREE.PointsMaterial({
      size: 0.12,
      map: sparkTextureDark,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const risingSparks = new THREE.Points(pGeometry, pMat);
    scene.add(risingSparks);

    // Dynamic theme colors state
    let isThemeDark = document.documentElement.classList.contains("dark");

    const applyProjectorTheme = (isDark: boolean) => {
      // 1. Scanline material blending & texture
      scanlineMat.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
      scanlineMat.map = isDark ? scanlineTextureDark : scanlineTextureLight;
      scanlineMat.needsUpdate = true;

      // 2. Hologram ring material colors & opacities
      ringMat.color.setHex(isDark ? 0x06b6d4 : 0x0e7490);
      ringMat.opacity = isDark ? 0.35 : 0.45;

      // 3. Emitter base solid ring
      baseMat.color.setHex(isDark ? 0x6366f1 : 0x4338ca);
      baseMat.opacity = isDark ? 0.15 : 0.25;

      // 4. Projector beams
      beamMat.color.setHex(isDark ? 0x06b6d4 : 0x0e7490);
      beamMat.opacity = isDark ? 0.16 : 0.25;
      beamMat.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;

      // 5. Sparks particles
      pMat.map = isDark ? sparkTextureDark : sparkTextureLight;
      pMat.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
      pMat.opacity = isDark ? 0.55 : 0.65;
      pMat.needsUpdate = true;
    };

    // Apply colors immediately
    applyProjectorTheme(isThemeDark);

    // --- INTERACTIVE EVENT LISTENERS ---
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      targetTiltRef.current.y = mouseX * 0.2;  // Rotate around Y
      targetTiltRef.current.x = -mouseY * 0.15; // Rotate around X
    };

    const handleMouseLeave = () => {
      targetTiltRef.current.x = 0;
      targetTiltRef.current.y = 0;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    // --- RESIZE OBSERVATION ---
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        // Responsive positioning based on layout scaling - scaled up for a larger visual profile
        let scaleVal = 1.0;
        if (width < 480) {
          scaleVal = 0.95; // increased from 0.68
        } else if (width < 640) {
          scaleVal = 1.1;  // increased from 0.85
        } else if (width < 1024) {
          scaleVal = 1.3;  // increased from 1.15
        } else if (width < 1280) {
          scaleVal = 1.5;  // increased from 1.15
        } else {
          scaleVal = 1.7;  // increased from 1.15
        }

        screenMesh.scale.set(scaleVal, scaleVal, 1);
        ringMesh.scale.set(scaleVal, scaleVal, 1);
        baseMesh.scale.set(scaleVal, scaleVal, 1);

        // Adjust camera Z based on aspect and scale to fit the hologram screen nicely.
        // We target the hologram mesh filling about 85% of either viewport width or height.
        const fillFactor = 0.85;
        const meshW = 5.2 * scaleVal;
        const meshH = 3.25 * scaleVal;
        
        // vertical distance to fit height
        const tanFovHalf = Math.tan((camera.fov * Math.PI) / 360); // Math.tan(22.5 deg)
        const zForHeight = meshH / (2 * tanFovHalf * fillFactor);
        
        // horizontal distance to fit width
        const zForWidth = meshW / (2 * tanFovHalf * fillFactor * camera.aspect);
        
        // Combine them with a safe minimum distance plus buffer for mouse-tilt margins
        const targetZ = Math.max(zForHeight, zForWidth) + 0.6;
        
        camera.position.z = targetZ;
      }
    });
    resizeObserver.observe(container);

    // --- TICK ANIMATION LOOP ---
    let animId: number;
    let lastUrl = imageUrlRef.current;

    const tick = () => {
      // Check for theme updates dynamically
      const currentDark = document.documentElement.classList.contains("dark");
      if (currentDark !== isThemeDark) {
        isThemeDark = currentDark;
        applyProjectorTheme(isThemeDark);
      }

      // 1. Detect dynamic URL swaps to trigger 3D Card Flips
      if (imageUrlRef.current !== lastUrl) {
        lastUrl = imageUrlRef.current;
        isFlippingRef.current = true;
        flipTargetRotationRef.current = screenMesh.rotation.y + Math.PI; // Flip 180 degrees
        
        const cachedTex = textureCache[imageUrlRef.current];
        if (cachedTex) {
          nextTextureRef.current = cachedTex;
        } else {
          textureLoader.load(imageUrlRef.current, (newTex) => {
            newTex.colorSpace = THREE.SRGBColorSpace;
            newTex.minFilter = THREE.LinearFilter;
            nextTextureRef.current = newTex;
            textureCache[imageUrlRef.current] = newTex;
          });
        }
      }

      // 2. Perform Card Flip Rotation & Texture Swapping
      if (isFlippingRef.current) {
        screenMesh.rotation.y += (flipTargetRotationRef.current - screenMesh.rotation.y) * 0.12;
        screenMesh.rotation.x += (0 - screenMesh.rotation.x) * 0.1; // Straighten tilt on flip

        const diff = flipTargetRotationRef.current - screenMesh.rotation.y;
        
        // Swap textures at the halfway point of the spin (90 degrees / face away)
        if (diff < Math.PI / 2 && nextTextureRef.current) {
          screenMat.map?.dispose();
          screenMat.map = nextTextureRef.current;
          screenMat.needsUpdate = true;
          nextTextureRef.current = null;
        }

        if (diff < 0.008) {
          screenMesh.rotation.y = flipTargetRotationRef.current;
          isFlippingRef.current = false;
        }
      } else {
        // Apply spring-damped tilt to follow cursor mouse coords
        screenMesh.rotation.y += (targetTiltRef.current.y - screenMesh.rotation.y) * 0.08;
        screenMesh.rotation.x += (targetTiltRef.current.x - screenMesh.rotation.x) * 0.08;
      }

      // 3. Scroll Hologram Overlay Scanlines
      scanlineTextureDark.offset.y -= 0.007;
      scanlineTextureLight.offset.y -= 0.007;

      // 4. Subtle Ambient Float (sine wave vertical offset)
      const floatOffset = Math.sin(Date.now() / 600) * 0.08;
      screenMesh.position.y = 0.5 + floatOffset;

      // 5. Connect laser beams to floating/rotating screen mesh corners
      const posAttr = beamGeometry.getAttribute("position") as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;

      // Force matrix update to get current world transformation coordinates
      screenMesh.updateMatrixWorld();

      screenCorners.forEach((localV, idx) => {
        // Rotate local coordinates to world space coordinates
        const worldPos = localV.clone().applyMatrix4(screenMesh.matrixWorld);

        // Distribute start positions around the ring emitter
        const angle = (idx / beamCount) * Math.PI * 2;
        const scaleVal = ringMesh.scale.x;
        const ex = Math.cos(angle) * 1.25 * scaleVal;
        const ez = Math.sin(angle) * 1.25 * scaleVal;
        const fillFactor = 0.85; // Aligning layout
        const ey = -2.3;

        // Line Start
        posArr[idx * 6] = ex;
        posArr[idx * 6 + 1] = ey;
        posArr[idx * 6 + 2] = ez;

        // Line End (Corner)
        posArr[idx * 6 + 3] = worldPos.x;
        posArr[idx * 6 + 4] = worldPos.y;
        posArr[idx * 6 + 5] = worldPos.z;
      });
      posAttr.needsUpdate = true;

      // 6. Animate rising glowing particles (energy sparks)
      const pPosAttr = pGeometry.getAttribute("position") as THREE.BufferAttribute;
      const pArr = pPosAttr.array as Float32Array;
      const sparkScale = ringMesh.scale.x;
      const maxSparkHeight = 0.5 + (3.25 * sparkScale) / 2; // top of the screen mesh

      for (let i = 0; i < pCount; i++) {
        pArr[i * 3 + 1] += pVelocities[i]; // rise Y coordinate
        pArr[i * 3] += Math.sin(Date.now() / 400 + i) * 0.002; // horizontal sway X

        // Reset particle if it drifts above the screen threshold height
        if (pArr[i * 3 + 1] > maxSparkHeight) {
          pArr[i * 3 + 1] = -2.3;
          pArr[i * 3] = (Math.random() - 0.5) * 1.8 * sparkScale;
          pArr[i * 3 + 2] = (Math.random() - 0.5) * 1.8 * sparkScale;
        }
      }
      pPosAttr.needsUpdate = true;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    tick();

    // --- GEOMETRIES & ASSETS CLEANUP ---
    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);

      // Dispose buffer assets
      screenGeo.dispose();
      screenMat.dispose();
      
      // Dispose all cached textures
      Object.values(textureCache).forEach((tex) => {
        tex.dispose();
      });
      
      scanlineTextureDark.dispose();
      scanlineTextureLight.dispose();
      sparkTextureDark.dispose();
      sparkTextureLight.dispose();
      scanlineMat.dispose();
      
      ringGeo.dispose();
      ringMat.dispose();
      baseGeo.dispose();
      baseMat.dispose();

      beamGeometry.dispose();
      beamMat.dispose();

      pGeometry.dispose();
      pMat.map?.dispose();
      pMat.dispose();

      if (nextTextureRef.current) {
        nextTextureRef.current.dispose();
      }

      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[340px] sm:h-[450px] md:h-[500px] lg:h-[580px] xl:h-[650px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing overflow-hidden"
    >
      {/* Background ambient neon flare */}
      <div className="absolute w-[280px] h-[280px] rounded-full bg-cyan-500/5 blur-[80px] pointer-events-none z-0" />
      
      {/* Three.js canvas element */}
      <canvas
        ref={canvasRef}
        className="w-full h-full relative z-10 pointer-events-auto block"
      />
    </div>
  );
}
