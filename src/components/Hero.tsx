"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  ArrowDown,
  GitFork,
  Link2,
  Terminal,
  Activity,
  Cpu,
} from "lucide-react";
import dynamic from "next/dynamic";
import FloatingTech from "./FloatingTech";

// Dynamic import with no SSR for WebGL Flow Field
const ThreeBg = dynamic(() => import("./ThreeBg"), { ssr: false });

export default function Hero() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState("");
  const [screenDim, setScreenDim] = useState({ w: 1920, h: 1080 });
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

    // Track dynamic specs
    setScreenDim({ w: window.innerWidth, h: window.innerHeight });

    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });

      const px = (e.clientX / window.innerWidth) - 0.5;
      const py = (e.clientY / window.innerHeight) - 0.5;
      setParallax({ x: px, y: py });
    };

    const handleResize = () => {
      setScreenDim({ w: window.innerWidth, h: window.innerHeight });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    // Clock
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => {
      window.removeEventListener("hud-loaded", handleHudLoaded);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      clearInterval(interval);
    };
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-primary pt-20"
    >
      {/* WebGL Swirling Cosmic Flow Field */}
      <ThreeBg />

      {/* Decorative center spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,var(--bg-primary)_85%)] pointer-events-none" />

      {/* Sci-Fi Grid Backdrop */}
      <div
        className="absolute inset-0 pointer-events-none -z-10 animate-pulse"
        style={{
          backgroundImage: `
            linear-gradient(var(--grid-color) 1px, transparent 1px), 
            linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black, transparent 80%)",
          animationDuration: "4s",
        }}
      />

      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-cyan-500/10 blur-[130px] transition-transform duration-500"
          style={{ transform: `translate3d(${parallax.x * 40}px, ${parallax.y * 40}px, 0)` }}
        />
        <div className="absolute bottom-10 right-10 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-purple-500/10 blur-[130px] transition-transform duration-500"
          style={{ transform: `translate3d(${parallax.x * -40}px, ${parallax.y * -40}px, 0)` }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 w-full max-w-5xl flex flex-col items-center justify-center">

        {/* Center Contents Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isIntroFinished ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            x: parallax.x * 10,
            y: parallax.y * 10,
          }}
          className="text-center max-w-3xl flex flex-col items-center"
        >


          {/* Master Name Header */}
          <h1 className="text-6xl sm:text-8xl md:text-[100px] font-black uppercase tracking-tight leading-[0.95] text-slate-900 dark:text-white">
            Goutham
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 text-glow">
              Krishna P S
            </span>
          </h1>

          {/* Role subtitle */}
          <h2 className="mt-6 text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-[8px] sm:tracking-[12px] text-text-muted">
            Senior Frontend Engineer
          </h2>

          {/* Intro Description */}
          <p className="mt-8 max-w-xl text-sm sm:text-base md:text-lg text-text-secondary leading-relaxed">
            Architecting interactive browser installations, complex e-commerce engines,
            and lightweight mathematical UI layouts. Transforming vectors into code.
          </p>

          {/* Actions button strip */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 w-full sm:w-auto">
            <a
              href="#projects"
              className="w-full sm:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-sm uppercase tracking-wider transition-all duration-300 shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              Selected Work
            </a>

            <a
              href="#contact"
              className="w-full sm:w-auto px-10 py-4 rounded-full border border-surface-border bg-surface/30 backdrop-blur-md hover:bg-surface/60 text-slate-900 dark:text-white font-black text-sm uppercase tracking-wider transition-all duration-300 hover:border-cyan-500/50 hover:text-cyan-600 dark:hover:text-cyan-400 hover:-translate-y-0.5 active:translate-y-0"
            >
              Get In Touch
            </a>
          </div>

          {/* Social icons row */}
          <div className="flex items-center gap-5 mt-10">
            {[
              { icon: GitFork, href: "https://github.com/gouthamkrishnaps", label: "GitHub" },
              { icon: Link2, href: "https://linkedin.com/in/gouthamkrishnaps", label: "LinkedIn" },
              { icon: Mail, href: "mailto:gouthamkrishnaps02@gmail.com", label: "Email" },
            ].map((social, idx) => {
              const Icon = social.icon;
              return (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-full bg-surface/20 border border-surface-border hover:border-cyan-500/40 hover:bg-surface/80 hover:text-cyan-400 text-text-muted transition-all duration-300"
                  aria-label={social.label}
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>

        </motion.div>
      </div>

      {/* Side floating tech cards for large viewports (cleared space) */}
      <FloatingTech parallax={parallax} />

      {/* Compact HUD Status Ribbon at Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isIntroFinished ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute bottom-5 inset-x-0 px-6 sm:px-12 w-full flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 pointer-events-none select-none text-[10px] sm:text-xs font-mono text-text-tertiary uppercase tracking-wider"
      >
        {/* Left side telemetry metrics */}
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Terminal size={12} className="text-cyan-400" />
            TELEMETRY: <span className="text-cyan-300">X: {coords.x} | Y: {coords.y}</span>
          </span>
          <span className="hidden md:inline">
            RESOLUTION: <span className="text-slate-800 dark:text-white">{screenDim.w} x {screenDim.h}</span>
          </span>
        </div>

        {/* Down Scroll Arrow link (Centered in middle space) */}
        <div className="hidden sm:block pointer-events-auto">
          <motion.div
            animate={{
              y: [0, 6, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
          >
            <a href="#about" aria-label="Scroll to About">
              <ArrowDown className="text-cyan-400 hover:text-cyan-300 transition-colors" size={20} />
            </a>
          </motion.div>
        </div>

        {/* Right side diagnostics */}
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Activity size={12} className="text-purple-400" />
            DIAGNOSTICS: <span className="text-green-400 flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-badge" /> ONLINE
            </span>
          </span>
          <span className="hidden sm:inline">PING: <span className="text-purple-300">12MS</span></span>
          <span className="text-slate-800 dark:text-white font-semibold">{time}</span>
        </div>
      </motion.div>
    </section>
  );
}