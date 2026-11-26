"use client";

import { motion } from "framer-motion";
import Skills3D from "./Skills3D";
import { FaReact, FaNodeJs, FaHtml5, FaSass, FaGithub, FaDocker, FaCube, FaInfinity } from "react-icons/fa";
import {
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiExpress,
  SiGraphql,
  SiApollographql,
  SiMongodb,
  SiMysql,
  SiThreedotjs,
  SiFramer,
  SiRedux,
  SiJavascript,
  SiRadixui,
  SiFirebase,
  SiPostgresql,
  SiJsonwebtokens,
  SiVercel,
  SiVite,
} from "react-icons/si";
import { TbApi, TbBuildingStore } from "react-icons/tb";
import { VscAzureDevops } from "react-icons/vsc";

const skillsMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "React 19": FaReact,
  "Next.js 16": SiNextdotjs,
  "TypeScript": SiTypescript,
  "JavaScript (ES6+)": SiJavascript,
  "HTML5/CSS3": FaHtml5,
  "SCSS": FaSass,
  "Tailwind CSS": SiTailwindcss,
  "Three.js / WebGL": SiThreedotjs,
  "Framer Motion": SiFramer,
  "Redux Toolkit": SiRedux,
  "Radix UI / Shadcn UI": SiRadixui,
  "Node.js": FaNodeJs,
  "Express.js": SiExpress,
  "GraphQL": SiGraphql,
  "Apollo Client": SiApollographql,
  "REST APIs": TbApi,
  "JWT / OAuth": SiJsonwebtokens,
  "Firebase": SiFirebase,
  "PostgreSQL": SiPostgresql,
  "MongoDB": SiMongodb,
  "MySQL": SiMysql,
  "Azure Devops": VscAzureDevops,
  "Git / GitHub": FaGithub,
  "Vercel": SiVercel,
  "Docker": FaDocker,
  "CI/CD Pipelines": FaInfinity,
  "Vite": SiVite,
  "Cylindo 3D": FaCube,
  "ERP Software": TbBuildingStore,
};

const skillCategories = [
  {
    title: "Frontend & Creative UI",
    skills: [
      "React 19",
      "Next.js 16",
      "TypeScript",
      "JavaScript (ES6+)",
      "Three.js / WebGL",
      "Framer Motion",
      "Redux Toolkit",
      "Radix UI / Shadcn UI",
      "Tailwind CSS",
      "SCSS",
      "HTML5/CSS3",
    ],
    color: "text-cyan-600 dark:text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
  },
  {
    title: "Backend, Auth & Databases",
    skills: [
      "Node.js",
      "Express.js",
      "GraphQL",
      "Apollo Client",
      "REST APIs",
      "JWT / OAuth",
      "Firebase",
      "PostgreSQL",
      "MongoDB",
      "MySQL",
    ],
    color: "text-indigo-600 dark:text-indigo-400 border-indigo-500/20 bg-indigo-500/5",
  },
  {
    title: "Cloud, DevOps & Platforms",
    skills: [
      "Vercel",
      "Docker",
      "CI/CD Pipelines",
      "Vite",
      "Azure Devops",
      "Git / GitHub",
      "Cylindo 3D",
      "ERP Software",
    ],
    color: "text-purple-600 dark:text-purple-400 border-purple-500/20 bg-purple-500/5",
  },
];

export default function SkillsUniverse() {
  return (
    <section
      id="skills"
      className="relative py-20 sm:py-32 bg-bg-primary overflow-hidden"
    >
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full bg-cyan-500/5 blur-[130px]" />
        <div className="absolute top-10 right-10 w-[250px] h-[250px] rounded-full bg-purple-500/5 blur-[120px]" />
      </div>

      {/* Huge Background Mask Text */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <h2 className="absolute -left-10 top-10 text-[100px] sm:text-[180px] lg:text-[250px] font-black text-text-mask tracking-widest leading-none">
          STACK
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 relative z-10">
        
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.4 }}
          className="text-center sm:text-left mb-16"
        >
          <span className="text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-[4px] text-xs sm:text-sm">
            Interactive Stack
          </span>
          <h2 className="mt-3 text-4xl sm:text-5xl md:text-6xl font-black leading-none uppercase tracking-tight">
            Core Ecosystem
          </h2>
          <p className="mt-4 max-w-xl text-text-muted text-sm sm:text-base leading-relaxed">
            Move your cursor or drag the tag cloud to spin the sphere. Hover over tags to expand.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Interactive 3D Sphere */}
          <div className="lg:col-span-7 flex justify-center items-center">
            <Skills3D />
          </div>

          {/* Right Column: Skill categories breakdown list */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-5 space-y-4"
          >
            {skillCategories.map((cat) => (
              <div
                key={cat.title}
                className="glass-panel p-4 sm:p-5 rounded-2xl border border-surface-border glowing-border-parent relative"
              >
                <div className="glowing-border-glow" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 border-b border-surface-border/40 pb-2">
                  {cat.title}
                </h3>
                
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((item) => {
                    const Icon = skillsMap[item];
                    return (
                      <span
                        key={item}
                        className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[11px] font-medium ${cat.color}`}
                      >
                        {Icon && <Icon className="w-3 h-3 shrink-0" />}
                        <span>{item}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
