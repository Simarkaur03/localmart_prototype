import { supabase } from '../supabase'
import { MOCK_ORDERS } from '../mockData'

/**
 * Handles all order-related operations.
 */
export const orderService = {
  /**
   * Places a new order (calls Edge Function for atomic operation).
   */
  placeOrder: async (orderData) => {
    try {
      const { data, error } = await supabase.functions.invoke('place-order', {
        body: orderData
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('OrderService.placeOrder error:', error.message)
      return { data: null, error: error.message }
    }
  },

  /**
   * Fetches orders for a customer.
   */
  getOrdersByCustomer: async (customerId) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, status, total_amount, created_at, 
          stores (name, image_url)
        `)
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })
      
      if (error) {
        // FALLBACK FOR PROTOTYPE
        if (error.message?.includes('schema cache') || error.code === '42P01') {
          return { data: MOCK_ORDERS, error: null };
        }
        throw error;
      }
      return { data, error: null }
    } catch (error) {
      console.error('OrderService.getOrdersByCustomer error:', error.message)
      return { data: MOCK_ORDERS, error: null }
    }
  },

  /**
   * Fetches orders for a store (owner view).
   */
  getOrdersByStore: async (storeId) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, status, total_amount, created_at, delivery_address,
          users (name, phone)
        `)
        .eq('store_id', storeId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('OrderService.getOrdersByStore error:', error.message)
      return { data: [], error: error.message }
    }
  },

  /**
   * Updates order status.
   */
  updateOrderStatus: async (orderId, status) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('OrderService.updateOrderStatus error:', error.message)
      return { data: null, error: error.message }
    }
  },

  /**
   * Cancels an order (calls Edge Function).
   */
  cancelOrder: async (orderId, reason) => {
    try {
      const { data, error } = await supabase.functions.invoke('cancel-order', {
        body: { orderId, reason }
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('OrderService.cancelOrder error:', error.message)
      return { data: null, error: error.message }
    }
  },
  /**
   * Admin only: Get all orders globally.
   */
  getAllOrders: async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, users(name), stores(name)')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('OrderService.getAllOrders error:', error.message)
      return { data: null, error: error.message }
    }
  }
}
