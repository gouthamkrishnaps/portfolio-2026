"use client";

import { motion } from "framer-motion";

const techs = [
  "Next.js",
  "React",
  "TypeScript",
  "GraphQL",
  "Node.js",
];

export default function FloatingTech() {
  return (
    <div className="hidden lg:block">
      {techs.map((tech, index) => (
        <motion.div
          key={tech}
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 3 + index,
            repeat: Infinity,
          }}
          className="absolute bg-surface backdrop-blur-md border border-surface-border rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm"
          style={{
            top: `${15 + index * 12}%`,
            right: `${5 + index * 3}%`,
          }}
        >
          {tech}
        </motion.div>
      ))}
    </div>
  );
}