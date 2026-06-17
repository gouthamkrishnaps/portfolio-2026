"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Tilt from "react-parallax-tilt";

const stats = [
  {
    value: "2+",
    label: "Years Experience",
  },
  {
    value: "20+",
    label: "Projects",
  },
  {
    value: "5+",
    label: "Companies & Clients",
  },
  {
    value: "10+",
    label: "Technologies",
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="relative py-20 sm:py-32 bg-bg-primary"
    >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
  <h1 className="absolute -left-10 top-10 sm:top-20 sm:left-0 text-[120px] sm:text-[180px] lg:text-[280px] font-black text-text-mask leading-none select-none">
    ABOUT
  </h1>
</div>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-brand-600/20 blur-[60px] sm:blur-[80px] rounded-full" />

            <Tilt
  tiltMaxAngleX={10}
  tiltMaxAngleY={10}
  perspective={1500}
  scale={1.03}
  glareEnable
  glareMaxOpacity={0.12}
  className="relative"
>
              <Image
                src="/images/profile.jpg"
                alt="Goutham"
                width={700}
                height={900}
                className="w-full h-auto object-cover"
              />
            </Tilt>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-brand-400 uppercase tracking-[4px] text-sm">
              About Me
            </span>

            <h2 className="mt-3 sm:mt-4 text-4xl sm:text-5xl md:text-6xl font-black leading-none">
              Building Modern
              <br />
              Digital Products
            </h2>

            <p className="mt-6 sm:mt-8 text-text-muted text-base sm:text-lg leading-relaxed">
              I'm Goutham Krishna P S, a Junior Software
              Developer specializing in React, Next.js,
              TypeScript, GraphQL and modern frontend
              architecture.
            </p>

            <p className="mt-4 sm:mt-6 text-text-muted text-base sm:text-lg leading-relaxed">
              Currently working at ICodeBees, developing
              scalable eCommerce platforms and enterprise
              applications. I've contributed to projects
              such as Avumy, Darlings of Chelsea,
              Permatech, Rubberized and various custom
              web solutions.
            </p>

            <p className="mt-4 sm:mt-6 text-text-muted text-base sm:text-lg leading-relaxed">
              My focus is creating fast, responsive,
              accessible, and user-centric digital
              experiences while maintaining clean,
              scalable code architecture.
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-3 mt-8 sm:mt-10">
              {[
                "Next.js",
                "React",
                "TypeScript",
                "GraphQL",
                "Node.js",
                "Tailwind",
              ].map((item) => (
                <span
                  key={item}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-brand-500/20 bg-brand-500/10 text-brand-300 text-sm sm:text-base"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-16 sm:mt-24">
          {stats.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.1,
              }}
              whileHover={{
                y: -10,
              }}
              className="rounded-3xl border border-surface-border bg-surface backdrop-blur-md p-6 sm:p-8"
            >
              <h3 className="text-4xl sm:text-5xl font-black text-brand-500">
                {item.value}
              </h3>

              <p className="mt-3 text-text-muted">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}