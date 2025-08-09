'use client';

import { CartProvider } from '@/context/CartContext';
import { Toaster } from "@/components/ui/toaster"

export function ClientBody({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <Toaster />
    </CartProvider>
  );
}
