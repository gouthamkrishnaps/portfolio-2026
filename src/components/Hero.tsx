"use client";

import { motion } from "framer-motion";
import {
  Mail,
  ArrowDown,
  GitFork,
  Link2,
} from "lucide-react";
import FloatingTech from "./FloatingTech";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-20 -left-1/4 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] rounded-full bg-brand-600/20 blur-[100px] sm:blur-[150px]" />
        <div className="absolute bottom-20 -right-1/4 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] rounded-full bg-accent-purple-deep/20 blur-[100px] sm:blur-[150px]" />
      </div>

      {/* Huge Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="text-center leading-none scale-[0.6] sm:scale-[0.8] md:scale-100">
          <h1 className="text-[90px] sm:text-[150px] md:text-[220px] lg:text-[320px] font-black uppercase text-text-mask-light tracking-tight">
            SOFTWARE
          </h1>

          <h1 className="-mt-4 sm:-mt-6 md:-mt-16 text-[90px] sm:text-[150px] md:text-[220px] lg:text-[320px] font-black uppercase text-text-mask-light tracking-tight">
            ENGINEER
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-5xl">
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 border border-surface-border bg-surface px-4 py-2 rounded-full backdrop-blur-md mb-8"
          >
            <span className="h-2 w-2 rounded-full bg-accent-green" />
            Available for opportunities
          </motion.div>

          {/* Name */}
          <motion.h2
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-none"
          >
            Goutham
            <br />
            <span className="text-brand-500">
              Krishna P S
            </span>
          </motion.h2>

          {/* Role */}
          <motion.h3
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-4 sm:mt-6 text-xl sm:text-2xl md:text-4xl font-semibold text-text-secondary"
          >
            Junior Software Developer
          </motion.h3>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 sm:mt-8 max-w-2xl text-base sm:text-lg md:text-xl text-text-muted leading-relaxed"
          >
            Building scalable web applications,
            enterprise eCommerce platforms,
            and high-performance digital experiences
            using React, Next.js, TypeScript,
            GraphQL and Node.js.
          </motion.p>

          {/* Tech Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-2 sm:gap-3 mt-8 sm:mt-10"
          >
            {[
              "Next.js",
              "React",
              "TypeScript",
              "GraphQL",
              "Node.js",
              "Tailwind",
            ].map((tech) => (
              <div
                key={tech}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-300 text-sm sm:text-base"
              >
                {tech}
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-3 sm:gap-4 mt-10 sm:mt-12"
          >
            <a
              href="#projects"
              className="bg-brand-600 hover:bg-brand-700 transition px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base"
            >
              View Projects
            </a>

            <a
              href="#contact"
              className="border border-surface-border hover:border-surface-hover transition px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base"
            >
              Contact Me
            </a>
          </motion.div>

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center gap-5 mt-10 sm:mt-12"
          >
            <a
              href="https://github.com"
              target="_blank"
              className="hover:text-brand-400 transition"
            >
              <GitFork size={24} />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              className="hover:text-brand-400 transition"
            >
              <Link2 size={24} />
            </a>

            <a
              href="mailto:gouthamkrishnaps02@gmail.com"
              className="hover:text-brand-400 transition"
            >
              <Mail size={24} />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{
          y: [0, 12, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
        }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <ArrowDown className="text-text-tertiary" />
      </motion.div>
      <FloatingTech />
    </section>
  );
}