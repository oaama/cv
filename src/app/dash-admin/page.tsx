
"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore, useUser, useCollection } from '@/firebase';
import { collection, addDoc, deleteDoc, updateDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
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
import { Plus, Trash2, Edit, LogOut } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function DashAdminPage() {
  const { user, loading: authLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  
  const projectsQuery = query(collection(db!, 'projects'), orderBy('createdAt', 'desc'));
  const { data: projects, loading: projectsLoading } = useCollection(projectsQuery);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tech: '',
    image: 'https://picsum.photos/seed/1/800/600',
    demo: '',
    github: '',
    drive: ''
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleLogout = () => {
    auth?.signOut();
    router.push('/login');
  };

  const handleAdd = async () => {
    if (!db) return;
    try {
      await addDoc(collection(db, 'projects'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setFormData({ name: '', description: '', tech: '', image: 'https://picsum.photos/seed/1/800/600', demo: '', github: '', drive: '' });
      setIsAdding(false);
      toast({ title: "Project Added", description: "Live on the site now." });
    } catch (e: any) {
      const error = new FirestorePermissionError({ path: 'projects', operation: 'create', requestResourceData: formData });
      errorEmitter.emit('permission-error', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'projects', id));
      toast({ title: "Project Deleted", variant: "destructive" });
    } catch (e: any) {
      const error = new FirestorePermissionError({ path: `projects/${id}`, operation: 'delete' });
      errorEmitter.emit('permission-error', error);
    }
  };

  const startEditing = (p: any) => {
    setEditingId(p.id);
    setFormData({ ...p });
  };

  const handleUpdate = async () => {
    if (!db || !editingId) return;
    try {
      const { id, ...dataToUpdate } = formData as any;
      await updateDoc(doc(db, 'projects', editingId), dataToUpdate);
      setEditingId(null);
      toast({ title: "Project Updated" });
    } catch (e: any) {
      const error = new FirestorePermissionError({ path: `projects/${editingId}`, operation: 'update', requestResourceData: formData });
      errorEmitter.emit('permission-error', error);
    }
  };

  if (authLoading || !user) return <div className="min-h-screen flex items-center justify-center">Verifying session...</div>;

  return (
    <main className="min-h-screen pt-32 pb-24 bg-background">
      <Navbar />
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-headline font-bold mb-2">Portfolio Management</h1>
            <p className="text-muted-foreground">Add and manage your projects in real-time.</p>
          </div>
          
          <div className="flex gap-4">
            <Dialog open={isAdding} onOpenChange={setIsAdding}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-white gap-2 h-12 px-6 rounded-xl">
                  <Plus size={20} /> New Project
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
                  <Button onClick={handleAdd}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" className="text-muted-foreground hover:text-destructive" onClick={handleLogout}>
              <LogOut size={20} />
            </Button>
          </div>
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
              {projects?.map((p: any) => (
                <TableRow key={p.id} className="border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="font-bold py-6">{p.name}</TableCell>
                  <TableCell className="py-6">
                    <div className="flex flex-wrap gap-2">
                      {p.tech.split(',').map((t: string) => (
                        <span key={t} className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-[10px] font-bold">
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-6">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="ghost" className="hover:text-primary" onClick={() => startEditing(p)}>
                        <Edit size={18} />
                      </Button>
                      <Button size="icon" variant="ghost" className="hover:text-destructive" onClick={() => handleDelete(p.id)}>
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

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
