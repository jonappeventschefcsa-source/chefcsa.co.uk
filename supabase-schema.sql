-- Chefcsa Database Schema
-- Run this in your Supabase SQL editor

-- Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  dietary_labels TEXT[] DEFAULT '{}',
  available BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  delivery_address TEXT NOT NULL,
  delivery_date DATE NOT NULL,
  delivery_time TIME NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','preparing','out_for_delivery','delivered','cancelled')),
  notes TEXT,
  seen BOOLEAN DEFAULT false,
  stripe_payment_intent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Service Areas
CREATE TABLE IF NOT EXISTS service_areas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('local','regional','nationwide')),
  description TEXT,
  delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  min_order DECIMAL(10,2) NOT NULL DEFAULT 0,
  estimated_delivery TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Hero Images (for the rotating slider)
CREATE TABLE IF NOT EXISTS hero_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert a default empty placeholder so the hero section still works
INSERT INTO hero_images (image_url, sort_order) VALUES ('', 1);

-- Site Content (CMS)
CREATE TABLE IF NOT EXISTS site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(section, key)
);

-- Insert default site content
INSERT INTO site_content (section, key, value) VALUES
  ('hero', 'headline', 'Best Ghanaian Food in the UK'),
  ('hero', 'subheadline', 'Authentic Ghanaian Flavours, Made Fresh Daily'),
  ('hero', 'cta_primary', 'Order Online'),
  ('hero', 'cta_secondary', 'View Menu'),
  ('hero', 'background_image', ''),
  ('welcome', 'title', 'Welcome to Chefcsa'),
  ('welcome', 'body', 'At Chefcsa, every dish starts with a genuine love for Ghanaian cooking — not a recipe book, but years of passion poured into every pot of food and every pinch of spice. We are bringing that same home-kitchen love straight to your door across the UK, one authentic meal at a time.'),
  ('authenticity', 'title', 'Authentic Ghanaian Flavours Nearby'),
  ('authenticity', 'body_1', 'Every dish is lovingly prepared using the freshest ingredients, traditional recipes, and time-honoured techniques passed down through generations. No shortcuts, no compromises — just real, honest Ghanaian cooking.'),
  ('authenticity', 'body_2', 'From the bold, smoky heat of our jollof to the comforting richness of our light soup, each bite is a taste of home.'),
  ('authenticity', 'image_url', ''),
  ('experience', 'title', 'More Than Just Food — It''s an Experience'),
  ('experience', 'body', 'Every meal from Chefcsa is crafted with care, bringing the warmth and vibrancy of Ghanaian hospitality straight to your table. Whether it''s a weeknight dinner or a special celebration, we make every order feel like a homecoming.'),
  ('experience', 'image_url', ''),
  ('order_cta', 'title', 'Order From Our Website'),
  ('order_cta', 'body', 'Order direct to save on fees, get faster service, and support a local Ghanaian kitchen right here in the UK.'),
  ('order_cta', 'button_text', 'Order Now'),
  ('contact', 'email', 'hello@chefcsa.co.uk'),
  ('contact', 'phone', '+44 7700 000000'),
  ('contact', 'base_location', 'Cambridge, UK'),
  ('global', 'site_name', 'Chefcsa'),
  ('global', 'site_description', 'Authentic Ghanaian flavours, made fresh daily. Delivered across the UK from Cambridge.'),
  ('global', 'logo_url', '')
ON CONFLICT (section, key) DO NOTHING;

-- Weekly Specials
CREATE TABLE IF NOT EXISTS weekly_specials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  days_available TEXT,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add image_url if missing (safe for re-runs on existing tables)
DO $$ BEGIN
  ALTER TABLE weekly_specials ADD COLUMN image_url TEXT;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Ensure site_content image_url entries exist for sections that use them
INSERT INTO site_content (section, key, value) VALUES
  ('authenticity', 'image_url', ''),
  ('experience', 'image_url', '')
ON CONFLICT (section, key) DO NOTHING;

INSERT INTO weekly_specials (title, description, days_available, image_url, sort_order) VALUES
  ('Weekend Jollof Special', 'Every Saturday & Sunday — our signature jollof rice with your choice of protein. The way mum used to make it.', 'Saturday, Sunday', '', 1),
  ('Friday Fufu Night', 'Freshly pounded fufu with your choice of light soup, groundnut soup, or palm nut soup. Available Friday evenings.', 'Friday', '', 2);

-- Testimonials / Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  text TEXT NOT NULL,
  rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  photo_url TEXT,
  active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO reviews (name, text, rating, sort_order) VALUES
  ('Abena M.', 'The jollof rice from Chefcsa is the real deal — perfectly spiced, smoky, and reminds me of home. Best I''ve had in the UK!', 5, 1),
  ('Kwame A.', 'Ordered the fufu and light soup for Friday night. Freshly made, generous portions, and the soup was packed with flavour. Highly recommend.', 5, 2),
  ('Sarah T.', 'Tried the waakye and kelewele for the first time. Absolutely delicious! You can taste the care in every bite. Will definitely order again.', 5, 3);

-- Insert sample menu data
INSERT INTO menu_items (name, description, price, category, dietary_labels, sort_order) VALUES
  ('Jollof Rice', 'Classic one-pot rice with tomato, pepper & spices', 8.50, 'Rice & Classics', ARRAY['spicy'], 1),
  ('Waakye', 'Rice & beans cooked with millet leaves, served with shito', 7.50, 'Rice & Classics', ARRAY['vegan'], 2),
  ('Fried Rice', 'Stir-fried rice with vegetables & your choice of protein', 8.00, 'Rice & Classics', ARRAY[]::TEXT[], 3),
  ('Fufu & Light Soup', 'Cassava & plantain dough with goat light soup', 10.00, 'Swallow', ARRAY['gluten-free'], 1),
  ('Banku & Tilapia', 'Fermented corn & cassava dough with grilled tilapia', 11.00, 'Swallow', ARRAY['gluten-free'], 2),
  ('Ampesi & Kontomire', 'Boiled yam/plantain with palava sauce', 9.00, 'Swallow', ARRAY['vegan','gluten-free'], 3),
  ('Kelewele', 'Spiced fried plantains with ginger & chilli', 5.00, 'Starters', ARRAY['vegan','gluten-free'], 1),
  ('Spring Rolls', 'Crispy vegetable spring rolls', 4.50, 'Starters', ARRAY['vegan'], 2),
  ('Chicken Wings', 'Grilled wings with shito dip', 6.50, 'Starters', ARRAY[]::TEXT[], 3),
  ('Grilled Tilapia', 'Whole tilapia, seasoned & grilled', 9.00, 'Protein', ARRAY['gluten-free'], 1),
  ('Red Red', 'Beans in palm oil with fried plantain', 7.00, 'Protein', ARRAY['vegan','gluten-free'], 2),
  ('Shito (Hot Pepper Sauce)', 'Traditional Ghanaian black pepper sauce', 2.50, 'Sides', ARRAY['vegan','gluten-free'], 1);

-- Insert service areas
INSERT INTO service_areas (name, type, description, delivery_fee, min_order, estimated_delivery) VALUES
  ('Cambridge (Local)', 'local', '10-mile radius of Cambridge city centre', 2.50, 10.00, 'Same day (order before 2pm)'),
  ('East of England', 'regional', 'Bedfordshire, Essex, Hertfordshire, Norfolk, Suffolk', 5.00, 15.00, 'Next-day delivery'),
  ('UK Nationwide', 'nationwide', 'All postcodes across England, Scotland, Wales & Northern Ireland', 8.00, 25.00, '1-2 business days via courier');

-- Enable Row Level Security
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_specials ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DROP POLICY IF EXISTS "Public read menu_items" ON menu_items;
CREATE POLICY "Public read menu_items" ON menu_items FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read service_areas" ON service_areas;
CREATE POLICY "Public read service_areas" ON service_areas FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read site_content" ON site_content;
CREATE POLICY "Public read site_content" ON site_content FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read weekly_specials" ON weekly_specials;
CREATE POLICY "Public read weekly_specials" ON weekly_specials FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read reviews" ON reviews;
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);

-- Allow public insert orders (customers don't log in, they just submit orders)
DROP POLICY IF EXISTS "Public insert orders" ON orders;
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);
-- No public SELECT — customers don't log in, so there's no way to match them.
-- Admins use the authenticated role policy below.

-- Admin access for authenticated users only
DROP POLICY IF EXISTS "Admin all menu_items" ON menu_items;
CREATE POLICY "Admin all menu_items" ON menu_items FOR ALL USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admin all orders" ON orders;
CREATE POLICY "Admin all orders" ON orders FOR ALL USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admin all service_areas" ON service_areas;
CREATE POLICY "Admin all service_areas" ON service_areas FOR ALL USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admin all site_content" ON site_content;
CREATE POLICY "Admin all site_content" ON site_content FOR ALL USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admin all weekly_specials" ON weekly_specials;
CREATE POLICY "Admin all weekly_specials" ON weekly_specials FOR ALL USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admin all reviews" ON reviews;
CREATE POLICY "Admin all reviews" ON reviews FOR ALL USING (auth.role() = 'authenticated');

-- Hero images policies
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read hero_images" ON hero_images;
CREATE POLICY "Public read hero_images" ON hero_images FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin all hero_images" ON hero_images;
CREATE POLICY "Admin all hero_images" ON hero_images FOR ALL USING (auth.role() = 'authenticated');

-- Storage bucket setup
-- Make bucket public so uploaded images are accessible via publicUrl
INSERT INTO storage.buckets (id, name, public) VALUES ('chefcsa', 'chefcsa', true)
ON CONFLICT (id) DO UPDATE SET public = true;
-- Allow anyone to read (needed for images to load in browser)
DROP POLICY IF EXISTS "Public Access chefcsa" ON storage.objects;
CREATE POLICY "Public Access chefcsa" ON storage.objects FOR SELECT USING (bucket_id = 'chefcsa');
-- Allow uploads from both anon (via API route) and authenticated (via dashboard)
DROP POLICY IF EXISTS "Upload Access chefcsa" ON storage.objects;
CREATE POLICY "Upload Access chefcsa" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'chefcsa');
DROP POLICY IF EXISTS "Delete Access chefcsa" ON storage.objects;
CREATE POLICY "Delete Access chefcsa" ON storage.objects FOR DELETE USING (bucket_id = 'chefcsa');
DROP POLICY IF EXISTS "Update Access chefcsa" ON storage.objects;
CREATE POLICY "Update Access chefcsa" ON storage.objects FOR UPDATE USING (bucket_id = 'chefcsa');
