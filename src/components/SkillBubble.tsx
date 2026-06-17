"use client";

import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

interface Props {
  skill: {
    name: string;
    years: string;
    level: number;
  };
  index: number;
}

export default function SkillBubble({
  skill,
  index,
}: Props) {
  return (
    <motion.div
      animate={{
        y: [0, -20, 0],
      }}
      transition={{
        duration: 4 + index,
        repeat: Infinity,
      }}
    >
      <Tilt
        tiltMaxAngleX={10}
        tiltMaxAngleY={10}
        scale={1.05}
      >
        <div
          className="
          w-[200px] sm:w-[220px]
          rounded-[30px]
          border border-surface-border
          bg-surface
          backdrop-blur-md
          p-5 sm:p-6
          cursor-pointer"
        >
          <h3 className="text-xl font-bold">
            {skill.name}
          </h3>

          <p className="text-text-muted mt-1">
            {skill.years} Experience
          </p>

          <div className="mt-5 h-2 rounded-full bg-surface-raised">
            <div
              style={{
                width: `${skill.level}%`,
              }}
              className="h-full rounded-full bg-brand-500"
            />
          </div>

          <span className="mt-3 block text-brand-400">
            {skill.level}%
          </span>
        </div>
      </Tilt>
    </motion.div>
  );
}