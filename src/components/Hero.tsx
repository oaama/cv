
"use client"

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
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
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center pt-32 pb-16 overflow-hidden bg-background">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left"
          >
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-headline font-bold leading-[1.1] md:leading-[0.9] mb-8 tracking-tighter">
              <AnimatedText text={data.hero.name} /> <br />
              <span className="text-muted-foreground">
                <AnimatedText text="Specialist in" />
              </span> <br />
              <AnimatedText text={data.hero.specialty} className="text-gradient" />
            </h1>
            
            <p className="text-base md:text-xl text-muted-foreground mb-10 md:mb-12 max-w-2xl leading-relaxed">
              {data.hero.bio}
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-start items-start sm:items-center">
              <Link 
                href="/#projects" 
                className="group w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-5 bg-primary text-white rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
              >
                View Projects
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/#contact" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-5 bg-secondary text-foreground border border-white/5 rounded-2xl font-bold transition-all hover:bg-white/10"
              >
                Contact Me
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
