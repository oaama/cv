
"use client"

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Building2, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { initialPortfolioData } from '@/lib/portfolio-store';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';

export function About() {
  const db = useFirestore();
  const configRef = useMemo(() => doc(db, 'settings', 'portfolio'), [db]);
  const { data: remoteConfig, loading } = useDoc<any>(configRef);

  const data = remoteConfig || initialPortfolioData;

  if (loading) return null;

  return (
    <section id="about" className="py-20 md:py-32 bg-card/30 border-y border-white/5 scroll-mt-32">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            {data.about.imageUrl && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="mb-10 md:mb-12 relative"
              >
                <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-white/10 overflow-hidden shadow-2xl hover:scale-105 hover:rotate-3 transition-all duration-500">
                  <Image 
                    src={data.about.imageUrl} 
                    alt="Angelo" 
                    width={176} 
                    height={176} 
                    className="object-cover w-full h-full"
                  />
                </div>
              </motion.div>
            )}

            <h2 className="text-3xl sm:text-4xl md:text-6xl font-headline font-bold mb-8 md:mb-10 tracking-tight uppercase px-2 text-gradient leading-tight">
              {data.about.title}
            </h2>
            <div className="space-y-6 md:space-y-8 text-muted-foreground text-base md:text-xl leading-relaxed max-w-3xl mx-auto">
              <p>{data.about.bio}</p>
            </div>

            <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-2 gap-8 text-left w-full">
              {data.about.ventures.map((v: any, i: number) => (
                <div key={i} className="glass p-8 md:p-10 rounded-[2rem] border-white/5 hover:border-primary/30 transition-all duration-300">
                  <div className="mb-6 w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                    {i === 0 ? <Building2 className="text-primary" size={24} /> : <Sparkles className="text-primary" size={24} />}
                  </div>
                  <h4 className="font-bold text-xl md:text-2xl mb-2">{v.title}</h4>
                  <p className="text-xs text-primary font-bold uppercase tracking-widest mb-5">{v.role}</p>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
