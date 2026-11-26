"use client";

import { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactLenis } from "lenis/react";
import Preloader from "./Preloader";

// Filter out the "Encountered a script tag" React 19 warning in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const origError = console.error;
  console.error = (...args: any[]) => {
    if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) return;
    origError.apply(console, args);
  };
}

function ThemeLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);

    // Skip preloader if already finished in this session or if user prefers reduced motion
    if (sessionStorage.getItem("preloader-done") === "true" || mq.matches) {
      setLoading(false);
      window.dispatchEvent(new Event("hud-loaded"));
    }

    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    // Lock scroll during loading
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  const handleComplete = () => {
    setLoading(false);
    sessionStorage.setItem("preloader-done", "true");
    window.dispatchEvent(new Event("hud-loaded"));
  };

  return (
    <>
      {loading && <Preloader onComplete={handleComplete} />}
      <ReactLenis root options={{ lerp: 0.22, duration: 0.75, smoothWheel: !reducedMotion, syncTouch: false }}>
        <div className={loading ? "opacity-0" : "opacity-100 transition-opacity duration-500 font-sans"}>
          {children}
        </div>
      </ReactLenis>
    </>
  );
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <ThemeLoader>{children}</ThemeLoader>
    </NextThemesProvider>
  );
}
