"use client";

import { motion } from "framer-motion";

interface CounterProps {
  value: string;
  label: string;
}

export default function CounterCard({
  value,
  label,
}: CounterProps) {
  return (
    <motion.div
      whileHover={{
        y: -10,
      }}
      className="
      rounded-[32px]
      border border-surface-border
      bg-surface
      backdrop-blur-md
      p-6 sm:p-8"
    >
      <h3 className="text-6xl md:text-7xl font-black text-brand-500">
        {value}
      </h3>

      <p className="mt-4 text-text-muted text-lg">
        {label}
      </p>
    </motion.div>
  );
}