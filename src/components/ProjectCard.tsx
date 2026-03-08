
"use client"

import { motion } from 'framer-motion';
import { ExternalLink, Github, FileBox } from 'lucide-react';
import Image from 'next/image';
import { Project } from '@/lib/project-store';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-3xl overflow-hidden border-white/5 flex flex-col group h-full"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image 
          src={project.image} 
          alt={project.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          {project.demo && (
            <a href={project.demo} target="_blank" className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform">
              <ExternalLink size={20} />
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform">
              <Github size={20} />
            </a>
          )}
          {project.drive && (
            <a href={project.drive} target="_blank" className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform">
              <FileBox size={20} />
            </a>
          )}
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.split(',').map(t => (
            <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {t.trim()}
            </span>
          ))}
        </div>
        <h3 className="text-2xl font-headline font-bold mb-3">{project.name}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-grow">
          {project.description}
        </p>

        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
           <a 
             href={project.demo || '#'} 
             className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2 hover:opacity-70 transition-opacity"
           >
             View Live <ArrowRight size={14} />
           </a>
        </div>
      </div>
    </motion.div>
  );
}

function ArrowRight({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14m-7-7 7 7-7 7"/>
    </svg>
  );
}
