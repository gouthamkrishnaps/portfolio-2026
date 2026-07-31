"use client";

import { useMotionValue, motion, useMotionTemplate } from "framer-motion";
import React, { MouseEvent as ReactMouseEvent, useState } from "react";
import { CanvasRevealEffect } from "@/images/components/ui/canvas-reveal-effect";
import { cn } from "@/images/lib/utils";

export const CardSpotlight = ({
  children,
  radius = 350,
  color = "var(--card-spotlight-color)",
  className,
  ...props
}: {
  radius?: number;
  color?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: ReactMouseEvent<HTMLDivElement>) {
    let { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const [isHovering, setIsHovering] = useState(false);
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    let { left, top } = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    mouseX.set(touch.clientX - left);
    mouseY.set(touch.clientY - top);
    setIsHovering(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    let { left, top } = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    mouseX.set(touch.clientX - left);
    mouseY.set(touch.clientY - top);
  };

  const handleTouchEnd = () => {
    setTimeout(() => {
      setIsHovering(false);
    }, 1500);
  };

  return (
    <div
      className={cn(
        "group/spotlight p-10 rounded-md relative border border-surface-border dark:border-neutral-800 bg-transparent",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      {...props}
    >
      <motion.div
        className={cn(
          "pointer-events-none absolute z-0 -inset-px rounded-[inherit] opacity-0 transition duration-300 group-hover/spotlight:opacity-100",
          isHovering && "opacity-100"
        )}
        style={{
          backgroundColor: color,
          maskImage: useMotionTemplate`
            radial-gradient(
              ${radius}px circle at ${mouseX}px ${mouseY}px,
              white,
              transparent 80%
            )
          `,
        }}
      >
        {isHovering && (
          <CanvasRevealEffect
            animationSpeed={5}
            containerClassName="bg-transparent absolute inset-0 pointer-events-none"
            colors={[
              [59, 130, 246],
              [139, 92, 246],
            ]}
            dotSize={3}
            showGradient={false}
          />
        )}
      </motion.div>
      {children}
    </div>
  );
};
