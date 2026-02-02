import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const isFirstRender = useRef(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        setCartItems([]);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes (skip first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    try {
      // Store minimal product data without large images to avoid quota exceeded error
      const cartToSave = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        brand: item.brand,
        price: item.price,
        category: item.category,
        quantity: item.quantity,
        // Store only first image URL or none to save space
        imageUrl: item.imageUrl1 || item.imageUrl || ''
      }));
      localStorage.setItem('cart', JSON.stringify(cartToSave));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
      // Clear old data if quota exceeded
      if (error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded, clearing cart data');
        localStorage.removeItem('cart');
      }
    }
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Store only essential product data, exclude large image data
      return [...prevItems, { 
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category,
        shortDesc: product.shortDesc,
        features: product.features,
        // Only store first image to minimize storage
        imageUrl: product.imageUrl1 || product.imageUrl || '',
        quantity: 1 
      }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
