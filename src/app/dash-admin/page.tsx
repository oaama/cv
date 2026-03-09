
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
import { Plus, Trash2, Edit, LogOut, User, Briefcase, Cpu, Phone, LayoutGrid, Upload, Loader2, Save } from 'lucide-react';
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
    name: '', description: '', tech: '', image: 'https://picsum.photos/seed/1/800/600', demo: '', github: ''
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
    toast({ title: "Changes Saved", description: "Updated locally in your browser." });
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

  const handleFileUpload = async (file: File, path: string, onComplete: (url: string) => void) => {
    setIsUploading(path);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onComplete(base64String);
        setIsUploading(null);
        toast({ title: "Success", description: "Image saved to LocalStorage." });
      };
      reader.onerror = () => {
        setIsUploading(null);
        toast({ title: "Error", description: "Failed to read file.", variant: "destructive" });
      };
      reader.readAsDataURL(file);
    } catch (error) {
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
    setProjectForm({ name: '', description: '', tech: '', image: 'https://picsum.photos/seed/1/800/600', demo: '', github: '' });
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
    <main className="min-h-screen pt-24 md:pt-32 pb-12 bg-background">
      <Navbar />
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-headline font-bold mb-1">Portfolio Manager</h1>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Client-Side Storage Only</p>
          </div>
          <Button variant="outline" className="border-white/10 text-muted-foreground hover:text-destructive gap-2 rounded-xl" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </Button>
        </div>

        <Tabs defaultValue="hero" className="space-y-6">
          <div className="overflow-x-auto no-scrollbar pb-2">
            <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl w-max flex">
              <TabsTrigger value="hero" className="rounded-xl gap-2 py-2 px-6 whitespace-nowrap"><User size={14}/> Hero</TabsTrigger>
              <TabsTrigger value="about" className="rounded-xl gap-2 py-2 px-6 whitespace-nowrap"><Briefcase size={14}/> About</TabsTrigger>
              <TabsTrigger value="projects" className="rounded-xl gap-2 py-2 px-6 whitespace-nowrap"><LayoutGrid size={14}/> Projects</TabsTrigger>
              <TabsTrigger value="tech" className="rounded-xl gap-2 py-2 px-6 whitespace-nowrap"><Cpu size={14}/> Tech</TabsTrigger>
              <TabsTrigger value="contact" className="rounded-xl gap-2 py-2 px-6 whitespace-nowrap"><Phone size={14}/> Contact</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="hero">
            <div className="glass p-6 md:p-10 rounded-[2.5rem] border-white/10 space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">Your Name</label>
                  <Input value={data.hero.name} onChange={e => updateHero('name', e.target.value)} className="bg-white/5 border-white/10 h-14 rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">Specialty / Title</label>
                  <Input value={data.hero.specialty} onChange={e => updateHero('specialty', e.target.value)} className="bg-white/5 border-white/10 h-14 rounded-2xl" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">Short Bio</label>
                <Textarea value={data.hero.bio} onChange={e => updateHero('bio', e.target.value)} rows={3} className="bg-white/5 border-white/10 rounded-2xl p-4" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="about">
            <div className="glass p-6 md:p-10 rounded-[2.5rem] border-white/10 space-y-10">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">About Title</label>
                  <Input value={data.about.title} onChange={e => updateAbout('title', e.target.value)} className="bg-white/5 border-white/10 h-14 rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">Profile Photo</label>
                  <div className="flex items-center gap-4">
                    <Input 
                      value={data.about.imageUrl || ''} 
                      onChange={e => updateAbout('imageUrl', e.target.value)} 
                      placeholder="Image URL" 
                      className="bg-white/5 border-white/10 h-14 rounded-2xl" 
                    />
                    <Button 
                      variant="secondary" 
                      className="rounded-2xl h-14 px-5 gap-2"
                      onClick={() => aboutFileRef.current?.click()}
                      disabled={!!isUploading}
                    >
                      {isUploading === 'about' ? <Loader2 className="animate-spin" size={16}/> : <Upload size={18}/>}
                    </Button>
                    <input type="file" ref={aboutFileRef} className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(file, 'about', (url) => updateAbout('imageUrl', url)); }} />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">Main Description</label>
                <Textarea value={data.about.bio} onChange={e => updateAbout('bio', e.target.value)} rows={4} className="bg-white/5 border-white/10 rounded-2xl p-4" />
              </div>

              <div className="pt-6 border-t border-white/5 space-y-6">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Featured Ventures</h4>
                <div className="grid gap-4">
                  {data.about.ventures.map((v, i) => (
                    <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5 grid md:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-muted-foreground ml-1">Title</label>
                        <Input placeholder="Venture Name" value={v.title} onChange={e => updateVenture(i, 'title', e.target.value)} className="bg-black/20 border-white/5 rounded-xl h-12" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-muted-foreground ml-1">Role</label>
                        <Input placeholder="Your Role" value={v.role} onChange={e => updateVenture(i, 'role', e.target.value)} className="bg-black/20 border-white/5 rounded-xl h-12" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-muted-foreground ml-1">Summary</label>
                        <Input placeholder="Short Summary" value={v.description} onChange={e => updateVenture(i, 'description', e.target.value)} className="bg-black/20 border-white/5 rounded-xl h-12" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <div className="glass rounded-[2.5rem] border-white/10 overflow-hidden">
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <h3 className="font-headline font-bold text-xl">Projects</h3>
                <Button size="sm" onClick={() => { setEditingProjectId(null); setProjectForm({name:'', description:'', tech:'', image:'https://picsum.photos/seed/1/800/600', demo:'', github:''}); setIsAddingProject(true); }} className="bg-primary rounded-2xl px-6 h-12">
                  <Plus size={18} className="mr-2"/> New Project
                </Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="py-6 px-8">Project Name</TableHead>
                      <TableHead className="py-6">Stack</TableHead>
                      <TableHead className="py-6 text-right px-8">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.projects.map((p) => (
                      <TableRow key={p.id} className="border-white/5 hover:bg-white/[0.01]">
                        <TableCell className="font-bold px-8 py-5">{p.name}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{p.tech}</TableCell>
                        <TableCell className="text-right space-x-2 px-8 py-5">
                          <Button size="icon" variant="ghost" className="h-10 w-10 hover:bg-primary/10 rounded-xl" onClick={() => { setEditingProjectId(p.id); setProjectForm({...p}); setIsAddingProject(true); }}>
                            <Edit size={16}/>
                          </Button>
                          <Button size="icon" variant="ghost" className="h-10 w-10 text-muted-foreground hover:text-destructive rounded-xl" onClick={() => deleteProject(p.id)}>
                            <Trash2 size={16}/>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tech">
            <div className="glass p-6 md:p-10 rounded-[2.5rem] border-white/10 space-y-10">
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2 w-full">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">Tool Name</label>
                  <Input 
                    placeholder="e.g. Next.js" 
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    className="bg-white/5 border-white/10 rounded-2xl h-14" 
                  />
                </div>
                <div className="space-y-2 w-full sm:w-[200px]">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">Category</label>
                  <Select value={newTechCategory} onValueChange={(v) => setNewTechCategory(v as TechItem['category'])}>
                    <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-14">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/10 rounded-2xl">
                      <SelectItem value="Web">Web</SelectItem>
                      <SelectItem value="Mobile">Mobile</SelectItem>
                      <SelectItem value="Backend">Backend</SelectItem>
                      <SelectItem value="Cloud">Cloud</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addTech} className="bg-primary h-14 rounded-2xl px-10">Add Tool</Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                {data.techStack.map(t => (
                  <div key={t.id} className="group relative p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] flex flex-col items-center gap-3 hover:border-primary/30 transition-all text-center">
                    <div className="text-primary">{getTechIcon(t.name, 28)}</div>
                    <p className="font-bold text-sm">{t.name}</p>
                    <Button 
                      size="icon" 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" 
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
            <div className="glass p-6 md:p-10 rounded-[2.5rem] border-white/10">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">Public Email</label>
                  <Input value={data.contact.email} onChange={e => updateContact('email', e.target.value)} className="bg-white/5 border-white/10 h-14 rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">WhatsApp Number</label>
                  <Input value={data.contact.whatsapp} onChange={e => updateContact('whatsapp', e.target.value)} className="bg-white/5 border-white/10 h-14 rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">LinkedIn Link</label>
                  <Input value={data.contact.linkedin} onChange={e => updateContact('linkedin', e.target.value)} className="bg-white/5 border-white/10 h-14 rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">GitHub Username</label>
                  <Input value={data.contact.github} onChange={e => updateContact('github', e.target.value)} className="bg-white/5 border-white/10 h-14 rounded-2xl" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {isAddingProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
             <div className="glass w-full max-w-2xl p-8 md:p-10 rounded-[3rem] border-white/10 my-10 relative">
                <h3 className="text-2xl font-headline font-bold mb-8">{editingProjectId ? 'Update Project' : 'New Creation'}</h3>
                <div className="space-y-6">
                   <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-primary ml-1">Name</label>
                      <Input placeholder="Project Name" value={projectForm.name} onChange={e => setProjectForm({...projectForm, name: e.target.value})} className="bg-white/5 border-white/10 h-14 rounded-2xl" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-primary ml-1">Description</label>
                      <Textarea placeholder="What did you build?" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} className="bg-white/5 border-white/10 rounded-2xl p-4 h-32" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-primary ml-1">Stack (Separated by commas)</label>
                      <Input placeholder="e.g. Flutter, Firebase, Dart" value={projectForm.tech} onChange={e => setProjectForm({...projectForm, tech: e.target.value})} className="bg-white/5 border-white/10 h-14 rounded-2xl" />
                   </div>
                   
                   <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-primary ml-1">Cover Image</label>
                      <div className="flex items-center gap-4">
                        <Input placeholder="Image URL or Base64" value={projectForm.image} onChange={e => setProjectForm({...projectForm, image: e.target.value})} className="bg-white/5 border-white/10 h-14 rounded-2xl" />
                        <Button variant="secondary" className="h-14 rounded-2xl px-5" onClick={() => projectFileRef.current?.click()}>
                          {isUploading === 'project' ? <Loader2 className="animate-spin" size={16}/> : <Upload size={18}/>}
                        </Button>
                        <input type="file" ref={projectFileRef} className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(file, 'project', (url) => setProjectForm({...projectForm, image: url})); }} />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-primary ml-1">Live Demo</label>
                      <Input placeholder="URL" value={projectForm.demo} onChange={e => setProjectForm({...projectForm, demo: e.target.value})} className="bg-white/5 border-white/10 h-14 rounded-2xl" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-primary ml-1">Source Code</label>
                      <Input placeholder="GitHub URL" value={projectForm.github} onChange={e => setProjectForm({...projectForm, github: e.target.value})} className="bg-white/5 border-white/10 h-14 rounded-2xl" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-10">
                   <Button variant="ghost" onClick={() => setIsAddingProject(false)} className="rounded-2xl h-14 px-8">Cancel</Button>
                   <Button onClick={handleSaveProject} className="bg-primary px-12 rounded-2xl h-14 font-bold shadow-xl shadow-primary/20">Save Project</Button>
                </div>
             </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
