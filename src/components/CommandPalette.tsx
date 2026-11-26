"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Search,
  X,
  Home,
  User,
  Briefcase,
  FolderKanban,
  Cpu,
  Mail,
  Copy,
  Check,
  Sun,
  Moon,
  Download,
  CornerDownLeft,
} from "lucide-react";

interface PaletteItem {
  id: string;
  label: string;
  group: "Navigate" | "Actions";
  keywords: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export default function CommandPalette() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = isMounted && currentTheme === "dark";

  const openDialog = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    setQuery("");
    setSelectedIndex(0);
    dialog.showModal();
    setIsOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const closeDialog = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog?.open) {
      dialog.close();
    }
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialogRef.current?.open) {
          closeDialog();
        } else {
          openDialog();
        }
      }
    };

    const handleCustomOpen = () => openDialog();

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, [openDialog, closeDialog]);

  // Fallback light-dismiss for browsers without HTMLDialogElement.closedBy support (e.g. Safari)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => setIsOpen(false);
    dialog.addEventListener("close", handleClose);

    if (!("closedBy" in HTMLDialogElement.prototype)) {
      const handleClick = (event: MouseEvent) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (!isDialogContent) {
          dialog.close();
        }
      };
      dialog.addEventListener("click", handleClick);
      return () => {
        dialog.removeEventListener("close", handleClose);
        dialog.removeEventListener("click", handleClick);
      };
    }

    return () => dialog.removeEventListener("close", handleClose);
  }, []);

  const items: PaletteItem[] = useMemo(
    () => [
      {
        id: "home",
        label: "Go to Home",
        group: "Navigate",
        keywords: "hero top start",
        icon: Home,
      },
      {
        id: "about",
        label: "Go to About",
        group: "Navigate",
        keywords: "bio story background",
        icon: User,
      },
      {
        id: "experience",
        label: "Go to Experience",
        group: "Navigate",
        keywords: "career work jobs icodebees mykare",
        icon: Briefcase,
      },
      {
        id: "projects",
        label: "Go to Selected Work",
        group: "Navigate",
        keywords: "portfolio showcase darlings permatech avumy",
        icon: FolderKanban,
      },
      {
        id: "skills",
        label: "Go to Skills Universe",
        group: "Navigate",
        keywords: "tech stack react nextjs typescript",
        icon: Cpu,
      },
      {
        id: "contact",
        label: "Go to Contact",
        group: "Navigate",
        keywords: "email message hire",
        icon: Mail,
      },
      {
        id: "copy-email",
        label: copied ? "Copied: gouthamkrishnaps02@gmail.com" : "Copy Email Address",
        group: "Actions",
        keywords: "mail clipboard contact",
        icon: copied ? Check : Copy,
      },
      {
        id: "toggle-theme",
        label: isDark ? "Switch to Light Theme" : "Switch to Dark Theme",
        group: "Actions",
        keywords: "dark light mode appearance",
        icon: isDark ? Sun : Moon,
      },
      {
        id: "resume",
        label: "Download Resume (PDF)",
        group: "Actions",
        keywords: "cv pdf download",
        icon: Download,
      },
    ],
    [copied, isDark]
  );

  const executeItem = useCallback(
    (id: string) => {
      if (["home", "about", "experience", "projects", "skills", "contact"].includes(id)) {
        closeDialog();
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else {
          router.push(`/#${id}`);
        }
        return;
      }
      if (id === "copy-email") {
        navigator.clipboard?.writeText("gouthamkrishnaps02@gmail.com");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else if (id === "toggle-theme") {
        setTheme(isDark ? "light" : "dark");
        closeDialog();
      } else if (id === "resume") {
        const link = document.createElement("a");
        link.href = "/resume/Goutham_Krishna_PS.pdf";
        link.download = "Goutham_Krishna_PS.pdf";
        link.click();
        closeDialog();
      }
    },
    [closeDialog, isDark, router, setTheme]
  );

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q)
    );
  }, [items, query]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredItems.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = filteredItems[selectedIndex];
      if (target) executeItem(target.id);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: "any" } as Record<string, string>)}
      aria-label="Quick navigation and actions"
      className="m-auto w-[92vw] max-w-lg rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 text-zinc-900 dark:text-zinc-100 shadow-2xl backdrop-blur-xl p-0 overflow-hidden backdrop:bg-black/55 backdrop:backdrop-blur-sm"
    >
      {/* Search Header */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-200/70 dark:border-zinc-800/80">
        <Search size={17} className="text-zinc-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(0);
          }}
          onKeyDown={handleInputKeyDown}
          placeholder="Jump to section or run an action..."
          aria-label="Search commands"
          className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
        />
        <button
          type="button"
          onClick={closeDialog}
          aria-label="Close command palette"
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      {/* Results List */}
      <div className="max-h-[340px] overflow-y-auto p-2">
        {filteredItems.length === 0 ? (
          <p className="py-8 text-center text-xs text-zinc-500">
            No matching commands found.
          </p>
        ) : (
          <div role="listbox" aria-label="Commands" className="flex flex-col gap-0.5">
            {filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => executeItem(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-indigo-500/12 text-indigo-600 dark:text-indigo-400"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/70 dark:hover:bg-zinc-900/70"
                  }`}
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <Icon size={16} className="shrink-0 opacity-80" />
                    <span className="font-medium truncate">{item.label}</span>
                  </span>
                  <span className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400">
                      {item.group}
                    </span>
                    {isSelected && <CornerDownLeft size={12} className="opacity-60" />}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Hints */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-zinc-200/70 dark:border-zinc-800/80 text-[11px] text-zinc-500 bg-zinc-50/60 dark:bg-zinc-900/40">
        <span className="flex items-center gap-2">
          <span>↑↓ Navigate</span>
          <span>·</span>
          <span>↵ Select</span>
        </span>
        <span>Esc to close</span>
      </div>

      {isOpen && <span className="sr-only">Command palette open</span>}
    </dialog>
  );
}
