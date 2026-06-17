"use client";

import {
  motion,
  useScroll,
  useSpring,
} from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress);

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