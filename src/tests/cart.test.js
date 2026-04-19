import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useStore } from '../store/useStore';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn(key => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn(key => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useStore Cart Logic', () => {
  beforeEach(() => {
    useStore.getState().clearCart();
    vi.clearAllMocks();
  });

  it('adds an item to the cart', () => {
    const product = { id: 'p1', name: 'Milk', price: 50 };
    useStore.getState().addToCart(product);

    const cart = useStore.getState().cart;
    expect(cart).toHaveLength(1);
    expect(cart[0].id).toBe('p1');
    expect(cart[0].quantity).toBe(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('kirana_cart', expect.any(String));
  });

  it('increments quantity if same item is added', () => {
    const product = { id: 'p1', name: 'Milk', price: 50 };
    useStore.getState().addToCart(product);
    useStore.getState().addToCart(product);

    const cart = useStore.getState().cart;
    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(2);
  });

  it('updates quantity with delta', () => {
    const product = { id: 'p1', name: 'Milk', price: 50 };
    useStore.getState().addToCart(product);
    
    useStore.getState().updateCartQuantity('p1', 1); // +1 = 2
    expect(useStore.getState().cart[0].quantity).toBe(2);

    useStore.getState().updateCartQuantity('p1', -1); // -1 = 1
    expect(useStore.getState().cart[0].quantity).toBe(1);
  });

  it('removes item if quantity reaches 0', () => {
    const product = { id: 'p1', name: 'Milk', price: 50 };
    useStore.getState().addToCart(product);
    
    useStore.getState().updateCartQuantity('p1', -1); // 1 - 1 = 0
    expect(useStore.getState().cart).toHaveLength(0);
  });
});
