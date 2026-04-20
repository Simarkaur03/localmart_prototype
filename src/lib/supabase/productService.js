import { supabase } from '../supabase'
import { MOCK_PRODUCTS } from '../mockData'

/**
 * Handles all product-related operations.
 */
export const productService = {
  /**
   * Fetches products for a specific store.
   */
  getProductsByStore: async (storeId) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, category, description, price, unit, image_url, stock_qty, is_available')
        .eq('store_id', storeId)
        .order('name', { ascending: true })
      
      if (error) {
        // FALLBACK FOR PROTOTYPE
        if (error.message?.includes('schema cache') || error.code === '42P01') {
          return { data: MOCK_PRODUCTS[storeId] || MOCK_PRODUCTS['store-1'], error: null };
        }
        throw error;
      }
      return { data, error: null }
    } catch (error) {
      console.error('ProductService.getProductsByStore error:', error.message)
      return { data: MOCK_PRODUCTS[storeId] || MOCK_PRODUCTS['store-1'], error: null }
    }
  },

  /**
   * Creates a new product.
   */
  createProduct: async (productData) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('ProductService.createProduct error:', error.message)
      return { data: null, error: error.message }
    }
  },

  /**
   * Updates product details.
   */
  updateProduct: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('ProductService.updateProduct error:', error.message)
      return { data: null, error: error.message }
    }
  },

  /**
   * Manually updates stock (though usually handled by triggers or edge functions).
   */
  updateStock: async (id, newStock) => {
    return productService.updateProduct(id, { stock_qty: newStock })
  }
}
