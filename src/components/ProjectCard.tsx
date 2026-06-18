"use client";

import Image, { StaticImageData } from "next/image";
import { motion } from "framer-motion";

interface CardProps {
  project: {
    number: string;
    title: string;
    subtitle: string;
    image: string | StaticImageData;
  };
}

export default function ProjectCard({
  project,
}: CardProps) {
  return (
    <div className="sticky top-0 h-screen flex items-center justify-center">
      <motion.div
        whileHover={{
          scale: 1.02,
        }}
        className="w-[90%] max-w-7xl h-[80vh]
        rounded-[40px]
        overflow-hidden
        border border-surface-border
        bg-surface
        backdrop-blur-md"
      >
        <div className="grid lg:grid-cols-2 h-full">
          <div className="relative h-full">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-10 lg:p-16 flex flex-col justify-center">
            <span className="text-7xl font-black text-brand-500">
              {project.number}
            </span>

            <h2 className="text-5xl font-black mt-4">
              {project.title}
            </h2>

            <p className="text-xl text-text-muted mt-4">
              {project.subtitle}
            </p>

            <div className="flex gap-3 mt-8">
              <span className="px-4 py-2 rounded-full bg-brand-500/10">
                Next.js
              </span>

              <span className="px-4 py-2 rounded-full bg-brand-500/10">
                TypeScript
              </span>

              <span className="px-4 py-2 rounded-full bg-brand-500/10">
                GraphQL
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}