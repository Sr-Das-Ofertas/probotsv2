'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import type { Category } from '@/data/products';

interface CategoryGridProps {
  categoryIds: string[];
  title?: string;
}

export function CategoryGrid({ categoryIds, title }: CategoryGridProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('Failed to fetch categories');
        const allCategories = await res.json();
    
    const filteredAndOrdered = categoryIds
          .map(id => allCategories.find((cat: Category) => cat.id === id))
      .filter((cat): cat is Category => cat !== undefined);
      
    setCategories(filteredAndOrdered);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, [categoryIds]);

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="p-4">
       {title && <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Link href={`/categoria/${category.id}`} key={category.id} className="block group">
            <Card className="overflow-hidden rounded-lg aspect-square shadow-none border-none">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
