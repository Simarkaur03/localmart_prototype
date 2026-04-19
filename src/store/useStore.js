import { create } from 'zustand'
import { authService } from '../lib/supabase/authService'
import { userService } from '../lib/supabase/userService'

// Helper to load cart from localStorage
const loadCart = () => {
  try {
    const savedCart = localStorage.getItem('kirana_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (e) {
    return [];
  }
};

export const useStore = create((set, get) => ({
  user: null,
  profile: null,
  cart: loadCart(),
  isLoading: true,

  // Auth Actions
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  
  fetchProfile: async (userId) => {
    const { data, error } = await userService.getUser(userId)
    if (data) set({ profile: data })
    return { data, error }
  },

  logout: async () => {
    await authService.signOut()
    set({ user: null, profile: null, cart: [] })
    localStorage.removeItem('kirana_cart');
  },

  // Cart Actions
  addToCart: (product) => {
    const cart = get().cart
    const existingItem = cart.find(item => item.id === product.id)
    
    let newCart;
    if (existingItem) {
      newCart = cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    
    set({ cart: newCart });
    localStorage.setItem('kirana_cart', JSON.stringify(newCart));
  },

  updateCartQuantity: (productId, delta) => {
    const cart = get().cart
    const newCart = cart.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(0, item.quantity + delta)
        return { ...item, quantity: newQty }
      }
      return item
    }).filter(item => item.quantity > 0);
    
    set({ cart: newCart });
    localStorage.setItem('kirana_cart', JSON.stringify(newCart));
  },

  clearCart: () => {
    set({ cart: [] });
    localStorage.removeItem('kirana_cart');
  },

  clearAndAddToCart: (product) => {
    const newCart = [{ ...product, quantity: 1 }];
    set({ cart: newCart });
    localStorage.setItem('kirana_cart', JSON.stringify(newCart));
  },

  setLoading: (isLoading) => set({ isLoading })
}))
