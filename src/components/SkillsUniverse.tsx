"use client";

import { motion } from "framer-motion";
import SkillBubble from "./SkillBubble";
import { skills } from "../data/skills";

const positions = skills.map((_, i) => {
  const angle = (i / skills.length) * 2 * Math.PI - Math.PI / 2;
  const r = 36;
  return {
    left: `${50 + r * Math.cos(angle)}%`,
    top: `${50 + r * Math.sin(angle)}%`,
  };
});

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function SkillsUniverse() {
  return (
    <section
      id="skills"
      className="relative py-20 sm:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-40 left-20 h-96 w-96 rounded-full bg-brand-500/10 blur-[150px]" />
        <div className="absolute bottom-40 right-20 h-96 w-96 rounded-full bg-accent-purple/10 blur-[150px]" />
      </div>

      {/* Huge Background Text */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <h1 className="absolute -left-10 sm:left-0 top-10 sm:top-20 text-[120px] sm:text-[180px] lg:text-[280px] font-black text-text-mask select-none">
          STACK
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          <span className="text-brand-400 uppercase tracking-[4px] text-sm">
            Technology
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mt-3 sm:mt-4">
            Tech Ecosystem
          </h2>
        </motion.div>

        {/* Desktop: Orbital Layout (md+) */}
        <div className="hidden md:block relative mt-24 min-h-[900px]">
          {/* Center Circle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-60 xl:size-72 rounded-full border border-brand-500/20 bg-brand-500/5 backdrop-blur-md flex items-center justify-center z-10"
          >
            <div className="text-center">
              <h3 className="text-2xl xl:text-4xl font-black">Goutham</h3>
              <p className="text-text-muted text-sm xl:text-base mt-1 xl:mt-2">Software Engineer</p>
            </div>
          </motion.div>

          {/* Orbital Skills */}
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease }}
              className="absolute w-[170px] xl:w-[200px]"
              style={{
                left: positions[i].left,
                top: positions[i].top,
                transform: "translate(-50%, -50%)",
              }}
            >
              <SkillBubble skill={skill} index={i + 1} />
            </motion.div>
          ))}
        </div>

        {/* Mobile: Compact Layout (< md) */}
        <div className="md:hidden mt-10">
          <div className="flex flex-col items-center gap-6">
            {/* Center badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
              className="size-40 rounded-full border border-brand-500/20 bg-brand-500/5 backdrop-blur-md flex items-center justify-center shrink-0"
            >
              <div className="text-center">
                <h3 className="text-2xl font-black">Goutham</h3>
                <p className="text-text-muted text-xs mt-1">Software Engineer</p>
              </div>
            </motion.div>

            {/* Skills grid */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease }}
                >
                  <SkillBubble skill={skill} index={i + 1} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
