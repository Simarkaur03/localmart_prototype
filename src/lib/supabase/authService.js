import { supabase } from '../supabase'

/**
 * Handles all authentication related operations.
 */
export const authService = {
  /**
   * Signs up a new user.
   */
  signUp: async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('AuthService.signUp error:', error.message)
      return { data: null, error: error.message }
    }
  },

  /**
   * Signs in an existing user.
   */
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('AuthService.signIn error:', error.message)
      return { data: null, error: error.message }
    }
  },

  /**
   * Signs out the current user.
   */
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('AuthService.signOut error:', error.message)
      return { error: error.message }
    }
  },

  /**
   * Gets the current session.
   */
  getSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return { data: session, error: null }
    } catch (error) {
      console.error('AuthService.getSession error:', error.message)
      return { data: null, error: error.message }
    }
  },

  /**
   * Listens for auth state changes.
   */
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}
