'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/data/products';

interface ProductCarouselProps {
  title: string;
  type: 'bestSeller' | 'forYou' | 'category';
  categoryId?: string;
}

export function ProductCarousel({ title, type, categoryId }: ProductCarouselProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();
  const { addItem, formatPrice } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const allProducts: Product[] = await res.json();

        let productList: Product[] = [];
        switch (type) {
          case 'bestSeller':
            productList = allProducts.filter(p => p.bestSeller);
            break;
          case 'forYou':
            productList = allProducts.filter(p => p.forYou);
            break;
          case 'category':
            if (categoryId) {
              productList = allProducts.filter(p => p.category === categoryId);
            }
            break;
        }
        setProducts(productList);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, [type, categoryId]);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
    toast({
      title: '🛒 Produto adicionado ao carrinho!',
      description: `${product.name} foi adicionado com sucesso.`,
      variant: 'cart',
    });
  };

  if (products.length === 0) return null;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <Button variant="ghost" size="sm" className="text-blue-600">
          Ver todos
        </Button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {products.map((product) => (
          <Card
            key={product.id}
            className="flex-shrink-0 w-40 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push(`/produto/${product.id}`)}
          >
            <CardContent className="p-3">
              <div className="relative w-full h-32 mb-2 rounded-lg overflow-hidden">
                <Image
                  src={product.coverImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.discount && (
                  <Badge className="absolute top-1 left-1 bg-green-500 text-white text-xs">
                    {product.discount}%
                  </Badge>
                )}
              </div>

              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                {product.name}
              </h3>

              <div className="space-y-1 mb-3">
                <div className="text-lg font-bold text-blue-600">
                  {formatPrice(product.price)}
                </div>
                {product.originalPrice && (
                  <div className="text-xs text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </div>
                )}
                <div className="text-xs text-gray-600">
                  5x de {formatPrice(Math.floor(product.price / 5))} SEM JUROS
                </div>
              </div>

              <Button
                size="sm"
                className="w-full bg-blue-600 hover:bg-blue-700 text-xs"
                onClick={(e) => handleAddToCart(product, e)}
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                Adicionar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
