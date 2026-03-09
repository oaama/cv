
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
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Plus, Trash2, Edit, LogOut, Save, User, Briefcase, Cpu, Phone } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getPortfolioData, savePortfolioData, PortfolioData, Project, TechItem, Venture } from '@/lib/portfolio-store';

export default function DashAdminPage() {
  const router = useRouter();
  const [data, setData] = useState<PortfolioData | null>(null);
  
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

  // Generic Update Handlers
  const updateHero = (field: keyof PortfolioData['hero'], value: string) => {
    persistData({ ...data, hero: { ...data.hero, [field]: value } });
  };

  const updateContact = (field: keyof PortfolioData['contact'], value: string) => {
    persistData({ ...data, contact: { ...data.contact, [field]: value } });
  };

  const updateAbout = (field: keyof Omit<PortfolioData['about'], 'ventures'>, value: string) => {
    persistData({ ...data, about: { ...data.about, [field]: value } });
  };

  // Venture Handlers
  const updateVenture = (index: number, field: keyof Venture, value: string) => {
    const newVentures = [...data.about.ventures];
    newVentures[index] = { ...newVentures[index], [field]: value };
    persistData({ ...data, about: { ...data.about, ventures: newVentures } });
  };

  // Project Handlers
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

  // Tech Stack Handlers
  const addTech = (name: string, category: TechItem['category']) => {
    if (!name) return;
    const newItem = { id: Date.now().toString(), name, category };
    persistData({ ...data, techStack: [...data.techStack, newItem] });
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

          {/* Hero Section Tab */}
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

          {/* About Section Tab */}
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
                <h4 className="text-xl font-bold">Ventures (Zone A, Sidra, etc.)</h4>
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

          {/* Projects Tab */}
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

          {/* Tech Stack Tab */}
          <TabsContent value="tech">
            <div className="glass p-10 rounded-[2.5rem] border-white/10 space-y-8">
              <h3 className="text-2xl font-headline font-bold">Manage Tech Stack</h3>
              <div className="flex gap-4">
                <Input id="tech-name" placeholder="Tool Name (e.g. Next.js)" className="max-w-xs" />
                <select id="tech-cat" className="bg-white/5 border border-white/10 rounded-xl px-4 text-sm">
                  <option value="Web">Web</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Backend">Backend</option>
                  <option value="Cloud">Cloud</option>
                </select>
                <Button onClick={() => {
                  const n = (document.getElementById('tech-name') as HTMLInputElement).value;
                  const c = (document.getElementById('tech-cat') as HTMLSelectElement).value as any;
                  addTech(n, c);
                  (document.getElementById('tech-name') as HTMLInputElement).value = '';
                }}>Add</Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {data.techStack.map(t => (
                  <div key={t.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group">
                    <div>
                      <p className="font-bold text-sm">{t.name}</p>
                      <p className="text-[10px] text-primary uppercase font-bold tracking-widest">{t.category}</p>
                    </div>
                    <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 h-8 w-8 text-destructive" onClick={() => removeTech(t.id)}>
                      <Trash2 size={14}/>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Contact Tab */}
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

        {/* Project Modal */}
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
