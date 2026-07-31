"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Tilt from "react-parallax-tilt";
import Profileimage from "@/images/assets/generatedimage.png";
import CounterCard from "./CounterCard";
import { FaReact, FaNodeJs } from "react-icons/fa";
import { SiNextdotjs, SiTypescript, SiGraphql, SiThreedotjs, SiTailwindcss } from "react-icons/si";
import { Tooltip } from "@/images/components/ui/tooltip-card";
import { EncryptedText } from "@/images/components/ui/encrypted-text";

// Tooltip Card Subcomponents
const ICodeBeesTooltip = () => (
  <span className="w-[260px] sm:w-[300px] max-w-full flex flex-col gap-2">
    <span className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-1.5 mb-1">
      <span className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        <span className="font-bold text-neutral-900 dark:text-neutral-100">iCodeBees</span>
      </span>
      <span className="text-[10px] text-neutral-400 font-medium">Kochi, Kerala</span>
    </span>
    
    <span className="block text-xs text-neutral-600 dark:text-neutral-400 leading-normal">
      Technology partner specializing in headless eCommerce (Magento, Shopify), custom ERP systems (Odoo, ERPNext), and robust Next.js/React engineering.
    </span>

    <span className="relative block w-full h-[150px] rounded-md overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 mt-1 shadow-inner">
      <iframe 
        src="https://www.icodebees.com/" 
        title="iCodeBees Website"
        className="w-[400%] h-[400%] border-none scale-25 origin-top-left opacity-90 hover:opacity-100 transition-opacity"
        sandbox="allow-scripts allow-same-origin"
      />
      {/* Absolute overlay to intercept mouse interaction and avoid cursor locking inside the iframe */}
      <span className="absolute inset-0 bg-transparent" />
    </span>

    <span className="flex justify-between items-center text-[10px] text-neutral-400 mt-1 border-t border-neutral-100 dark:border-neutral-800 pt-1.5">
      <span>icodebees.com</span>
      <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Active Client Work</span>
    </span>
  </span>
);

const AvumyTooltip = () => (
  <span className="w-[240px] sm:w-[280px] max-w-full flex flex-col gap-2">
    <span className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-1.5 mb-1">
      <span className="font-bold text-neutral-900 dark:text-neutral-100">Avumy Space</span>
      <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10">Live Booking App</span>
    </span>
    
    <span className="block text-xs text-neutral-600 dark:text-neutral-400 leading-normal">
      A sophisticated hotel and event booking platform featuring real-time search filters, property management systems, and interactive UI animations.
    </span>

    <span className="flex flex-wrap gap-1 mt-1">
      {["Next.js", "React", "REST APIs", "Tailwind"].map((tech) => (
        <span key={tech} className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-semibold">
          {tech}
        </span>
      ))}
    </span>

    <span className="flex justify-between items-center text-[10px] text-neutral-400 mt-1 border-t border-neutral-100 dark:border-neutral-800 pt-1.5">
      <span>avumy.com</span>
      <span className="text-neutral-500">2025</span>
    </span>
  </span>
);

const DarlingsTooltip = () => (
  <span className="w-[240px] sm:w-[280px] max-w-full flex flex-col gap-2">
    <span className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-1.5 mb-1">
      <span className="font-bold text-neutral-900 dark:text-neutral-100">Darlings of Chelsea</span>
      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10">UK eCommerce</span>
    </span>
    
    <span className="block text-xs text-neutral-600 dark:text-neutral-400 leading-normal">
      Premium UK luxury furniture retailer. Integrated complex Cylindo 3D product configurations, customized responsive layouts, and optimized Core Web Vitals.
    </span>

    <span className="flex flex-wrap gap-1 mt-1">
      {["Next.js", "React 19", "Cylindo 3D", "SCSS"].map((tech) => (
        <span key={tech} className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-semibold">
          {tech}
        </span>
      ))}
    </span>

    <span className="flex justify-between items-center text-[10px] text-neutral-400 mt-1 border-t border-neutral-100 dark:border-neutral-800 pt-1.5">
      <span>darlingsofchelsea.co.uk</span>
      <span className="text-neutral-500">2026</span>
    </span>
  </span>
);

const PermatechTooltip = () => (
  <span className="w-[240px] sm:w-[280px] max-w-full flex flex-col gap-2">
    <span className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-1.5 mb-1">
      <span className="font-bold text-neutral-900 dark:text-neutral-100">Permatech Roofing</span>
      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10">B2B Platform</span>
    </span>
    
    <span className="block text-xs text-neutral-600 dark:text-neutral-400 leading-normal">
      Scalable enterprise commerce platform featuring bundle price calculations, specialized contractor authentication workflows, and Magento/Adobe Commerce APIs.
    </span>

    <span className="flex flex-wrap gap-1 mt-1">
      {["Next.js", "GraphQL", "Apollo", "Tailwind CSS"].map((tech) => (
        <span key={tech} className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-semibold">
          {tech}
        </span>
      ))}
    </span>

    <span className="flex justify-between items-center text-[10px] text-neutral-400 mt-1 border-t border-neutral-100 dark:border-neutral-800 pt-1.5">
      <span>permatechroofing.com</span>
      <span className="text-neutral-500">2025</span>
    </span>
  </span>
);

const RubberizedTooltip = () => (
  <span className="w-[240px] sm:w-[280px] max-w-full flex flex-col gap-2">
    <span className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-1.5 mb-1">
      <span className="font-bold text-neutral-900 dark:text-neutral-100">Rubberized</span>
      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold px-2 py-0.5 rounded-full bg-amber-500/10">eCommerce</span>
    </span>
    
    <span className="block text-xs text-neutral-600 dark:text-neutral-400 leading-normal">
      High-performing e-commerce storefront for industrial rubberized products. Integrated custom inventory controls, product search options, and optimized loading times.
    </span>

    <span className="flex flex-wrap gap-1 mt-1">
      {["React", "Shopify", "Tailwind CSS", "REST API"].map((tech) => (
        <span key={tech} className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-semibold">
          {tech}
        </span>
      ))}
    </span>

    <span className="flex justify-between items-center text-[10px] text-neutral-400 mt-1 border-t border-neutral-100 dark:border-neutral-800 pt-1.5">
      <span>Product Customization</span>
      <span className="text-neutral-500">2025</span>
    </span>
  </span>
);

const techIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Next.js": SiNextdotjs,
  "React": FaReact,
  "TypeScript": SiTypescript,
  "GraphQL": SiGraphql,
  "Three.js": SiThreedotjs,
  "Tailwind CSS": SiTailwindcss,
  "Node.js": FaNodeJs,
};

const stats = [
  {
    value: "2+",
    label: "Years Experience",
  },
  {
    value: "20+",
    label: "Projects Completed",
  },
  {
    value: "5+",
    label: "Companies & Clients",
  },
  {
    value: "20+",
    label: "Technologies",
  },
];

export default function About() {
  return (
    <section id="about" className="relative py-20 sm:py-32 bg-bg-primary overflow-hidden">
      {/* Decorative blurred background shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full bg-indigo-500/10 blur-[130px]" />
        <div className="absolute top-1/2 -left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      {/* Huge Background Mask Text */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <h2 className="absolute -left-10 top-10 text-[100px] sm:text-[180px] lg:text-[250px] font-black text-text-mask tracking-widest leading-none">
          ABOUT
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 sm:gap-16 items-center">
          
          {/* Profile Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-5 relative group"
          >
            {/* Glowing border outline behind image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-[30px] blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
            
            <Tilt
              tiltMaxAngleX={6}
              tiltMaxAngleY={6}
              perspective={1500}
              scale={1.02}
              glareEnable
              glareMaxOpacity={0.08}
              className="relative rounded-[30px] border border-surface-border overflow-hidden bg-surface/30 backdrop-blur-md shadow-2xl"
            >
              <Image
                src={Profileimage}
                alt="Goutham Krishna"
                width={600}
                height={800}
                className="w-full h-auto object-cover rounded-[30px] transition-transform duration-700 group-hover:scale-103"
                priority
              />
            </Tilt>
          </motion.div>

          {/* About Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <span className="text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-[4px] text-xs sm:text-sm">
              <EncryptedText
                text="Discover My Story"
                encryptedClassName="text-cyan-600/40 dark:text-cyan-400/40"
                revealedClassName="text-cyan-600 dark:text-cyan-400"
                revealDelayMs={40}
              />
            </span>

            <h2 className="mt-3 text-4xl sm:text-5xl md:text-6xl font-black leading-none uppercase tracking-tight">
              Building Modern
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-indigo-600 dark:from-cyan-400 dark:to-indigo-400">
                Digital Products
              </span>
            </h2>

            <div className="select-none" onCopy={(e) => e.preventDefault()}>
              <p className="mt-6 text-text-secondary text-base sm:text-lg leading-relaxed">
                I'm Goutham Krishna P S, a passionate and results-driven Software Developer. 
                My focus is on crafting clean, modular React, Next.js, and TypeScript architectures 
                and implementing high-end frontend experiences that are engaging and highly performant.
              </p>

              <p className="mt-4 text-text-secondary text-base sm:text-lg leading-relaxed">
                Currently working at{" "}
                <Tooltip content={<ICodeBeesTooltip />}>
                  <strong className="text-cyan-600 dark:text-cyan-400 cursor-pointer underline decoration-dotted decoration-cyan-500/50 underline-offset-4 hover:text-cyan-500 transition-colors">
                    ICodeBees
                  </strong>
                </Tooltip>
                , where I construct complex, enterprise-level e-commerce portals and interactive SaaS interfaces. 
                I have contributed to custom features for major brands like{" "}
                <Tooltip content={<AvumyTooltip />}>
                  <span className="font-semibold text-cyan-600 dark:text-cyan-400 cursor-pointer underline decoration-dotted decoration-cyan-500/50 underline-offset-4 hover:text-cyan-500 transition-colors">
                    Avumy
                  </span>
                </Tooltip>
                ,{" "}
                <Tooltip content={<DarlingsTooltip />}>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 cursor-pointer underline decoration-dotted decoration-indigo-500/50 underline-offset-4 hover:text-indigo-500 transition-colors">
                    Darlings of Chelsea
                  </span>
                </Tooltip>
                ,{" "}
                <Tooltip content={<PermatechTooltip />}>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 cursor-pointer underline decoration-dotted decoration-emerald-500/50 underline-offset-4 hover:text-emerald-500 transition-colors">
                    Permatech
                  </span>
                </Tooltip>
                , and{" "}
                <Tooltip content={<RubberizedTooltip />}>
                  <span className="font-semibold text-amber-600 dark:text-amber-400 cursor-pointer underline decoration-dotted decoration-amber-500/50 underline-offset-4 hover:text-amber-500 transition-colors">
                    Rubberized
                  </span>
                </Tooltip>
                .
              </p>

              <p className="mt-4 text-text-secondary text-base sm:text-lg leading-relaxed">
                My engineering philosophy revolves around pixel-perfect accuracy, optimization (Core Web Vitals), 
                responsive fluidity, and pushing the boundaries of what is possible in the browser.
              </p>
            </div>



            {/* Core Tech Stack Pills */}
            <div className="flex flex-wrap gap-2.5 mt-8">
              {[
                "Next.js",
                "React",
                "TypeScript",
                "GraphQL",
                "Three.js",
                "Tailwind CSS",
                "Node.js",
              ].map((item) => {
                const Icon = techIcons[item];
                return (
                  <span
                    key={item}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/25 bg-cyan-500/5 text-cyan-600 dark:text-cyan-300 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-700 dark:hover:text-white cursor-default group"
                  >
                    {Icon && <Icon className="w-4 h-4 text-cyan-600/80 dark:text-cyan-400/80 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />}
                    <span>{item}</span>
                  </span>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-20 sm:mt-28">
          {stats.map((item) => (
            <CounterCard
              key={item.label}
              value={item.value}
              label={item.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
