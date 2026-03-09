"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Plus, Trash2, Edit, LogOut, User, Briefcase, Cpu, Phone, LayoutGrid, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getPortfolioData, savePortfolioData, PortfolioData, TechItem, Venture, Project } from '@/lib/portfolio-store';
import { getTechIcon } from '@/lib/icons';

export default function DashAdminPage() {
  const router = useRouter();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [newTechCategory, setNewTechCategory] = useState<TechItem['category']>('Web');
  const [techInput, setTechInput] = useState('');
  
  // Project Form State
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<Omit<Project, 'id'>>({
    name: '', description: '', tech: '', image: 'https://picsum.photos/seed/1/800/600', demo: '', github: '', drive: ''
  });

  useEffect(() => {
    const isAuth = localStorage.getItem('is_admin_auth');
    if (!isAuth) {
      router.push('/login');
    } else {
      setData(getPortfolioData());
    }
  }, [router]);

  if (!data) return null;

  const handleLogout = () => {
    localStorage.removeItem('is_admin_auth');
    router.push('/login');
  };

  const persistData = (newData: PortfolioData) => {
    setData(newData);
    savePortfolioData(newData);
    toast({ title: "Changes Saved", description: "Portfolio updated successfully." });
  };

  const updateHero = (field: keyof PortfolioData['hero'], value: string) => {
    persistData({ ...data, hero: { ...data.hero, [field]: value } });
  };

  const updateContact = (field: keyof PortfolioData['contact'], value: string) => {
    persistData({ ...data, contact: { ...data.contact, [field]: value } });
  };

  const updateAbout = (field: keyof Omit<PortfolioData['about'], 'ventures'>, value: string) => {
    persistData({ ...data, about: { ...data.about, [field]: value } });
  };

  const updateVenture = (index: number, field: keyof Venture, value: string) => {
    const newVentures = [...data.about.ventures];
    newVentures[index] = { ...newVentures[index], [field]: value };
    persistData({ ...data, about: { ...data.about, ventures: newVentures } });
  };

  const handleSaveProject = () => {
    const newProjects = editingProjectId 
      ? data.projects.map(p => p.id === editingProjectId ? { ...projectForm, id: p.id } : p)
      : [...data.projects, { ...projectForm, id: Date.now().toString() }];
    
    persistData({ ...data, projects: newProjects });
    setIsAddingProject(false);
    setEditingProjectId(null);
    setProjectForm({ name: '', description: '', tech: '', image: 'https://picsum.photos/seed/1/800/600', demo: '', github: '', drive: '' });
  };

  const deleteProject = (id: string) => {
    persistData({ ...data, projects: data.projects.filter(p => p.id !== id) });
  };

  const addTech = () => {
    if (!techInput.trim()) return;
    const newItem: TechItem = { 
      id: Date.now().toString(), 
      name: techInput.trim(), 
      category: newTechCategory 
    };
    persistData({ ...data, techStack: [...data.techStack, newItem] });
    setTechInput('');
  };

  const removeTech = (id: string) => {
    persistData({ ...data, techStack: data.techStack.filter(t => t.id !== id) });
  };

  return (
    <main className="min-h-screen pt-32 pb-24 bg-background">
      <Navbar />
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-headline font-bold mb-2">Portfolio Management</h1>
            <p className="text-muted-foreground">Control your personal brand and projects in one place.</p>
          </div>
          <Button variant="ghost" className="text-muted-foreground hover:text-destructive" onClick={handleLogout}>
            <LogOut size={20} />
          </Button>
        </div>

        <Tabs defaultValue="hero" className="space-y-8">
          <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl w-full justify-start overflow-x-auto h-auto">
            <TabsTrigger value="hero" className="rounded-xl gap-2 py-3 px-6"><User size={16}/> Hero</TabsTrigger>
            <TabsTrigger value="about" className="rounded-xl gap-2 py-3 px-6"><Briefcase size={16}/> About</TabsTrigger>
            <TabsTrigger value="projects" className="rounded-xl gap-2 py-3 px-6"><LayoutGrid size={16}/> Projects</TabsTrigger>
            <TabsTrigger value="tech" className="rounded-xl gap-2 py-3 px-6"><Cpu size={16}/> Tech Stack</TabsTrigger>
            <TabsTrigger value="contact" className="rounded-xl gap-2 py-3 px-6"><Phone size={16}/> Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="hero">
            <div className="glass p-10 rounded-[2.5rem] border-white/10 space-y-6">
              <h3 className="text-2xl font-headline font-bold mb-4">Hero Section</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name</label>
                  <Input value={data.hero.name} onChange={e => updateHero('name', e.target.value)} className="bg-white/5 border-white/10 h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Specialty / Title</label>
                  <Input value={data.hero.specialty} onChange={e => updateHero('specialty', e.target.value)} className="bg-white/5 border-white/10 h-12" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Hero Bio</label>
                <Textarea value={data.hero.bio} onChange={e => updateHero('bio', e.target.value)} rows={4} className="bg-white/5 border-white/10" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="about">
            <div className="glass p-10 rounded-[2.5rem] border-white/10 space-y-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-headline font-bold">About Section</h3>
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">About Title</label>
                     <Input value={data.about.title} onChange={e => updateAbout('title', e.target.value)} className="bg-white/5 border-white/10 h-12" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Since Year Title</label>
                        <Input value={data.about.experienceTitle} onChange={e => updateAbout('experienceTitle', e.target.value)} className="bg-white/5 border-white/10 h-12" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sub-text</label>
                        <Input value={data.about.experienceSub} onChange={e => updateAbout('experienceSub', e.target.value)} className="bg-white/5 border-white/10 h-12" />
                      </div>
                   </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Detailed Bio</label>
                  <Textarea value={data.about.bio} onChange={e => updateAbout('bio', e.target.value)} rows={6} className="bg-white/5 border-white/10" />
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-xl font-bold">Featured Ventures</h4>
                <div className="grid gap-4">
                  {data.about.ventures.map((v, i) => (
                    <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/10 grid md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-muted-foreground font-bold uppercase">Company Name</label>
                        <Input placeholder="Venture Title" value={v.title} onChange={e => updateVenture(i, 'title', e.target.value)} className="bg-black/20 border-white/10" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-muted-foreground font-bold uppercase">Your Role</label>
                        <Input placeholder="Role" value={v.role} onChange={e => updateVenture(i, 'role', e.target.value)} className="bg-black/20 border-white/10" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-muted-foreground font-bold uppercase">Summary</label>
                        <Input placeholder="Description" value={v.description} onChange={e => updateVenture(i, 'description', e.target.value)} className="bg-black/20 border-white/10" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <div className="glass rounded-[2.5rem] border-white/10 overflow-hidden">
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div>
                  <h3 className="text-2xl font-headline font-bold">Projects Library</h3>
                  <p className="text-sm text-muted-foreground">Showcase your best work.</p>
                </div>
                <Button onClick={() => { setEditingProjectId(null); setProjectForm({name:'', description:'', tech:'', image:'https://picsum.photos/seed/1/800/600', demo:'', github:'', drive:''}); setIsAddingProject(true); }} className="bg-primary hover:scale-105 transition-transform px-6">
                  <Plus size={18} className="mr-2"/> Add Project
                </Button>
              </div>
              <Table>
                <TableHeader className="bg-white/[0.01]">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="py-6 pl-8">Project Detail</TableHead>
                    <TableHead className="py-6">Technologies</TableHead>
                    <TableHead className="py-6 text-right pr-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.projects.map((p) => (
                    <TableRow key={p.id} className="border-white/5 group hover:bg-white/[0.02]">
                      <TableCell className="pl-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
                            <img src={p.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-base">{p.name}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{p.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {p.tech.split(',').slice(0, 3).map((t, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[10px] uppercase font-bold text-primary">{t.trim()}</span>
                          ))}
                          {p.tech.split(',').length > 3 && <span className="text-[10px] text-muted-foreground font-bold">+{p.tech.split(',').length - 3}</span>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <Button size="icon" variant="ghost" className="hover:bg-primary/20 hover:text-primary" onClick={() => { setEditingProjectId(p.id); setProjectForm({...p}); setIsAddingProject(true); }}>
                          <Edit size={16}/>
                        </Button>
                        <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => deleteProject(p.id)}>
                          <Trash2 size={16}/>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="tech">
            <div className="glass p-10 rounded-[2.5rem] border-white/10 space-y-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-white/5">
                <div className="space-y-2">
                  <h3 className="text-2xl font-headline font-bold flex items-center gap-2">
                    <Sparkles className="text-primary" size={24} />
                    Technical Arsenal
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Enter the tool name, and our system will automatically match it with a high-quality icon.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-stretch">
                  <div className="relative flex-grow min-w-[240px]">
                    <Input 
                      placeholder="Tool Name (e.g. Next.js, Flutter)" 
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      className="h-14 pl-14 bg-white/5 border-white/10 rounded-2xl focus-visible:ring-primary text-lg" 
                    />
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary transition-all scale-110">
                      {getTechIcon(techInput, 24)}
                    </div>
                  </div>
                  
                  <Select value={newTechCategory} onValueChange={(v) => setNewTechCategory(v as TechItem['category'])}>
                    <SelectTrigger className="w-full sm:w-[180px] h-14 bg-white/5 border-white/10 rounded-2xl text-base px-6">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/10 shadow-2xl rounded-2xl overflow-hidden p-1">
                      <SelectItem value="Web" className="rounded-xl py-3 px-4 focus:bg-primary focus:text-white">Web</SelectItem>
                      <SelectItem value="Mobile" className="rounded-xl py-3 px-4 focus:bg-primary focus:text-white">Mobile</SelectItem>
                      <SelectItem value="Backend" className="rounded-xl py-3 px-4 focus:bg-primary focus:text-white">Backend</SelectItem>
                      <SelectItem value="Cloud" className="rounded-xl py-3 px-4 focus:bg-primary focus:text-white">Cloud</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button onClick={addTech} className="h-14 px-10 rounded-2xl bg-primary text-white font-bold text-base shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                    Add Tool
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {data.techStack.map(t => (
                  <div key={t.id} className="group relative p-6 bg-white/[0.03] border border-white/5 rounded-[2rem] flex flex-col items-center gap-4 transition-all hover:bg-white/[0.06] hover:border-primary/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]">
                    <div className="p-4 bg-primary/10 text-primary rounded-2xl group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      {getTechIcon(t.name, 32)}
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-base leading-tight mb-1">{t.name}</p>
                      <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                        {t.category}
                      </span>
                    </div>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 h-8 w-8 text-destructive hover:bg-destructive/10 rounded-xl transition-all" 
                      onClick={() => removeTech(t.id)}
                    >
                      <Trash2 size={16}/>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <div className="glass p-10 rounded-[2.5rem] border-white/10 space-y-6">
              <h3 className="text-2xl font-headline font-bold">Contact & Socials</h3>
              <p className="text-sm text-muted-foreground mb-8">Update your contact points for potential clients.</p>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Business Email</label>
                  <Input value={data.contact.email} onChange={e => updateContact('email', e.target.value)} className="bg-white/5 border-white/10 h-14 rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">WhatsApp (e.g. +20...)</label>
                  <Input value={data.contact.whatsapp} onChange={e => updateContact('whatsapp', e.target.value)} className="bg-white/5 border-white/10 h-14 rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">LinkedIn URL</label>
                  <Input value={data.contact.linkedin} onChange={e => updateContact('linkedin', e.target.value)} className="bg-white/5 border-white/10 h-14 rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">GitHub Username</label>
                  <Input value={data.contact.github} onChange={e => updateContact('github', e.target.value)} className="bg-white/5 border-white/10 h-14 rounded-2xl" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {isAddingProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6">
             <div className="glass w-full max-w-2xl p-12 rounded-[3rem] border-white/10 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-headline font-bold text-gradient">{editingProjectId ? 'Edit Project' : 'New Project'}</h3>
                  <Button variant="ghost" size="icon" onClick={() => setIsAddingProject(false)} className="rounded-full">
                    <Plus size={24} className="rotate-45" />
                  </Button>
                </div>
                
                <div className="space-y-6 mb-10">
                   <div className="grid gap-4">
                     <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Project Name</label>
                     <Input placeholder="E.g. Royal Cut App" value={projectForm.name} onChange={e => setProjectForm({...projectForm, name: e.target.value})} className="bg-white/5 border-white/10 h-14 rounded-2xl text-lg" />
                   </div>

                   <div className="grid gap-4">
                     <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Description</label>
                     <Textarea placeholder="What problems did this project solve?" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} className="bg-white/5 border-white/10 rounded-2xl min-h-[120px]" />
                   </div>

                   <div className="grid md:grid-cols-2 gap-6">
                      <div className="grid gap-4">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Tech Stack (CSV)</label>
                        <Input placeholder="React, Flutter, Node..." value={projectForm.tech} onChange={e => setProjectForm({...projectForm, tech: e.target.value})} className="bg-white/5 border-white/10 h-14 rounded-2xl" />
                      </div>
                      <div className="grid gap-4">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Thumbnail URL</label>
                        <Input placeholder="https://..." value={projectForm.image} onChange={e => setProjectForm({...projectForm, image: e.target.value})} className="bg-white/5 border-white/10 h-14 rounded-2xl" />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="grid gap-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Live Demo</label>
                      <Input placeholder="Link" value={projectForm.demo} onChange={e => setProjectForm({...projectForm, demo: e.target.value})} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                    </div>
                    <div className="grid gap-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Repo URL</label>
                      <Input placeholder="Link" value={projectForm.github} onChange={e => setProjectForm({...projectForm, github: e.target.value})} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                    </div>
                    <div className="grid gap-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Drive Resources</label>
                      <Input placeholder="Link" value={projectForm.drive} onChange={e => setProjectForm({...projectForm, drive: e.target.value})} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 border-t border-white/5 pt-8">
                   <Button variant="ghost" onClick={() => setIsAddingProject(false)} className="h-14 px-8 rounded-2xl text-base">Cancel</Button>
                   <Button onClick={handleSaveProject} className="h-14 px-12 bg-primary text-white font-bold rounded-2xl text-base shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                     {editingProjectId ? 'Update Project' : 'Publish Project'}
                   </Button>
                </div>
             </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
