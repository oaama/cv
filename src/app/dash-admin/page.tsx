
"use client"

import { useState, useEffect, useRef } from 'react';
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
import { Plus, Trash2, Edit, LogOut, User, Briefcase, Cpu, Phone, LayoutGrid, Sparkles, Image as ImageIcon, Upload, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getPortfolioData, savePortfolioData, PortfolioData, TechItem, Venture, Project } from '@/lib/portfolio-store';
import { getTechIcon } from '@/lib/icons';

export default function DashAdminPage() {
  const router = useRouter();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [newTechCategory, setNewTechCategory] = useState<TechItem['category']>('Web');
  const [techInput, setTechInput] = useState('');
  const [isUploading, setIsUploading] = useState<string | null>(null);
  
  const heroFileRef = useRef<HTMLInputElement>(null);
  const aboutFileRef = useRef<HTMLInputElement>(null);
  const projectFileRef = useRef<HTMLInputElement>(null);

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

  // Local File Handler using FileReader (Base64)
  const handleFileUpload = async (file: File, path: string, onComplete: (url: string) => void) => {
    setIsUploading(path);
    
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onComplete(base64String);
        setIsUploading(null);
        toast({ title: "Success", description: "Image processed locally." });
      };
      reader.onerror = () => {
        setIsUploading(null);
        toast({ title: "Error", description: "Failed to read file.", variant: "destructive" });
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      console.error(error);
      setIsUploading(null);
      toast({ title: "Failed", description: "Could not process image.", variant: "destructive" });
    }
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
    <main className="min-h-screen pt-24 md:pt-32 pb-12 md:pb-24 bg-background">
      <Navbar />
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-headline font-bold mb-2">Portfolio Management</h1>
            <p className="text-sm text-muted-foreground">Control your personal brand and projects in one place.</p>
          </div>
          <Button variant="ghost" className="text-muted-foreground hover:text-destructive self-end md:self-auto" onClick={handleLogout}>
            <LogOut size={20} className="mr-2" /> Logout
          </Button>
        </div>

        <Tabs defaultValue="hero" className="space-y-8">
          <div className="overflow-x-auto no-scrollbar pb-2">
            <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl w-max min-w-full justify-start overflow-visible h-auto flex-nowrap flex">
              <TabsTrigger value="hero" className="rounded-xl gap-2 py-3 px-4 md:px-6 whitespace-nowrap"><User size={16}/> Hero</TabsTrigger>
              <TabsTrigger value="about" className="rounded-xl gap-2 py-3 px-4 md:px-6 whitespace-nowrap"><Briefcase size={16}/> About</TabsTrigger>
              <TabsTrigger value="projects" className="rounded-xl gap-2 py-3 px-4 md:px-6 whitespace-nowrap"><LayoutGrid size={16}/> Projects</TabsTrigger>
              <TabsTrigger value="tech" className="rounded-xl gap-2 py-3 px-4 md:px-6 whitespace-nowrap"><Cpu size={16}/> Tech Stack</TabsTrigger>
              <TabsTrigger value="contact" className="rounded-xl gap-2 py-3 px-4 md:px-6 whitespace-nowrap"><Phone size={16}/> Contact</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="hero">
            <div className="glass p-5 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border-white/10 space-y-6">
              <h3 className="text-xl md:text-2xl font-headline font-bold mb-4">Hero Section</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Full Name</label>
                  <Input value={data.hero.name} onChange={e => updateHero('name', e.target.value)} className="bg-white/5 border-white/10 h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Specialty / Title</label>
                  <Input value={data.hero.specialty} onChange={e => updateHero('specialty', e.target.value)} className="bg-white/5 border-white/10 h-12" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Hero Image</label>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex-grow w-full space-y-2">
                    <Input 
                      value={data.hero.imageUrl || ''} 
                      onChange={e => updateHero('imageUrl', e.target.value)} 
                      placeholder="Image URL or upload a file" 
                      className="bg-white/5 border-white/10 h-12" 
                    />
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="rounded-xl h-10 px-4 gap-2"
                        onClick={() => heroFileRef.current?.click()}
                        disabled={!!isUploading}
                      >
                        {isUploading === 'hero' ? <Loader2 className="animate-spin" size={16}/> : <Upload size={16}/>}
                        {isUploading === 'hero' ? 'Processing...' : 'Upload Image'}
                      </Button>
                      <input 
                        type="file" 
                        ref={heroFileRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'hero', (url) => updateHero('imageUrl', url));
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {data.hero.imageUrl ? <img src={data.hero.imageUrl} className="w-full h-full object-cover" /> : <ImageIcon size={32} className="text-muted-foreground" />}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Hero Bio</label>
                <Textarea value={data.hero.bio} onChange={e => updateHero('bio', e.target.value)} rows={4} className="bg-white/5 border-white/10" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="about">
            <div className="glass p-5 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border-white/10 space-y-8">
              <div className="space-y-6">
                <h3 className="text-xl md:text-2xl font-headline font-bold">About Section</h3>
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">About Title</label>
                     <Input value={data.about.title} onChange={e => updateAbout('title', e.target.value)} className="bg-white/5 border-white/10 h-12" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Secondary Image (Above Driven)</label>
                     <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <div className="flex-grow w-full space-y-2">
                          <Input 
                            value={data.about.imageUrl || ''} 
                            onChange={e => updateAbout('imageUrl', e.target.value)} 
                            className="bg-white/5 border-white/10 h-12" 
                            placeholder="Image URL or upload a file" 
                          />
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className="rounded-xl h-10 px-4 gap-2"
                              onClick={() => aboutFileRef.current?.click()}
                              disabled={!!isUploading}
                            >
                              {isUploading === 'about' ? <Loader2 className="animate-spin" size={16}/> : <Upload size={16}/>}
                              {isUploading === 'about' ? 'Processing...' : 'Upload Image'}
                            </Button>
                            <input 
                              type="file" 
                              ref={aboutFileRef} 
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(file, 'about', (url) => updateAbout('imageUrl', url));
                              }}
                            />
                          </div>
                        </div>
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {data.about.imageUrl ? <img src={data.about.imageUrl} className="w-full h-full object-cover" /> : <ImageIcon size={24} className="text-muted-foreground" />}
                        </div>
                     </div>
                   </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Detailed Bio</label>
                  <Textarea value={data.about.bio} onChange={e => updateAbout('bio', e.target.value)} rows={6} className="bg-white/5 border-white/10" />
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-lg font-bold">Featured Ventures</h4>
                <div className="grid gap-4">
                  {data.about.ventures.map((v, i) => (
                    <div key={i} className="p-4 md:p-6 bg-white/5 rounded-2xl border border-white/10 grid md:grid-cols-3 gap-4">
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
            <div className="glass rounded-[1.5rem] md:rounded-[2.5rem] border-white/10 overflow-hidden">
              <div className="p-6 md:p-8 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between bg-white/[0.02] gap-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-headline font-bold">Projects Library</h3>
                  <p className="text-xs text-muted-foreground">Showcase your best work.</p>
                </div>
                <Button onClick={() => { setEditingProjectId(null); setProjectForm({name:'', description:'', tech:'', image:'https://picsum.photos/seed/1/800/600', demo:'', github:'', drive:''}); setIsAddingProject(true); }} className="bg-primary hover:scale-105 transition-transform px-6">
                  <Plus size={18} className="mr-2"/> Add Project
                </Button>
              </div>
              <div className="overflow-x-auto no-scrollbar">
                <Table className="min-w-[600px] md:min-w-full">
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
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                              <img src={p.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-bold text-sm md:text-base">{p.name}</p>
                              <p className="text-[10px] md:text-xs text-muted-foreground truncate max-w-[120px] md:max-w-[200px]">{p.description}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {p.tech.split(',').slice(0, 2).map((t, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[9px] uppercase font-bold text-primary">{t.trim()}</span>
                            ))}
                            {p.tech.split(',').length > 2 && <span className="text-[9px] text-muted-foreground font-bold">+{p.tech.split(',').length - 2}</span>}
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <div className="flex justify-end gap-1">
                            <Button size="icon" variant="ghost" className="hover:bg-primary/20 hover:text-primary h-8 w-8" onClick={() => { setEditingProjectId(p.id); setProjectForm({...p}); setIsAddingProject(true); }}>
                              <Edit size={14}/>
                            </Button>
                            <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8" onClick={() => deleteProject(p.id)}>
                              <Trash2 size={14}/>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tech">
            <div className="glass p-5 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border-white/10 space-y-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-white/5">
                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-headline font-bold flex items-center gap-2">
                    <Sparkles className="text-primary" size={24} />
                    Technical Arsenal
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground max-w-sm">
                    Enter the tool name, and our system will match it with an icon.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-stretch">
                  <div className="relative flex-grow sm:min-w-[200px]">
                    <Input 
                      placeholder="Tool Name" 
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl" 
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                      {getTechIcon(techInput, 20)}
                    </div>
                  </div>
                  
                  <Select value={newTechCategory} onValueChange={(v) => setNewTechCategory(v as TechItem['category'])}>
                    <SelectTrigger className="w-full sm:w-[140px] h-12 bg-white/5 border-white/10 rounded-xl">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/10 shadow-2xl rounded-2xl overflow-hidden p-1">
                      <SelectItem value="Web" className="rounded-xl">Web</SelectItem>
                      <SelectItem value="Mobile" className="rounded-xl">Mobile</SelectItem>
                      <SelectItem value="Backend" className="rounded-xl">Backend</SelectItem>
                      <SelectItem value="Cloud" className="rounded-xl">Cloud</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button onClick={addTech} className="h-12 px-6 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20">
                    Add
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                {data.techStack.map(t => (
                  <div key={t.id} className="group relative p-4 md:p-6 bg-white/[0.03] border border-white/5 rounded-[1.5rem] md:rounded-[2rem] flex flex-col items-center gap-3 md:gap-4 transition-all hover:bg-white/[0.06] hover:border-primary/30">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition-all duration-300">
                      {getTechIcon(t.name, 24)}
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-sm md:text-base leading-tight mb-1">{t.name}</p>
                      <span className="text-[8px] text-muted-foreground uppercase font-black tracking-widest bg-white/5 px-2 py-0.5 rounded-full">
                        {t.category}
                      </span>
                    </div>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 h-7 w-7 text-destructive hover:bg-destructive/10 rounded-lg transition-all" 
                      onClick={() => removeTech(t.id)}
                    >
                      <Trash2 size={12}/>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <div className="glass p-5 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border-white/10 space-y-6">
              <h3 className="text-xl md:text-2xl font-headline font-bold">Contact & Socials</h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-8">Update your contact points for potential clients.</p>
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Business Email</label>
                  <Input value={data.contact.email} onChange={e => updateContact('email', e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">WhatsApp</label>
                  <Input value={data.contact.whatsapp} onChange={e => updateContact('whatsapp', e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">LinkedIn URL</label>
                  <Input value={data.contact.linkedin} onChange={e => updateContact('linkedin', e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">GitHub Username</label>
                  <Input value={data.contact.github} onChange={e => updateContact('github', e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {isAddingProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 overflow-y-auto">
             <div className="glass w-full max-w-2xl p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border-white/10 my-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl md:text-3xl font-headline font-bold text-gradient">{editingProjectId ? 'Edit Project' : 'New Project'}</h3>
                  <Button variant="ghost" size="icon" onClick={() => setIsAddingProject(false)} className="rounded-full">
                    <Plus size={24} className="rotate-45" />
                  </Button>
                </div>
                
                <div className="space-y-4 md:space-y-6 mb-8">
                   <div className="grid gap-2">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Project Name</label>
                     <Input placeholder="E.g. Royal Cut App" value={projectForm.name} onChange={e => setProjectForm({...projectForm, name: e.target.value})} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                   </div>

                   <div className="grid gap-2">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Description</label>
                     <Input placeholder="Short summary" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                   </div>

                   <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                      <div className="grid gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Tech Stack (CSV)</label>
                        <Input placeholder="React, Flutter..." value={projectForm.tech} onChange={e => setProjectForm({...projectForm, tech: e.target.value})} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Thumbnail</label>
                        <div className="space-y-2">
                          <Input placeholder="https://..." value={projectForm.image} onChange={e => setProjectForm({...projectForm, image: e.target.value})} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className="rounded-xl h-9 px-4 gap-2"
                              onClick={() => projectFileRef.current?.click()}
                              disabled={!!isUploading}
                            >
                              {isUploading === 'project' ? <Loader2 className="animate-spin" size={14}/> : <Upload size={14}/>}
                              {isUploading === 'project' ? 'Processing...' : 'Upload Image'}
                            </Button>
                            <input 
                              type="file" 
                              ref={projectFileRef} 
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(file, 'project', (url) => setProjectForm({...projectForm, image: url}));
                              }}
                            />
                          </div>
                        </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="grid gap-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Live Demo</label>
                      <Input placeholder="Link" value={projectForm.demo} onChange={e => setProjectForm({...projectForm, demo: e.target.value})} className="bg-white/5 border-white/10 h-10 rounded-lg" />
                    </div>
                    <div className="grid gap-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Repo URL</label>
                      <Input placeholder="Link" value={projectForm.github} onChange={e => setProjectForm({...projectForm, github: e.target.value})} className="bg-white/5 border-white/10 h-10 rounded-lg" />
                    </div>
                    <div className="grid gap-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Drive</label>
                      <Input placeholder="Link" value={projectForm.drive} onChange={e => setProjectForm({...projectForm, drive: e.target.value})} className="bg-white/5 border-white/10 h-10 rounded-lg" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 border-t border-white/5 pt-8">
                   <Button variant="ghost" onClick={() => setIsAddingProject(false)} className="h-12 px-8 rounded-xl order-2 sm:order-1">Cancel</Button>
                   <Button onClick={handleSaveProject} className="h-12 px-10 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all order-1 sm:order-2">
                     {editingProjectId ? 'Update' : 'Publish'}
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
