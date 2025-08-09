'use client';

import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { X, Trash2, Minus, Plus, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { CheckoutModal } from './CheckoutModal';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { 
    cart, 
    removeItem, 
    updateQuantity, 
    formatPrice, 
    sendToWhatsApp,
    isCheckoutModalOpen,
    openCheckoutModal,
    closeCheckoutModal
  } = useCart();

  if (!isOpen) return null;

  return (
    <>
    <div
      className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Seu Carrinho ({cart.itemCount})</h2>
            <button onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Itens do carrinho */}
          {cart.items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="font-semibold text-lg">Seu carrinho está vazio</h3>
              <p className="text-gray-500 text-sm">Adicione produtos para continuar</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.items.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex gap-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                    <Image
                      src={item.product.coverImage}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium leading-tight">{item.product.name}</p>
                    {item.size && (
                      <p className="text-xs text-gray-500">Tamanho: {item.size}</p>
                    )}
                    <p className="text-sm font-bold mt-1">{formatPrice(item.product.price)}</p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.product.id, item.size)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-1 border border-gray-200 rounded-full px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.size)}
                        className="w-5 h-5 flex items-center justify-center text-gray-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size)}
                        className="w-5 h-5 flex items-center justify-center text-gray-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          {cart.items.length > 0 && (
            <div className="p-4 border-t space-y-4">
              <div className="flex justify-between font-medium">
                <span>Subtotal</span>
                <span>{formatPrice(cart.total)}</span>
              </div>
                <Button onClick={openCheckoutModal} className="w-full bg-green-500 hover:bg-green-600">
                  Finalizar Pedido
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
      
      <CheckoutModal 
        isOpen={isCheckoutModalOpen}
        onClose={closeCheckoutModal}
        onSubmit={sendToWhatsApp}
      />
    </>
  );
}
