import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import Swal from 'sweetalert2';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Performance: Lazy initialization with error handling for localStorage
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('spice-cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Cart parsing error:', error);
      return [];
    }
  });

  // Best Practices: Sync cart with localStorage
  useEffect(() => {
    localStorage.setItem('spice-cart', JSON.stringify(cart));
  }, [cart]);

  // Performance: useCallback ব্যবহার করে ফাংশন মেমোইজ করা হয়েছে যাতে চাইল্ড কম্পোনেন্ট অপ্রয়োজনীয় রি-রেন্ডার না হয়
  const addToCart = useCallback(food => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === food.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === food.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item,
        );
      }
      return [...prevCart, { ...food, quantity: 1 }];
    });

    // Accessibility & UX: Boutique themed toast
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      background: '#fcf9f5',
      color: '#1a1a1a',
      iconColor: '#E65100',
    });

    Toast.fire({
      icon: 'success',
      title: `${food.name} added to collection`,
    });
  }, []);

  const removeFromCart = useCallback(id => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  }, []);

  // Best Practices: পেমেন্ট সাকসেস হওয়ার পর কার্ট খালি করার জন্য
  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem('spice-cart');
  }, []);

  // Performance: useMemo ব্যবহার করে ক্যালকুলেশন অপ্টিমাইজ করা হয়েছে
  const cartTotal = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + (Number(item.price_usd) || 0) * (item.quantity || 1),
      0,
    );
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  }, [cart]);

  // Context Value memoized to prevent unnecessary re-renders of consumers
  const value = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      cartTotal,
      cartCount,
    }),
    [cart, addToCart, removeFromCart, clearCart, cartTotal, cartCount],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
