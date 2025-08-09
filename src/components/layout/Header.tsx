'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link'
import { Menu, Search, ShoppingCart, X } from 'lucide-react';
import { useCartContext } from '@/context/CartContext';
import { usePathname } from 'next/navigation';
import { CartDrawer } from '@/components/products/CartDrawer';
import { Product } from '@/data/products';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const { cart, isCartOpen, openCart, closeCart } = useCartContext();
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === '/';

  useEffect(() => {
    if (searchQuery.length > 2) {
      fetch(`/api/products?q=${searchQuery}`)
        .then(res => res.json())
        .then(data => {
          setSuggestedProducts(data);
          setShowSuggestions(true);
        });
    } else {
      setSuggestedProducts([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica de busca
    console.log('Buscando:', searchQuery);
    if (searchQuery.trim()) {
      router.push(`/busca?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (product: Product) => {
    router.push(`/produto/${product.id}`);
    setShowSuggestions(false);
  };

  return (
    <>
      <header
        className={cn(
          "z-50 text-white",
          isHomePage
            ? "absolute top-0 left-0 right-0 bg-transparent"
            : "sticky top-0 shadow-md"
        )}
      >
      {/* Barra de frete grátis */}
        <div className={cn(
          "text-center py-1.5 text-sm",
          isHomePage ? "bg-proboots-red/90" : "bg-proboots-red"
        )}>
        ⚡ Frete grátis para todo o Brasil
      </div>

      {/* Header principal */}
        <div className={cn(
          "transition-all duration-300",
          isHomePage ? "bg-proboots-red/90" : "bg-proboots-red"
        )}>
        <div className="flex items-center justify-between p-3">
          {/* Menu hamburger (mobile) */}
            <Button variant="ghost" size="sm" className="md:hidden h-10 w-10">
            <Menu className="w-5 h-5" />
          </Button>

          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <img
                src="/logo.png"
                alt="Proboots Logo"
                className="h-20 w-auto"
              />
            </Link>
          </div>

            {/* Ícones da direita */}
            <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={openCart}
                className="relative h-10 w-10"
          >
            <ShoppingCart className="w-5 h-5" />
            {cart.itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs bg-red-500">
                {cart.itemCount}
              </Badge>
            )}
          </Button>
            </div>
        </div>

          {/* Barra de pesquisa fixa */}
          <div className="px-3 pb-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="O que está buscando?"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="pl-12 bg-white border-0 placeholder:text-gray-400 text-black h-14 text-base rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/50"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-proboots-red hover:bg-proboots-red/90 text-white h-10 px-4 rounded-lg"
              >
                Buscar
              </Button>
            </form>

            {/* Sugestões de produtos */}
            {showSuggestions && suggestedProducts.length > 0 && (
              <div className="absolute left-0 right-0 mx-3 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                {suggestedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onMouseDown={() => handleSuggestionClick(product)}
                    >
                      <div className="flex items-center space-x-3">
                        <Search className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-800">{product.name}</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Drawer do carrinho */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
      />
    </>
  );
}
