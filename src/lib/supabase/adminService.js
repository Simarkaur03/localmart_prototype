import { supabase } from '../supabase'

/**
 * Handles cross-cutting administrative stats and operations.
 */
export const adminService = {
  /**
   * Fetches summary stats for the admin dashboard.
   */
  getDashboardStats: async () => {
    try {
      // 1. Total Stores
      const { count: storesCount, error: storesError } = await supabase
        .from('stores')
        .select('*', { count: 'exact', head: true })
      
      if (storesError) throw storesError

      // 2. Total Users
      const { count: usersCount, error: usersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

      if (usersError) throw usersError

      // 3. Orders Today & Revenue
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('total_amount')
        .gte('created_at', today.toISOString())

      if (ordersError) throw ordersError

      const revenue = orders?.reduce((acc, o) => acc + parseFloat(o.total_amount || 0), 0) || 0

      return {
        data: {
          totalStores: storesCount || 0,
          totalUsers: usersCount || 0,
          ordersToday: orders?.length || 0,
          revenue
        },
        error: null
      }
    } catch (error) {
      console.error('AdminService.getDashboardStats error:', error.message)
      return { data: null, error: error.message }
    }
  }
}
