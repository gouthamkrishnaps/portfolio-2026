"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
  onComplete: () => void;
}

const statusSteps = [
  { threshold: 0, text: "VERIFYING SECURE PROTOCOLS..." },
  { threshold: 15, text: "COMPILING WEBGL MODULES..." },
  { threshold: 40, text: "PARSING CLIENT VIEWPORT DATA..." },
  { threshold: 65, text: "RENDERING INTERACTIVE SCENE..." },
  { threshold: 85, text: "LAUNCHING EXPERIENCE..." },
];

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState(statusSteps[0].text);
  const [isLoaded, setIsLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Handle progress interval
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      // Staggered incremental updates for realistic loading feel
      const increment = Math.floor(Math.random() * 8) + 3;
      current = Math.min(current + increment, 100);
      setProgress(current);

      // Update status text based on progress thresholds
      const activeStep = [...statusSteps]
        .reverse()
        .find((step) => current >= step.threshold);
      if (activeStep) {
        setStatusText(activeStep.text);
      }

      if (current >= 100) {
        clearInterval(interval);
        // Start exit animation after a tiny completion pause
        setTimeout(() => {
          setIsLoaded(true);
          // Trigger complete callback once exit transition concludes
          setTimeout(() => {
            onCompleteRef.current();
          }, 800);
        }, 300);
      }
    }, 80);

    return () => clearInterval(interval);
  }, []);

  // Ambient Starry Particle Orbit Canvas Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Create particles swirling in orbit
    const particleCount = 60;
    const particles: Array<{
      angle: number;
      radius: number;
      speed: number;
      size: number;
      color: string;
      pulseSpeed: number;
      pulseOffset: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      const isCyan = Math.random() > 0.4;
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: Math.random() * 200 + 80,
        speed: (Math.random() * 0.01 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
        size: Math.random() * 2 + 1,
        color: isCyan ? "rgba(6, 182, 212, " : "rgba(168, 85, 247, ",
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    let frameId: number;
    const drawParticles = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      particles.forEach((p) => {
        p.angle += p.speed;
        const x = centerX + Math.cos(p.angle) * p.radius;
        const y = centerY + Math.sin(p.angle) * p.radius;

        // Oscillate opacity for starry twinkling effect
        const alpha = Math.abs(Math.sin(Date.now() * p.pulseSpeed + p.pulseOffset)) * 0.4 + 0.1;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color.includes("6, 182") ? "rgba(6, 182, 212, 0.4)" : "rgba(168, 85, 247, 0.4)";
        ctx.fill();
      });

      frameId = requestAnimationFrame(drawParticles);
    };

    drawParticles();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 w-full h-full bg-[#030306] z-[99999] flex flex-col items-center justify-center select-none overflow-hidden font-sans"
        >
          {/* Subtle grid lines background */}
          <div 
            className="absolute inset-0 z-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), 
                                linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
              backgroundPosition: "center",
            }}
          />

          {/* Canvas for swirling ambient dust */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
          />

          {/* Central Glassmorphic App Launch Card */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ 
              scale: 18, 
              opacity: 0,
              filter: "blur(4px)",
              transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center bg-gradient-to-br from-neutral-900/60 to-neutral-950/80 backdrop-blur-xl border border-white/10 rounded-[32px] shadow-[0_0_50px_rgba(99,102,241,0.15)] relative z-10"
          >
            {/* Glowing backdrop halo */}
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-tr from-cyan-500/10 via-indigo-500/5 to-purple-500/15 blur-md" />

            <svg viewBox="0 0 100 100" className="w-20 h-20 sm:w-24 sm:h-24 relative z-10">
              <defs>
                <linearGradient id="loaderLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>

              {/* Outer spinning ring */}
              <circle
                cx="50"
                cy="50"
                r="43"
                fill="none"
                stroke="url(#loaderLogoGrad)"
                strokeWidth="1.5"
                strokeDasharray="25 15 35 15"
                className="animate-[spin_10s_linear_infinite]"
              />

              {/* Inner dashed tracker ring */}
              <circle
                cx="50"
                cy="50"
                r="37"
                fill="none"
                stroke="#6366f1"
                strokeWidth="0.75"
                strokeOpacity="0.3"
                strokeDasharray="3 3"
              />

              {/* Stylized Modern G Logo */}
              <motion.path
                d="M 72 38 
                   C 72 23, 28 23, 28 50 
                   C 28 77, 72 77, 72 62 
                   L 50 62 
                   L 50 51 
                   L 80 51"
                fill="none"
                stroke="url(#loaderLogoGrad)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </svg>
          </motion.div>

          {/* Lower HUD Info & Progress (Slides down & fades out on launch) */}
          <motion.div
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex flex-col items-center mt-10 relative z-10"
          >
            {/* Status indicator */}
            <span className="text-[10px] sm:text-xs font-black tracking-[3px] text-neutral-400 font-sans h-4 select-none">
              {statusText}
            </span>

            {/* Linear glowing progress bar */}
            <div className="flex items-center gap-4 mt-6">
              <div className="w-48 sm:w-56 h-[3px] bg-neutral-800 rounded-full overflow-hidden relative shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs sm:text-sm font-bold text-white tracking-wider w-8 text-right font-sans tabular-nums">
                {Math.round(progress)}%
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
