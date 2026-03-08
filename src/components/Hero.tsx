"use client"

import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] bg-accent/10 blur-[100px] rounded-full -z-10" />

      <div className="container mx-auto px-6">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-6">
              Software Engineer
            </span>
            <h1 className="text-6xl md:text-8xl font-headline font-bold leading-[0.9] mb-8 tracking-tighter">
              Angelo <br />
              <span className="text-muted-foreground">Specialist in</span> <span className="text-gradient">Web & Flutter</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl leading-relaxed"
          >
            I build modern websites and powerful mobile applications. Founder of Zone A & Sidra.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
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
          </motion.div>
        </div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground flex flex-col items-center gap-2"
      >
        <span className="text-xs uppercase tracking-widest font-bold">Scroll Down</span>
        <ChevronDown size={20} />
      </motion.div>
    </section>
  );
}
