-- supabase/migrations/20260526000001_admin_user.sql

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Update the handle_new_user function to automatically make naman.adlakha3@gmail.com an admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email = 'naman.adlakha3@gmail.com' THEN
    INSERT INTO public.profiles (id, email, role)
    VALUES (NEW.id, NEW.email, 'admin');
  ELSE
    INSERT INTO public.profiles (id, email, role)
    VALUES (NEW.id, NEW.email, 'user');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update the existing profile if it's already created
UPDATE public.profiles SET role = 'admin' WHERE email = 'naman.adlakha3@gmail.com';
