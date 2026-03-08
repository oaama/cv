
"use client"

import { useState, useEffect } from 'react';
import { ProjectCard } from './ProjectCard';
import { getProjects, Project } from '@/lib/project-store';

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  return (
    <section id="projects" className="py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-headline font-bold mb-4 tracking-tight">
              Selected <span className="text-gradient">Creations</span>
            </h2>
            <p className="text-muted-foreground max-w-xl">
              A collection of digital experiences built across web and mobile platforms, solving real-world challenges.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="h-1 w-20 bg-primary rounded-full" />
            <div className="h-1 w-8 bg-white/20 rounded-full" />
            <div className="h-1 w-4 bg-white/20 rounded-full" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
