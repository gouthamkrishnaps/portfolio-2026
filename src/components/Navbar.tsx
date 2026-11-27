"use client";

import { useState, useEffect } from "react";
import {
  Moon,
  Sun,
  Menu,
  X,
  Download,
  Search,
  Home,
  User,
  Briefcase,
  FolderKanban,
  Cpu,
  Mail,
} from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import CommandPalette from "./CommandPalette";

const navLinks = [
  { label: "Home", href: "#home", id: "home", icon: Home },
  { label: "About", href: "#about", id: "about", icon: User },
  { label: "Experience", href: "#experience", id: "experience", icon: Briefcase },
  { label: "Projects", href: "#projects", id: "projects", icon: FolderKanban },
  { label: "Skills", href: "#skills", id: "skills", icon: Cpu },
  { label: "Contact", href: "#contact", id: "contact", icon: Mail },
];

export default function Navbar() {
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

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full pointer-events-none">
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 26,
          mass: 0.7,
        }}
        style={{ pointerEvents: "auto" }}
        className={`flex items-center justify-between gap-3 md:gap-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled
            ? "w-[90vw] md:w-auto max-w-2xl px-4 py-2 rounded-full border border-zinc-200/40 dark:border-zinc-800/40 bg-white/75 dark:bg-zinc-900/75 backdrop-blur-xl shadow-lg shadow-indigo-500/5 translate-y-3 sm:translate-y-4"
            : "w-[92vw] md:w-auto max-w-3xl px-4 py-2.5 md:px-5 rounded-full border border-zinc-200/15 dark:border-zinc-800/20 bg-white/25 dark:bg-zinc-950/30 backdrop-blur-md shadow-lg shadow-indigo-500/5 translate-y-4 sm:translate-y-6"
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

        {/* Desktop Nav Items (Hybrid Dock: active expands to Icon + Label, inactive shows Icon + hover tooltip) */}
        <nav className="hidden md:flex items-center gap-1.5 relative" aria-label="Main navigation">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            const Icon = link.icon;
            return (
              <a
                key={link.href}
                href={link.href}
                aria-label={link.label}
                className={`group relative flex items-center gap-1.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 focus-ring ${
                  isActive
                    ? "px-3.5 py-1.5 text-indigo-600 dark:text-indigo-400"
                    : "p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/50"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 rounded-full bg-indigo-500/10 border border-indigo-500/20 -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon size={16} className="shrink-0" />
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.span
                      key={link.id}
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {link.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!isActive && (
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[11px] font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md">
                    {link.label}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Command Palette trigger */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 text-xs font-medium transition-all duration-300 focus-ring cursor-pointer"
            aria-label="Open command palette"
          >
            <Search size={13} />
            <kbd className="text-[10px] font-semibold opacity-75">⌘K</kbd>
          </button>

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

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.25 }}
            className={`pointer-events-auto absolute left-4 right-4 md:hidden rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-xl overflow-hidden p-5 z-50 flex flex-col gap-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isScrolled ? "top-16 sm:top-18" : "top-20 sm:top-24"
            }`}
          >
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors focus-ring ${
                      activeSection === link.id 
                        ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20" 
                        : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    <Icon size={16} className="shrink-0 opacity-80" />
                    <span>{link.label}</span>
                  </a>
                );
              })}
            </div>

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
    <CommandPalette />
    </>
  );
}
