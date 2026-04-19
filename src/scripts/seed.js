import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';

// GET KEYS FROM .env or ask USER
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing environment variables. Please run with env or update script.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const categories = ['Dairy', 'Snacks', 'Beverages', 'Staples', 'Fruits', 'Vegetables'];
const units = ['kg', 'litre', 'piece', 'gm', 'packet'];

async function seedData() {
  console.log("🌱 Starting seed...");

  // 1. Create a dummy owner user if needed or use existing
  // This usually requires admin key or service role for auth.users
  // For this script, we assume profiles/stores/products table access
  
  // NOTE: This seed script focuses on PUBLIC TABLES (stores, products)
  // Users must be created via the UI for Auth to work.

  const ownerId = 'db744837-79cb-403d-8884-69970c653696'; // Example existing owner ID - USER SHOULD CHANGE THIS

  // 2. Create Stores
  console.log("Creating stores...");
  const stores = [
    { name: 'Kisan Kirana Store', category: 'General', address: '123 Market Lane', city: 'Mumbai', pincode: '400001', owner_id: ownerId, is_active: true },
    { name: 'Gopal Dairy & Snacks', category: 'Dairy', address: '45 Station Road', city: 'Mumbai', pincode: '400001', owner_id: ownerId, is_active: true },
    { name: 'Fresh Fields', category: 'Fruits', address: 'Green Complex', city: 'Mumbai', pincode: '400001', owner_id: ownerId, is_active: true }
  ];

  const { data: storeData, error: storeError } = await supabase.from('stores').upsert(stores).select();
  if (storeError) {
    console.error("Store Seed Error:", storeError.message);
    return;
  }

  // 3. Create Products for each store
  console.log("Creating products...");
  for (const store of storeData) {
    const products = Array.from({ length: 15 }).map(() => ({
      store_id: store.id,
      name: faker.commerce.productName(),
      category: faker.helpers.arrayElement(categories),
      price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
      unit: faker.helpers.arrayElement(units),
      stock_qty: faker.number.int({ min: 0, max: 100 }),
      is_available: true
    }));

    const { error: prodError } = await supabase.from('products').insert(products);
    if (prodError) console.error(`Error for store ${store.name}:`, prodError.message);
  }

  console.log("✅ Seed complete!");
}

seedData();
