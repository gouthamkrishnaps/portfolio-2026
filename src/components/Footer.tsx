"use client";

import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-surface-border/50 py-10 bg-slate-50/50 dark:bg-black/20 backdrop-blur-md relative z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm sm:text-base">
        
        {/* Left Side: Copyright */}
        <div className="text-center md:text-left text-text-secondary font-semibold">
          © {new Date().getFullYear()} Goutham Krishna P S. All rights reserved.
        </div>

        {/* Center Side: Technologies Info */}
        <div className="text-text-muted text-center md:text-left font-medium">
          Built with{" "}
          <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Next.js 16</span>,{" "}
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Three.js</span>,{" "}
          <span className="text-purple-600 dark:text-purple-400 font-semibold">Tailwind CSS</span> &{" "}
          <span className="text-pink-600 dark:text-pink-400 font-semibold">Framer Motion</span>.
        </div>

        {/* Right Side: Back to Top Button */}
        <motion.button
          onClick={scrollToTop}
          suppressHydrationWarning
          whileHover={{ y: -4, borderColor: "rgba(6, 182, 212, 0.5)" }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-surface-border bg-surface/30 hover:bg-surface/70 text-text-muted hover:text-cyan-600 dark:hover:text-cyan-400 text-xs font-bold uppercase tracking-wider transition-all duration-300"
          aria-label="Scroll to top"
        >
          Back to Top
          <ArrowUp size={12} />
        </motion.button>
      </div>
    </footer>
  );
}