"use client";

import { motion } from "framer-motion";
import CounterCard from "./CounterCard";

export default function Achievements() {
  return (
    <section className="relative py-20 sm:py-32">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <h1 className="absolute -right-10 sm:right-0 top-0 text-[120px] sm:text-[180px] lg:text-[280px] font-black text-text-mask select-none">
          IMPACT
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span className="text-brand-400 uppercase tracking-[4px] text-sm">
            Achievements
          </span>

          <h2 className="mt-3 sm:mt-4 text-4xl sm:text-5xl md:text-6xl font-black">
            Impact & Results
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-20">
          <CounterCard
            value="20+"
            label="Projects Delivered"
          />

          <CounterCard
            value="5+"
            label="Production Applications"
          />

          <CounterCard
            value="10+"
            label="Technologies Mastered"
          />

          <CounterCard
            value="100%"
            label="Responsive Experiences"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mt-16 sm:mt-20">
          <div className="rounded-[32px] border border-surface-border bg-surface p-6 sm:p-8">
            <h3 className="text-2xl sm:text-3xl font-bold">
              Career Highlights
            </h3>

            <div className="space-y-4 sm:space-y-5 mt-6 sm:mt-8">
              {[
                "Developed enterprise eCommerce platforms",
                "Built scalable Next.js applications",
                "Integrated GraphQL & REST APIs",
                "Delivered international client projects",
                "Created reusable UI architecture",
                "Worked across healthcare and commerce domains",
              ].map((item) => (
                <div
                  key={item}
                  className="flex gap-3 sm:gap-4 items-start"
                >
                  <div className="w-2 h-2 rounded-full bg-brand-500 mt-2 sm:mt-3 shrink-0" />
                  <p className="text-text-secondary text-sm sm:text-base">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-surface-border bg-surface p-6 sm:p-8">
            <h3 className="text-2xl sm:text-3xl font-bold">
              Core Expertise
            </h3>

            <div className="space-y-4 sm:space-y-6 mt-6 sm:mt-8">
              {[
                {
                  title: "Frontend Development",
                  value: "95%",
                },
                {
                  title: "Next.js Ecosystem",
                  value: "95%",
                },
                {
                  title: "React Development",
                  value: "95%",
                },
                {
                  title: "GraphQL Integration",
                  value: "85%",
                },
              ].map((skill) => (
                <div key={skill.title}>
                  <div className="flex justify-between mb-2">
                    <span>{skill.title}</span>
                    <span>{skill.value}</span>
                  </div>

                  <div className="h-2 rounded-full bg-surface-raised">
                    <div
                      className="h-full rounded-full bg-brand-500"
                      style={{
                        width: skill.value,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}