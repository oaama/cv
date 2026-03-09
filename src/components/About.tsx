
"use client"

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Sparkles, User } from 'lucide-react';
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
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10" />
            
            <h2 className="text-4xl md:text-5xl font-headline font-bold mb-8 tracking-tight">
              {data.about.title}
            </h2>
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
              <p>{data.about.bio}</p>
            </div>

            <div className="mt-16 grid sm:grid-cols-2 gap-8 text-left">
              {data.about.ventures.map((v, i) => (
                <div key={i} className="glass p-8 rounded-[2rem] border-white/5 hover:border-primary/30 transition-colors">
                  <div className="mb-6 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    {i === 0 ? <Building2 className="text-primary" size={24} /> : <Sparkles className="text-primary" size={24} />}
                  </div>
                  <h4 className="font-bold text-xl mb-1">{v.title}</h4>
                  <p className="text-xs text-primary font-bold uppercase tracking-widest mb-4">{v.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
