'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { Product, Category } from '@/data/products';

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    description: '',
    coverImage: '',
    images: '',
    category: '',
    inStock: true,
    featured: false,
    bestSeller: false,
    forYou: false
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ]);
      if (!productsRes.ok || !categoriesRes.ok) {
        throw new Error('Failed to fetch data');
      }
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', price: '', originalPrice: '', description: '',
      coverImage: '', images: '', category: '', inStock: true,
      featured: false, bestSeller: false, forYou: false
    });
    setEditingProduct(null);
  };

  const openDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: (product.price / 100).toString(),
        originalPrice: product.originalPrice ? (product.originalPrice / 100).toString() : '',
        description: product.description,
        coverImage: product.coverImage,
        images: product.images.join('\n'),
        category: product.category,
        inStock: product.inStock,
        featured: product.featured,
        bestSeller: product.bestSeller,
        forYou: product.forYou
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
    const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';

    const productData = {
      name: formData.name,
      price: Math.round(Number.parseFloat(formData.price) * 100),
      originalPrice: formData.originalPrice ? Math.round(Number.parseFloat(formData.originalPrice) * 100) : undefined,
      discount: formData.originalPrice ?
        Math.round((1 - Number.parseFloat(formData.price) / Number.parseFloat(formData.originalPrice)) * 100) : undefined,
      description: formData.description,
      coverImage: formData.coverImage,
      images: formData.images.split('\n').filter(img => img.trim()),
      category: formData.category,
      inStock: formData.inStock,
      featured: formData.featured,
      bestSeller: formData.bestSeller,
      forYou: formData.forYou
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (!response.ok) throw new Error('Failed to save product');
      await loadData();
    closeDialog();
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar produto.');
    }
  };

  const handleDelete = async (productId: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        const response = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete product');
        await loadData();
      } catch (error) {
        console.error(error);
        alert('Erro ao excluir produto.');
      }
    }
  };

  const formatPrice = (price: number): string => {
    return `R$ ${(price / 100).toFixed(2).replace('.', ',')}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Produtos</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Nome do produto"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Preço (R$)"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
                <Input
                  placeholder="Preço original (R$)"
                  type="number"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                />
              </div>

              <Textarea
                placeholder="Descrição do produto"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />

              <Input
                placeholder="URL da imagem de capa"
                value={formData.coverImage}
                onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
              />

              <Textarea
                placeholder="URLs das imagens (uma por linha)"
                value={formData.images}
                onChange={(e) => setFormData({...formData, images: e.target.value})}
              />

              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({...formData, inStock: e.target.checked})}
                  />
                  <span>Em estoque</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  />
                  <span>Destaque</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.bestSeller}
                    onChange={(e) => setFormData({...formData, bestSeller: e.target.checked})}
                  />
                  <span>Mais vendido</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.forYou}
                    onChange={(e) => setFormData({...formData, forYou: e.target.checked})}
                  />
                  <span>Para você</span>
                </label>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex-1">
                  {editingProduct ? 'Atualizar' : 'Criar'} Produto
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
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <img
                  src={product.coverImage}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="font-bold text-blue-600">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    {product.bestSeller && <Badge className="bg-green-500">Mais Vendido</Badge>}
                    {product.forYou && <Badge className="bg-blue-500">Para Você</Badge>}
                    {product.featured && <Badge className="bg-purple-500">Destaque</Badge>}
                    {!product.inStock && <Badge variant="destructive">Fora de Estoque</Badge>}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="sm" onClick={() => openDialog(product)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)}>
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
