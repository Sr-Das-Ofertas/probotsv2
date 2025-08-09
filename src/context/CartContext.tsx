'use client';

import { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import type { Product } from '@/data/products';
import type { UserData } from '@/components/products/CheckoutModal';

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

interface CartContextType {
  cart: Cart;
  isCheckoutModalOpen: boolean;
  openCheckoutModal: () => void;
  closeCheckoutModal: () => void;
  addItem: (product: Product, quantity: number, size?: string) => void;
  removeItem: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  sendToWhatsApp: (userData: UserData) => void;
  formatPrice: (price: number) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
    itemCount: 0
  });
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');

  // Carregar configurações do WhatsApp
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const settings = await response.json();
          setWhatsappNumber(settings.whatsappNumber);
        }
      } catch (error) {
        console.error('Erro ao carregar configurações do WhatsApp:', error);
        // Fallback para um número padrão caso a API falhe
        setWhatsappNumber('5511999999999');
      }
    };

    loadSettings();
  }, []);

  // Carregar carrinho do localStorage na inicialização
  useEffect(() => {
    if (typeof window !== 'undefined') {
    try {
      const savedCart = localStorage.getItem('proboots-cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      }
    }
  }, []);

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('proboots-cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error);
      }
    }
  }, [cart]);

  const openCheckoutModal = () => setIsCheckoutModalOpen(true);
  const closeCheckoutModal = () => setIsCheckoutModalOpen(false);

  const recalculateCart = (items: CartItem[]): Cart => {
    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return { items, total, itemCount };
  };

  const addItem = (product: Product, quantity = 1, size?: string) => {
    setCart(currentCart => {
      const existingItemIndex = currentCart.items.findIndex(
        item => item.product.id === product.id && item.size === size
      );
      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        newItems = [...currentCart.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity
        };
      } else {
        newItems = [...currentCart.items, { product, quantity, size }];
      }
      return recalculateCart(newItems);
    });
  };

  const removeItem = (productId: string, size?: string) => {
    setCart(currentCart => {
      const newItems = currentCart.items.filter(
        item => !(item.product.id === productId && item.size === size)
      );
      return recalculateCart(newItems);
    });
  };

  const updateQuantity = (productId: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeItem(productId, size);
      return;
    }
    setCart(currentCart => {
      const newItems = currentCart.items.map(item => {
        if (item.product.id === productId && item.size === size) {
          return { ...item, quantity };
        }
        return item;
      });
      return recalculateCart(newItems);
    });
  };

  const clearCart = () => {
    setCart({ items: [], total: 0, itemCount: 0 });
  };

  const formatPrice = (price: number): string => {
    return `R$ ${(price / 100).toFixed(2).replace('.', ',')}`;
  };

  const generateWhatsAppMessage = (userData: UserData): string => {
    let message = "🛒 *PEDIDO PROBOOTS* 🛒\n\n";

    message += "*DADOS DO CLIENTE:*\n";
    message += `Nome: ${userData.name}\n`;
    message += `CPF: ${userData.cpf}\n`;
    message += `Telefone: ${userData.phone}\n`;
    
    // Formatar endereço completo
    const addressParts = [
      userData.street,
      userData.number,
      userData.neighborhood,
      `${userData.city} - ${userData.state}`,
      `CEP: ${userData.cep}`
    ];
    if (userData.complement) {
      addressParts.splice(2, 0, userData.complement);
    }
    message += `Endereço: ${addressParts.join(', ')}\n`;
    message += `✅ Cliente concordou com envio via Transportadora Flex\n\n`;

    message += "----------\n\n";
    
    message += "*ITENS DO PEDIDO:*\n";
    cart.items.forEach((item, index) => {
      message += `${index + 1}. *${item.product.name}*\n`;
      if (item.size) message += `   Tamanho: ${item.size}\n`;
      message += `   Quantidade: ${item.quantity}\n`;
      message += `   Valor: ${formatPrice(item.product.price)}\n\n`;
    });
    message += `💰 *Total: ${formatPrice(cart.total)}*\n\n`;
    message += "✅ Gostaria de finalizar este pedido!";
    return encodeURIComponent(message);
  };

  const sendToWhatsApp = (userData: UserData) => {
    if (cart.items.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    if (!whatsappNumber) {
      alert('Número do WhatsApp não configurado. Entre em contato com o administrador.');
      return;
    }

    const message = generateWhatsAppMessage(userData);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    closeCheckoutModal();
  };

  return (
    <CartContext.Provider value={{ cart, isCheckoutModalOpen, openCheckoutModal, closeCheckoutModal, addItem, removeItem, updateQuantity, clearCart, sendToWhatsApp, formatPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
} 