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
          className={`flex items-center justify-between px-6 py-3 rounded-full border border-surface-border bg-white/40 dark:bg-black/40 backdrop-blur-md shadow-lg transition-all duration-300 ${
            isScrolled ? "shadow-cyan-500/5 py-2.5" : "shadow-slate-200/20 dark:shadow-black/40"
          }`}
        >
          {/* Logo */}
          <a
            href="#home"
            className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-indigo-600 dark:from-cyan-400 dark:to-indigo-400 hover:scale-105 transition-transform duration-300"
          >
            GK
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5 relative">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-semibold tracking-wide rounded-full transition-colors duration-300 ${
                    isActive ? "text-cyan-500 dark:text-cyan-400" : "text-text-muted hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 rounded-full bg-cyan-500/10 border border-cyan-500/20 -z-10"
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
                className="p-2 rounded-full border border-surface-border bg-surface/30 hover:bg-surface/85 hover:border-cyan-500/40 text-text-muted hover:text-cyan-500 dark:hover:text-cyan-400 transition-all duration-300"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}

            {/* Resume button */}
            <a
              href="/resume/Goutham_Krishna_PS.pdf"
              download
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:border-cyan-500/60"
            >
              <Download size={12} />
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
              className="md:hidden p-2 rounded-full border border-surface-border bg-surface/30 hover:bg-surface/80 text-text-muted hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Toggle menu"
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
            className="absolute top-16 left-4 right-4 md:hidden rounded-3xl border border-surface-border bg-white/95 dark:bg-black/90 backdrop-blur-xl shadow-xl overflow-hidden p-6 z-50 flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3 text-base font-semibold rounded-2xl transition-colors ${
                    activeSection === link.id 
                      ? "bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 border border-cyan-500/20" 
                      : "text-text-secondary hover:text-slate-900 dark:hover:text-white hover:bg-surface/35"
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
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm uppercase tracking-wider transition-colors"
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
