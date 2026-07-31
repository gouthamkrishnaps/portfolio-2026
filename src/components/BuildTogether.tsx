"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import CoffeePic from "@/images/assets/Web design glassmorphism about coffee dark and blue.jpeg";
import RestaurantPic from "@/images/assets/Luxury Restaurant Website Design – Elegant & Modern Fine Dining Layout.jpeg";
import FoodPic from "@/images/assets/Rustic Food Landing Page Mockup _ Dark UI & Organic Web Design Inspiration.jpeg";

export default function BuildTogether() {
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    setIsMounted(true);
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  // Responsive positions for fan animation
  const leftCustom = {
    x: isMobile ? -65 : isTablet ? -160 : -260,
    y: isMobile ? 12 : isTablet ? 18 : 24,
    rotate: isMobile ? -6 : isTablet ? -10 : -14,
    scale: isMobile ? 0.85 : isTablet ? 0.9 : 0.95,
  };

  const rightCustom = {
    x: isMobile ? 65 : isTablet ? 160 : 260,
    y: isMobile ? 12 : isTablet ? 18 : 24,
    rotate: isMobile ? 6 : isTablet ? 10 : 14,
    scale: isMobile ? 0.85 : isTablet ? 0.9 : 0.95,
  };

  const centerCustom = {
    x: 0,
    y: 0,
    rotate: 0,
    scale: isMobile ? 0.95 : isTablet ? 1.0 : 1.05,
  };

  const cards = [
    {
      id: "left",
      title: "Coffee App",
      image: CoffeePic,
      custom: leftCustom,
      zIndex: hoveredCard === "left" ? 30 : hoveredCard ? 10 : 10,
    },
    {
      id: "right",
      title: "Rustic Food",
      image: FoodPic,
      custom: rightCustom,
      zIndex: hoveredCard === "right" ? 30 : hoveredCard ? 10 : 10,
    },
    {
      id: "center",
      title: "Fine Dining",
      image: RestaurantPic,
      custom: centerCustom,
      zIndex: hoveredCard === "center" ? 30 : hoveredCard ? 10 : 20,
    },
  ];

  // Framer Motion variants
  const cardVariants = {
    hidden: { x: 0, y: 0, rotate: 0, scale: 0.85, opacity: 0 },
    visible: (custom: any) => ({
      x: custom.x,
      y: custom.y,
      rotate: custom.rotate,
      scale: custom.scale,
      opacity: 1,
    }),
  };

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-bg-primary">
      {/* Background Glow Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
        {/* Category Badge */}
        <span className="text-[10px] sm:text-xs font-black tracking-[0.2em] text-cyan-600 dark:text-cyan-400 uppercase bg-cyan-500/10 px-3 py-1 rounded-full mb-6 border border-cyan-500/20">
          Collaboration
        </span>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white max-w-3xl leading-[1.15]">
          Let's create{" "}
          <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 bg-clip-text text-transparent font-black">
            something amazing
          </span>
          .
        </h2>

        {/* Subtitle */}
        <p className="mt-6 text-sm sm:text-base md:text-lg text-text-secondary dark:text-slate-300 max-w-2xl leading-relaxed font-medium">
          Have an innovative product concept, a custom application to build, or need help scaling your digital systems? Let's team up to build high-performance solutions.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center">
          <Link
            href="#contact"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 font-bold text-sm sm:text-base text-center shadow-lg shadow-cyan-500/15 dark:shadow-cyan-500/5 hover:shadow-cyan-500/25 transition-all duration-300 border border-cyan-400/20"
          >
            Start a Project
          </Link>
          <Link
            href="#featured-projects"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full text-text-muted hover:text-cyan-600 dark:hover:text-cyan-400 font-bold text-sm sm:text-base text-center bg-surface/50 border border-surface-border hover:border-cyan-500/30 transition-all duration-300"
          >
            View Projects
          </Link>
        </div>

        {/* Section Divider Subtext */}
        <span className="mt-12 text-[10px] sm:text-xs font-mono tracking-widest text-text-tertiary uppercase">
          or explore some of my work
        </span>

        {/* Fan-out Showcase Card Stack */}
        <div className="relative h-[220px] sm:h-[280px] md:h-[360px] w-full max-w-[800px] mt-12 flex items-center justify-center">
          {cards.map((card) => (
            <motion.div
              key={card.id}
              variants={cardVariants}
              custom={card.custom}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              whileHover={{
                scale: card.custom.scale * 1.05,
              }}
              transition={{
                type: "spring",
                stiffness: 90,
                damping: 14,
                delay: card.id === "center" ? 0.1 : card.id === "left" ? 0.25 : 0.35,
              }}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="absolute w-[220px] h-[140px] sm:w-[320px] sm:h-[200px] md:w-[400px] md:h-[250px] rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-neutral-900 overflow-hidden shadow-xl shadow-black/10 dark:shadow-black/40 flex flex-col transition-shadow duration-300"
              style={{
                zIndex: card.zIndex,
                boxShadow: hoveredCard === card.id 
                  ? "0 20px 40px -10px rgba(6, 182, 212, 0.18), 0 0 15px 1px rgba(6, 182, 212, 0.1)"
                  : undefined,
                borderColor: hoveredCard === card.id ? "rgba(6, 182, 212, 0.4)" : undefined,
              }}
            >
              {/* Browser Window Header Mockup */}
              <div className="h-6 sm:h-7 bg-neutral-100 dark:bg-neutral-950 border-b border-slate-200 dark:border-neutral-900 px-3 flex items-center gap-1.5 shrink-0 select-none">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-rose-500/80" />
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-500/80" />
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500/80" />
                <span className="text-[8px] sm:text-[9px] font-mono text-text-tertiary ml-2 hidden sm:inline select-none truncate max-w-[120px]">
                  {card.title.toLowerCase().replace(/ /g, "")}.dev
                </span>
              </div>

              {/* Card Image Content */}
              <div className="relative flex-1 w-full h-full bg-neutral-950">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-w-640px) 220px, (max-w-1024px) 320px, 400px"
                  priority={card.id === "center"}
                  className="object-cover object-top opacity-95 transition-opacity hover:opacity-100 duration-200"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
