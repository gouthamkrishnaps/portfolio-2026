"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { featuredProjects } from "../data/projects";
import Tilt from "react-parallax-tilt";

export default function FeaturedProjects() {
    return (
        <section
            id="projects"
            className="relative py-20 sm:py-32 bg-bg-primary"
        >
            {/* Background Text */}

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <h1 className="absolute -left-10 sm:left-0 top-10 sm:top-20 text-[120px] sm:text-[180px] lg:text-[280px] font-black text-text-mask select-none">
                    WORK
                </h1>
            </div>

            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
                <div>
                    <span className="text-brand-400 uppercase tracking-[4px] text-sm">
                        Featured Projects
                    </span>

                    <h2 className="mt-3 sm:mt-4 text-4xl sm:text-5xl md:text-6xl font-black">
                        Selected Work
                    </h2>
                </div>

                <div className="space-y-20 sm:space-y-32 mt-16 sm:mt-24">
                    {featuredProjects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{
                                opacity: 0,
                                y: 100,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.8,
                            }}
                            className={`grid lg:grid-cols-2 gap-8 sm:gap-12 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""
                                }`}
                        >
                            {/* Image */}

                            <Tilt
                                tiltMaxAngleX={8}
                                tiltMaxAngleY={8}
                                perspective={1200}
                                glareEnable={true}
                                glareMaxOpacity={0.15}
                                scale={1.02}
                                transitionSpeed={1500}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-brand-500/20 blur-3xl" />

                                <div className="relative overflow-hidden rounded-[30px] border border-surface-border">
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        width={1400}
                                        height={1000}
                                        className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                                    />
                                </div>
                            </Tilt>

                            {/* Content */}

                            <div>
                                <span className="text-[60px] sm:text-[80px] md:text-[120px] font-black text-text-mask-medium leading-none">
                                    {project.id}
                                </span>

                                <p className="text-brand-400 uppercase tracking-widest">
                                    {project.category}
                                </p>

                                <h3 className="text-3xl sm:text-4xl md:text-5xl font-black mt-2 sm:mt-3">
                                    {project.title}
                                </h3>

                                <p className="text-text-muted mt-4 sm:mt-6 text-base sm:text-lg leading-relaxed">
                                    {project.description}
                                </p>

                                {/* Technologies */}

                                <div className="flex flex-wrap gap-2 sm:gap-3 mt-6 sm:mt-8">
                                    {project.technologies.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-brand-500/20 bg-brand-500/10 text-brand-300 text-sm sm:text-base"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                {/* Features */}

                                <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8">
                                    {project.highlights.map((item) => (
                                        <div
                                            key={item}
                                            className="bg-surface border border-surface-border rounded-xl p-3 sm:p-4 text-sm sm:text-base"
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </div>

                                {/* Buttons */}

                                <div className="flex flex-wrap gap-3 sm:gap-4 mt-8 sm:mt-10">
                                    <button className="bg-brand-600 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium flex items-center gap-2 text-sm sm:text-base">
                                        View Case Study
                                        <ArrowUpRight size={16} className="sm:size-[18px]" />
                                    </button>

                                    <button className="border border-surface-border px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base">
                                        Live Demo
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}