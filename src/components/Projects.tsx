
"use client"

import { useMemo } from 'react';
import { ProjectCard } from './ProjectCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Project } from '@/lib/portfolio-store';

export function Projects() {
  const db = useFirestore();
  const projectsQuery = useMemo(() => query(collection(db, 'projects')), [db]);
  const { data: projects, loading } = useCollection<Project>(projectsQuery);

  return (
    <section id="projects" className="py-24 scroll-mt-32">
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
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[400px] rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects?.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
            {(!projects || projects.length === 0) && (
              <p className="col-span-full text-center py-20 text-muted-foreground">
                No projects added yet. Check back soon!
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
