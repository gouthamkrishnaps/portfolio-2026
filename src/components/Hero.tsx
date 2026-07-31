"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  ArrowDown,
  Terminal,
  Activity,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import dynamic from "next/dynamic";
import FloatingTech from "./FloatingTech";
import { EncryptedText } from "@/images/components/ui/encrypted-text";

// Dynamic import with no SSR for WebGL wave-field canvas
const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-primary pt-20 pb-24 sm:pb-8"
    >
      {/* WebGL Wave-Field Interactive Canvas */}
      <HeroCanvas />

      {/* Decorative center spotlight to ensure text readability */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--bg-primary)_0%,transparent_55%)] pointer-events-none opacity-60" />

      {/* Top & bottom vignettes */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bg-primary to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg-primary to-transparent pointer-events-none" />

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
          className="text-center w-full max-w-5xl flex flex-col items-center"
        >


          {/* Master Name Header */}
          <h1 className="w-full text-6xl xs:text-7xl sm:text-[7vw] md:text-[6.8vw] lg:text-[90px] font-black uppercase tracking-tight leading-[0.95] text-slate-900 dark:text-white sm:whitespace-nowrap text-center">
            Goutham
            <br className="sm:hidden" />{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 dark:from-cyan-400 dark:via-indigo-400 dark:to-purple-500 text-glow">
              Krishna P S
            </span>
          </h1>

          {/* Role subtitle */}
          <h2 className="mt-4 sm:mt-6 text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-[8px] sm:tracking-[12px] text-text-muted">
            <EncryptedText
              text="Software Engineer"
              encryptedClassName="text-text-muted/40"
              revealedClassName="text-text-muted"
              revealDelayMs={55}
            />
          </h2>

          {/* Intro Description */}
          <p className="mt-5 sm:mt-8 max-w-xl text-sm sm:text-base md:text-lg text-text-secondary leading-relaxed">
            Architecting interactive browser installations, complex e-commerce engines,
            and lightweight mathematical UI layouts. Transforming vectors into code.
          </p>

          {/* Actions button strip */}
          <div className="flex flex-row items-center justify-center gap-3 mt-6 sm:mt-10">
            <a
              href="#projects"
              className="px-6 py-3 sm:px-8 sm:py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
            >
              Selected Work
            </a>

            <a
              href="#contact"
              className="px-6 py-3 sm:px-8 sm:py-3.5 rounded-full border border-surface-border bg-surface/30 backdrop-blur-md hover:bg-surface/60 text-slate-900 dark:text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 hover:border-cyan-500/50 hover:text-cyan-600 dark:hover:text-cyan-400 hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
            >
              Get In Touch
            </a>
          </div>

          {/* Social icons row */}
          <div className="flex items-center gap-4 sm:gap-5 mt-6 sm:mt-10">
            {[
              { icon: FaGithub, href: "https://github.com/gouthamkrishnaps", label: "GitHub" },
              { icon: FaLinkedin, href: "https://linkedin.com/in/gouthamkrishnaps", label: "LinkedIn" },
              { icon: Mail, href: "mailto:gouthamkrishnaps02@gmail.com", label: "Email" },
            ].map((social, idx) => {
              const Icon = social.icon;
              return (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 sm:p-3.5 rounded-full bg-surface/20 border border-surface-border hover:border-cyan-500/40 hover:bg-surface/80 hover:text-cyan-600 dark:hover:text-cyan-400 text-text-muted transition-all duration-300"
                  aria-label={social.label}
                  id={`social-link-${social.label.toLowerCase()}`}
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>

        </motion.div>
      </div>

      {/* Side floating tech cards for large viewports */}
      <FloatingTech parallax={parallax} />

      {/* Compact HUD Status Ribbon at Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isIntroFinished ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute bottom-3 sm:bottom-5 inset-x-0 px-6 sm:px-12 w-full flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 pointer-events-none select-none text-[10px] sm:text-xs font-mono text-text-tertiary uppercase tracking-wider"
      >
        {/* Left side telemetry metrics */}
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Terminal size={12} className="text-cyan-600 dark:text-cyan-400" />
            TELEMETRY: <span className="text-cyan-600 dark:text-cyan-300 font-bold">X: {coords.x} | Y: {coords.y}</span>
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
              <ArrowDown className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors" size={20} />
            </a>
          </motion.div>
        </div>

        {/* Right side diagnostics */}
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Activity size={12} className="text-purple-600 dark:text-purple-400" />
            DIAGNOSTICS: <span className="text-green-600 dark:text-green-400 flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-400 pulse-badge" /> ONLINE
            </span>
          </span>
          <span className="hidden sm:inline">PING: <span className="text-purple-600 dark:text-purple-300 font-semibold">12MS</span></span>
          <span className="text-slate-800 dark:text-white font-semibold">{time}</span>
        </div>
      </motion.div>
    </section>
  );
}