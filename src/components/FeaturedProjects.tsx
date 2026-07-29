"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import ProjectShowcase3D from "./ProjectShowcase3D";
import { featuredProjects } from "../data/projects";

export default function FeaturedProjects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = featuredProjects[activeIndex];
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const activeChild = containerRef.current.children[activeIndex] as HTMLElement;
      if (activeChild) {
        const container = containerRef.current;
        const containerWidth = container.clientWidth;
        const childWidth = activeChild.clientWidth;
        const childLeft = activeChild.offsetLeft;
        
        // Calculate the ideal scroll position to center the active child
        let targetScrollLeft = childLeft - (containerWidth / 2) + (childWidth / 2);
        
        // Clamp targetScrollLeft to be between 0 and the max scroll width to prevent negative values or scrolling past the end
        const maxScrollLeft = container.scrollWidth - containerWidth;
        targetScrollLeft = Math.max(0, Math.min(maxScrollLeft, targetScrollLeft));
        
        container.scrollTo({
          left: targetScrollLeft,
          behavior: "smooth",
        });
      }
    }
  }, [activeIndex]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % featuredProjects.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + featuredProjects.length) % featuredProjects.length);
  };

  return (
    <section
      id="projects"
      className="relative min-h-screen py-16 sm:py-24 flex items-center justify-center bg-bg-primary overflow-hidden"
    >
      {/* Background spotlights */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -right-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full bg-cyan-500/5 blur-[130px]" />
        <div className="absolute bottom-1/4 -left-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full bg-purple-500/5 blur-[130px]" />
      </div>

      {/* Huge Background Mask Text */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <h2 className="absolute -left-10 top-10 text-[100px] sm:text-[180px] lg:text-[250px] font-black text-text-mask tracking-widest leading-none">
          PORTFOLIO
        </h2>
      </div>

      {/* Scroll-linked Section Reveal wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 relative z-10 w-full flex flex-col justify-between min-h-[80vh]"
      >
        
        {/* Header Block */}
        <div className="text-center sm:text-left mb-6 sm:mb-8">
          <span className="text-cyan-400 font-bold uppercase tracking-[4px] text-xs sm:text-sm">
            Featured Projects
          </span>
          <h2 className="mt-1.5 text-4xl sm:text-5xl font-black leading-none uppercase tracking-tight">
            Selected Work
          </h2>
        </div>

        {/* ============================================================
           UPPER SECTION: Active Project Detailed Showcase
           ============================================================ */}
        <div className="flex-1 flex items-center justify-center py-4">
          <div className="w-full glass-panel rounded-[32px] p-6 sm:p-8 lg:p-10 border border-surface-border glowing-border-parent relative">
            <div className="glowing-border-glow" />
            
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              
              {/* Details grid column */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <span className="text-cyan-400 text-xs sm:text-sm font-bold uppercase tracking-widest">
                      {activeProject.category}
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase mt-1 tracking-tight">
                      {activeProject.title}
                    </h3>
                    <p className="text-text-secondary mt-4 text-sm sm:text-base leading-relaxed">
                      {activeProject.description}
                    </p>

                    {/* Highlights Bullet List */}
                    <div className="grid grid-cols-2 gap-2.5 mt-5">
                      {activeProject.highlights.map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-surface/30 border border-surface-border/50 text-text-secondary text-xs font-semibold"
                        >
                          <CheckCircle2 className="text-cyan-400 shrink-0" size={12} />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Technologies pills */}
                    <div className="flex flex-wrap gap-1.5 mt-5">
                      {activeProject.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-md border border-cyan-500/20 bg-cyan-500/5 text-cyan-600 dark:text-cyan-300 text-[10px] sm:text-xs font-bold"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-3 mt-6">
                      <a
                        href={activeProject.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        suppressHydrationWarning
                        className="px-5 py-2.5 rounded-lg border border-surface-border bg-surface/30 hover:bg-surface/60 text-slate-900 dark:text-white font-bold text-xs sm:text-sm transition-all duration-300 hover:border-cyan-500/50 hover:text-cyan-600 dark:hover:text-cyan-400 hover:-translate-y-0.5"
                      >
                        Live Demo
                      </a>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Large Showcase Mockup Column (Dynamic 3D Holographic Projector) */}
              <div className="lg:col-span-7 relative flex items-center justify-center h-full min-h-[340px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[580px] xl:min-h-[650px] w-full">
                <ProjectShowcase3D imageUrl={activeProject.image.src} title={activeProject.title} />
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
           LOWER SECTION: Horizontal Ribbon Project Switcher
           ============================================================ */}
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-text-tertiary px-2">
            <span>NAVIGATE SHOWCASE</span>
            <div className="flex gap-2.5">
              <button
                onClick={handlePrev}
                suppressHydrationWarning
                className="p-1.5 rounded-full border border-surface-border bg-surface/30 hover:bg-surface/85 hover:text-cyan-500 dark:hover:text-cyan-400 text-slate-900 dark:text-white transition-colors"
                aria-label="Previous project"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={handleNext}
                suppressHydrationWarning
                className="p-1.5 rounded-full border border-surface-border bg-surface/30 hover:bg-surface/85 hover:text-cyan-500 dark:hover:text-cyan-400 text-slate-900 dark:text-white transition-colors"
                aria-label="Next project"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Horizontal scrollbar carousel track */}
          <div
            ref={containerRef}
            className="relative flex gap-4 overflow-x-auto pt-3 pb-4 px-2 -mx-2 scrollbar-none snap-x snap-mandatory"
          >
            {featuredProjects.map((project, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={project.id}
                  onClick={() => setActiveIndex(idx)}
                  suppressHydrationWarning
                  className={`flex-shrink-0 snap-start w-[240px] sm:w-[280px] flex items-center gap-4 p-3 rounded-2xl border text-left transition-all duration-300 relative ${
                    isActive 
                      ? "border-cyan-500/50 bg-cyan-500/5 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] scale-[1.02]" 
                      : "border-surface-border bg-surface/10 hover:bg-surface/35 text-text-muted hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {/* Miniature Thumbnail */}
                  <div className="w-16 h-11 rounded-lg overflow-hidden relative bg-black/45 border border-surface-border shrink-0">
                    <Image
                      src={project.image}
                      alt=""
                      fill
                      className={`object-cover transition-opacity duration-300 ${
                        isActive ? "opacity-100" : "opacity-60"
                      }`}
                      sizes="64px"
                    />
                  </div>

                  <div className="min-w-0">
                    <span className={`block text-[10px] uppercase font-bold tracking-widest leading-none mb-1 ${
                      isActive ? "text-cyan-600 dark:text-cyan-300" : "text-text-tertiary"
                    }`}>
                      {project.id} // {project.category.split(" ")[0]}
                    </span>
                    <span className="block text-sm font-black uppercase tracking-wide truncate">
                      {project.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </motion.div>
    </section>
  );
}