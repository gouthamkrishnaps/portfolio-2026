"use client";

import { motion } from "framer-motion";
import { Terminal, Cpu, Sparkles, ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import HeroBackground from "./HeroBackground";

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 20 },
    },
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-zinc-950 text-white selection:bg-cyan-500/30">
      {/* 3D WebGL Anti-Gravity Background Canvas */}
      <HeroBackground />

      {/* Decorative vignettes to blend sections */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-zinc-950 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />

      {/* Hero Content Overlay */}
      <div className="container mx-auto px-6 relative z-10 w-full max-w-5xl flex flex-col items-center justify-center text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center max-w-3xl"
        >
          {/* Top Tech Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/30 backdrop-blur-md text-cyan-400 text-xs font-semibold tracking-wider uppercase mb-6"
          >
            <Cpu size={14} className="animate-pulse" />
            <span>GPU Accelerated Physics</span>
          </motion.div>

          {/* Title Header */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-[0.95] text-slate-100 mb-6"
          >
            Liquid Grid
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500">
              Anti-Gravity
            </span>
          </motion.h1>

          {/* Subtitle Description */}
          <motion.p
            variants={itemVariants}
            className="text-zinc-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-xl mb-10"
          >
            Hover or touch the background to warp the 3D particle mesh. Experience organic waves and real-time gravity well simulation powered completely on the GPU.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16"
          >
            <a
              href="#explore"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-sm uppercase tracking-wider transition-all duration-300 shadow-xl shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:-translate-y-0.5"
            >
              Explore Components
              <ArrowRight size={16} />
            </a>

            <a
              href="https://github.com/gouthamkrishnaps"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-md hover:bg-zinc-800/80 text-zinc-200 font-black text-sm uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5"
            >
              <FaGithub size={16} />
              View Source
            </a>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-12 border-t border-zinc-800/60 pt-8 w-full"
          >
            {[
              { label: "Performance", val: "120 FPS", desc: "Instanced Point Rendering" },
              { label: "Calculations", val: "0 CPU", desc: "Driven inside GLSL Shaders" },
              { label: "Responsive", val: "Any Device", desc: "Fluid Vector Raycasting" },
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-2xl font-black text-cyan-400">{stat.val}</span>
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wide mt-1">{stat.label}</span>
                <span className="text-[10px] text-zinc-500 mt-0.5">{stat.desc}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Floating HUD ribbon details */}
      <div className="absolute bottom-5 inset-x-0 px-8 flex items-center justify-between text-[10px] font-mono text-zinc-600 uppercase tracking-widest pointer-events-none">
        <span className="flex items-center gap-2">
          <Terminal size={12} className="text-zinc-500" />
          WebGL Context: Active
        </span>
        <span className="flex items-center gap-1.5">
          <Sparkles size={12} className="text-cyan-500 animate-pulse" />
          Inspired by Antigravity.google
        </span>
      </div>
    </section>
  );
}
