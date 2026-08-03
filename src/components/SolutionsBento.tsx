"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ShoppingBag, Zap, Cpu, Server, Layers } from "lucide-react";
import { EncryptedText } from "./ui/encrypted-text";

export default function SolutionsBento() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const ease = [0.25, 0.46, 0.45, 0.94] as const;

  return (
    <section ref={containerRef} className="relative py-24 sm:py-32 bg-bg-primary overflow-hidden border-t border-surface-border/30">
      {/* Huge Background Mask Text to match achievements & about section theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <h1 className="absolute -left-10 sm:left-0 top-0 text-[100px] sm:text-[180px] lg:text-[250px] font-black text-text-mask tracking-widest leading-none uppercase">
          SOLUTIONS
        </h1>
      </div>

      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[120px] -translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px] -translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 relative z-10">
        
        {/* Header Block */}
        <div className="text-left mb-16 sm:mb-24">
          <span className="text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-[4px] text-xs sm:text-sm">
            <EncryptedText
              text="Business Value"
              encryptedClassName="text-cyan-600/40 dark:text-cyan-400/40"
              revealedClassName="text-cyan-600 dark:text-cyan-400"
              revealDelayMs={40}
            />
          </span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="mt-3 text-4xl sm:text-5xl md:text-6xl font-black leading-none uppercase tracking-tight text-slate-900 dark:text-white"
          >
            How I Help You Succeed
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="mt-4 text-sm sm:text-base md:text-lg text-text-secondary font-medium leading-relaxed max-w-3xl"
          >
            Engineered to solve business bottlenecks, automate operations, and scale digital products smoothly.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          
          {/* Card 1: Headless Commerce (Col span 2 on large screens) */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="md:col-span-2 bg-surface/30 backdrop-blur-md rounded-[32px] p-6 sm:p-8 flex flex-col justify-between border border-surface-border glowing-border-parent relative overflow-hidden min-h-[380px] group"
          >
            <div className="glowing-border-glow" />
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors duration-500" />
            
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                  <ShoppingBag size={18} />
                </div>
                <span className="text-[10px] font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase">Headless Solutions</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black uppercase text-slate-900 dark:text-white mt-4 tracking-tight">
                Seamless Headless Commerce
              </h3>
              <p className="mt-2 text-text-secondary text-xs sm:text-sm max-w-xl leading-relaxed">
                Integrating modern frontend platforms with APIs like Magento, Shopify, and ERP systems. I help companies eliminate monolithic latency, automate invoice/order processing, and enhance loading speeds.
              </p>
            </div>

            {/* Graphic Component: Integrations Map */}
            <div className="relative mt-6 h-32 w-full flex items-center justify-center bg-black/10 dark:bg-black/25 rounded-2xl border border-surface-border/50 overflow-hidden">
              <div className="absolute inset-0 dot-grid-bg opacity-30" />
              
              <div className="relative flex items-center justify-between w-full max-w-md px-6 sm:px-12 z-10">
                {/* Source Nodes */}
                <div className="flex flex-col gap-2">
                  {["Magento", "Shopify", "ERPNext"].map((api) => (
                    <div key={api} className="px-2.5 py-1 rounded-lg border border-surface-border bg-surface/80 text-[9px] font-bold text-text-muted flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                      {api}
                    </div>
                  ))}
                </div>

                {/* Connecting glowing laser lines */}
                <div className="absolute left-[30%] right-[30%] top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-cyan-500/40 via-indigo-500/40 to-indigo-500/10 flex items-center justify-center">
                  <div className="absolute w-2 h-2 rounded-full bg-cyan-400 blur-sm animate-ping" style={{ animationDuration: "2s" }} />
                  <motion.div 
                    animate={{ x: [-80, 80] }} 
                    transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                    className="w-8 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent absolute" 
                  />
                  <motion.div 
                    animate={{ x: [-60, 60] }} 
                    transition={{ repeat: Infinity, duration: 3, delay: 1, ease: "linear" }}
                    className="w-12 h-[2px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent absolute" 
                  />
                </div>

                {/* Centralized Node */}
                <div className="p-3.5 rounded-full bg-gradient-to-tr from-cyan-500/15 to-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/5 relative group-hover:scale-105 transition-transform duration-500">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping absolute" />
                  <span className="text-[10px] font-mono font-black text-white bg-indigo-600 px-2.5 py-0.5 rounded-full shadow-md">Next.js Core</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Core Web Vitals (Col span 1) */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25, ease }}
            className="bg-surface/30 backdrop-blur-md rounded-[32px] p-6 sm:p-8 flex flex-col justify-between border border-surface-border glowing-border-parent relative overflow-hidden min-h-[380px] group"
          >
            <div className="glowing-border-glow" />
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/10 transition-colors duration-500" />

            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                  <Zap size={18} />
                </div>
                <span className="text-[10px] font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">Performance</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black uppercase text-slate-900 dark:text-white mt-4 tracking-tight">
                99+ Lighthouse Speeds
              </h3>
              <p className="mt-2 text-text-secondary text-xs sm:text-sm leading-relaxed">
                By optimizing Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS), I ensure your pages load instantly. High performance directly correlates with higher search ranking and lower drop-off.
              </p>
            </div>

            {/* Graphic Component: Speedometer / Graph */}
            <div className="relative mt-6 h-32 w-full flex items-center justify-center bg-black/10 dark:bg-black/25 rounded-2xl border border-surface-border/50 overflow-hidden">
              <div className="absolute inset-0 dot-grid-bg opacity-30" />
              
              <div className="flex items-center gap-5 z-10">
                {/* Speed gauge ring */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="26" stroke="rgba(255,255,255,0.05)" strokeWidth="5" fill="transparent" />
                    <motion.circle 
                      cx="32" 
                      cy="32" 
                      r="26" 
                      stroke="url(#speedGradient)" 
                      strokeWidth="5" 
                      fill="transparent" 
                      strokeDasharray="170"
                      initial={{ strokeDashoffset: 170 }}
                      animate={isInView ? { strokeDashoffset: 8 } : {}}
                      transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                    />
                    <defs>
                      <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-sm font-black tracking-tight text-white leading-none">100</span>
                    <span className="text-[6px] font-bold text-cyan-400 uppercase tracking-widest mt-0.5">PERF</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono text-text-tertiary">LCP:</span>
                    <span className="text-[10px] font-mono font-black text-emerald-400">0.4s (Good)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono text-text-tertiary">CLS:</span>
                    <span className="text-[10px] font-mono font-black text-emerald-400">0.00 (Perfect)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono text-text-tertiary">SEO:</span>
                    <span className="text-[10px] font-mono font-black text-emerald-400">100%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 3: AI-Driven Integrations (Col span 1) */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4, ease }}
            className="bg-surface/30 backdrop-blur-md rounded-[32px] p-6 sm:p-8 flex flex-col justify-between border border-surface-border glowing-border-parent relative overflow-hidden min-h-[380px] group"
          >
            <div className="glowing-border-glow" />
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors duration-500" />

            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                  <Cpu size={18} />
                </div>
                <span className="text-[10px] font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase">AI Integrations</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black uppercase text-slate-900 dark:text-white mt-4 tracking-tight">
                AI Agent Workflows
              </h3>
              <p className="mt-2 text-text-secondary text-xs sm:text-sm leading-relaxed">
                Leveraging neural APIs (OpenAI, Anthropic, Gemini) to integrate semantic text searching, real-time query categorization, vector database storage, and AI auto-responses to make workflows smoother.
              </p>
            </div>

            {/* Graphic Component: AI Nodes Grid */}
            <div className="relative mt-6 h-32 w-full flex items-center justify-center bg-black/10 dark:bg-black/25 rounded-2xl border border-surface-border/50 overflow-hidden">
              <div className="absolute inset-0 dot-grid-bg opacity-30" />
              
              <div className="relative flex items-center gap-4 z-10">
                <div className="relative flex h-8 w-8">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-20"></span>
                  <div className="relative rounded-full h-8 w-8 bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <Cpu size={14} />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  {["Semantic Search", "LLM Routing", "RAG Processing"].map((item, idx) => (
                    <motion.div 
                      key={item}
                      initial={{ x: -10, opacity: 0 }}
                      animate={isInView ? { x: 0, opacity: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.8 + idx * 0.15 }}
                      className="text-[9px] font-mono px-2 py-0.5 rounded bg-surface/50 border border-surface-border text-text-muted flex items-center gap-1.5"
                    >
                      <span className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />
                      {item}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Next.js Architecture & Performance (Col span 1) */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.55, ease }}
            className="bg-surface/30 backdrop-blur-md rounded-[32px] p-6 sm:p-8 flex flex-col justify-between border border-surface-border glowing-border-parent relative overflow-hidden min-h-[380px] group"
          >
            <div className="glowing-border-glow" />
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/10 transition-colors duration-500" />

            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                  <Server size={18} />
                </div>
                <span className="text-[10px] font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">Framework Architecture</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black uppercase text-slate-900 dark:text-white mt-4 tracking-tight">
                Scalable Next.js Dev
              </h3>
              <p className="mt-2 text-text-secondary text-xs sm:text-sm leading-relaxed">
                Deploying robust App Router configurations, Server Components, and optimized GraphQL/REST client caches to ensure the infrastructure handles high traffic with minimum server costs.
              </p>
            </div>

            {/* Graphic Component: Stack Layers */}
            <div className="relative mt-6 h-32 w-full flex items-center justify-center bg-black/10 dark:bg-black/25 rounded-2xl border border-surface-border/50 overflow-hidden">
              <div className="absolute inset-0 dot-grid-bg opacity-30" />
              
              <div className="flex flex-col gap-1 w-36 z-10">
                <div className="px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/30 text-[8px] font-mono font-bold text-indigo-300 text-center relative overflow-hidden">
                  Server Components
                  <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" style={{ animationDuration: "2.5s" }} />
                </div>
                <div className="px-2 py-0.5 rounded bg-indigo-900/60 border border-indigo-500/20 text-[8px] font-mono font-bold text-indigo-300 text-center">
                  Data Fetch Cache
                </div>
                <div className="px-2 py-0.5 rounded bg-indigo-950/40 border border-indigo-500/10 text-[8px] font-mono font-bold text-indigo-400 text-center">
                  CDN Edge (Vercel)
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 5: WebGL & 3D builders (Col span 1) */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.7, ease }}
            className="bg-surface/30 backdrop-blur-md rounded-[32px] p-6 sm:p-8 flex flex-col justify-between border border-surface-border glowing-border-parent relative overflow-hidden min-h-[380px] group"
          >
            <div className="glowing-border-glow" />
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors duration-500" />

            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                  <Layers size={18} />
                </div>
                <span className="text-[10px] font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase">WebGL Interactions</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black uppercase text-slate-900 dark:text-white mt-4 tracking-tight">
                Immersive 3D Graphics
              </h3>
              <p className="mt-2 text-text-secondary text-xs sm:text-sm leading-relaxed">
                Constructing high-performance WebGL configurations using Three.js and React Three Fiber to build product configurators, immersive storytelling layouts, and sleek decorative canvases.
              </p>
            </div>

            {/* Graphic Component: Wireframe Cube Visual */}
            <div className="relative mt-6 h-32 w-full flex items-center justify-center bg-black/10 dark:bg-black/25 rounded-2xl border border-surface-border/50 overflow-hidden">
              <div className="absolute inset-0 dot-grid-bg opacity-30" />
              
              <div className="relative w-12 h-12 z-10 flex items-center justify-center">
                {/* Custom animated geometric SVG */}
                <svg className="w-full h-full text-cyan-500" viewBox="0 0 100 100">
                  <motion.polygon 
                    points="50,15 85,35 85,75 50,95 15,75 15,35" 
                    fill="transparent" 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                    className="origin-center"
                  />
                  <motion.polygon 
                    points="50,30 75,45 75,65 50,80 25,65 25,45" 
                    fill="transparent" 
                    stroke="rgba(99, 102, 241, 0.6)" 
                    strokeWidth="1"
                    strokeLinejoin="round"
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                    className="origin-center"
                  />
                  <line x1="50" y1="15" x2="50" y2="95" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                  <line x1="15" y1="35" x2="85" y2="75" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                  <line x1="85" y1="35" x2="15" y2="75" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                </svg>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
