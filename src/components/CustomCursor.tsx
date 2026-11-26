"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const pointerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isHovered = useRef(false);
  const isMouseDown = useRef(false);
  const isHidden = useRef(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (isHidden.current) {
        isHidden.current = false;
        ringPos.current.x = e.clientX;
        ringPos.current.y = e.clientY;
        if (pointerRef.current) pointerRef.current.style.opacity = "1";
        if (ringRef.current) ringRef.current.style.opacity = "1";
      }
    };

    const handleMouseDown = () => {
      isMouseDown.current = true;
    };

    const handleMouseUp = () => {
      isMouseDown.current = false;
    };

    const handleMouseLeave = () => {
      isHidden.current = true;
      if (pointerRef.current) pointerRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };

    const handleMouseEnter = () => {
      isHidden.current = false;
      if (pointerRef.current) pointerRef.current.style.opacity = "1";
      if (ringRef.current) ringRef.current.style.opacity = "1";
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive = Boolean(
        target.tagName === "A" ||
          target.tagName === "BUTTON" ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.closest("a") ||
          target.closest("button") ||
          target.closest('[role="button"]') ||
          target.classList.contains("cursor-pointer")
      );

      isHovered.current = isInteractive;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseover", handleMouseOver);

    let animationFrameId: number;

    const render = () => {
      const lerpFactor = prefersReducedMotion ? 1.0 : 0.22;

      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerpFactor;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerpFactor;

      const isDark = document.documentElement.classList.contains("dark");
      const pointerScale = isMouseDown.current ? 0.88 : isHovered.current ? 1.08 : 1.0;

      if (pointerRef.current) {
        // Tip of the SVG arrow is at (2, 2), offset so the exact tip sits on the cursor coordinate
        pointerRef.current.style.transform = `translate3d(${mousePos.current.x - 2}px, ${mousePos.current.y - 2}px, 0) scale(${pointerScale})`;
      }

      if (ringRef.current) {
        const ringScale = isMouseDown.current ? 0.75 : isHovered.current ? 1.35 : 1.0;
        const borderColor = isHovered.current
          ? isDark
            ? "rgba(34, 211, 238, 0.75)"
            : "rgba(79, 70, 229, 0.75)"
          : isDark
            ? "rgba(129, 140, 248, 0.35)"
            : "rgba(99, 102, 241, 0.35)";

        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate3d(-50%, -50%, 0) scale(${ringScale})`;
        ringRef.current.style.borderColor = borderColor;
        ringRef.current.style.backgroundColor = isHovered.current
          ? isDark
            ? "rgba(34, 211, 238, 0.08)"
            : "rgba(79, 70, 229, 0.06)"
          : "transparent";
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
    <div className="hidden md:block">
      {/* Crisp Precision SVG Pointer */}
      <div
        ref={pointerRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] transition-opacity duration-200 opacity-0"
        style={{ willChange: "transform", transformOrigin: "2px 2px" }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.28)]"
        >
          <path
            d="M3 2L10.2 20.5L13.1 13.4L20.2 10.5L3 2Z"
            className="fill-zinc-900 stroke-white dark:fill-white dark:stroke-indigo-400"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Subtle Precision Halo */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-5 h-5 border rounded-full pointer-events-none z-[9998] transition-[opacity,border-color,background-color] duration-200 opacity-0"
        style={{ willChange: "transform", transformOrigin: "center" }}
      />
    </div>
  );
}
