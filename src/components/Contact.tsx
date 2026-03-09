
"use client"

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Github, Linkedin, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { getPortfolioData, PortfolioData } from '@/lib/portfolio-store';

export function Contact() {
  const [data, setData] = useState<PortfolioData | null>(null);

  useEffect(() => {
    setData(getPortfolioData());
    const handleUpdate = () => setData(getPortfolioData());
    window.addEventListener('portfolio-update', handleUpdate);
    return () => window.removeEventListener('portfolio-update', handleUpdate);
  }, []);

  if (!data) return null;

  const socials = [
    { icon: <Mail />, label: 'Email', value: data.contact.email, href: `mailto:${data.contact.email}` },
    { icon: <MessageCircle />, label: 'WhatsApp', value: data.contact.whatsapp, href: `https://wa.me/${data.contact.whatsapp.replace(/\s+/g, '')}` },
    { icon: <Linkedin />, label: 'LinkedIn', value: data.contact.linkedin, href: `https://linkedin.com${data.contact.linkedin}` },
    { icon: <Github />, label: 'GitHub', value: data.contact.github, href: `https://github.com/${data.contact.github.replace('@', '')}` },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. I'll get back to you shortly.",
    });
  };

  return (
    <section id="contact" className="py-24 bg-card/20 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6 tracking-tight">
                Let's <span className="text-primary">Collaborate</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-12">
                Have a project in mind or just want to say hello? My inbox is always open.
              </p>

              <div className="space-y-8">
                {socials.map((social, i) => (
                  <a 
                    key={i} 
                    href={social.href} 
                    className="flex items-center gap-6 group hover:text-primary transition-colors"
                  >
                    <div className="w-14 h-14 glass flex items-center justify-center rounded-2xl group-hover:bg-primary group-hover:text-white group-hover:rotate-6 transition-all">
                      {social.icon}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-1">
                        {social.label}
                      </p>
                      <p className="text-lg font-bold">{social.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass p-10 rounded-[2.5rem] border-white/5 shadow-2xl"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest ml-1">Name</label>
                    <Input placeholder="Your Name" className="bg-white/5 border-white/10 h-14 rounded-xl focus-visible:ring-primary" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest ml-1">Email</label>
                    <Input type="email" placeholder="Your Email" className="bg-white/5 border-white/10 h-14 rounded-xl focus-visible:ring-primary" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest ml-1">Message</label>
                  <Textarea placeholder="Tell me about your project..." className="bg-white/5 border-white/10 min-h-[150px] rounded-xl focus-visible:ring-primary py-4" required />
                </div>
                <Button type="submit" className="w-full h-14 bg-primary text-white font-bold rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center gap-2">
                  Send Message <Send size={18} />
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
