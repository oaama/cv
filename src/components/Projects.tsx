
"use client"

import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { ProjectCard } from './ProjectCard';
import { Skeleton } from '@/components/ui/skeleton';

export function Projects() {
  const db = useFirestore();
  const projectsQuery = db ? query(collection(db, 'projects'), orderBy('createdAt', 'desc')) : null;
  const { data: projects, loading } = useCollection(projectsQuery);

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

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[400px] rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects?.map((project: any) => (
              <ProjectCard key={project.id} project={project} />
            ))}
            {projects?.length === 0 && (
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
