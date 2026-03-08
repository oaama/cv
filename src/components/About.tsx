"use client"

import { motion } from 'framer-motion';
import { Building2, GraduationCap, Rocket, Sparkles } from 'lucide-react';

const ventures = [
  {
    icon: <Building2 className="text-primary" size={24} />,
    title: "Zone A",
    role: "Founder & CEO",
    description: "An integrated software house and tech academy empowering businesses and the next generation of developers."
  },
  {
    icon: <Sparkles className="text-primary" size={24} />,
    title: "Sidra",
    role: "Founder",
    description: "Innovative tech venture focused on driving digital transformation through cutting-edge solutions."
  }
];

export function About() {
  return (
    <section id="about" className="py-24 bg-card/30 border-y border-white/5">
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
              Driven by Innovation, <br />
              <span className="text-primary">Led by Passion.</span>
            </h2>
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p>
                I am a Software Engineer based in Egypt, specializing in crafting premium web experiences and cross-platform mobile applications using Flutter.
              </p>
              <p>
                My journey isn't just about writing code; it's about building ecosystems. Through <span className="text-foreground font-semibold">Zone A</span>, I provide cutting-edge software solutions and cultivate tech talent. Through <span className="text-foreground font-semibold">Sidra</span>, I drive innovation in the digital landscape.
              </p>
            </div>

            <div className="mt-12 grid sm:grid-cols-2 gap-8">
              {ventures.map((v, i) => (
                <div key={i} className="glass p-6 rounded-2xl border-white/5">
                  <div className="mb-4">{v.icon}</div>
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
                  <p className="font-headline text-3xl font-bold tracking-tight mb-2">Since 2018</p>
                  <p className="text-muted-foreground uppercase tracking-widest text-sm font-bold">Developing Excellence</p>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
