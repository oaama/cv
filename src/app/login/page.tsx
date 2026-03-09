"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Lock, Sparkles, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();

  // 3D Tilt Effect logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Welcome back, Angelo", description: "Login successful. Redirecting to dashboard..." });
      router.push('/dash-admin');
    } catch (error: any) {
      console.error(error);
      let message = "Invalid credentials.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        message = "No user found with these credentials. Make sure you created the user in Firebase Console.";
      } else if (error.code === 'auth/invalid-api-key') {
        message = "Firebase API Key is invalid. Check your config.";
      }
      
      toast({ 
        title: "Access Denied", 
        description: message, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background overflow-hidden relative">
      {/* Background Decorations */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute -top-20 -left-20 w-80 h-80 bg-primary/20 blur-[100px] rounded-full pointer-events-none"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          rotate: [0, -120, 0],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-40 -right-20 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full pointer-events-none"
      />

      <motion.div
        style={{
          perspective: 1000,
          rotateX,
          rotateY,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="glass border-white/10 shadow-2xl overflow-hidden group rounded-[2.5rem]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
          
          <CardHeader className="text-center pb-2">
            <motion.div 
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="mx-auto w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center mb-6 relative group"
            >
              <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
              <div className="relative">
                <ShieldCheck className="text-primary group-hover:scale-110 transition-transform" size={48} />
                <motion.div
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-2 -right-2 text-accent"
                >
                  <Sparkles size={20} />
                </motion.div>
              </div>
            </motion.div>
            <CardTitle className="text-3xl font-headline font-bold tracking-tight mb-2">
              <span className="text-gradient">Admin Access</span>
            </CardTitle>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.3em]">Secure Gateway</p>
          </CardHeader>

          <CardContent className="pt-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1 group-focus-within:text-primary transition-colors">Identifier (Email)</label>
                  <Input 
                    type="email" 
                    placeholder="admin@zonea.com"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-primary focus:border-primary transition-all text-lg"
                  />
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1 group-focus-within:text-primary transition-colors">Passkey (Password)</label>
                  <Input 
                    type="password" 
                    placeholder="••••••••"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-primary focus:border-primary transition-all text-lg"
                  />
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  type="submit" 
                  className="w-full h-16 font-bold text-lg bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/20 rounded-2xl flex items-center justify-center gap-3 transition-all"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </div>
                  ) : (
                    <>
                      Enter Dashboard <Lock size={20} />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>

            <div className="mt-8 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex gap-3 items-start">
              <AlertCircle className="text-primary shrink-0 mt-0.5" size={18} />
              <div className="text-[11px] text-muted-foreground leading-relaxed">
                <span className="text-primary font-bold">First time?</span> Go to your Firebase Console &gt; Authentication &gt; Users to create your admin credentials.
              </div>
            </div>
          </CardContent>
          
          <div className="p-8 text-center border-t border-white/5 bg-white/[0.02]">
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-bold">
              Authorized Personnel Only
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
