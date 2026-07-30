"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Tilt from "react-parallax-tilt";
import Profileimage from "@/images/assets/generatedimage.png";
import CounterCard from "./CounterCard";
import { FaReact, FaNodeJs } from "react-icons/fa";
import { SiNextdotjs, SiTypescript, SiGraphql, SiThreedotjs, SiTailwindcss } from "react-icons/si";

const techIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Next.js": SiNextdotjs,
  "React": FaReact,
  "TypeScript": SiTypescript,
  "GraphQL": SiGraphql,
  "Three.js": SiThreedotjs,
  "Tailwind CSS": SiTailwindcss,
  "Node.js": FaNodeJs,
};

const stats = [
  {
    value: "2+",
    label: "Years Experience",
  },
  {
    value: "20+",
    label: "Projects Completed",
  },
  {
    value: "5+",
    label: "Companies & Clients",
  },
  {
    value: "20+",
    label: "Technologies",
  },
];

export default function About() {
  return (
    <section id="about" className="relative py-20 sm:py-32 bg-bg-primary overflow-hidden">
      {/* Decorative blurred background shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full bg-indigo-500/10 blur-[130px]" />
        <div className="absolute top-1/2 -left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      {/* Huge Background Mask Text */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <h2 className="absolute -left-10 top-10 text-[100px] sm:text-[180px] lg:text-[250px] font-black text-text-mask tracking-widest leading-none">
          ABOUT
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 sm:gap-16 items-center">
          
          {/* Profile Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-5 relative group"
          >
            {/* Glowing border outline behind image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-[30px] blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
            
            <Tilt
              tiltMaxAngleX={6}
              tiltMaxAngleY={6}
              perspective={1500}
              scale={1.02}
              glareEnable
              glareMaxOpacity={0.08}
              className="relative rounded-[30px] border border-surface-border overflow-hidden bg-surface/30 backdrop-blur-md shadow-2xl"
            >
              <Image
                src={Profileimage}
                alt="Goutham Krishna"
                width={600}
                height={800}
                className="w-full h-auto object-cover rounded-[30px] transition-transform duration-700 group-hover:scale-103"
                priority
              />
            </Tilt>
          </motion.div>

          {/* About Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <span className="text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-[4px] text-xs sm:text-sm">
              Discover My Story
            </span>

            <h2 className="mt-3 text-4xl sm:text-5xl md:text-6xl font-black leading-none uppercase tracking-tight">
              Building Modern
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-indigo-600 dark:from-cyan-400 dark:to-indigo-400">
                Digital Products
              </span>
            </h2>

            <p className="mt-6 text-text-secondary text-base sm:text-lg leading-relaxed">
              I'm Goutham Krishna P S, a passionate and results-driven Software Developer. 
              My focus is on crafting clean, modular React, Next.js, and TypeScript architectures 
              and implementing high-end frontend experiences that are engaging and highly performant.
            </p>

            <p className="mt-4 text-text-secondary text-base sm:text-lg leading-relaxed">
              Currently working at <strong>ICodeBees</strong>, where I construct complex, enterprise-level 
              e-commerce portals and interactive SaaS interfaces. I have contributed to custom features for 
              major brands like <em>Avumy</em>, <em>Darlings of Chelsea</em>, <em>Permatech</em>, and <em>Rubberized</em>.
            </p>

            <p className="mt-4 text-text-secondary text-base sm:text-lg leading-relaxed">
              My engineering philosophy revolves around pixel-perfect accuracy, optimization (Core Web Vitals), 
              responsive fluidity, and pushing the boundaries of what is possible in the browser.
            </p>

            {/* Core Tech Stack Pills */}
            <div className="flex flex-wrap gap-2.5 mt-8">
              {[
                "Next.js",
                "React",
                "TypeScript",
                "GraphQL",
                "Three.js",
                "Tailwind CSS",
                "Node.js",
              ].map((item) => {
                const Icon = techIcons[item];
                return (
                  <span
                    key={item}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/25 bg-cyan-500/5 text-cyan-600 dark:text-cyan-300 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-700 dark:hover:text-white cursor-default group"
                  >
                    {Icon && <Icon className="w-4 h-4 text-cyan-600/80 dark:text-cyan-400/80 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />}
                    <span>{item}</span>
                  </span>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-20 sm:mt-28">
          {stats.map((item) => (
            <CounterCard
              key={item.label}
              value={item.value}
              label={item.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
