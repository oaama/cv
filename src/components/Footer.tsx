
"use client"

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-background border-t border-white/5">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/20 flex items-center justify-center rounded-lg">
            <span className="font-headline font-bold text-primary">A</span>
          </div>
          <span className="font-headline font-bold text-lg tracking-tighter">ANGELO</span>
        </div>

        <p className="text-sm text-muted-foreground">
          © {currentYear} Apex Technoscapes. Designed with precision by Angelo.
        </p>

        <div className="flex items-center gap-8">
          <Link href="#" className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors">Privacy</Link>
          <Link href="#" className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
