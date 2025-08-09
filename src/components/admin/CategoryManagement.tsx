'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { Category } from '@/data/products';

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', image: '' });
    setEditingCategory(null);
  };

  const openDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
        image: category.image
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSave = async () => {
    const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';
    const method = editingCategory ? 'PUT' : 'POST';

    const categoryData = {
      name: formData.name,
      description: formData.description,
      image: formData.image,
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      });

      if (!response.ok) throw new Error('Failed to save category');
      
      await loadCategories();
    closeDialog();
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar categoria.');
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        const response = await fetch(`/api/categories/${categoryId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete category');
        await loadCategories();
      } catch (error) {
        console.error(error);
        alert('Erro ao excluir categoria.');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Categorias</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Nome da categoria"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />

              <Textarea
                placeholder="Descrição da categoria"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Imagem da categoria</label>
                <Input
                  placeholder="URL da imagem"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex-1">
                  {editingCategory ? 'Atualizar' : 'Criar'} Categoria
                </Button>
                <Button variant="outline" onClick={closeDialog}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`/categoria/${category.id}`, '_blank')}
                    className="mt-2 w-full text-xs"
                  >
                    Ver Categoria
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => openDialog(category)} className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(category.id)}
                  >
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
