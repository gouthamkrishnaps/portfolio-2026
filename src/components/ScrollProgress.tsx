"use client";

import {
  motion,
  useScroll,
  useSpring,
} from "framer-motion";
import { usePathname } from "next/navigation";

export default function ScrollProgress() {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress);

  if (pathname === "/sandbox") return null;

  return (
    <div>
        <motion.div
          style={{
            scaleX,
            transformOrigin: "0%",
          }}
          className="fixed top-0 left-0 right-0 h-[3px]
          bg-brand-500 z-[9999]"
        />
    </div>
  );
}