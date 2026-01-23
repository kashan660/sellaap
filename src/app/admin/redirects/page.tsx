'use client';

import { useState, useEffect } from 'react';
import { getRedirects, createRedirect, deleteRedirect } from '@/lib/actions/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Trash2, Plus, ArrowRight, Save, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface Redirect {
  id: number;
  source: string;
  destination: string;
  permanent: boolean;
  createdAt: string;
}

export default function AdminRedirectsPage() {
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    permanent: true
  });

  useEffect(() => {
    loadRedirects();
  }, []);

  const loadRedirects = async () => {
    try {
      const data = await getRedirects();
      setRedirects(data as any);
    } catch (error) {
      console.error('Error loading redirects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createRedirect(formData);
      if (result.success) {
        setIsDialogOpen(false);
        setFormData({ source: '', destination: '', permanent: true });
        loadRedirects();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Error creating redirect:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this redirect?')) {
      try {
        const result = await deleteRedirect(id);
        if (result.success) {
          loadRedirects();
        }
      } catch (error) {
        console.error('Error deleting redirect:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Redirects</h1>
          <p className="text-muted-foreground mt-1">Manage URL redirects for your site.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Redirect
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Redirect</DialogTitle>
              <DialogDescription>
                Add a new redirect rule.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="source">Source Path</Label>
                <Input
                  id="source"
                  placeholder="/old-path"
                  value={formData.source}
                  onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">The path to redirect from (e.g., /old-page)</p>
              </div>
              
              <div>
                <Label htmlFor="destination">Destination Path</Label>
                <Input
                  id="destination"
                  placeholder="/new-path"
                  value={formData.destination}
                  onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">The path to redirect to (e.g., /new-page)</p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="permanent"
                  checked={formData.permanent}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, permanent: checked }))}
                />
                <Label htmlFor="permanent">Permanent Redirect (308)</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Redirect
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {redirects.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">No redirects found.</p>
          </div>
        ) : (
          redirects.map((redirect) => (
            <Card key={redirect.id} className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4 overflow-hidden">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm bg-muted px-2 py-1 rounded truncate max-w-[200px]" title={redirect.source}>
                      {redirect.source}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="font-mono text-sm bg-green-50 text-green-700 px-2 py-1 rounded truncate max-w-[200px]" title={redirect.destination}>
                      {redirect.destination}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    redirect.permanent ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {redirect.permanent ? 'Permanent (308)' : 'Temporary (307)'}
                  </span>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(redirect.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-4"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}