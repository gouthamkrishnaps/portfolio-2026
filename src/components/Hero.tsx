"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowDown } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import dynamic from "next/dynamic";

// Dynamic import with no SSR for WebGL canvas
const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

export default function Hero() {
  const [isIntroFinished, setIsIntroFinished] = useState(false);

  useEffect(() => {
    // Check if preloader was already completed
    if (sessionStorage.getItem("preloader-done") === "true") {
      setIsIntroFinished(true);
    }

    const handleHudLoaded = () => {
      setIsIntroFinished(true);
    };

    window.addEventListener("hud-loaded", handleHudLoaded);

    return () => {
      window.removeEventListener("hud-loaded", handleHudLoaded);
    };
  }, []);

  // Staggered animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-primary pt-20 pb-24 sm:pb-8"
    >
      {/* Toned-down WebGL Canvas */}
      <HeroCanvas />

      {/* Subtle dot-grid background overlay */}
      <div className="absolute inset-0 dot-grid-bg opacity-40 pointer-events-none" />

      {/* Center radial readability mask */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--bg-primary)_0%,transparent_70%)] pointer-events-none opacity-70" />

      {/* Top & bottom vignettes */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bg-primary to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg-primary to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 w-full max-w-5xl flex flex-col items-center justify-center">
        {/* Staggered Entry Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isIntroFinished ? "visible" : "hidden"}
          className="text-center w-full flex flex-col items-center"
        >
          {/* Name Heading */}
          <motion.h1
            variants={itemVariants}
            className="w-full text-5xl xs:text-6xl sm:text-7xl md:text-[80px] lg:text-[88px] font-black uppercase tracking-tight leading-[1] text-zinc-900 dark:text-zinc-50 text-center sm:whitespace-nowrap"
          >
            Goutham
            <br className="sm:hidden" />{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 dark:from-indigo-400 dark:via-indigo-400 dark:to-cyan-400">
              Krishna P S
            </span>
          </motion.h1>

          {/* Role Subtitle */}
          <motion.h2
            variants={itemVariants}
            className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl font-medium text-text-muted tracking-wide"
          >
            Frontend & Full-Stack Software Engineer
          </motion.h2>

          {/* Bio Description */}
          <motion.p
            variants={itemVariants}
            className="mt-5 sm:mt-6 max-w-xl text-sm sm:text-base md:text-[17px] text-text-secondary leading-relaxed"
          >
            Specializing in React, Next.js, and high-performance web applications.
            Focused on building pixel-perfect UI systems, modern design architectures,
            and fast, accessible web experiences.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-row items-center justify-center gap-3 mt-8 sm:mt-10"
          >
            {/* Primary: Dark inverted button with micro-glow */}
            <a
              href="#projects"
              className="group relative px-5 py-2.5 sm:px-8 sm:py-3.5 rounded-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold text-xs sm:text-sm tracking-wide transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 focus-ring"
            >
              <span className="relative z-10">View Projects</span>
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_20px_rgba(99,102,241,0.3)] dark:shadow-[0_0_20px_rgba(99,102,241,0.2)]" />
            </a>

            {/* Secondary: Ghost/outline button */}
            <a
              href="#contact"
              className="px-5 py-2.5 sm:px-8 sm:py-3.5 rounded-full border border-zinc-300 dark:border-zinc-700 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 font-semibold text-xs sm:text-sm tracking-wide transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 focus-ring"
            >
              Get in Touch
            </a>
          </motion.div>

          {/* Social Icons Row */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 mt-8 sm:mt-10"
          >
            {[
              {
                icon: FaGithub,
                href: "https://github.com/gouthamkrishnaps",
                label: "GitHub",
              },
              {
                icon: FaLinkedin,
                href: "https://linkedin.com/in/gouthamkrishnaps",
                label: "LinkedIn",
              },
              {
                icon: Mail,
                href: "mailto:gouthamkrishnaps02@gmail.com",
                label: "Email",
              },
            ].map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-11 h-11 flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 hover:border-indigo-500/40 hover:bg-indigo-500/5 text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 focus-ring"
                  aria-label={social.label}
                  id={`social-link-${social.label.toLowerCase()}`}
                >
                  <Icon size={18} />
                  {/* Tooltip */}
                  <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 px-2.5 py-1 text-[11px] font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
                    {social.label}
                  </span>
                </a>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isIntroFinished ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.a
          href="#about"
          aria-label="Scroll to About section"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-zinc-400 dark:text-zinc-600 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors focus-ring rounded-full p-2 block"
        >
          <ArrowDown size={20} />
        </motion.a>
      </motion.div>
    </section>
  );
}