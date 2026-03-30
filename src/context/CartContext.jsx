import React, { createContext, useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('spice-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('spice-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = food => {
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

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `${food.name} added to collection`,
      showConfirmButton: false,
      timer: 2000,
      background: '#fcf9f5',
    });
  };

  const removeFromCart = id => {
    setCart(cart.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce(
    (acc, item) => acc + item.price_usd * (item.quantity || 1),
    0,
  );
  const cartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, cartTotal, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
