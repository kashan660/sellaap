'use client';

import { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/actions/products';
import { getMenus } from '@/lib/actions/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Trash2, Plus, Edit2, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from '@/components/ImageUpload';
import { Switch } from '@/components/ui/switch';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

interface MenuItem {
  id: number;
  label: string;
  children?: MenuItem[];
}

interface Menu {
  id: number;
  name: string;
  items: MenuItem[];
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    addToMenu: false,
    menuPlacement: 'top_level', // 'top_level' | 'submenu'
    targetMenuId: '',
    parentMenuItemId: 'root'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesData, menusData] = await Promise.all([
        getCategories(),
        getMenus()
      ]);
      setCategories(categoriesData);
      setMenus(menusData as any);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('slug', formData.slug);
    if (formData.description) data.append('description', formData.description);
    if (formData.image) data.append('image', formData.image);

    // Menu data (only for create)
    if (!editingCategory && formData.addToMenu) {
      data.append('menuPlacement', formData.menuPlacement);
      data.append('targetMenuId', formData.targetMenuId);
      if (formData.menuPlacement === 'submenu' && formData.parentMenuItemId !== 'root') {
        data.append('parentMenuItemId', formData.parentMenuItemId);
      }
    }

    try {
      let result;
      if (editingCategory) {
        result = await updateCategory(editingCategory.id, data);
      } else {
        result = await createCategory(data);
      }

      if (result.success) {
        setIsDialogOpen(false);
        resetForm();
        loadCategories();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        const result = await deleteCategory(id);
        if (result.success) {
          loadCategories();
        } else {
            alert(result.error);
        }
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: '', 
      slug: '', 
      description: '', 
      image: '',
      addToMenu: false,
      menuPlacement: 'top_level',
      targetMenuId: menus.length > 0 ? menus[0].id.toString() : '',
      parentMenuItemId: 'root'
    });
    setEditingCategory(null);
  };

  const openEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image: category.image || '',
      addToMenu: false,
      menuPlacement: 'top_level',
      targetMenuId: '',
      parentMenuItemId: 'root'
    });
    setIsDialogOpen(true);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  // Helper to get items for selected menu
  const getSelectedMenuItems = () => {
    if (!formData.targetMenuId) return [];
    const menu = menus.find(m => m.id.toString() === formData.targetMenuId);
    return menu ? menu.items : [];
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground mt-1">Manage product categories.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'Create Category'}</DialogTitle>
              <DialogDescription>
                {editingCategory ? 'Edit the category details below.' : 'Add a new category to your store.'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData(prev => ({ 
                      ...prev, 
                      name,
                      slug: !editingCategory ? generateSlug(name) : prev.slug 
                    }));
                  }}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div>
                  <Label>Image</Label>
                  <ImageUpload
                      onImageUpload={(img) => setFormData(prev => ({ ...prev, image: img.url }))}
                  />
                  {formData.image && (
                      <div className="mt-2 text-sm text-green-600">
                          Image selected
                      </div>
                  )}
              </div>

              {!editingCategory && (
                <div className="space-y-4 border-t pt-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="addToMenu" 
                      checked={formData.addToMenu}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, addToMenu: checked }))}
                    />
                    <Label htmlFor="addToMenu">Add to Menu</Label>
                  </div>

                  {formData.addToMenu && (
                     <div className="space-y-4 pl-6 border-l-2 border-muted ml-2">
                       <div>
                          <Label>Select Menu</Label>
                          <Select 
                            value={formData.targetMenuId} 
                            onValueChange={(val) => setFormData(prev => ({ ...prev, targetMenuId: val }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a menu" />
                            </SelectTrigger>
                            <SelectContent>
                              {menus.map(menu => (
                                <SelectItem key={menu.id} value={menu.id.toString()}>{menu.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                       </div>

                       <div>
                          <Label>Placement</Label>
                          <Select 
                            value={formData.menuPlacement} 
                            onValueChange={(val) => setFormData(prev => ({ ...prev, menuPlacement: val }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="top_level">Top Level Item</SelectItem>
                              <SelectItem value="submenu">Dropdown Item</SelectItem>
                            </SelectContent>
                          </Select>
                       </div>

                       {formData.menuPlacement === 'submenu' && (
                         <div>
                            <Label>Parent Item</Label>
                            <Select 
                              value={formData.parentMenuItemId} 
                              onValueChange={(val) => setFormData(prev => ({ ...prev, parentMenuItemId: val }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select parent item" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="root">-- Select Parent --</SelectItem>
                                {getSelectedMenuItems().map(item => (
                                  <SelectItem key={item.id} value={item.id.toString()}>{item.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                         </div>
                       )}
                     </div>
                  )}
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCategory ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          className="pl-10"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="group">
             <CardContent className="p-6">
               <div className="flex justify-between items-start">
                 <div>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{category.slug}</p>
                    {category.description && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{category.description}</p>
                    )}
                 </div>
                 <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(category)}>
                        <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(category.id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                 </div>
               </div>
             </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}