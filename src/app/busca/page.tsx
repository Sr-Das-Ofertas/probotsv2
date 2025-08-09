'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/data/products';
import Link from 'next/link';
import Image from 'next/image';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setLoading(true);
      fetch(`/api/products?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Resultados da busca por: <span className="text-proboots-red">{query}</span>
      </h1>

      {loading ? (
        <div className="text-center">
          <p>Carregando...</p>
        </div>
      ) : products.length > 0 ? (
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
      ) : (
        <div className="text-center">
          <p>Nenhum produto encontrado para &quot;{query}&quot;.</p>
        </div>
      )}
    </div>
  );
}
