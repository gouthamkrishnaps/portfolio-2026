"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Cpu } from "lucide-react";

interface PreloaderProps {
  onComplete: () => void;
}

const logs = [
  "INITIALIZING GRAPHICS PORTAL...",
  "ESTABLISHING SECURE NODE CHANNELS...",
  "CONNECTING WEBGL FLOW MATRIX...",
  "PARSING CORE TELEMETRY...",
  "SYSTEM MODULES STANDBY...",
  "ALL SYSTEMS NOMINAL. LAUNCHING PORTFOLIO.",
];

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [currentLogIdx, setCurrentLogIdx] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Increment progress bar smoothly
    const duration = 2000; // 2 seconds boot
    const intervalTime = 30;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setIsLoaded(true);
          setTimeout(() => {
            onComplete();
          }, 600); // Allow fade-out exit buffer
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    // Switch log lines based on progress increments
    const logStep = 100 / logs.length;
    const currentStep = Math.floor(progress / logStep);
    if (currentStep < logs.length) {
      setCurrentLogIdx(Math.min(currentStep, logs.length - 1));
    }
  }, [progress]);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-100vh" }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 w-full h-full bg-[#030308] z-[99999] flex flex-col items-center justify-center font-mono text-cyan-400 p-6"
        >
          {/* HUD ambient glow backdrop */}
          <div className="absolute w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

          <div className="max-w-lg w-full flex flex-col gap-6 relative z-10">
            {/* Header Title Console */}
            <div className="flex items-center gap-3 border-b border-cyan-500/20 pb-4 justify-between">
              <div className="flex items-center gap-2.5">
                <Cpu size={20} className="pulse-badge text-cyan-400" />
                <span className="text-sm font-bold uppercase tracking-widest text-white">
                  Goutham-HUD Boot.v26
                </span>
              </div>
              <span className="text-xs text-cyan-400/50">SECURE SHELL v2</span>
            </div>

            {/* Log Terminal Screen */}
            <div className="h-32 bg-black/40 rounded-xl border border-surface-border p-4 flex flex-col justify-end text-xs leading-relaxed gap-1 text-cyan-400/80">
              {logs.slice(0, currentLogIdx).map((log, index) => (
                <div key={index} className="flex gap-2 text-cyan-400/40">
                  <span>&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
              <div className="flex gap-2 text-cyan-300 font-bold text-shadow-sm">
                <span className="animate-pulse">&gt;</span>
                <span>{logs[currentLogIdx]}</span>
              </div>
            </div>

            {/* Progress Bar & Numeric Indicator */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold tracking-wider text-white">
                <span>SYSTEM LINKAGE</span>
                <span>{Math.round(progress)}%</span>
              </div>
              
              {/* Progress track */}
              <div className="h-1.5 w-full bg-surface-raised border border-surface-border rounded-full overflow-hidden p-[1px]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Micro Diagnostic specs */}
            <div className="flex justify-between text-[10px] text-text-tertiary">
              <span>ENG: TURBOPACK COMPILER</span>
              <span>CORE STAT: PASSING</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
