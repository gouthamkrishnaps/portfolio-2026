"use client";

import { motion } from "framer-motion";

interface FloatingTechProps {
  parallax: { x: number; y: number };
}

const techs = [
  // Left Side scattered tags
  { name: "Next.js", left: "6%", top: "20%", weight: -25 },
  { name: "TypeScript", left: "8%", bottom: "25%", weight: 15 },
  { name: "Three.js", left: "14%", top: "52%", weight: -18 },
  
  // Right Side scattered tags
  { name: "React", right: "6%", top: "18%", weight: -30 },
  { name: "GraphQL", right: "12%", bottom: "22%", weight: 12 },
  { name: "Node.js", right: "15%", top: "48%", weight: 22 },
];

export default function FloatingTech({ parallax }: FloatingTechProps) {
  return (
    <div className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none">
      {techs.map((tech, idx) => (
        <motion.div
          key={tech.name}
          animate={{
            y: [0, -12, 0],
          }}
          transition={{
            duration: 5 + idx * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: tech.left,
            right: tech.right,
            top: tech.top,
            bottom: tech.bottom,
            x: parallax.x * tech.weight,
            y: parallax.y * tech.weight,
            willChange: "transform",
          }}
          className="bg-surface/30 backdrop-blur-md border border-surface-border rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white shadow-lg pointer-events-auto cursor-default hover:border-cyan-500/50 hover:text-cyan-600 dark:hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all duration-300"
        >
          {tech.name}
        </motion.div>
      ))}
    </div>
  );
}