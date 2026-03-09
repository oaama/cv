
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
import { Plus, Trash2, Edit, LogOut, User, Briefcase, Cpu, Phone, Sparkles } from 'lucide-react';
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
    toast({ title: "Changes Saved", description: "Your portfolio is updated locally." });
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
    if (!techInput) return;
    const newItem = { id: Date.now().toString(), name: techInput, category: newTechCategory };
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
            <p className="text-muted-foreground">Manage every section of your portfolio from one place.</p>
          </div>
          <Button variant="ghost" className="text-muted-foreground hover:text-destructive" onClick={handleLogout}>
            <LogOut size={20} />
          </Button>
        </div>

        <Tabs defaultValue="hero" className="space-y-8">
          <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl w-full justify-start overflow-x-auto">
            <TabsTrigger value="hero" className="rounded-xl gap-2"><User size={16}/> Hero</TabsTrigger>
            <TabsTrigger value="about" className="rounded-xl gap-2"><Briefcase size={16}/> About</TabsTrigger>
            <TabsTrigger value="projects" className="rounded-xl gap-2"><Plus size={16}/> Projects</TabsTrigger>
            <TabsTrigger value="tech" className="rounded-xl gap-2"><Cpu size={16}/> Tech Stack</TabsTrigger>
            <TabsTrigger value="contact" className="rounded-xl gap-2"><Phone size={16}/> Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="hero">
            <div className="glass p-10 rounded-[2.5rem] border-white/10 space-y-6">
              <h3 className="text-2xl font-headline font-bold mb-4">Hero Section</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Name</label>
                  <Input value={data.hero.name} onChange={e => updateHero('name', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Specialty</label>
                  <Input value={data.hero.specialty} onChange={e => updateHero('specialty', e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Bio Description</label>
                <Textarea value={data.hero.bio} onChange={e => updateHero('bio', e.target.value)} rows={4} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="about">
            <div className="glass p-10 rounded-[2.5rem] border-white/10 space-y-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-headline font-bold">About Section</h3>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Main Title</label>
                  <Input value={data.about.title} onChange={e => updateAbout('title', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Bio Paragraph</label>
                  <Textarea value={data.about.bio} onChange={e => updateAbout('bio', e.target.value)} rows={6} />
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-xl font-bold">Ventures</h4>
                {data.about.ventures.map((v, i) => (
                  <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/10 grid md:grid-cols-3 gap-4">
                    <Input placeholder="Venture Title" value={v.title} onChange={e => updateVenture(i, 'title', e.target.value)} />
                    <Input placeholder="Role" value={v.role} onChange={e => updateVenture(i, 'role', e.target.value)} />
                    <Input placeholder="Description" value={v.description} onChange={e => updateVenture(i, 'description', e.target.value)} />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <div className="glass rounded-[2.5rem] border-white/10 overflow-hidden">
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-2xl font-headline font-bold">Project List</h3>
                <Button onClick={() => { setEditingProjectId(null); setProjectForm({name:'', description:'', tech:'', image:'', demo:'', github:'', drive:''}); setIsAddingProject(true); }} className="bg-primary">
                  <Plus size={18} className="mr-2"/> New Project
                </Button>
              </div>
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/5">
                    <TableHead className="py-6">Project</TableHead>
                    <TableHead className="py-6">Tech</TableHead>
                    <TableHead className="py-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.projects.map((p) => (
                    <TableRow key={p.id} className="border-white/5">
                      <TableCell className="font-bold">{p.name}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{p.tech}</TableCell>
                      <TableCell className="text-right">
                        <Button size="icon" variant="ghost" onClick={() => { setEditingProjectId(p.id); setProjectForm({...p}); setIsAddingProject(true); }}>
                          <Edit size={16}/>
                        </Button>
                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteProject(p.id)}>
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
            <div className="glass p-10 rounded-[2.5rem] border-white/10 space-y-8">
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-headline font-bold mb-2">Manage Tech Stack</h3>
                  <p className="text-sm text-muted-foreground mb-6">Type a tool name, and I'll automatically detect its icon.</p>
                </div>
                <div className="flex gap-4 items-center w-full md:w-auto">
                   <div className="relative flex-grow md:w-64">
                      <Input 
                        placeholder="Tool Name (e.g. Next.js)" 
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl" 
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                        {getTechIcon(techInput, 20)}
                      </div>
                   </div>
                   
                   <Select value={newTechCategory} onValueChange={(v) => setNewTechCategory(v as TechItem['category'])}>
                     <SelectTrigger className="w-[180px] h-12 bg-white/5 border-white/10 rounded-xl">
                       <SelectValue placeholder="Category" />
                     </SelectTrigger>
                     <SelectContent className="glass border-white/10">
                       <SelectItem value="Web">Web</SelectItem>
                       <SelectItem value="Mobile">Mobile</SelectItem>
                       <SelectItem value="Backend">Backend</SelectItem>
                       <SelectItem value="Cloud">Cloud</SelectItem>
                     </SelectContent>
                   </Select>

                   <Button onClick={addTech} className="h-12 px-8 rounded-xl bg-primary">Add Tool</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {data.techStack.map(t => (
                  <div key={t.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="text-primary">{getTechIcon(t.name, 18)}</div>
                      <div>
                        <p className="font-bold text-sm">{t.name}</p>
                        <p className="text-[10px] text-primary uppercase font-bold tracking-widest">{t.category}</p>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 h-8 w-8 text-destructive" onClick={() => removeTech(t.id)}>
                      <Trash2 size={14}/>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <div className="glass p-10 rounded-[2.5rem] border-white/10 space-y-6">
              <h3 className="text-2xl font-headline font-bold">Contact Details</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Public Email</label>
                  <Input value={data.contact.email} onChange={e => updateContact('email', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">WhatsApp Link/Number</label>
                  <Input value={data.contact.whatsapp} onChange={e => updateContact('whatsapp', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">LinkedIn Slug</label>
                  <Input value={data.contact.linkedin} onChange={e => updateContact('linkedin', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">GitHub Handle</label>
                  <Input value={data.contact.github} onChange={e => updateContact('github', e.target.value)} />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {isAddingProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
             <div className="glass w-full max-w-xl p-10 rounded-[2.5rem] border-white/10 max-h-[90vh] overflow-y-auto">
                <h3 className="text-2xl font-headline font-bold mb-6">{editingProjectId ? 'Edit Project' : 'New Project'}</h3>
                <div className="space-y-4 mb-8">
                   <Input placeholder="Project Name" value={projectForm.name} onChange={e => setProjectForm({...projectForm, name: e.target.value})} />
                   <Textarea placeholder="Description" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} />
                   <Input placeholder="Tech Stack (comma separated)" value={projectForm.tech} onChange={e => setProjectForm({...projectForm, tech: e.target.value})} />
                   <Input placeholder="Image URL" value={projectForm.image} onChange={e => setProjectForm({...projectForm, image: e.target.value})} />
                   <div className="grid grid-cols-3 gap-3">
                    <Input placeholder="Demo" value={projectForm.demo} onChange={e => setProjectForm({...projectForm, demo: e.target.value})} />
                    <Input placeholder="GitHub" value={projectForm.github} onChange={e => setProjectForm({...projectForm, github: e.target.value})} />
                    <Input placeholder="Drive" value={projectForm.drive} onChange={e => setProjectForm({...projectForm, drive: e.target.value})} />
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                   <Button variant="ghost" onClick={() => setIsAddingProject(false)}>Cancel</Button>
                   <Button onClick={handleSaveProject} className="bg-primary text-white">Save Project</Button>
                </div>
             </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
