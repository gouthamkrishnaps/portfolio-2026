"use client";

import { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Preloader from "./Preloader";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Skip loading if already finished in this browser session
    if (sessionStorage.getItem("preloader-done") === "true") {
      setLoading(false);
      return;
    }
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
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {loading && <Preloader onComplete={handleComplete} />}
      <div className={loading ? "opacity-0" : "opacity-100 transition-opacity duration-700"}>
        {children}
      </div>
    </NextThemesProvider>
  );
}
