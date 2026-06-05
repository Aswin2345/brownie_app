import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'aswin_brownies_cart';

const getStoredCart = () => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    // Remove fallback products (fb1, fb2, etc.) to prevent checkout errors
    return parsed.filter(item => {
      const idStr = String(item.id || '');
      return !idStr.startsWith('fb') && idStr.length === 24; // Must be valid MongoDB ObjectId length
    }).map((item) => ({
      ...item,
      variant: item.variant || 'piece',
      unitLabel: item.unitLabel || 'Piece',
      cartId: item.cartId || `${item.id}:piece`,
    }));
  } catch {
    return [];
  }
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingIndex = state.findIndex(item => item.cartId === action.payload.cartId);
      if (existingIndex >= 0) {
        const updated = [...state];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }
    case 'REMOVE_FROM_CART':
      return state.filter(item => item.cartId !== action.payload);
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return state.filter(item => item.cartId !== action.payload.cartId);
      }
      return state.map(item =>
        item.cartId === action.payload.cartId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
    }
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], getStoredCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product, variant = 'piece') => {
    const productId = product._id || product.id;
    const isHalfKg = variant === 'halfKg';
    const price = isHalfKg ? product.priceHalfKg : product.price;
    const unitLabel = isHalfKg ? 'Half kg' : 'Piece';

    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        cartId: `${productId}:${variant}`,
        id: productId,
        name: product.name,
        price,
        variant,
        unitLabel,
        image: product.image,
      },
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: cartId });
  };

  const updateQuantity = (cartId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { cartId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export default CartContext;
