"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Use refs to track positions to avoid triggering React re-renders at 120fps
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const isHovered = useRef(false);
  const isMouseDown = useRef(false);
  const isHidden = useRef(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      if (isHidden.current) {
        isHidden.current = false;
        if (dotRef.current) dotRef.current.style.opacity = "1";
        if (ringRef.current) ringRef.current.style.opacity = "1";
      }
    };

    const handleMouseDown = () => {
      isMouseDown.current = true;
      if (ringRef.current) {
        ringRef.current.style.transform = `${ringRef.current.style.transform} scale(0.75)`;
      }
    };

    const handleMouseUp = () => {
      isMouseDown.current = false;
    };

    const handleMouseLeave = () => {
      isHidden.current = true;
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };

    const handleMouseEnter = () => {
      isHidden.current = false;
      if (dotRef.current) dotRef.current.style.opacity = "1";
      if (ringRef.current) ringRef.current.style.opacity = "1";
    };

    // Listeners for cursor interaction
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Track hovered elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest('[role="button"]') ||
        target.classList.contains("cursor-pointer");

      if (isInteractive) {
        isHovered.current = true;
      } else {
        isHovered.current = false;
      }
    };

    window.addEventListener("mouseover", handleMouseOver);

    // Lerp loop
    let animationFrameId: number;
    const render = () => {
      const lerpFactor = 0.15; // Speed of the outer ring follow
      
      // Update ring position
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerpFactor;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerpFactor;

      // Apply transforms directly to DOM elements
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate3d(-50%, -50%, 0)`;
      }

      if (ringRef.current) {
        const scale = isMouseDown.current ? 0.75 : isHovered.current ? 2.0 : 1.0;
        const color = isHovered.current ? "rgba(6, 182, 212, 0.4)" : "rgba(147, 51, 234, 0.3)";
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate3d(-50%, -50%, 0) scale(${scale})`;
        ringRef.current.style.borderColor = color;
        
        if (isHovered.current) {
          ringRef.current.style.backgroundColor = "rgba(6, 182, 212, 0.1)";
        } else {
          ringRef.current.style.backgroundColor = "transparent";
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Inner Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-cyan-400 rounded-full pointer-events-none z-[9999] transition-opacity duration-300 opacity-0 dark:mix-blend-screen"
        style={{ willChange: "transform" }}
      />
      {/* Outer Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 border border-purple-500 rounded-full pointer-events-none z-[9998] transition-[opacity,width,height,background-color] duration-300 opacity-0 dark:mix-blend-screen"
        style={{
          willChange: "transform",
          transformOrigin: "center",
        }}
      />
    </>
  );
}
