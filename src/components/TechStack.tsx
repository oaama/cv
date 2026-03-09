
"use client"

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Smartphone, Database, Cpu, Atom, Zap, Server, Layers } from 'lucide-react';
import { getPortfolioData, PortfolioData, TechItem } from '@/lib/portfolio-store';

const getIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('react') || n.includes('next')) return <Atom />;
  if (n.includes('flutter') || n.includes('dart')) return <Smartphone />;
  if (n.includes('node') || n.includes('backend')) return <Server />;
  if (n.includes('firebase') || n.includes('cloud')) return <Database />;
  if (n.includes('tailwind') || n.includes('css')) return <Layers />;
  if (n.includes('js') || n.includes('code')) return <Code />;
  return <Zap />;
};

export function TechStack() {
  const [data, setData] = useState<PortfolioData | null>(null);

  useEffect(() => {
    setData(getPortfolioData());
    const handleUpdate = () => setData(getPortfolioData());
    window.addEventListener('portfolio-update', handleUpdate);
    return () => window.removeEventListener('portfolio-update', handleUpdate);
  }, []);

  if (!data) return null;

  return (
    <section id="stack" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-headline font-bold mb-4">Mastering the <span className="text-primary">Tools</span></h2>
          <p className="text-muted-foreground">My technical arsenal for building world-class software.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {data.techStack.map((item, i) => (
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
                {getIcon(item.name)}
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
