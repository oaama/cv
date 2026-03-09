"use client"

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { initialPortfolioData } from '@/lib/portfolio-store';
import { getTechIcon } from '@/lib/icons';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';

export function TechStack() {
  const db = useFirestore();
  const configRef = useMemo(() => doc(db, 'settings', 'portfolio'), [db]);
  const { data: remoteConfig, loading } = useDoc<any>(configRef);

  const data = remoteConfig || initialPortfolioData;

  if (loading) return null;

  return (
    <section id="stack" className="py-24 scroll-mt-32">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-headline font-bold mb-4">Mastering the <span className="text-primary">Tools</span></h2>
          <p className="text-muted-foreground">My technical arsenal for building world-class software.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {data.techStack.map((item: any, i: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass p-8 rounded-3xl border-white/5 text-center group transition-all hover:bg-primary hover:text-white"
            >
              <div className="mb-4 flex justify-center text-primary group-hover:text-white transition-colors">
                {getTechIcon(item.name, 32)}
              </div>
              <h4 className="font-bold mb-1">{item.name}</h4>
              <p className="text-xs text-muted-foreground group-hover:text-white/70 transition-colors uppercase tracking-widest font-bold">
                {item.category}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
