"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Menu, X, Download, GitBranch } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "#home", id: "home" },
  { label: "About", href: "#about", id: "about" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Skills", href: "#skills", id: "skills" },
  { label: "Contact", href: "#contact", id: "contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      // Scroll state
      setIsScrolled(window.scrollY > 20);

      // Section tracking
      const scrollPosition = window.scrollY + 150;
      for (const link of navLinks) {
        const el = document.getElementById(link.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(link.id);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = currentTheme === "dark";

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  if (pathname === "/sandbox") return null;

  return (
    <header 
      className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "top-4" : "top-2 sm:top-6"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`flex items-center justify-between px-5 py-2.5 sm:px-6 sm:py-3 rounded-full border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-lg transition-all duration-300 ${
            isScrolled ? "shadow-indigo-500/5 py-2" : "shadow-zinc-200/20 dark:shadow-black/40"
          }`}
        >
          {/* Logo */}
          <a
            href="#home"
            className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-400 dark:to-indigo-300 hover:scale-105 transition-transform duration-300 focus-ring rounded-lg"
            aria-label="Go to home"
          >
            GK
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 relative" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-1.5 text-sm font-medium tracking-wide rounded-full transition-colors duration-300 focus-ring ${
                    isActive ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 rounded-full bg-indigo-500/10 border border-indigo-500/20 -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-300 focus-ring"
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}

            {/* Resume button */}
            <a
              href="/resume/Goutham_Krishna_PS.pdf"
              download
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-semibold tracking-wide transition-all duration-300 hover:text-indigo-600 dark:hover:text-indigo-400 focus-ring"
              aria-label="Download resume"
            >
              <Download size={13} />
              Resume
            </a>

            {/* Git Sandbox button - Commented out
            <Link
              href="/sandbox"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:border-purple-500/60"
            >
              <GitBranch size={12} className="animate-pulse" />
              Git Sandbox
            </Link>
            */}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors focus-ring"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.25 }}
            className="absolute top-16 left-4 right-4 md:hidden rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-xl overflow-hidden p-5 z-50 flex flex-col gap-3"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-colors focus-ring ${
                    activeSection === link.id 
                      ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20" 
                      : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Commented out Git Sandbox mobile link
            <hr className="border-surface-border my-1" />

            <Link
              href="/sandbox"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 text-cyan-400 font-bold text-sm uppercase tracking-wider transition-colors mb-2"
            >
              <GitBranch size={14} className="text-purple-400 animate-pulse" />
              Try Git Sandbox
            </Link>
            */}

            <a
              href="/resume/Goutham_Krishna_PS.pdf"
              download
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-sm tracking-wide transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200 focus-ring"
            >
              <Download size={14} />
              Download Resume
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
