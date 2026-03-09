"use client"

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-background border-t border-white/5">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="px-2 h-8 bg-primary/20 flex items-center justify-center rounded-lg">
            <span className="font-headline font-bold text-primary">Eng</span>
          </div>
          <span className="font-headline font-bold text-xl tracking-tighter uppercase">ANGELO</span>
        </div>

        <p className="text-sm text-muted-foreground font-medium">
          © {currentYear} Developed & Designed with passion by Angelo.
        </p>

        <div className="flex items-center gap-8">
          <Link href="/privacy" className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors">Privacy</Link>
          <Link href="/terms" className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
