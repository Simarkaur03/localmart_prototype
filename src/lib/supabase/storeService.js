import { supabase } from '../supabase'
import { MOCK_STORES } from '../mockData'

/**
 * Handles all store-related operations.
 */
export const storeService = {
  /**
   * Fetches all active stores with pagination.
   */
  getStores: async (page = 0, pageSize = 20) => {
    try {
      const { data, error, count } = await supabase
        .from('stores')
        .select('id, name, category, address, city, image_url, is_active, rating, delivery_time_min', { count: 'exact' })
        .eq('is_active', true)
        .range(page * pageSize, (page + 1) * pageSize - 1)
        .order('created_at', { ascending: false })
      
      if (error) {
        // FALLBACK FOR PROTOTYPE
        if (error.message?.includes('schema cache') || error.code === '42P01') {
          console.warn('StoreService: Stores table missing, using mock data.');
          return { data: MOCK_STORES, count: MOCK_STORES.length, error: null };
        }
        throw error;
      }
      return { data, count, error: null }
    } catch (error) {
      console.error('StoreService.getStores error:', error.message)
      return { data: MOCK_STORES, count: MOCK_STORES.length, error: null }
    }
  },

  /**
   * Fetches a single store by ID.
   */
  getStoreById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('StoreService.getStoreById error:', error.message)
      return { data: null, error: error.message }
    }
  },

  /**
   * Creates a new store (for owners).
   */
  createStore: async (storeData) => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .insert(storeData)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('StoreService.createStore error:', error.message)
      return { data: null, error: error.message }
    }
  },

  /**
   * Updates store details.
   */
  updateStore: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('StoreService.updateStore error:', error.message)
      return { data: null, error: error.message }
    }
  },

  /**
   * Fetches store by owner ID.
   */
  getStoreByOwner: async (ownerId) => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('owner_id', ownerId)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      return { data, error: null }
    } catch (error) {
      console.error('StoreService.getStoreByOwner error:', error.message)
      return { data: null, error: error.message }
    }
  },

  /**
   * Admin only: Get all stores.
   */
  getAllStores: async () => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*, users(email)')
        .order('name', { ascending: true })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('StoreService.getAllStores error:', error.message)
      return { data: null, error: error.message }
    }
  },

  /**
   * Admin/Owner: Update store status.
   */
  updateStoreStatus: async (storeId, isActive) => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .update({ is_active: isActive })
        .eq('id', storeId)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('StoreService.updateStoreStatus error:', error.message)
      return { data: null, error: error.message }
    }
  },

  /**
   * Owner: Save (upsert) store profile.
   */
  saveStore: async (ownerId, storeData) => {
    try {
      // Try to find existing first to decide insert or update
      const { data: existing } = await supabase
        .from('stores')
        .select('id')
        .eq('owner_id', ownerId)
        .single()

      let result
      if (existing) {
        result = await supabase
          .from('stores')
          .update(storeData)
          .eq('owner_id', ownerId)
          .select()
          .single()
      } else {
        result = await supabase
          .from('stores')
          .insert({ ...storeData, owner_id: ownerId })
          .select()
          .single()
      }

      if (result.error) throw result.error
      return { data: result.data, error: null }
    } catch (error) {
      console.error('StoreService.saveStore error:', error.message)
      return { data: null, error: error.message }
    }
  }
}
