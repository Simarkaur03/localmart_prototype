-- 1. EXTEND USERS FOR DELIVERY & NOTIFICATIONS
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_v5') THEN
        ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
        ALTER TABLE users ADD CONSTRAINT users_role_check 
            CHECK (role IN ('customer', 'owner', 'delivery', 'admin'));
    END IF;
END $$;

ALTER TABLE users ADD COLUMN IF NOT EXISTS onesignal_player_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS vehicle_type TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS pincode_serve TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT FALSE;

-- 2. EXTEND ORDERS FOR PAYMENTS & TRACKING
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT 
    CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_partner_id UUID REFERENCES users(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS estimated_delivery_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_fee_partner NUMERIC DEFAULT 0;

-- 3. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT CHECK (status IN ('created', 'paid', 'failed', 'refunded')),
    method TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DELIVERY TRACKING TABLES
CREATE TABLE IF NOT EXISTS delivery_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    partner_id UUID REFERENCES users(id),
    lat NUMERIC(10,7) NOT NULL,
    lng NUMERIC(10,7) NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS delivery_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    partner_id UUID REFERENCES users(id),
    status TEXT CHECK (status IN ('assigned', 'accepted', 'picked_up', 'delivered', 'rejected')),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    picked_up_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    earnings NUMERIC DEFAULT 0
);

-- 5. REVIEWS & RATINGS
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) UNIQUE,
    customer_id UUID REFERENCES users(id),
    store_id UUID REFERENCES stores(id),
    rating INT CHECK (rating BETWEEN 1 AND 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to update store rating
CREATE OR REPLACE FUNCTION update_store_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE stores
    SET rating = (
        SELECT ROUND(AVG(rating)::numeric, 1)
        FROM reviews WHERE store_id = NEW.store_id
    )
    WHERE id = NEW.store_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS store_rating_trigger ON reviews;
CREATE TRIGGER store_rating_trigger
    AFTER INSERT OR UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_store_rating();

-- 6. COUPONS & OFFERS
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    discount_type TEXT CHECK (discount_type IN ('percent', 'flat')),
    discount_value NUMERIC NOT NULL,
    min_order_amount NUMERIC DEFAULT 0,
    max_discount_amount NUMERIC,
    valid_from TIMESTAMPTZ,
    valid_until TIMESTAMPTZ,
    max_uses INT,
    used_count INT DEFAULT 0,
    store_id UUID REFERENCES stores(id), -- NULL for global coupons
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coupon_uses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID REFERENCES coupons(id),
    order_id UUID REFERENCES orders(id),
    customer_id UUID REFERENCES users(id),
    discount_applied NUMERIC,
    used_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_uses ENABLE ROW LEVEL SECURITY;

-- Basic Policies (Global READ for relevant roles)
CREATE POLICY "Users can view their own payments" ON payments FOR SELECT TO authenticated USING (auth.uid() IN (SELECT customer_id FROM orders WHERE id = order_id));
CREATE POLICY "Customers can track their delivery" ON delivery_locations FOR SELECT TO authenticated USING (auth.uid() IN (SELECT customer_id FROM orders WHERE id = order_id));
CREATE POLICY "Public can view store reviews" ON reviews FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Customers can create reviews for their orders" ON reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Anyone can view active coupons" ON coupons FOR SELECT TO authenticated USING (is_active = TRUE);
