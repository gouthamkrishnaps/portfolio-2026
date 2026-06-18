"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Briefcase,
  Building2,
  GraduationCap,
} from "lucide-react";

const experiences = [
  {
    title: "Junior Software Developer",
    company: "ICodeBees",
    period: "Aug 2024 - Present",
    icon: Briefcase,
    color: "from-cyan-500/10 via-blue-500/5 to-indigo-500/10 border-cyan-500/20 text-cyan-400",
    description:
      "Engineered high-performance eCommerce platforms, enterprise booking flows, and customized visual features. Led refactoring of legacy frontend structures into modular Next.js layouts.",
    skills: ["Next.js", "React", "TypeScript", "GraphQL", "Apollo", "Tailwind CSS"],
  },
  {
    title: "Software Developer Intern",
    company: "Mykare Health",
    period: "Jun 2024 - Jul 2024",
    icon: Building2,
    color: "from-purple-500/10 via-pink-500/5 to-pink-500/10 border-purple-500/20 text-purple-400",
    description:
      "Contributed to building patient-facing dashboards and search tools for health packages. Integrated REST APIs, optimized state management, and resolved responsiveness issues.",
    skills: ["React", "JavaScript", "REST APIs", "Tailwind CSS", "Redux Toolkit"],
  },
  {
    title: "MERN Stack Intern",
    company: "Luminar Technolab",
    period: "Jul 2023 - Mar 2024",
    icon: GraduationCap,
    color: "from-emerald-500/10 via-teal-500/5 to-green-500/10 border-emerald-500/20 text-emerald-400",
    description:
      "Trained intensely in full-stack JavaScript development. Developed, deployed, and audited full-stack applications, managing MongoDB databases and Express REST endpoints.",
    skills: ["MongoDB", "Express.js", "React", "Node.js", "REST APIs", "CSS3"],
  },
];

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of the section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section
      ref={containerRef}
      id="experience"
      className="relative py-20 sm:py-32 bg-bg-primary overflow-hidden"
    >
      {/* Decorative blurred background shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-purple-500/5 blur-[120px]" />
      </div>

      {/* Background Mask Text */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <h2 className="absolute -right-10 top-10 text-[100px] sm:text-[180px] lg:text-[250px] font-black text-text-mask tracking-widest leading-none">
          CAREER
        </h2>
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-6 relative z-10">
        
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-cyan-400 font-bold uppercase tracking-[4px] text-xs sm:text-sm">
            My Journey
          </span>

          <h2 className="mt-3 text-4xl sm:text-5xl md:text-6xl font-black leading-none uppercase tracking-tight">
            Work History
          </h2>
        </motion.div>

        {/* Timeline Content */}
        <div className="relative mt-20 md:mt-28">
          
          {/* Faint Timeline Track Line */}
          <div className="absolute left-[18px] sm:left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-surface-border md:-translate-x-1/2" />

          {/* Active Glowing Scroll-Linked Timeline Progress Line */}
          <motion.div
            style={{ scaleY, originY: 0 }}
            className="absolute left-[18px] sm:left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-400 via-indigo-500 to-purple-500 origin-top shadow-[0_0_10px_rgba(6,182,212,0.6)] md:-translate-x-1/2"
          />

          <div className="space-y-12 sm:space-y-16">
            {experiences.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.company}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: index * 0.15 }}
                  className={`relative flex flex-col md:flex-row ${
                    index % 2 === 0 ? "md:justify-start" : "md:justify-end"
                  }`}
                >
                  
                  {/* Card Container */}
                  <div
                    className={`w-[calc(100%-2.5rem)] ml-8 sm:w-[calc(100%-3.5rem)] sm:ml-12 md:w-[46%] md:ml-0 rounded-[24px] border p-6 sm:p-8 backdrop-blur-md bg-gradient-to-br ${item.color} glowing-border-parent relative transition-all duration-300 hover:shadow-xl`}
                  >
                    <div className="glowing-border-glow" />

                    {/* Job Details Header */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-surface-raised border border-surface-border flex items-center justify-center shrink-0">
                        <Icon size={20} className={item.color.split(" ").pop()} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-xl sm:text-2xl font-black truncate tracking-wide text-slate-900 dark:text-white">
                          {item.title}
                        </h3>

                        <p className="text-cyan-400 text-sm sm:text-base font-bold truncate">
                          {item.company}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-text-muted mt-3 font-semibold">
                      {item.period}
                    </p>

                    <p className="mt-4 text-sm sm:text-base text-text-secondary leading-relaxed">
                      {item.description}
                    </p>

                    {/* Skill Badges for this Role */}
                    <div className="flex flex-wrap gap-2 mt-6 border-t border-surface-border/40 pt-4">
                      {item.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-md bg-surface/50 border border-surface-border text-text-muted text-xs font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Timeline Dot/Node */}
                  <div className="absolute left-[10px] sm:left-[14px] md:left-1/2 top-8 md:top-12 md:-translate-x-1/2 flex items-center justify-center">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-cyan-500 border-[3px] border-bg-primary shadow-[0_0_8px_rgba(6,182,212,0.8)] z-10" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Small Bottom Features summary (3 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-20 sm:mt-28">
          {[
            { metric: "20+", desc: "Responsive Projects Shipped" },
            { metric: "Clean Code", desc: "Atomic Component Design" },
            { metric: "Next.js", desc: "Production Performance Ready" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="glass-panel rounded-2xl p-6 border border-surface-border text-center sm:text-left glowing-border-parent relative"
            >
              <div className="glowing-border-glow" />
              <h3 className="text-2xl font-black text-cyan-400">{item.metric}</h3>
              <p className="mt-1.5 text-text-muted text-sm sm:text-base">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}