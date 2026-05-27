-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Categorías de servicio
CREATE TABLE IF NOT EXISTS service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Perfiles base (extiende auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT[] DEFAULT ARRAY['client'],
  expo_push_token TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Perfil extendido de prestador
CREATE TABLE IF NOT EXISTS provider_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  business_name TEXT,
  logo_url TEXT,
  bio TEXT,
  years_experience INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  rating_avg NUMERIC(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  coverage_area TEXT DEFAULT 'Playa del Carmen',
  schedule TEXT,
  website TEXT,
  portfolio_urls TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Migration: add new columns to existing tables (run once on production)
-- ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS business_name TEXT;
-- ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS logo_url TEXT;
-- ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS schedule TEXT;
-- ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS website TEXT;

-- Servicios del prestador
CREATE TABLE IF NOT EXISTS provider_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
  price_from NUMERIC(10,2),
  price_unit TEXT DEFAULT 'a convenir',
  UNIQUE(provider_id, category_id)
);

-- Solicitudes de trabajo
CREATE TABLE IF NOT EXISTS job_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES profiles(id),
  category_id UUID NOT NULL REFERENCES service_categories(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  photos TEXT[],
  location TEXT NOT NULL,
  budget_min NUMERIC(10,2),
  budget_max NUMERIC(10,2),
  status TEXT DEFAULT 'open' CHECK (status IN ('open','in_progress','completed','cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Ofertas de prestadores
CREATE TABLE IF NOT EXISTS job_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_request_id UUID NOT NULL REFERENCES job_requests(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES provider_profiles(id),
  price NUMERIC(10,2) NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(job_request_id, provider_id)
);

-- Reservas / trabajos confirmados
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_request_id UUID NOT NULL REFERENCES job_requests(id),
  bid_id UUID REFERENCES job_bids(id),
  client_id UUID NOT NULL REFERENCES profiles(id),
  provider_id UUID NOT NULL REFERENCES provider_profiles(id),
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed','in_progress','completed','disputed','cancelled')),
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Reseñas
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  reviewer_id UUID NOT NULL REFERENCES profiles(id),
  reviewee_id UUID NOT NULL REFERENCES profiles(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(booking_id, reviewer_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_job_requests_client_id ON job_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_job_requests_category_id ON job_requests(category_id);
CREATE INDEX IF NOT EXISTS idx_job_requests_status ON job_requests(status);
CREATE INDEX IF NOT EXISTS idx_job_bids_job_request_id ON job_bids(job_request_id);
CREATE INDEX IF NOT EXISTS idx_job_bids_provider_id ON job_bids(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider_id ON bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_provider_services_provider_id ON provider_services(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_services_category_id ON provider_services(category_id);

-- Trigger: crear profile al registrarse
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Trigger: actualizar rating_avg en provider_profiles al insertar review
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
DECLARE
  v_provider_id UUID;
BEGIN
  SELECT b.provider_id INTO v_provider_id
  FROM bookings b WHERE b.id = NEW.booking_id;

  UPDATE provider_profiles
  SET
    rating_avg = (
      SELECT AVG(r.rating)::NUMERIC(3,2)
      FROM reviews r
      JOIN bookings b ON b.id = r.booking_id
      WHERE b.provider_id = v_provider_id
        AND r.reviewee_id = (SELECT user_id FROM provider_profiles WHERE id = v_provider_id)
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM reviews r
      JOIN bookings b ON b.id = r.booking_id
      WHERE b.provider_id = v_provider_id
    )
  WHERE id = v_provider_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_review_inserted ON reviews;
CREATE TRIGGER on_review_inserted
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_provider_rating();

-- Seed: categorías de servicio
INSERT INTO service_categories (name, slug, icon, description) VALUES
  ('Plomería', 'plomeria', '🔧', 'Reparación de tuberías, fugas, instalaciones sanitarias'),
  ('Electricidad', 'electricidad', '⚡', 'Instalaciones eléctricas, cableado, interruptores'),
  ('Pintura', 'pintura', '🎨', 'Pintura interior y exterior, acabados decorativos'),
  ('Jardinería', 'jardineria', '🌿', 'Poda, mantenimiento de jardines y áreas verdes'),
  ('Limpieza de Albercas', 'albercas', '🏊', 'Mantenimiento y limpieza de piscinas'),
  ('Limpieza del Hogar', 'limpieza', '🧹', 'Limpieza general, profunda y post-obra'),
  ('Carpintería', 'carpinteria', '🪚', 'Muebles, closets, puertas, restauración'),
  ('Cerrajería', 'cerrajeria', '🔑', 'Apertura, cambio y reparación de cerraduras'),
  ('Gas y Gasodomésticos', 'gas', '🔥', 'Instalación y reparación de equipos de gas'),
  ('Aire Acondicionado', 'aire-acondicionado', '❄️', 'Instalación, mantenimiento y reparación de minisplits'),
  ('Albañilería', 'albanileria', '🧱', 'Construcción, remodelación, trabajos de concreto'),
  ('Fumigación', 'fumigacion', '🪲', 'Control de plagas, cucarachas, termitas'),
  ('Mudanzas', 'mudanzas', '📦', 'Carga, descarga y traslado de muebles'),
  ('Herrería', 'herreria', '⚙️', 'Rejas, portones, estructuras metálicas'),
  ('Impermeabilización', 'impermeabilizacion', '💧', 'Techos, azoteas, muros, impermeabilizante')
ON CONFLICT (slug) DO NOTHING;

-- RLS Policies
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- service_categories: solo lectura para todos
DROP POLICY IF EXISTS "Categorías solo lectura" ON service_categories;
CREATE POLICY "Categorías solo lectura" ON service_categories FOR SELECT USING (true);

-- profiles: lectura pública, escritura solo del dueño
DROP POLICY IF EXISTS "Profiles públicos para lectura" ON profiles;
CREATE POLICY "Profiles públicos para lectura" ON profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Usuario edita su propio perfil" ON profiles;
CREATE POLICY "Usuario edita su propio perfil" ON profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Usuario inserta su propio perfil" ON profiles;
CREATE POLICY "Usuario inserta su propio perfil" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- provider_profiles: lectura pública, escritura solo del dueño
DROP POLICY IF EXISTS "Provider profiles públicos" ON provider_profiles;
CREATE POLICY "Provider profiles públicos" ON provider_profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Provider edita su perfil" ON provider_profiles;
CREATE POLICY "Provider edita su perfil" ON provider_profiles FOR ALL USING (user_id = auth.uid());

-- provider_services: lectura pública, escritura del dueño
DROP POLICY IF EXISTS "Provider services públicos" ON provider_services;
CREATE POLICY "Provider services públicos" ON provider_services FOR SELECT USING (true);
DROP POLICY IF EXISTS "Provider gestiona sus servicios" ON provider_services;
CREATE POLICY "Provider gestiona sus servicios" ON provider_services
  FOR ALL USING (provider_id IN (SELECT id FROM provider_profiles WHERE user_id = auth.uid()));

-- job_requests
DROP POLICY IF EXISTS "Cliente ve sus solicitudes" ON job_requests;
CREATE POLICY "Cliente ve sus solicitudes" ON job_requests
  FOR SELECT USING (client_id = auth.uid() OR status = 'open');
DROP POLICY IF EXISTS "Cliente crea solicitudes" ON job_requests;
CREATE POLICY "Cliente crea solicitudes" ON job_requests
  FOR INSERT WITH CHECK (client_id = auth.uid());
DROP POLICY IF EXISTS "Cliente actualiza sus solicitudes" ON job_requests;
CREATE POLICY "Cliente actualiza sus solicitudes" ON job_requests
  FOR UPDATE USING (client_id = auth.uid());

-- job_bids
DROP POLICY IF EXISTS "Ver ofertas relevantes" ON job_bids;
CREATE POLICY "Ver ofertas relevantes" ON job_bids
  FOR SELECT USING (
    provider_id IN (SELECT id FROM provider_profiles WHERE user_id = auth.uid())
    OR job_request_id IN (SELECT id FROM job_requests WHERE client_id = auth.uid())
  );
DROP POLICY IF EXISTS "Prestador crea ofertas" ON job_bids;
CREATE POLICY "Prestador crea ofertas" ON job_bids
  FOR INSERT WITH CHECK (
    provider_id IN (SELECT id FROM provider_profiles WHERE user_id = auth.uid())
  );

-- bookings
DROP POLICY IF EXISTS "Ver reservas propias" ON bookings;
CREATE POLICY "Ver reservas propias" ON bookings
  FOR SELECT USING (
    client_id = auth.uid()
    OR provider_id IN (SELECT id FROM provider_profiles WHERE user_id = auth.uid())
  );

-- reviews
DROP POLICY IF EXISTS "Reviews públicas" ON reviews;
CREATE POLICY "Reviews públicas" ON reviews FOR SELECT USING (true);
DROP POLICY IF EXISTS "Reviewer crea su review" ON reviews;
CREATE POLICY "Reviewer crea su review" ON reviews
  FOR INSERT WITH CHECK (reviewer_id = auth.uid());
