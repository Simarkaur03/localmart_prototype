import { useEffect } from 'react'
import { realtimeService } from '../lib/supabase/realtimeService'

/**
 * Custom hook to subscribe to order changes for a store.
 */
export const useOrderRealtime = (storeId, onUpdate) => {
  useEffect(() => {
    if (!storeId) return

    const channel = realtimeService.subscribeToOrders(storeId, (payload) => {
      onUpdate(payload)
    })

    return () => {
      realtimeService.unsubscribe(channel)
    }
  }, [storeId, onUpdate])
}
