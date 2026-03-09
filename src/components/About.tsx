"use client"

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Rocket, Sparkles } from 'lucide-react';
import { getPortfolioData, PortfolioData } from '@/lib/portfolio-store';

export function About() {
  const [data, setData] = useState<PortfolioData | null>(null);

  useEffect(() => {
    setData(getPortfolioData());
    const handleUpdate = () => setData(getPortfolioData());
    window.addEventListener('portfolio-update', handleUpdate);
    return () => window.removeEventListener('portfolio-update', handleUpdate);
  }, []);

  if (!data) return null;

  return (
    <section id="about" className="py-24 bg-card/30 border-y border-white/5 scroll-mt-32">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            <h2 className="text-4xl md:text-5xl font-headline font-bold mb-8 tracking-tight">
              {data.about.title}
            </h2>
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p>{data.about.bio}</p>
            </div>

            <div className="mt-12 grid sm:grid-cols-2 gap-8">
              {data.about.ventures.map((v, i) => (
                <div key={i} className="glass p-6 rounded-2xl border-white/5">
                  <div className="mb-4">
                    {i === 0 ? <Building2 className="text-primary" size={24} /> : <Sparkles className="text-primary" size={24} />}
                  </div>
                  <h4 className="font-bold text-lg mb-1">{v.title}</h4>
                  <p className="text-xs text-primary font-bold uppercase tracking-wider mb-3">{v.role}</p>
                  <p className="text-sm text-muted-foreground">{v.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10 rounded-[3rem] -rotate-3 border border-white/10" />
            <div className="absolute inset-0 bg-card border border-white/10 rounded-[3rem] rotate-3 overflow-hidden flex items-center justify-center p-12">
               <div className="text-center">
                  <Rocket size={120} className="text-primary/20 mb-6 mx-auto" />
                  <p className="font-headline text-3xl font-bold tracking-tight mb-2">{data.about.experienceTitle}</p>
                  <p className="text-muted-foreground uppercase tracking-widest text-sm font-bold">{data.about.experienceSub}</p>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
