'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CartDrawer } from '@/components/products/CartDrawer';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cart } = useCart();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

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
          "text-center py-1 text-xs",
          isHomePage ? "bg-proboots-red/90" : "bg-proboots-red"
        )}>
        ⚡ Frete grátis para todo o Brasil
      </div>

      {/* Header principal */}
        <div className={cn(
          "transition-all duration-300",
          isHomePage ? "bg-proboots-red/90" : "bg-proboots-red"
        )}>
        <div className="flex items-center justify-between p-2">
          {/* Menu hamburger (mobile) */}
            <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="w-4 h-4" />
          </Button>

          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/logo.png"
              alt="Proboots Logo"
              className="h-12 w-auto"
            />
          </div>

            {/* Ícones da direita */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="relative"
              >
                {isSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
              </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCartOpen(true)}
                className="relative"
          >
            <ShoppingCart className="w-4 h-4" />
            {cart.itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[10px] bg-red-500">
                {cart.itemCount}
              </Badge>
            )}
          </Button>
            </div>
        </div>

          {/* Barra de pesquisa expansível */}
          {isSearchOpen && (
            <div className="px-2 pb-2 animate-fadeIn">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 w-3 h-3" />
            <Input
              placeholder="O que está procurando?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-white/20 border-white/30 placeholder:text-gray-300 text-sm"
            />
          </div>
            </div>
          )}
        </div>
      </header>

      {/* Drawer do carrinho */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}
