'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Upload, Eye, EyeOff } from 'lucide-react';
import type { Banner } from '@/data/products';

export function BannerManagement() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    link: '',
    active: true
  });

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const response = await fetch('/api/banners/all');
      if (!response.ok) throw new Error('Failed to fetch banners');
      const data = await response.json();
      setBanners(data);
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      image: '',
      link: '',
      active: true
    });
    setEditingBanner(null);
  };

  const openDialog = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title,
        image: banner.image,
        link: banner.link || '',
        active: banner.active
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
    const url = editingBanner ? `/api/banners/${editingBanner.id}` : '/api/banners';
    const method = editingBanner ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
      title: formData.title,
      image: formData.image,
      link: formData.link || undefined,
      active: formData.active
        })
      });

      if (!response.ok) throw new Error('Failed to save banner');
      
      await loadBanners();
    closeDialog();
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar banner. Verifique o console.');
    }
  };

  const handleDelete = async (bannerId: string) => {
    if (confirm('Tem certeza que deseja excluir este banner?')) {
      try {
        const response = await fetch(`/api/banners/${bannerId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete banner');
        await loadBanners();
      } catch (error) {
        console.error(error);
        alert('Erro ao excluir banner. Verifique o console.');
      }
    }
  };

  const toggleActive = async (banner: Banner) => {
    try {
      const response = await fetch(`/api/banners/${banner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !banner.active })
      });
      if (!response.ok) throw new Error('Failed to toggle banner status');
      await loadBanners();
    } catch (error) {
      console.error(error);
      alert('Erro ao alterar status do banner. Verifique o console.');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      alert('Upload de imagem ainda não implementado. Por favor, insira a URL da imagem diretamente.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Banners</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Banner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBanner ? 'Editar Banner' : 'Novo Banner'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Título do banner"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Imagem do banner</label>
                <Input
                  placeholder="URL da imagem"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}
              </div>

              <Input
                placeholder="Link do banner (opcional)"
                value={formData.link}
                onChange={(e) => setFormData({...formData, link: e.target.value})}
              />

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({...formData, active: e.target.checked})}
                />
                <span>Banner ativo</span>
              </label>

              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex-1">
                  {editingBanner ? 'Atualizar' : 'Criar'} Banner
                </Button>
                <Button variant="outline" onClick={closeDialog}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {banners.map((banner) => (
          <Card key={banner.id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-32 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{banner.title}</h3>
                    <Badge variant={banner.active ? "default" : "secondary"}>
                      {banner.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  {banner.link && (
                    <p className="text-sm text-gray-600">Link: {banner.link}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleActive(banner)}
                  >
                    {banner.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button size="sm" onClick={() => openDialog(banner)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(banner.id)}>
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
