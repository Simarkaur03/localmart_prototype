import { supabase } from '../supabase';

export const paymentService = {
  /**
   * Initializes a Razorpay order via Edge Function
   */
  createRzpOrder: async (orderId, amount) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-payment-order', {
        body: { orderId, amount }
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('PaymentService.createRzpOrder error:', error.message);
      return { data: null, error: error.message };
    }
  },

  /**
   * Verifies Razorpay signature via Edge Function
   */
  verifyPayment: async (paymentData) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: paymentData
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('PaymentService.verifyPayment error:', error.message);
      return { data: null, error: error.message };
    }
  },

  /**
   * Process refund (Admin only)
   */
  processRefund: async (orderId, amount) => {
    try {
      const { data, error } = await supabase.functions.invoke('process-refund', {
        body: { orderId, amount }
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('PaymentService.processRefund error:', error.message);
      return { data: null, error: error.message };
    }
  }
};
