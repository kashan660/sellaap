'use client';

import { useState, useEffect } from 'react';
import { 
  getMenus, 
  createMenu, 
  updateMenu, 
  deleteMenu,
  createMenuItem,
  updateMenuItem,
  updateMenuItemOrders,
  deleteMenuItem,
} from '@/lib/actions/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  Trash2, 
  Plus, 
  Edit2, 
  MoreVertical, 
  ChevronRight, 
  ChevronDown,
  GripVertical
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface MenuItem {
  id: number;
  label: string;
  url: string;
  target: string;
  parentId: number | null;
  order: number;
  children: MenuItem[];
}

interface Menu {
  id: number;
  name: string;
  location: string | null;
  items: MenuItem[];
}

export default function AdminMenusPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  
  // Dialog states
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Forms
  const [menuForm, setMenuForm] = useState({ name: '', location: '' });
  const [itemForm, setItemForm] = useState({ 
    label: '', 
    url: '', 
    target: '_self', 
    parentId: 'root' 
  });

  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = async () => {
    try {
      const data = await getMenus();
      setMenus(data as any);
      if (selectedMenu) {
        // Refresh selected menu
        const updated = data.find((m: any) => m.id === selectedMenu.id);
        if (updated) setSelectedMenu(updated as any);
      }
    } catch (error) {
      console.error('Error loading menus:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createMenu(menuForm);
    if (result.success) {
      setIsMenuDialogOpen(false);
      setMenuForm({ name: '', location: '' });
      loadMenus();
    }
  };

  const handleDeleteMenu = async (id: number) => {
    if (confirm('Delete this menu and all its items?')) {
      const result = await deleteMenu(id);
      if (result.success) {
        if (selectedMenu?.id === id) setSelectedMenu(null);
        loadMenus();
      }
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMenu) return;

    const parentId = itemForm.parentId === 'root' ? null : parseInt(itemForm.parentId);
    
    if (editingItem) {
      const result = await updateMenuItem(editingItem.id, {
        label: itemForm.label,
        url: itemForm.url,
        target: itemForm.target,
      });
      if (result.success) {
        setIsItemDialogOpen(false);
        setEditingItem(null);
        loadMenus();
      }
    } else {
      const result = await createMenuItem({
        menuId: selectedMenu.id,
        label: itemForm.label,
        url: itemForm.url,
        target: itemForm.target,
        parentId: parentId || undefined
      });
      if (result.success) {
        setIsItemDialogOpen(false);
        resetItemForm();
        loadMenus();
      }
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (confirm('Delete this item?')) {
      const result = await deleteMenuItem(id);
      if (result.success) loadMenus();
    }
  };

  const handleReorder = async (newItems: MenuItem[]) => {
    if (!selectedMenu) return;
    
    // Update local state
    const updatedMenu = { ...selectedMenu, items: newItems };
    setSelectedMenu(updatedMenu);
  };

  const handleDragEnd = async (items: MenuItem[]) => {
    const updates = items.map((item, index) => ({
      id: item.id,
      order: index
    }));
    
    try {
      await updateMenuItemOrders(updates);
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const resetItemForm = () => {
    setItemForm({ label: '', url: '', target: '_self', parentId: 'root' });
    setEditingItem(null);
  };

  const openEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setItemForm({
      label: item.label,
      url: item.url,
      target: item.target,
      parentId: item.parentId ? item.parentId.toString() : 'root'
    });
    setIsItemDialogOpen(true);
  };

  // Helper to flatten items for parent selection
  const getFlatItems = (items: MenuItem[], depth = 0): { id: number, label: string, depth: number }[] => {
    return items.reduce((acc, item) => {
      acc.push({ id: item.id, label: item.label, depth });
      if (item.children) {
        acc.push(...getFlatItems(item.children, depth + 1));
      }
      return acc;
    }, [] as { id: number, label: string, depth: number }[]);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Menus</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar: Menu List */}
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Menus</CardTitle>
              <Dialog open={isMenuDialogOpen} onOpenChange={setIsMenuDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Menu</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateMenu} className="space-y-4 mt-4">
                    <div>
                      <Label>Name</Label>
                      <Input 
                        value={menuForm.name} 
                        onChange={e => setMenuForm({...menuForm, name: e.target.value})} 
                        required 
                      />
                    </div>
                    <div>
                      <Label>Location (Optional)</Label>
                      <Input 
                        value={menuForm.location} 
                        onChange={e => setMenuForm({...menuForm, location: e.target.value})} 
                        placeholder="e.g. header, footer"
                      />
                    </div>
                    <Button type="submit" className="w-full">Create</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-1">
                {menus.map(menu => (
                  <div 
                    key={menu.id}
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                      selectedMenu?.id === menu.id ? 'bg-secondary' : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedMenu(menu)}
                  >
                    <div className="truncate">
                      <span className="font-medium">{menu.name}</span>
                      {menu.location && (
                        <span className="ml-2 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          {menu.location}
                        </span>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMenu(menu.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main: Menu Items */}
        <div className="md:col-span-3">
          {selectedMenu ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{selectedMenu.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage items for this menu.
                  </p>
                </div>
                <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetItemForm}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingItem ? 'Edit Item' : 'Add Item'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSaveItem} className="space-y-4 mt-4">
                      <div>
                        <Label>Label</Label>
                        <Input 
                          value={itemForm.label} 
                          onChange={e => setItemForm({...itemForm, label: e.target.value})} 
                          required 
                        />
                      </div>
                      <div>
                        <Label>URL</Label>
                        <Input 
                          value={itemForm.url} 
                          onChange={e => setItemForm({...itemForm, url: e.target.value})} 
                          required 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Target</Label>
                          <Select 
                            value={itemForm.target} 
                            onValueChange={v => setItemForm({...itemForm, target: v})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="_self">Same Tab</SelectItem>
                              <SelectItem value="_blank">New Tab</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Parent Item</Label>
                          <Select 
                            value={itemForm.parentId} 
                            onValueChange={v => setItemForm({...itemForm, parentId: v})}
                            disabled={!!editingItem} // Disable parent change on edit for simplicity
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Root (No Parent)" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="root">Root (No Parent)</SelectItem>
                              {getFlatItems(selectedMenu.items)
                                .filter(i => i.id !== editingItem?.id) // Prevent self-parenting
                                .map(item => (
                                  <SelectItem key={item.id} value={item.id.toString()}>
                                    {'-'.repeat(item.depth)} {item.label}
                                  </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button type="submit" className="w-full">Save Item</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedMenu.items.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No items in this menu.
                    </div>
                  ) : (
                    <MenuItemsList 
                      items={selectedMenu.items} 
                      onEdit={openEditItem} 
                      onDelete={handleDeleteItem}
                      onReorder={handleReorder}
                      onDragEnd={handleDragEnd}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center border rounded-lg bg-muted/10 min-h-[400px]">
              <div className="text-center text-muted-foreground">
                <p>Select a menu to manage its items</p>
                <p className="text-sm">or create a new one.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { Reorder } from 'framer-motion';

// Recursive component for rendering items
function MenuItemsList({ 
  items, 
  onEdit, 
  onDelete, 
  onReorder,
  onDragEnd,
  level = 0 
}: { 
  items: MenuItem[], 
  onEdit: (i: MenuItem) => void, 
  onDelete: (id: number) => void, 
  onReorder: (items: MenuItem[]) => void,
  onDragEnd: (items: MenuItem[]) => void,
  level?: number 
}) {
  return (
    <Reorder.Group axis="y" values={items} onReorder={onReorder} className="space-y-2">
      {items.map(item => (
        <Reorder.Item key={item.id} value={item} onDragEnd={() => onDragEnd(items)}>
          <div 
            className="flex items-center justify-between p-3 bg-white border rounded-md hover:border-primary/50 transition-colors group"
            style={{ marginLeft: `${level * 24}px` }}
          >
            <div className="flex items-center gap-3">
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-move opacity-50" />
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.url}</div>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="sm" variant="ghost" onClick={() => onEdit(item)}>
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onDelete(item.id)} className="text-destructive">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          {item.children && item.children.length > 0 && (
            <MenuItemsList 
              items={item.children} 
              onEdit={onEdit} 
              onDelete={onDelete}
              onReorder={(newChildren) => {
                const newItems = items.map(i => 
                  i.id === item.id ? { ...i, children: newChildren } : i
                );
                onReorder(newItems);
              }}
              onDragEnd={onDragEnd}
              level={level + 1} 
            />
          )}
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}
