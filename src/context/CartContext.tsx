import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MenuItem,
  DELIVERY_ZONES,
  DeliveryZone,
  RESTAURANT_INFO,
  isStoreOpen,
  getStoreStatus,
  StoreStatus,
  IkoyiDistrict,
  getDeliveryFeeByDistrict,
  IKOYI_DISTRICTS_LOOKUP,
} from '../data/kabachi';

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface SubmittedOrder {
  reference: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  orderType: 'delivery' | 'pickup';
  customerName: string;
  customerPhone: string;
  address?: string;
  landmark?: string;
  deliveryZone?: string;
  district?: IkoyiDistrict;
  pickupTime?: string;
  kitchenNote?: string;
  paymentMethod: 'delivery' | 'pickup' | 'transfer';
  rawWhatsAppMessage: string;
  whatsappUrl: string;
  createdAt: string;
}

interface CartContextType {
  items: CartItem[];
  totalItemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  minOrder: number;
  isBelowMinOrder: boolean;
  minOrderRemaining: number;
  addItem: (item: MenuItem) => void;
  decrementItem: (itemId: string) => void;
  removeItem: (itemId: string) => void;
  getItemQuantity: (itemId: string) => number;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isBadgeAnimating: boolean;
  orderType: 'delivery' | 'pickup';
  setOrderType: (type: 'delivery' | 'pickup') => void;
  selectedZone: DeliveryZone;
  setSelectedZone: (zone: DeliveryZone) => void;
  selectedDistrict: IkoyiDistrict;
  selectedDistrictId: string;
  setSelectedDistrictId: (districtId: string) => void;
  storeStatus: StoreStatus;
  isStoreClosed: boolean;
  setIsStoreClosed: (closed: boolean) => void;
  completedOrder: SubmittedOrder | null;
  setCompletedOrder: (order: SubmittedOrder | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kabachi_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBadgeAnimating, setIsBadgeAnimating] = useState(false);
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('gerard-kingsway');
  const [selectedZone, setSelectedZone] = useState<DeliveryZone>(DELIVERY_ZONES[0]);
  
  // Real-time store status tracking Lagos timezone (9:00 AM - 10:00 PM)
  const [storeStatus, setStoreStatus] = useState<StoreStatus>(() => getStoreStatus());
  const [isStoreClosed, setIsStoreClosed] = useState<boolean>(() => !getStoreStatus().isOpen);
  const [isManualOverride, setIsManualOverride] = useState(false);

  const [completedOrder, setCompletedOrder] = useState<SubmittedOrder | null>(() => {
    try {
      const saved = sessionStorage.getItem('kabachi_last_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Calculate current district details using helper function
  const selectedDistrict = getDeliveryFeeByDistrict(selectedDistrictId);

  // Real-time interval: recalculates store status every 10 seconds without page refresh
  useEffect(() => {
    const updateStatus = () => {
      const current = getStoreStatus();
      setStoreStatus(current);
      if (!isManualOverride) {
        setIsStoreClosed(!current.isOpen);
      }
    };

    // Initial check
    updateStatus();

    // Lightweight 10-second timer
    const interval = setInterval(updateStatus, 10000);
    return () => clearInterval(interval);
  }, [isManualOverride]);

  const handleSetIsStoreClosed = (closed: boolean) => {
    setIsManualOverride(true);
    setIsStoreClosed(closed);
  };

  useEffect(() => {
    try {
      localStorage.setItem('kabachi_cart', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  useEffect(() => {
    if (completedOrder) {
      try {
        sessionStorage.setItem('kabachi_last_order', JSON.stringify(completedOrder));
      } catch {
        // ignore
      }
    }
  }, [completedOrder]);

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
  // Delivery fee is dynamically computed using the Ikoyi district lookup helper
  const deliveryFee = orderType === 'delivery' ? selectedDistrict.fee : 0;
  const total = subtotal + deliveryFee;
  const minOrder = RESTAURANT_INFO.minOrder;
  const isBelowMinOrder = subtotal > 0 && subtotal < minOrder;
  const minOrderRemaining = Math.max(0, minOrder - subtotal);

  const triggerBadgePop = () => {
    setIsBadgeAnimating(true);
    setTimeout(() => {
      setIsBadgeAnimating(false);
    }, 180);
  };

  const addItem = (item: MenuItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
    triggerBadgePop();
  };

  const decrementItem = (itemId: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.item.id === itemId);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return prev.filter((i) => i.item.id !== itemId);
      }
      return prev.map((i) =>
        i.item.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.item.id !== itemId));
  };

  const getItemQuantity = (itemId: string) => {
    const found = items.find((i) => i.item.id === itemId);
    return found ? found.quantity : 0;
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalItemCount,
        subtotal,
        deliveryFee,
        total,
        minOrder,
        isBelowMinOrder,
        minOrderRemaining,
        addItem,
        decrementItem,
        removeItem,
        getItemQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isBadgeAnimating,
        orderType,
        setOrderType,
        selectedZone,
        setSelectedZone,
        selectedDistrict,
        selectedDistrictId,
        setSelectedDistrictId,
        storeStatus,
        isStoreClosed,
        setIsStoreClosed: handleSetIsStoreClosed,
        completedOrder,
        setCompletedOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
