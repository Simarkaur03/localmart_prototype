import { useEffect } from 'react'
import { realtimeService } from '../lib/supabase/realtimeService'

/**
 * Custom hook to subscribe to product stock changes for a store.
 */
export const useStockRealtime = (storeId, onUpdate) => {
  useEffect(() => {
    if (!storeId) return

    const channel = realtimeService.subscribeToStock(storeId, (payload) => {
      onUpdate(payload)
    })

    return () => {
      realtimeService.unsubscribe(channel)
    }
  }, [storeId, onUpdate])
}
