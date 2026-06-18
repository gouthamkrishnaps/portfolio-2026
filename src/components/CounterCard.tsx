"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface CounterProps {
  value: string;
  label: string;
}

export default function CounterCard({
  value,
  label,
}: CounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);
  const [suffix, setSuffix] = useState("");

  useEffect(() => {
    // Extract suffix (e.g., "+", "%")
    const numMatch = value.match(/\d+/);
    if (!numMatch) {
      return;
    }
    const target = parseInt(numMatch[0]);
    const suf = value.replace(/\d+/g, "");
    setSuffix(suf);

    if (isInView) {
      let startTime: number | null = null;
      const duration = 2000; // 2 seconds animation

      const updateCount = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Exponential ease-out formula
        const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentCount = Math.floor(easeOut * target);
        
        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        }
      };

      requestAnimationFrame(updateCount);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      whileHover={{
        y: -8,
        borderColor: "rgba(6, 182, 212, 0.4)",
        boxShadow: "0 10px 30px -10px rgba(6, 182, 212, 0.15)",
      }}
      transition={{ duration: 0.3 }}
      className="glass-panel rounded-[30px] p-6 sm:p-8 flex flex-col justify-between glowing-border-parent relative"
    >
      {/* Glowing boundary element */}
      <div className="glowing-border-glow" />

      <h3 className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 text-glow">
        {count}
        {suffix}
      </h3>

      <p className="mt-4 text-text-secondary text-sm sm:text-base font-semibold uppercase tracking-wider">
        {label}
      </p>
    </motion.div>
  );
}