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
  
  loginBypass: async (email, role) => {
    const mockId = `demo-${role}`;
    const mockUser = { id: mockId, email, user_metadata: { role, name: `Demo ${role.toUpperCase()}` } };
    set({ user: mockUser, isLoading: false });
    await get().fetchProfile(mockId);
    return { data: { user: mockUser }, error: null };
  },

  fetchProfile: async (userId) => {
    try {
      const { data, error, isTableMissing } = await userService.getUser(userId)
      if (data) {
        set({ profile: data })
      } else {
        // FALLBACK: If table is missing or profile doesn't exist, use a guest profile
        const mockProfile = { 
          id: userId, 
          role: userId.includes('admin') ? 'admin' : userId.includes('owner') ? 'owner' : 'customer', 
          name: userId.startsWith('demo') ? `Demo ${userId.split('-')[1].toUpperCase()}` : 'Guest User',
          phone: '+91 99999 99999',
          email: get().user?.email || 'guest@localmart.com'
        };
        set({ profile: mockProfile });
      }
      return { data: get().profile, error: null }
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
