"use client";

import { useEffect, useRef, useState } from "react";
import { skills } from "../data/skills";
import { FaReact, FaNodeJs } from "react-icons/fa";
import { SiNextdotjs, SiTypescript, SiGraphql, SiMongodb, SiMysql, SiTailwindcss } from "react-icons/si";
import { VscAzure } from "react-icons/vsc";

const orbitIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Next.js": SiNextdotjs,
  "React": FaReact,
  "TypeScript": SiTypescript,
  "GraphQL": SiGraphql,
  "Node.js": FaNodeJs,
  "MongoDB": SiMongodb,
  "MySQL": SiMysql,
  "Tailwind": SiTailwindcss,
  "Azure": VscAzure,
};

interface Point3D {
  x: number;
  y: number;
  z: number;
  name: string;
}

export default function Skills3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointsRef = useRef<Point3D[]>([]);
  const elementRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Responsive radius
  const [radius, setRadius] = useState(210);
  const radiusRef = useRef(210);

  // Dragging and inertia states
  const speedX = useRef(0.002);
  const speedY = useRef(0.002);
  const targetSpeedX = useRef(0.002);
  const targetSpeedY = useRef(0.002);
  const isDragging = useRef(false);

  useEffect(() => {
    const count = skills.length;

    // Distribute skills on a unit sphere (radius = 1)
    pointsRef.current = skills.map((skill, i) => {
      const k = i + 0.5;
      const phi = Math.acos(1 - (2 * k) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * k;

      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.sin(phi) * Math.sin(theta);
      const z = Math.cos(phi);

      return {
        x,
        y,
        z,
        name: skill.name,
      };
    });

    const container = containerRef.current;
    if (!container) return;

    // --- MOUSE BIAS (tilt follow cursor) ---
    const handleMouseMoveHover = (e: MouseEvent) => {
      if (isDragging.current) return;
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - rect.width / 2;
      const mouseY = e.clientY - rect.top - rect.height / 2;
      
      // Control target speeds based on cursor location
      targetSpeedX.current = -mouseY * 0.000015;
      targetSpeedY.current = mouseX * 0.000015;
    };

    // --- DRAGGING STATES & HANDLERS ---
    let startX = 0;
    let startY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      startX = e.clientX;
      startY = e.clientY;
    };

    const handleMouseMoveDrag = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      
      targetSpeedY.current = dx * 0.003;
      targetSpeedX.current = -dy * 0.003;
      
      startX = e.clientX;
      startY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    // --- MOBILE TOUCH SWIPING HANDLERS ---
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging.current = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;

      targetSpeedY.current = dx * 0.005;
      targetSpeedX.current = -dy * 0.005;

      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
    };

    // Event listeners
    container.addEventListener("mousemove", handleMouseMoveHover);
    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMoveDrag);
    window.addEventListener("mouseup", handleMouseUp);

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    // --- RESIZE OBSERVATION ---
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        // Dynamically scale the projection radius based on width
        const newRadius = width < 480 ? 125 : 210;
        setRadius(newRadius);
        radiusRef.current = newRadius;
      }
    });
    resizeObserver.observe(container);

    // --- PHYSICS & PERSPECTIVE TICK ---
    let animId: number;

    const tick = () => {
      // Damping / Friction LERP
      speedX.current += (targetSpeedX.current - speedX.current) * 0.08;
      speedY.current += (targetSpeedY.current - speedY.current) * 0.08;

      if (!isDragging.current) {
        targetSpeedX.current *= 0.97;
        targetSpeedY.current *= 0.97;
        
        // Keep a micro rotation ambient spin
        if (Math.abs(targetSpeedX.current) < 0.001) targetSpeedX.current = 0.0006;
        if (Math.abs(targetSpeedY.current) < 0.001) targetSpeedY.current = 0.0006;
      }

      const cosX = Math.cos(speedX.current);
      const sinX = Math.sin(speedX.current);
      const cosY = Math.cos(speedY.current);
      const sinY = Math.sin(speedY.current);

      pointsRef.current.forEach((point, idx) => {
        // Rotate X
        const y1 = point.y * cosX - point.z * sinX;
        const z1 = point.y * sinX + point.z * cosX;

        // Rotate Y
        const x2 = point.x * cosY + z1 * sinY;
        const z2 = -point.x * sinY + z1 * cosY;

        // Save rotated coordinates (still normalized on unit sphere)
        point.x = x2;
        point.y = y1;
        point.z = z2;

        const el = elementRefs.current[idx];
        if (el) {
          const r = radiusRef.current;
          
          // Project using normalized coordinates multiplied by dynamic radius
          const px = x2 * r;
          const py = y1 * r;
          const pz = z2 * r;

          // Depth projection factor: 1 is closest, 0 is furthest
          const depth = (z2 + 1) / 2;
          const scale = depth * 0.45 + 0.7; // range: [0.7, 1.15]
          const opacity = depth * 0.7 + 0.3; // range: [0.3, 1.0]
          const zIndex = Math.round(pz + r);

          el.style.transform = `translate3d(${px}px, ${py}px, ${pz}px) scale(${scale})`;
          el.style.opacity = `${opacity}`;
          el.style.zIndex = `${zIndex}`;
        }
      });

      animId = requestAnimationFrame(tick);
    };

    tick();

    // --- CLEANUP ---
    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();

      container.removeEventListener("mousemove", handleMouseMoveHover);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMoveDrag);
      window.removeEventListener("mouseup", handleMouseUp);

      container.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[400px] sm:min-h-[550px] w-full select-none cursor-grab active:cursor-grabbing">
      <div
        ref={containerRef}
        className="relative w-[320px] h-[320px] sm:w-[480px] sm:h-[480px] flex items-center justify-center"
        style={{ perspective: "800px", transformStyle: "preserve-3d" }}
      >
        {/* Core center glowing element */}
        <div className="absolute w-24 h-24 sm:w-36 sm:h-36 rounded-full bg-cyan-500/15 dark:bg-cyan-500/10 border border-cyan-500/30 dark:border-cyan-500/20 blur-xl pointer-events-none" />

        {/* 3D Orbit Points */}
        {skills.map((skill, idx) => {
          const Icon = orbitIcons[skill.name];
          return (
            <div
              key={skill.name}
              ref={(el) => {
                elementRefs.current[idx] = el;
              }}
              className="absolute transition-shadow duration-300 pointer-events-auto group"
              style={{
                willChange: "transform, opacity",
              }}
            >
              {/* Tag Design - Matches original UI precisely */}
              <div className="glass-panel flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-surface-border text-xs sm:text-sm font-bold tracking-wide text-slate-800 dark:text-white hover:border-cyan-500 dark:hover:border-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                {Icon && <Icon className="w-4 h-4 text-cyan-600/80 dark:text-cyan-400/80 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />}
                <span>{skill.name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


