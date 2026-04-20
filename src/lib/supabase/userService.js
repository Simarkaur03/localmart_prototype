import { supabase } from '../supabase'

/**
 * Handles all user-related profile operations.
 */
export const userService = {
  /**
   * Fetches a user's profile by ID.
   */
  getUser: async (userId) => {
    // Add a race condition to prevent long-hanging queries
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('User fetch timeout')), 5000)
    );

    try {
      const query = supabase
        .from('users')
        .select('id, name, email, phone, role, avatar_url, default_address')
        .eq('id', userId)
        .single();

      const { data, error } = await Promise.race([query, timeoutPromise]);
      
      if (error) {
        // Detect 'Table Not Found' errors (schema cache error or relation doesn't exist)
        if (error.code === 'PGRST116' || error.message?.includes('schema cache') || error.code === '42P01') {
          console.warn('UserService: Users table or profile missing. User ID:', userId);
          return { data: null, error: 'Table or Profile not found', isTableMissing: error.message?.includes('schema cache') };
        }
        throw error;
      }
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
