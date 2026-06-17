"use client";

import { projects } from "../data/projects";
import ProjectCard from "./ProjectCard";


export default function CaseStudies() {
  return (
    <section className="relative bg-bg-primary">
      {projects.map((project) => (
        <ProjectCard
          key={project.number}
          project={project}
        />
      ))}
    </section>
  );
}