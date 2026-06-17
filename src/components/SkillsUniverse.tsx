"use client";

import { motion } from "framer-motion";
import SkillBubble from "./SkillBubble";
import { skills } from "../data/skills";

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
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full border border-brand-500/20 bg-brand-500/5 backdrop-blur-md flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-4xl font-black">Goutham</h3>
              <p className="text-text-muted mt-2">Software Engineer</p>
            </div>
          </div>

          {/* Floating Skills - Orbital positions */}
          <div className="absolute left-[5%] top-[5%]">
            <SkillBubble skill={skills[0]} index={1} />
          </div>
          <div className="absolute right-[10%] top-[10%]">
            <SkillBubble skill={skills[1]} index={2} />
          </div>
          <div className="absolute left-[15%] top-[45%]">
            <SkillBubble skill={skills[2]} index={3} />
          </div>
          <div className="absolute right-[15%] top-[50%]">
            <SkillBubble skill={skills[3]} index={4} />
          </div>
          <div className="absolute left-[10%] bottom-[10%]">
            <SkillBubble skill={skills[4]} index={5} />
          </div>
          <div className="absolute right-[10%] bottom-[10%]">
            <SkillBubble skill={skills[5]} index={6} />
          </div>
          <div className="absolute left-[40%] bottom-[2%]">
            <SkillBubble skill={skills[6]} index={7} />
          </div>
          <div className="absolute left-[40%] top-[2%]">
            <SkillBubble skill={skills[7]} index={8} />
          </div>
          <div className="absolute right-[40%] bottom-[5%]">
            <SkillBubble skill={skills[8]} index={9} />
          </div>
        </div>

        {/* Mobile: Compact Linear Layout (< md) */}
        <div className="md:hidden mt-10">
          {/* Center badge */}
          <div className="mx-auto mb-10 h-48 w-48 rounded-full border border-brand-500/20 bg-brand-500/5 backdrop-blur-md flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-3xl font-black">Goutham</h3>
              <p className="text-text-muted text-sm mt-1">Software Engineer</p>
            </div>
          </div>

          {/* Skills grid */}
          <div className="flex flex-wrap justify-center gap-4">
            {skills.map((skill, index) => (
              <SkillBubble key={skill.name} skill={skill} index={index + 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}