import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';

export interface CartItem {
  product: Product;
  quantity: number;
  includeInstallation: boolean;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, includeInstallation?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleInstallation: (productId: string) => void;
  clearCart: () => void;
  totalEquipmentZAR: number;
  totalInstallationZAR: number;
  totalCartZAR: number;
  totalItemsCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('vortex_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('vortex_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity = 1, includeInstallation = false) => {
    setItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity, includeInstallation: includeInstallation || item.includeInstallation }
            : item
        );
      }
      return [...prev, { product, quantity, includeInstallation }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const toggleInstallation = (productId: string) => {
    setItems(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, includeInstallation: !item.includeInstallation }
          : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalEquipmentZAR = items.reduce(
    (sum, item) => sum + item.product.priceZAR * item.quantity,
    0
  );

  const totalInstallationZAR = items.reduce((sum, item) => {
    if (item.includeInstallation && item.product.installationPriceZAR) {
      return sum + item.product.installationPriceZAR * item.quantity;
    }
    return sum;
  }, 0);

  const totalCartZAR = totalEquipmentZAR + totalInstallationZAR;
  const totalItemsCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleInstallation,
        clearCart,
        totalEquipmentZAR,
        totalInstallationZAR,
        totalCartZAR,
        totalItemsCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
