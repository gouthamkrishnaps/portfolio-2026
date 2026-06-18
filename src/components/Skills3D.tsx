"use client";

import { useEffect, useRef, useState } from "react";
import { skills } from "../data/skills";

interface Point3D {
  x: number;
  y: number;
  z: number;
  name: string;
  level: number;
  years: string;
}

export default function Skills3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointsRef = useRef<Point3D[]>([]);
  const elementRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Dragging and inertia states
  const speedX = useRef(0.003); // Initial slow rotation speed
  const speedY = useRef(0.003);
  const targetSpeedX = useRef(0.003);
  const targetSpeedY = useRef(0.003);
  const mousePos = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  useEffect(() => {
    const radius = window.innerWidth < 640 ? 150 : 220; // Sphere radius
    const count = skills.length;

    // Distribute skills on a sphere using Fibonacci sphere algorithm
    pointsRef.current = skills.map((skill, i) => {
      const k = i + 0.5;
      const phi = Math.acos(1 - (2 * k) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * k;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return {
        x,
        y,
        z,
        name: skill.name,
        level: skill.level,
        years: skill.years,
      };
    });

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) return;
      // Mouse coordinate mapping to spin speed
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mouseX = e.clientX - rect.left - rect.width / 2;
      const mouseY = e.clientY - rect.top - rect.height / 2;
      
      // Control spin direction and target speeds based on cursor
      targetSpeedX.current = -mouseY * 0.00003;
      targetSpeedY.current = mouseX * 0.00003;
    };

    // Drag states
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
      
      // Rotate coordinates instantly on drag
      targetSpeedY.current = dx * 0.002;
      targetSpeedX.current = -dy * 0.002;
      
      startX = e.clientX;
      startY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mousemove", handleMouseMoveDrag);
      window.addEventListener("mouseup", handleMouseUp);
    }

    // Physics & LERP Loop
    let animId: number;

    const tick = () => {
      // Apply friction and lerp to target speeds
      speedX.current += (targetSpeedX.current - speedX.current) * 0.08;
      speedY.current += (targetSpeedY.current - speedY.current) * 0.08;

      // Friction spin down on drag release
      if (!isDragging.current) {
        targetSpeedX.current *= 0.98;
        targetSpeedY.current *= 0.98;
        // Keep a micro rotation so it doesn't stand perfectly still
        if (Math.abs(targetSpeedX.current) < 0.001) targetSpeedX.current = 0.0005;
        if (Math.abs(targetSpeedY.current) < 0.001) targetSpeedY.current = 0.0005;
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

        // Update positions
        point.x = x2;
        point.y = y1;
        point.z = z2;

        // Apply depth styling directly to element refs
        const el = elementRefs.current[idx];
        if (el) {
          // Calculate relative depth factor: 1 is closest, 0 is furthest
          const depth = (z2 + radius) / (2 * radius);
          const scale = depth * 0.45 + 0.65;
          const opacity = depth * 0.75 + 0.25;
          const zIndex = Math.round(z2 + radius);

          el.style.transform = `translate3d(${x2}px, ${y1}px, ${z2}px) scale(${scale})`;
          el.style.opacity = `${opacity}`;
          el.style.zIndex = `${zIndex}`;
        }
      });

      animId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animId);
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mousedown", handleMouseDown);
      }
      window.removeEventListener("mousemove", handleMouseMoveDrag);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[450px] sm:min-h-[600px] w-full select-none cursor-grab active:cursor-grabbing">
      <div
        ref={containerRef}
        className="relative w-[320px] h-[320px] sm:w-[480px] sm:h-[480px] flex items-center justify-center"
        style={{ perspective: "800px", transformStyle: "preserve-3d" }}
      >
        {/* Core center glowing element */}
        <div className="absolute w-24 h-24 sm:w-36 sm:h-36 rounded-full bg-cyan-500/10 border border-cyan-500/20 blur-xl pointer-events-none" />

        {/* 3D Orbit Points */}
        {skills.map((skill, idx) => (
          <div
            key={skill.name}
            ref={(el) => {
              elementRefs.current[idx] = el;
            }}
            className="absolute transition-shadow duration-300 pointer-events-auto"
            style={{
              willChange: "transform, opacity",
            }}
          >
            {/* Tag Design */}
            <div className="glass-panel px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-surface-border text-xs sm:text-sm font-bold tracking-wide text-slate-800 dark:text-white hover:border-cyan-500 dark:hover:border-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              {skill.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
