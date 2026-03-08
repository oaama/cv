"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Globe, Smartphone, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Stack', href: '#stack' },
  { name: 'Contact', href: '#contact' },
  { name: 'Admin', href: '/admin' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="px-3 h-10 bg-primary flex items-center justify-center rounded-xl rotate-3 group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
            <span className="font-headline font-bold text-white text-xl">Eng</span>
          </div>
          <span className="font-headline font-bold text-xl tracking-tighter">ANGELO</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link 
            href="#contact" 
            className="px-5 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-semibold hover:bg-primary hover:text-white transition-all"
          >
            Hire Me
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-foreground p-1" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 glass border-t border-white/5 py-6 flex flex-col items-center gap-6 md:hidden"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium"
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
