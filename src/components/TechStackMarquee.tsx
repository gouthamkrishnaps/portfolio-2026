"use client";

import { FaReact, FaNodeJs } from "react-icons/fa";
import {
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiGraphql,
  SiThreedotjs,
  SiFirebase,
} from "react-icons/si";

const technologies = [
  { name: "React", icon: FaReact },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "TypeScript", icon: SiTypescript },
  { name: "Tailwind CSS", icon: SiTailwindcss },
  { name: "Node.js", icon: FaNodeJs },
  { name: "GraphQL", icon: SiGraphql },
  { name: "Three.js", icon: SiThreedotjs },
  { name: "Firebase", icon: SiFirebase },
];

export default function TechStackMarquee() {
  // Duplicate the list for seamless infinite scroll
  const items = [...technologies, ...technologies];

  return (
    <section
      aria-label="Tech stack"
      className="relative py-6 sm:py-8 bg-bg-primary border-t border-b border-zinc-200/60 dark:border-zinc-800/40 overflow-hidden"
    >
      {/* Edge fade masks */}
      <div className="absolute inset-y-0 left-0 w-20 sm:w-32 bg-gradient-to-r from-bg-primary to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 sm:w-32 bg-gradient-to-l from-bg-primary to-transparent z-10 pointer-events-none" />

      {/* Scrolling track */}
      <div className="animate-marquee flex items-center gap-10 sm:gap-14 w-max">
        {items.map((tech, idx) => {
          const Icon = tech.icon;
          return (
            <div
              key={`${tech.name}-${idx}`}
              className="group flex items-center gap-2.5 sm:gap-3 shrink-0 select-none cursor-default"
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400 dark:text-zinc-600 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors duration-300" />
              <span className="text-sm sm:text-base font-medium text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors duration-300 whitespace-nowrap tracking-wide">
                {tech.name}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
