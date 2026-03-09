
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
import { Plus, Trash2, Edit, LogOut, User, Briefcase, Cpu, Phone, LayoutGrid, Image as ImageIcon, Upload, Loader2, Save } from 'lucide-react';
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
            <h1 className="text-2xl md:text-4xl font-headline font-bold mb-1">Portfolio Editor</h1>
            <p className="text-xs text-muted-foreground">Manage your content and visual presence.</p>
          </div>
          <Button variant="outline" className="border-white/10 text-muted-foreground hover:text-destructive gap-2 rounded-xl" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </Button>
        </div>

        <Tabs defaultValue="hero" className="space-y-6">
          <div className="overflow-x-auto no-scrollbar">
            <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl w-max flex">
              <TabsTrigger value="hero" className="rounded-xl gap-2 py-2 px-4 whitespace-nowrap"><User size={14}/> Hero</TabsTrigger>
              <TabsTrigger value="about" className="rounded-xl gap-2 py-2 px-4 whitespace-nowrap"><Briefcase size={14}/> About</TabsTrigger>
              <TabsTrigger value="projects" className="rounded-xl gap-2 py-2 px-4 whitespace-nowrap"><LayoutGrid size={14}/> Projects</TabsTrigger>
              <TabsTrigger value="tech" className="rounded-xl gap-2 py-2 px-4 whitespace-nowrap"><Cpu size={14}/> Tech</TabsTrigger>
              <TabsTrigger value="contact" className="rounded-xl gap-2 py-2 px-4 whitespace-nowrap"><Phone size={14}/> Contact</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="hero">
            <div className="glass p-6 md:p-8 rounded-[2rem] border-white/10 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Name</label>
                  <Input value={data.hero.name} onChange={e => updateHero('name', e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Title</label>
                  <Input value={data.hero.specialty} onChange={e => updateHero('specialty', e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Hero Image</label>
                <div className="flex items-center gap-4">
                  <Input 
                    value={data.hero.imageUrl || ''} 
                    onChange={e => updateHero('imageUrl', e.target.value)} 
                    placeholder="URL or Upload" 
                    className="bg-white/5 border-white/10 h-12 rounded-xl" 
                  />
                  <Button 
                    variant="secondary" 
                    className="rounded-xl h-12 px-4 gap-2"
                    onClick={() => heroFileRef.current?.click()}
                    disabled={!!isUploading}
                  >
                    {isUploading === 'hero' ? <Loader2 className="animate-spin" size={16}/> : <Upload size={16}/>}
                  </Button>
                  <input type="file" ref={heroFileRef} className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(file, 'hero', (url) => updateHero('imageUrl', url)); }} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Bio</label>
                <Textarea value={data.hero.bio} onChange={e => updateHero('bio', e.target.value)} rows={3} className="bg-white/5 border-white/10 rounded-xl" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="about">
            <div className="glass p-6 md:p-8 rounded-[2rem] border-white/10 space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Section Title</label>
                  <Input value={data.about.title} onChange={e => updateAbout('title', e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Profile Image (Above Title)</label>
                  <div className="flex items-center gap-4">
                    <Input 
                      value={data.about.imageUrl || ''} 
                      onChange={e => updateAbout('imageUrl', e.target.value)} 
                      placeholder="URL or Upload" 
                      className="bg-white/5 border-white/10 h-12 rounded-xl" 
                    />
                    <Button 
                      variant="secondary" 
                      className="rounded-xl h-12 px-4 gap-2"
                      onClick={() => aboutFileRef.current?.click()}
                      disabled={!!isUploading}
                    >
                      {isUploading === 'about' ? <Loader2 className="animate-spin" size={16}/> : <Upload size={16}/>}
                    </Button>
                    <input type="file" ref={aboutFileRef} className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(file, 'about', (url) => updateAbout('imageUrl', url)); }} />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Description</label>
                <Textarea value={data.about.bio} onChange={e => updateAbout('bio', e.target.value)} rows={4} className="bg-white/5 border-white/10 rounded-xl" />
              </div>

              <div className="pt-4 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Featured Ventures</h4>
                <div className="grid gap-4">
                  {data.about.ventures.map((v, i) => (
                    <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 grid md:grid-cols-3 gap-4">
                      <Input placeholder="Venture" value={v.title} onChange={e => updateVenture(i, 'title', e.target.value)} className="bg-black/20 border-white/5 rounded-lg" />
                      <Input placeholder="Role" value={v.role} onChange={e => updateVenture(i, 'role', e.target.value)} className="bg-black/20 border-white/5 rounded-lg" />
                      <Input placeholder="Summary" value={v.description} onChange={e => updateVenture(i, 'description', e.target.value)} className="bg-black/20 border-white/5 rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <div className="glass rounded-[2rem] border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <h3 className="font-headline font-bold">Projects</h3>
                <Button size="sm" onClick={() => { setEditingProjectId(null); setProjectForm({name:'', description:'', tech:'', image:'https://picsum.photos/seed/1/800/600', demo:'', github:''}); setIsAddingProject(true); }} className="bg-primary rounded-xl px-4">
                  <Plus size={16} className="mr-1"/> Add
                </Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5">
                      <TableHead className="py-4">Project</TableHead>
                      <TableHead className="py-4">Tech</TableHead>
                      <TableHead className="py-4 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.projects.map((p) => (
                      <TableRow key={p.id} className="border-white/5 hover:bg-white/[0.01]">
                        <TableCell className="font-bold">{p.name}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{p.tech}</TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-primary/10" onClick={() => { setEditingProjectId(p.id); setProjectForm({...p}); setIsAddingProject(true); }}>
                            <Edit size={14}/>
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteProject(p.id)}>
                            <Trash2 size={14}/>
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
            <div className="glass p-6 md:p-8 rounded-[2rem] border-white/10 space-y-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input 
                  placeholder="Tool Name" 
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  className="bg-white/5 border-white/10 rounded-xl h-12" 
                />
                <Select value={newTechCategory} onValueChange={(v) => setNewTechCategory(v as TechItem['category'])}>
                  <SelectTrigger className="w-full sm:w-[150px] bg-white/5 border-white/10 rounded-xl h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass border-white/10 rounded-xl">
                    <SelectItem value="Web">Web</SelectItem>
                    <SelectItem value="Mobile">Mobile</SelectItem>
                    <SelectItem value="Backend">Backend</SelectItem>
                    <SelectItem value="Cloud">Cloud</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={addTech} className="bg-primary h-12 rounded-xl px-8">Add Tool</Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {data.techStack.map(t => (
                  <div key={t.id} className="group relative p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col items-center gap-2 hover:border-primary/20 transition-all">
                    <div className="text-primary">{getTechIcon(t.name, 20)}</div>
                    <p className="font-bold text-xs">{t.name}</p>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="absolute -top-2 -right-2 h-6 w-6 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" 
                      onClick={() => removeTech(t.id)}
                    >
                      <Trash2 size={10}/>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <div className="glass p-6 md:p-8 rounded-[2rem] border-white/10">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email</label>
                  <Input value={data.contact.email} onChange={e => updateContact('email', e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">WhatsApp</label>
                  <Input value={data.contact.whatsapp} onChange={e => updateContact('whatsapp', e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">LinkedIn</label>
                  <Input value={data.contact.linkedin} onChange={e => updateContact('linkedin', e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">GitHub</label>
                  <Input value={data.contact.github} onChange={e => updateContact('github', e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {isAddingProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto">
             <div className="glass w-full max-w-xl p-8 rounded-[2rem] border-white/10 my-8">
                <h3 className="text-xl font-headline font-bold mb-6">{editingProjectId ? 'Edit Project' : 'New Project'}</h3>
                <div className="space-y-4">
                   <Input placeholder="Project Name" value={projectForm.name} onChange={e => setProjectForm({...projectForm, name: e.target.value})} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                   <Textarea placeholder="Description" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} className="bg-white/5 border-white/10 rounded-xl" />
                   <Input placeholder="Tech Stack (e.g. React, Node)" value={projectForm.tech} onChange={e => setProjectForm({...projectForm, tech: e.target.value})} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                   
                   <div className="flex items-center gap-4">
                      <Input placeholder="Image URL or Upload" value={projectForm.image} onChange={e => setProjectForm({...projectForm, image: e.target.value})} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                      <Button variant="secondary" className="h-12 rounded-xl" onClick={() => projectFileRef.current?.click()}>
                        {isUploading === 'project' ? <Loader2 className="animate-spin" size={16}/> : <Upload size={16}/>}
                      </Button>
                      <input type="file" ref={projectFileRef} className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(file, 'project', (url) => setProjectForm({...projectForm, image: url})); }} />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Demo Link" value={projectForm.demo} onChange={e => setProjectForm({...projectForm, demo: e.target.value})} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                    <Input placeholder="GitHub Link" value={projectForm.github} onChange={e => setProjectForm({...projectForm, github: e.target.value})} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-8">
                   <Button variant="ghost" onClick={() => setIsAddingProject(false)}>Cancel</Button>
                   <Button onClick={handleSaveProject} className="bg-primary px-8 rounded-xl">Save</Button>
                </div>
             </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
