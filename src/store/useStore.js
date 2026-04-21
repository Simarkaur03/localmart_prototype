import { create } from 'zustand'
import { authService } from '../lib/supabase/authService'
import { userService } from '../lib/supabase/userService'

// Helper to load cart from localStorage
const loadCart = () => {
  try {
    const savedCart = localStorage.getItem('kirana_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch {
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
    try {
      const { data, error, isTableMissing } = await userService.getUser(userId)
      if (data) {
        set({ profile: data })
      } else if (isTableMissing || error) {
        set({ 
          profile: { 
            id: userId, 
            role: 'customer', 
            name: 'Guest User',
            phone: '+91 99999 99999',
            email: get().user?.email 
          } 
        })
      }
      return { data, error }
    } catch (error) {
      console.error('Store: fetchProfile error:', error)
      return { data: null, error }
    }
  },

  updateProfile: (updatedProfile) => {
    set((state) => ({
      profile: { ...state.profile, ...updatedProfile }
    }));
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
