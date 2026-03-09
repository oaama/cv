"use client"

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getPortfolioData, PortfolioData } from '@/lib/portfolio-store';

export function Hero() {
  const [data, setData] = useState<PortfolioData | null>(null);

  useEffect(() => {
    setData(getPortfolioData());
    const handleUpdate = () => setData(getPortfolioData());
    window.addEventListener('portfolio-update', handleUpdate);
    return () => window.removeEventListener('portfolio-update', handleUpdate);
  }, []);

  if (!data) return null;

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] bg-accent/10 blur-[100px] rounded-full -z-10" />

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-8">
              <span className="flex items-center gap-2">
                <Sparkles size={14} /> Software Engineer
              </span>
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline font-bold leading-[0.9] mb-8 tracking-tighter">
              {data.hero.name} <br />
              <span className="text-muted-foreground">Specialist in</span> <br />
              <span className="text-gradient">{data.hero.specialty}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-xl leading-relaxed">
              {data.hero.bio}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link 
                href="#projects" 
                className="group flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
              >
                View Projects
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="#contact" 
                className="flex items-center gap-2 px-8 py-4 bg-secondary text-foreground border border-white/5 rounded-2xl font-bold transition-all hover:bg-white/10"
              >
                Contact Me
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-[500px] mx-auto">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-[4rem] rotate-6 blur-2xl" />
              <div className="absolute inset-0 border-2 border-white/10 rounded-[4rem] -rotate-3" />
              <div className="relative w-full h-full rounded-[4rem] overflow-hidden border border-white/10 glass shadow-2xl">
                {data.hero.imageUrl ? (
                  <Image 
                    src={data.hero.imageUrl} 
                    alt={data.hero.name}
                    fill
                    className="object-cover"
                    priority
                    data-ai-hint="man portrait"
                  />
                ) : (
                   <div className="w-full h-full flex items-center justify-center bg-white/5">
                      <Sparkles size={100} className="text-primary/20" />
                   </div>
                )}
              </div>
              
              {/* Floating Decorative Badge */}
              <div className="absolute -bottom-6 -right-6 glass p-6 rounded-3xl border-white/10 shadow-2xl animate-bounce duration-[3000ms]">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest">Available for Hire</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
