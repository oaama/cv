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

  // Typing animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      x: -20,
      y: 10,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  const AnimatedText = ({ text, className }: { text: string; className?: string }) => {
    return (
      <motion.span
        variants={container}
        initial="hidden"
        animate="visible"
        className={className}
        style={{ display: 'inline-block' }}
      >
        {text.split("").map((char, index) => (
          <motion.span variants={child} key={index} style={{ display: 'inline-block' }}>
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.span>
    );
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-background">
      <div className="container mx-auto px-6 relative z-10">
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
              <AnimatedText text={data.hero.name} /> <br />
              <span className="text-muted-foreground">
                <AnimatedText text="Specialist in" />
              </span> <br />
              <AnimatedText text={data.hero.specialty} className="text-gradient" />
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-xl leading-relaxed">
              {data.hero.bio}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link 
                href="/#projects" 
                className="group flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
              >
                View Projects
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/#contact" 
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
              
              <div className="absolute -bottom-6 -right-6 glass p-6 rounded-3xl border-white/10 shadow-2xl">
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