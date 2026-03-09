
"use client"

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Sparkles } from 'lucide-react';
import Image from 'next/image';
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
    <section id="about" className="py-16 md:py-24 bg-card/30 border-y border-white/5 scroll-mt-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {data.about.imageUrl && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="mb-8 md:mb-10 inline-block relative"
              >
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white/10 overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-500 mx-auto">
                  <Image 
                    src={data.about.imageUrl} 
                    alt="Angelo" 
                    width={144} 
                    height={144} 
                    className="object-cover w-full h-full"
                  />
                </div>
              </motion.div>
            )}

            <h2 className="text-2xl sm:text-3xl md:text-5xl font-headline font-bold mb-6 md:mb-8 tracking-tight uppercase px-2 text-gradient">
              {data.about.title}
            </h2>
            <div className="space-y-4 md:space-y-6 text-muted-foreground text-sm md:text-lg leading-relaxed max-w-2xl mx-auto px-4">
              <p>{data.about.bio}</p>
            </div>

            <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 text-left px-4 sm:px-0">
              {data.about.ventures.map((v, i) => (
                <div key={i} className="glass p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-white/5 hover:border-primary/30 transition-all duration-300">
                  <div className="mb-4 md:mb-6 w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    {i === 0 ? <Building2 className="text-primary" size={20} /> : <Sparkles className="text-primary" size={20} />}
                  </div>
                  <h4 className="font-bold text-lg md:text-xl mb-1">{v.title}</h4>
                  <p className="text-[10px] md:text-xs text-primary font-bold uppercase tracking-widest mb-3 md:mb-4">{v.role}</p>
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
