"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowDown, ArrowRight, Command } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import dynamic from "next/dynamic";

// Dynamic import with no SSR for WebGL canvas
const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

const specialties = [
  "Next.js & React Architecture",
  "Headless Commerce & GraphQL",
  "Interactive WebGL & 3D UI",
];

function MagneticLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.18;
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.18;
    setOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
      }}
      className={className}
    >
      {children}
    </a>
  );
}

export default function Hero() {
  const [isIntroFinished, setIsIntroFinished] = useState(false);
  const [specialtyIndex, setSpecialtyIndex] = useState(0);
  const [typedText, setTypedText] = useState(specialties[0]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Check if preloader was already completed or reduced motion is preferred
    if (
      sessionStorage.getItem("preloader-done") === "true" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
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

  useEffect(() => {
    if (!isIntroFinished || isPaused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTypedText(specialties[specialtyIndex]);
      return;
    }

    const currentFull = specialties[specialtyIndex];

    if (!isDeleting && typedText === currentFull) {
      const pauseTimer = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(pauseTimer);
    }

    if (isDeleting && typedText === "") {
      setIsDeleting(false);
      setSpecialtyIndex((prev) => (prev + 1) % specialties.length);
      return;
    }

    const delay = isDeleting ? 26 : 48;
    const timer = setTimeout(() => {
      setTypedText((prev) =>
        isDeleting
          ? currentFull.slice(0, prev.length - 1)
          : currentFull.slice(0, prev.length + 1)
      );
    }, delay);

    return () => clearTimeout(timer);
  }, [isIntroFinished, isPaused, isDeleting, typedText, specialtyIndex]);

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-primary pt-24 pb-20 sm:pt-24 sm:pb-16"
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
          {/* Editorial Greeting */}
          <motion.p
            variants={itemVariants}
            className="mb-3 sm:mb-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-text-muted flex items-center justify-center gap-2"
          >
            <span aria-hidden="true" className="text-sm sm:text-base leading-none">
              👋
            </span>
            <span>Hey, I&apos;m</span>
          </motion.p>

          {/* Name Heading */}
          <motion.h1
            variants={itemVariants}
            className="w-full text-[clamp(2.45rem,10vw,3.75rem)] sm:text-6xl md:text-7xl lg:text-[74px] xl:text-[88px] font-black uppercase tracking-tight leading-[1.02] text-zinc-900 dark:text-zinc-50 text-center lg:whitespace-nowrap"
          >
            Goutham
            <br className="lg:hidden" />{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 dark:from-indigo-400 dark:via-indigo-400 dark:to-cyan-400">
              Krishna P S
            </span>
          </motion.h1>

          {/* Editorial Role & Cycling Specialty (locked left-side position) */}
          <motion.div
            variants={itemVariants}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="mt-4 sm:mt-5 w-full max-w-3xl flex flex-col sm:grid sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1 sm:gap-3 text-sm sm:text-lg md:text-xl font-medium tracking-wide"
          >
            <h2 className="text-text-muted sm:text-right whitespace-nowrap">
              Software Engineer
            </h2>
            <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700" aria-hidden="true">
              /
            </span>
            <button
              type="button"
              onClick={() => {
                const next = (specialtyIndex + 1) % specialties.length;
                setSpecialtyIndex(next);
                setTypedText(specialties[next]);
                setIsDeleting(false);
              }}
              aria-label={`Current specialty: ${specialties[specialtyIndex]}. Click to cycle specialty.`}
              className="group relative sm:justify-self-start text-center sm:text-left focus-ring rounded-sm cursor-pointer pb-1 whitespace-nowrap"
            >
              <span className="inline-flex items-center font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400 leading-normal">
                {"\u200B"}
                {typedText}
                <span
                  aria-hidden="true"
                  className="inline-block w-[2px] h-[1em] ml-0.5 bg-cyan-500 dark:bg-cyan-400 animate-pulse shrink-0"
                />
              </span>
              <span
                aria-hidden="true"
                className="block h-[1.5px] w-full opacity-35 group-hover:opacity-100 bg-gradient-to-r from-indigo-500 to-cyan-500 transition-opacity duration-300"
              />
            </button>
          </motion.div>

          {/* Bio Description */}
          <motion.p
            variants={itemVariants}
            className="mt-4 sm:mt-6 max-w-md sm:max-w-xl text-sm sm:text-base md:text-[17px] text-text-secondary leading-relaxed"
          >
            Specializing in React, Next.js, and high-performance web applications.
            Focused on building pixel-perfect UI systems, modern design architectures,
            and fast, accessible web experiences.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-row items-center justify-center gap-2.5 sm:gap-3 mt-6 sm:mt-8"
          >
            {/* Primary: Dark inverted button with magnetic pull & micro-glow */}
            <MagneticLink
              href="#projects"
              className="group relative inline-flex items-center gap-1.5 px-4 py-2 sm:px-6 sm:py-2.5 rounded-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold text-xs sm:text-[13px] tracking-wide transition-transform duration-200 ease-out active:scale-95 focus-ring"
            >
              <span className="relative z-10">View Projects</span>
              <ArrowRight
                size={14}
                className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
              />
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_24px_rgba(99,102,241,0.35)] dark:shadow-[0_0_24px_rgba(99,102,241,0.25)]" />
            </MagneticLink>

            {/* Secondary: Ghost/outline button with magnetic pull */}
            <MagneticLink
              href="#contact"
              className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-2.5 rounded-full border border-zinc-300 dark:border-zinc-700 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 font-semibold text-xs sm:text-[13px] tracking-wide transition-transform duration-200 ease-out active:scale-95 focus-ring"
            >
              Get in Touch
            </MagneticLink>
          </motion.div>

          {/* Social Icons Row + Command Palette Hint */}
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

            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
              className="hidden sm:inline-flex items-center gap-1.5 h-11 px-3.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 hover:border-indigo-500/40 hover:bg-indigo-500/5 text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-medium transition-all duration-300 focus-ring cursor-pointer"
              aria-label="Open quick navigation command palette"
            >
              <Command size={13} />
              <span>Quick Jump</span>
              <kbd className="ml-1 px-1.5 py-0.5 text-[10px] font-semibold rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                ⌘K
              </kbd>
            </button>
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