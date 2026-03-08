
"use client"

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';
import { Project, getProjects, addProject, deleteProject, updateProject } from '@/lib/project-store';
import { toast } from '@/hooks/use-toast';

export default function AdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    name: '',
    description: '',
    tech: '',
    image: 'https://picsum.photos/seed/1/800/600',
    demo: '',
    github: '',
    drive: ''
  });

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const refresh = () => setProjects(getProjects());

  const handleAdd = () => {
    addProject(formData);
    setFormData({ name: '', description: '', tech: '', image: 'https://picsum.photos/seed/1/800/600', demo: '', github: '', drive: '' });
    setIsAdding(false);
    refresh();
    toast({ title: "Project Added", description: "Successfully added to your portfolio." });
  };

  const handleDelete = (id: string) => {
    deleteProject(id);
    refresh();
    toast({ title: "Project Deleted", variant: "destructive" });
  };

  const startEditing = (p: Project) => {
    setEditingId(p.id);
    setFormData({ ...p });
  };

  const handleUpdate = () => {
    if (editingId) {
      updateProject({ ...formData, id: editingId });
      setEditingId(null);
      refresh();
      toast({ title: "Project Updated" });
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-24">
      <Navbar />
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-headline font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your portfolio projects and technical details.</p>
          </div>
          
          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-white gap-2 h-12 px-6 rounded-xl">
                <Plus size={20} /> Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="glass border-white/10 sm:max-w-xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-headline">New Project</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input placeholder="Project Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <Textarea placeholder="Short Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                <Input placeholder="Tech Stack (comma separated)" value={formData.tech} onChange={e => setFormData({...formData, tech: e.target.value})} />
                <Input placeholder="Image URL" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                <div className="grid grid-cols-3 gap-3">
                  <Input placeholder="Demo Link" value={formData.demo} onChange={e => setFormData({...formData, demo: e.target.value})} />
                  <Input placeholder="GitHub Link" value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} />
                  <Input placeholder="Drive Link" value={formData.drive} onChange={e => setFormData({...formData, drive: e.target.value})} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button onClick={handleAdd}>Save Project</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="glass rounded-3xl overflow-hidden border-white/5">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/5">
                <TableHead className="w-[200px] text-xs font-bold uppercase tracking-widest py-6">Project</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-widest py-6">Tech Stack</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-widest py-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((p) => (
                <TableRow key={p.id} className="border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="font-bold py-6">{p.name}</TableCell>
                  <TableCell className="py-6">
                    <div className="flex flex-wrap gap-2">
                      {p.tech.split(',').map(t => (
                        <span key={t} className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-[10px] font-bold">
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-6">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="hover:text-primary"
                        onClick={() => startEditing(p)}
                      >
                        <Edit size={18} />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="hover:text-destructive"
                        onClick={() => handleDelete(p.id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {projects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-20 text-muted-foreground">
                    No projects found. Add your first one above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Edit Modal Overlay */}
        {editingId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
             <div className="glass w-full max-w-xl p-10 rounded-[2.5rem] border-white/10">
                <h3 className="text-2xl font-headline font-bold mb-6">Edit Project</h3>
                <div className="space-y-4 mb-8">
                   <Input placeholder="Project Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                   <Textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                   <Input placeholder="Tech Stack" value={formData.tech} onChange={e => setFormData({...formData, tech: e.target.value})} />
                   <Input placeholder="Image URL" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                   <div className="grid grid-cols-3 gap-3">
                    <Input placeholder="Demo" value={formData.demo} onChange={e => setFormData({...formData, demo: e.target.value})} />
                    <Input placeholder="GitHub" value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} />
                    <Input placeholder="Drive" value={formData.drive} onChange={e => setFormData({...formData, drive: e.target.value})} />
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                   <Button variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                   <Button onClick={handleUpdate} className="bg-primary text-white">Save Changes</Button>
                </div>
             </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
