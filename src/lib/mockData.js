/**
 * MOCK DATA FOR PROTOTYPE PRESENTATION
 * This data is used as a fallback if the Supabase database is not fully configured.
 */

export const MOCK_STORES = [
  {
    id: 'store-1',
    name: 'Fresh Fields Grocery',
    category: 'Grocery',
    address: 'Near Central Park, Civil Lines',
    city: 'Raipur',
    image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400',
    is_active: true,
    rating: 4.8,
    delivery_time_min: 25
  },
  {
    id: 'store-2',
    name: 'Dairy Day Fresh',
    category: 'Dairy',
    address: 'Station Road, Sector 4',
    city: 'Raipur',
    image_url: 'https://images.unsplash.com/photo-1550583724-125581f77033?auto=format&fit=crop&q=80&w=400',
    is_active: true,
    rating: 4.5,
    delivery_time_min: 15
  },
  {
    id: 'store-3',
    name: 'Organic Harvest',
    category: 'Fruits & Veg',
    address: 'Main Market, MG Road',
    city: 'Raipur',
    image_url: 'https://images.unsplash.com/photo-1488459711615-de9b603fd1fb?auto=format&fit=crop&q=80&w=400',
    is_active: true,
    rating: 4.9,
    delivery_time_min: 30
  },
  {
    id: 'store-4',
    name: 'The Snack Hub',
    category: 'Snacks',
    address: 'Food Court, City Mall',
    city: 'Raipur',
    image_url: 'https://images.unsplash.com/photo-1599490659223-930b447870ed?auto=format&fit=crop&q=80&w=400',
    is_active: true,
    rating: 4.2,
    delivery_time_min: 20
  }
];

export const MOCK_PRODUCTS = {
  'store-1': [
    { id: 'p1', name: 'Premium Basmati Rice', category: 'Staples', price: 120, unit: 'kg', stock_qty: 50, is_available: true },
    { id: 'p2', name: 'Refined Sunflower Oil', category: 'Staples', price: 180, unit: '1L', stock_qty: 30, is_available: true },
    { id: 'p3', name: 'Whole Wheat Atta', category: 'Staples', price: 450, unit: '10kg', stock_qty: 20, is_available: true }
  ],
  'store-2': [
    { id: 'p4', name: 'Fresh Buffalo Milk', category: 'Dairy', price: 65, unit: '500ml', stock_qty: 100, is_available: true },
    { id: 'p5', name: 'Artisan Paneer', category: 'Dairy', price: 120, unit: '200g', stock_qty: 15, is_available: true },
    { id: 'p6', name: 'Pure Cow Ghee', category: 'Dairy', price: 550, unit: '500ml', stock_qty: 10, is_available: true }
  ],
  'store-3': [
    { id: 'p7', name: 'Organic Bananas', category: 'Fruits', price: 60, unit: 'dozen', stock_qty: 40, is_available: true },
    { id: 'p8', name: 'Hass Avocado', category: 'Fruits', price: 150, unit: 'piece', stock_qty: 5, is_available: true },
    { id: 'p9', name: 'Red Seedless Grapes', category: 'Fruits', price: 120, unit: '500g', stock_qty: 12, is_available: true }
  ]
};

export const MOCK_ORDERS = [
  {
    id: 'ord-101',
    status: 'delivered',
    total_amount: 350.00,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    payment_method: 'online',
    stores: { name: 'Fresh Fields Grocery' }
  },
  {
    id: 'ord-102',
    status: 'pending',
    total_amount: 180.50,
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    payment_method: 'cod',
    stores: { name: 'Dairy Day Fresh' }
  }
];
