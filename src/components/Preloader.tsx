"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Terminal } from "lucide-react";

interface PreloaderProps {
  onComplete: () => void;
}

const compileLogs = [
  "ROOT@GOUTHAM.DEV: INITIATING SECURE GATEWAY...",
  "CONNECTING CLIENT SHELL [IP: 192.168.1.7]...",
  "VERIFYING LOCAL HANDSHAKE PROTOCOLS... PASS",
  "ESTABLISHING CRYPTOGRAPHIC ADDR CHANNELS...",
  "ALLOCATING RUNTIME HEAP RESOURCE [4096MB]...",
  "SCANNING ENVIRONMENT WORKSPACE DEPENDENCIES...",
  "[LOAD] package.json -> 940B",
  "[LOAD] tsconfig.json -> 711B",
  "[LOAD] next.config.ts -> 185B",
  "[LOAD] tailwind.config.js -> OK",
  "[LOAD] src/app/layout.tsx -> 4.2KB",
  "[LOAD] src/app/page.tsx -> 2.1KB",
  "[LOAD] src/app/globals.css -> 11.4KB",
  "[LOAD] src/components/Hero.tsx -> 16.2KB",
  "[LOAD] src/components/About.tsx -> 12.8KB",
  "[LOAD] src/components/Experience.tsx -> 24.5KB",
  "[LOAD] src/components/Skills3D.tsx -> 20.1KB",
  "[LOAD] src/components/Preloader.tsx -> 15.6KB",
  "[LOAD] src/components/FeaturedProjects.tsx -> 28.3KB",
  "MOUNTING COMPILER CORE: NEXT-TURBOPACK...",
  "[BUILD] Compiling Turbopack contexts...",
  "[BUILD] webpack chunk loader init (182/1428)",
  "[BUILD] webpack chunk loader init (492/1428)",
  "[BUILD] webpack chunk loader init (864/1428)",
  "[BUILD] webpack chunk loader init (1190/1428)",
  "[BUILD] webpack chunk loader init (1428/1428)",
  "RESOLVED BUNDLE GRAPH ASSET PATHWAYS.",
  "TREESHAKING DEAD EXPORTS FRAGMENTS...",
  "OPTIMIZING GRAPHICS RENDERING SYSTEM...",
  "MINIFYING PRODUCTION BUNDLE PAYLOAD...",
  "SYSTEM 100% NOMINAL. BOOTING PORTFOLIO...",
];

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [currentLogs, setCurrentLogs] = useState<string[]>([compileLogs[0]]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const matrixCanvasRef = useRef<HTMLCanvasElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Hyper-speed log printing stream (adds a log every 60ms)
  useEffect(() => {
    let index = 1;
    const logInterval = setInterval(() => {
      if (index < compileLogs.length) {
        setCurrentLogs((prev) => [...prev, compileLogs[index]]);
        index++;
        
        // Map progress percentage to current log index
        const pct = Math.min((index / compileLogs.length) * 100, 100);
        setProgress(pct);
      } else {
        clearInterval(logInterval);
        setIsLoaded(true);
        setTimeout(() => {
          onCompleteRef.current();
        }, 550); // Fade-out exit delay buffer
      }
    }, 60);

    return () => clearInterval(logInterval);
  }, []);

  // Terminal scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [currentLogs]);

  // Background HTML5 Canvas Matrix Digital Rain
  useEffect(() => {
    const canvas = matrixCanvasRef.current;
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

    const matrixChars = "0101010101010101ABCDEFfnconstasyncawaitstructinterfaceWebGLTHREEletuseRefuseEffectimportexportclass";
    const fontSize = 13;
    const columns = Math.floor(width / fontSize);

    // Stagger drops vertical coordinates
    const rainDrops: number[] = [];
    for (let x = 0; x < columns; x++) {
      rainDrops[x] = Math.random() * -100;
    }

    let frameId: number;
    const drawMatrix = () => {
      ctx.fillStyle = "rgba(3, 3, 8, 0.08)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "rgba(6, 182, 212, 0.28)"; // Cyan code glow
      ctx.font = `bold ${fontSize}px monospace`;

      for (let i = 0; i < rainDrops.length; i++) {
        const char = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
        ctx.fillText(char, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > height && Math.random() > 0.985) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
      frameId = requestAnimationFrame(drawMatrix);
    };

    drawMatrix();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Compute segmented retro loading indicator
  const barLength = 16;
  const filledLength = Math.floor((progress / 100) * barLength);
  const visualLoadingBar = `[${"█".repeat(filledLength)}${"░".repeat(barLength - filledLength)}]`;

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scaleY: 0.01, 
            scaleX: 1.15,
            filter: "brightness(2.2) contrast(3)" 
          }}
          transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 w-full h-full bg-[#020205] z-[99999] flex items-center justify-center font-mono text-cyan-400 p-6 select-none overflow-hidden"
        >
          {/* Matrix code rain canvas background */}
          <canvas 
            ref={matrixCanvasRef} 
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-45"
          />

          {/* CRT Overlay Scanlines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.04),rgba(0,255,0,0.01),rgba(0,0,255,0.04))] bg-[size:100%_4px,6px_100%] pointer-events-none z-10" />

          {/* Compact Mini-Terminal HUD Console */}
          <div className="max-w-md w-full h-80 flex flex-col bg-black/85 rounded-xl border border-cyan-500/30 backdrop-blur-md shadow-[0_0_40px_rgba(6,182,212,0.2)] relative z-20 overflow-hidden glowing-border-parent">
            <div className="glowing-border-glow" />

            {/* Header console status bar */}
            <div className="flex items-center justify-between border-b border-cyan-500/20 px-3 py-2 shrink-0 bg-cyan-950/15">
              <div className="flex items-center gap-2">
                <Cpu size={14} className="pulse-badge text-cyan-400" />
                <span className="text-[10px] font-black uppercase tracking-[1.5px] text-white">
                  ROOT@GOUTHAM.DEV: SSH_SHELL
                </span>
              </div>
              <span className="text-[9px] text-cyan-400/60 font-bold animate-pulse">● SECURED</span>
            </div>

            {/* Core compiling outputs terminal */}
            <div 
              ref={terminalRef}
              className="flex-1 min-h-0 bg-black/40 p-4 flex flex-col text-[11px] leading-relaxed gap-1.5 text-cyan-400/85 overflow-y-auto scrollbar-none scroll-smooth font-mono select-text"
            >
              {currentLogs.slice(0, -1).map((log, index) => (
                <div key={index} className="flex gap-2 text-cyan-400/30 shrink-0">
                  <span className="select-none text-cyan-400/20">&gt;</span>
                  <span className="break-all">{log}</span>
                </div>
              ))}
              
              {currentLogs.length > 0 && (
                <div className="flex gap-2 text-cyan-300 font-bold text-shadow-xs shrink-0">
                  <span className="animate-pulse select-none">&gt;</span>
                  <span className="break-all">{currentLogs[currentLogs.length - 1]}</span>
                  <span className="animate-ping text-cyan-300 font-black">_</span>
                </div>
              )}
            </div>

            {/* Segmented loading progress footer */}
            <div className="border-t border-cyan-500/20 px-3 py-2 bg-cyan-950/20 flex items-center justify-between shrink-0 text-[10px] font-bold text-cyan-400/70">
              <span className="text-white text-[11px] tracking-[1px] font-black">
                {visualLoadingBar}
              </span>
              <span>
                {Math.round(progress)}%
              </span>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
