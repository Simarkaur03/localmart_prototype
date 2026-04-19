import { describe, it, expect, vi, beforeEach } from 'vitest';
import { orderService } from '../lib/supabase/orderService';
import { supabase } from '../lib/supabase';

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
    })),
    functions: {
      invoke: vi.fn()
    }
  }
}));

describe('orderService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('updateOrderStatus', () => {
    it('successfully updates order status', async () => {
      const mockResult = { data: { id: '1', status: 'delivered' }, error: null };
      supabase.from().update().eq().single.mockResolvedValueOnce(mockResult);

      const result = await orderService.updateOrderStatus('1', 'delivered');
      
      expect(result.data).toEqual(mockResult.data);
      expect(supabase.from).toHaveBeenCalledWith('orders');
    });

    it('returns error when update fails', async () => {
      const mockError = { message: 'Database error' };
      supabase.from().update().eq().single.mockResolvedValueOnce({ data: null, error: mockError });

      const result = await orderService.updateOrderStatus('1', 'delivered');
      
      expect(result.error).toBe(mockError.message);
      expect(result.data).toBeNull();
    });
  });

  describe('placeOrder', () => {
    it('calls the place-order edge function', async () => {
      const mockOrder = { items: [], total: 100 };
      supabase.functions.invoke.mockResolvedValueOnce({ data: { id: 'order_123' }, error: null });

      const result = await orderService.placeOrder(mockOrder);

      expect(supabase.functions.invoke).toHaveBeenCalledWith('place-order', {
        body: mockOrder
      });
      expect(result.data.id).toBe('order_123');
    });
  });
});
