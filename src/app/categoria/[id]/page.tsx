'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
// import { ProductCarousel } from '@/components/carousel/ProductCarousel';
import type { Category, Product } from '@/data/products';
import Link from 'next/link';
import Image from 'next/image';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!params.id) return;
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products')
        ]);

        if (!catRes.ok || !prodRes.ok) throw new Error('Failed to fetch data');

        const allCategories: Category[] = await catRes.json();
        const allProducts: Product[] = await prodRes.json();
        
    const categoryId = params.id as string;
        const foundCategory = allCategories.find(c => c.id === categoryId);
        
    if (foundCategory) {
          setCategory(foundCategory);
          const categoryProducts = allProducts.filter(p => p.category === categoryId);
      setProducts(categoryProducts);
        } else {
          setCategory(null);
          setProducts([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center pt-32">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center pt-32">
          <p className="text-gray-500">Categoria não encontrada.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-24 md:pt-32">
        <section className="text-center p-6 bg-white shadow-md">
          <h1 className="text-3xl font-bold text-proboots-red">{category.name}</h1>
          <p className="text-gray-600 mt-2">{category.description}</p>
        </section>

        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link href={`/produto/${product.id}`} key={product.id} className="group">
                <div className="border rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                  <div className="relative w-full h-48 bg-gray-200">
                    <Image
                      src={product.coverImage}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                      className="group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                    <p className="text-proboots-red font-bold text-xl mt-2">R$ {(product.price / 100).toFixed(2).replace('.', ',')}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
        
        <div className="p-4 text-center">
          <Button onClick={() => router.push('/')}>Voltar para a Home</Button>
        </div>
      </main>
    </div>
  );
}
