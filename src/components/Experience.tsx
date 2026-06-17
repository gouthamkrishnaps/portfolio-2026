"use client";

import { motion } from "framer-motion";
import {
    Briefcase,
    Building2,
    GraduationCap,
} from "lucide-react";

const experiences = [
    {
        title: "Junior Software Developer",
        company: "ICodeBees",
        period: "Aug 2024 - Present",
        icon: Briefcase,
        color:
            "from-brand-600/20 to-accent-cyan/20 border-brand-500/20",
        description:
            "Building scalable eCommerce and enterprise applications using Next.js, React, GraphQL and TypeScript.",
    },
    {
        title: "Software Developer Intern",
        company: "Mykare Health",
        period: "Jun 2024 - Jul 2024",
        icon: Building2,
        color:
            "from-accent-purple-deep/20 to-accent-pink/20 border-accent-purple/20",
        description:
            "Developed healthcare platform interfaces and integrated REST APIs.",
    },
    {
        title: "MERN Stack Intern",
        company: "Luminar Technolab",
        period: "Jul 2023 - Mar 2024",
        icon: GraduationCap,
        color:
            "from-accent-emerald/20 to-accent-green/20 border-accent-green/20",
        description:
            "Completed intensive MERN training and developed full-stack applications.",
    },
];

export default function Experience() {
    return (
        <section
            id="experience"
            className="relative py-20 sm:py-32 bg-bg-primary"
        >
            {/* Background Text */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <h1 className="absolute -right-10 sm:right-0 top-10 text-[120px] sm:text-[180px] lg:text-[280px] font-black text-text-mask leading-none select-none">
                    CAREER
                </h1>
            </div>

            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <span className="text-brand-400 uppercase tracking-[4px] text-sm">
                        Experience
                    </span>

                    <h2 className="mt-3 sm:mt-4 text-4xl sm:text-5xl md:text-6xl font-black">
                        Career Journey
                    </h2>
                </motion.div>

                <div className="relative mt-16 sm:mt-20">
                    {/* Timeline line - on mobile at left-6, on desktop at center */}
                    <div className="absolute left-[18px] sm:left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-surface-border" />

                    <div className="space-y-10 sm:space-y-12">
                        {experiences.map((item, index) => {
                            const Icon = item.icon;

                            return (
                                <motion.div
                                    key={item.company}
                                    initial={{
                                        opacity: 0,
                                        y: 60,
                                    }}
                                    whileInView={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    viewport={{ once: true }}
                                    transition={{
                                        delay: index * 0.15,
                                    }}
                                    className={`relative flex ${index % 2 === 0
                                            ? "md:justify-start"
                                            : "md:justify-end"
                                        }`}
                                >
                                    <div
                                        className={`w-full md:w-[45%] rounded-[30px]
                    border p-6 sm:p-8 backdrop-blur-md
                    bg-gradient-to-br ${item.color}
                    ml-8 sm:ml-10 md:ml-0`}
                                    >
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-surface-raised flex items-center justify-center shrink-0">
                                                <Icon size={20} className="sm:size-6" />
                                            </div>

                                            <div className="min-w-0">
                                                <h3 className="text-lg sm:text-2xl font-bold truncate">
                                                    {item.title}
                                                </h3>

                                                <p className="text-brand-400 text-sm sm:text-base truncate">
                                                    {item.company}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="text-xs sm:text-sm text-text-muted mt-4 sm:mt-5">
                                            {item.period}
                                        </p>

                                        <p className="mt-3 sm:mt-5 text-sm sm:text-base text-text-secondary leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>

                                    {/* Timeline Dot - visible on mobile too */}
                                    <div className="absolute left-[10px] sm:left-[14px] md:left-1/2 top-8 sm:top-12 md:-translate-x-1/2">
                                        <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-brand-500 border-2 sm:border-3 md:border-4 border-bg-primary" />
                                    </div>
                                </motion.div>
                            );
                        })}

                    </div>

                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-16 sm:mt-24">
                    <div className="rounded-3xl p-6 sm:p-8 bg-surface border border-surface-border text-center sm:text-left">
                        <h3 className="text-3xl sm:text-4xl font-black text-brand-500">
                            20+
                        </h3>
                        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-text-muted">
                            Projects Delivered
                        </p>
                    </div>

                    <div className="rounded-3xl p-6 sm:p-8 bg-surface border border-surface-border text-center sm:text-left">
                        <h3 className="text-3xl sm:text-4xl font-black text-brand-500">
                            React
                        </h3>
                        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-text-muted">
                            Primary Frontend Framework
                        </p>
                    </div>

                    <div className="rounded-3xl p-6 sm:p-8 bg-surface border border-surface-border text-center sm:text-left">
                        <h3 className="text-3xl sm:text-4xl font-black text-brand-500">
                            Next.js
                        </h3>
                        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-text-muted">
                            Production Applications
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}