import { supabase } from '../supabase'

/**
 * Handles centralized Realtime subscriptions.
 */
export const realtimeService = {
  /**
   * Subscribes to order updates for a specific store.
   */
  subscribeToOrders: (storeId, onUpdate) => {
    return supabase
      .channel(`store-orders-${storeId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `store_id=eq.${storeId}`
        },
        (payload) => onUpdate(payload)
      )
      .subscribe()
  },

  /**
   * Subscribes to status updates for a specific order.
   */
  subscribeToOrderStatus: (orderId, onUpdate) => {
    return supabase
      .channel(`order-status-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        (payload) => onUpdate(payload)
      )
      .subscribe()
  },

  /**
   * Subscribes to stock changes for products in a specific store.
   */
  subscribeToStock: (storeId, onUpdate) => {
    return supabase
      .channel(`store-stock-${storeId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products',
          filter: `store_id=eq.${storeId}`
        },
        (payload) => onUpdate(payload)
      )
      .subscribe()
  },

  /**
   * Unsubscribes from a channel.
   */
  unsubscribe: (channel) => {
    supabase.removeChannel(channel)
  }
}
