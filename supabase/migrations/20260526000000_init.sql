-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Turn on RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to profiles
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK ((SELECT auth.uid()) = id);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING ((SELECT auth.uid()) = id);

-- Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  price TEXT NOT NULL,
  image TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  area TEXT NOT NULL,
  description TEXT NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  gallery TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Turn on RLS for properties
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Allow public read access to properties
CREATE POLICY "Public properties are viewable by everyone." ON public.properties FOR SELECT USING (true);
CREATE POLICY "Admins can insert properties" ON public.properties FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update properties" ON public.properties FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete properties" ON public.properties FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Trigger to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert Mock Data
INSERT INTO public.properties (title, location, price, image, type, status, bedrooms, bathrooms, area, description, amenities, gallery)
VALUES 
('Modern Family Home', 'Prime residential area', '₹ 85 Lakh', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'House', 'Ready to Move', 3, 2, '1 Garage', 'A beautiful modern family home situated in a prime residential area. Features spacious rooms and contemporary finishing.', ARRAY['1 Garage', 'Spacious Garden', 'Modern Kitchen'], ARRAY['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80']),
('Minimal Apartment', 'City center', '₹ 52 Lakh', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Apartment', 'Ready to Move', 2, 2, 'Balcony', 'A sleek minimal apartment perfectly located in the city center. Ideal for young professionals.', ARRAY['Balcony', 'City View', 'Security'], ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80']),
('Luxury Villa', 'Gated community', '₹ 2.4 Cr', 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Villa', 'Ready to Move', 4, 4, 'Pool included', 'An expansive luxury villa located in a highly secure gated community. Complete with a private pool and premium fittings.', ARRAY['Pool', 'Security', 'Private Garden'], ARRAY['https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80']),
('Farm House', 'Prime residential area', '₹ 8 Cr', 'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Farmhouse', 'Ready to Move', 3, 2, '1 Garage', 'A grand farm house surrounded by nature, yet close enough to the prime residential area.', ARRAY['Large Open Land', '1 Garage', 'Nature Views'], ARRAY['https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80']),
('Resort''s', 'City center', '₹ 52 Cr', 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Resort', 'Ready to Move', 2, 2, 'Balcony', 'A spectacular resort property offering world-class amenities and incredible city access.', ARRAY['Balcony', 'Premium Services', 'Swimming Pool'], ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80']),
('Commercial Land', 'Gated community', '₹ 50 Lakh', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Land', 'Ready to Move', 4, 4, 'Pool included', 'Premium commercial land within a gated setup. High appreciation potential for business owners.', ARRAY['Pool', 'Gated Setup', 'Security'], ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'])
ON CONFLICT DO NOTHING;
