import { supabase } from '../supabase'

/**
 * Handles all user-related profile operations.
 */
export const userService = {
  /**
   * Fetches a user's profile by ID.
   */
  getUser: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, phone, role, avatar_url, default_address')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('UserService.getUser error:', error.message)
      return { data: null, error: error.message }
    }
  },

  /**
   * Updates a user's profile.
   */
  updateUser: async (userId, updates) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('UserService.updateUser error:', error.message)
      return { data: null, error: error.message }
    }
  },

  /**
   * Quick helper to get user role.
   */
  getUserRole: async (userId) => {
    const { data, error } = await userService.getUser(userId)
    return { role: data?.role || null, error }
  },

  /**
   * Admin only: Get all users.
   */
  getAllUsers: async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('UserService.getAllUsers error:', error.message)
      return { data: null, error: error.message }
    }
  }
}
