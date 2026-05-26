# OficiosPlaya — Blueprint

> Generado por The Architect el 2026-05-26
> Archetype: Mobile App — Marketplace de Dos Lados

---

## 1. Visión del Proyecto

### Descripción
OficiosPlaya es una aplicación móvil para iOS y Android que conecta a personas que necesitan servicios del hogar y oficios especializados en Playa del Carmen con prestadores de servicios verificados y calificados. Funciona como un marketplace de dos lados: los clientes pueden buscar y contactar directamente a prestadores, o publicar una solicitud de trabajo y recibir ofertas. Los prestadores crean perfiles, listan sus servicios y compiten por trabajos.

El problema central que resuelve es la dificultad real de encontrar mano de obra confiable en Playa del Carmen. La app actúa como un directorio vivo y confiable, respaldado por calificaciones reales de usuarios y un proceso de moderación manual.

### Objetivos
- Crear la red de prestadores de servicios más confiable de Playa del Carmen
- Reducir el tiempo promedio que tarda un cliente en encontrar un prestador calificado
- Dar visibilidad a prestadores informales de calidad que hoy dependen del boca a boca
- Construir una base de usuarios verificados antes de activar monetización por comisiones

### Métricas de Éxito (primeros 6 meses)
- 200+ prestadores registrados y verificados
- 500+ clientes activos
- 4.0+ rating promedio de la app en stores
- 50+ trabajos completados y calificados por mes

---

## 2. Tech Stack

| Capa | Tecnología | Por qué |
|------|-----------|---------|
| App Framework | React Native + Expo SDK 52 | iOS + Android desde un solo código TypeScript; sin ejectar |
| Lenguaje | TypeScript (strict) | Tipos en toda la app = menos bugs en producción |
| Navegación | Expo Router v4 | File-based routing, deep links nativos, gestión de layouts limpia |
| Estilos | NativeWind v4 (Tailwind) | Velocidad de desarrollo, tokens consistentes, responsive nativo |
| Estado servidor | TanStack Query v5 | Caché, refetch automático, optimistic updates |
| Estado UI | Zustand v4 | Estado cliente liviano (modales, preferencias, sesión local) |
| Backend / DB | Supabase | Auth + PostgreSQL + Storage + Edge Functions + Realtime en un servicio |
| Auth | Supabase Auth | Integrado al DB, RLS policies, soporta email + teléfono + Google |
| Almacenamiento | Supabase Storage | Fotos de perfil y portfolio de prestadores |
| Mapas | react-native-maps + Google Maps API | Mostrar ubicación de trabajos y zona de cobertura |
| Push Notifications | Expo Notifications + Expo Push API | Notificaciones para nuevas solicitudes, ofertas y confirmaciones |
| Build | EAS Build (Expo Application Services) | Compilar y firmar binarios para App Store y Play Store |
| Deploy | EAS Submit | Subir automáticamente a TestFlight y Google Play Console |
| OTA Updates | EAS Update | Parches de JS sin pasar por revisión de stores |
| Admin Panel | Next.js 15 App Router | Panel web liviano para moderar prestadores; misma base Supabase |
| Package Manager | npm (Expo default) | Compatibilidad garantizada con Expo SDK |

---

## 3. Estructura de Directorios

```
oficios-playa/
├── app/                          # Expo Router — toda la navegación
│   ├── _layout.tsx               # Root layout: auth check, providers globales
│   ├── +not-found.tsx            # Pantalla 404
│   ├── (auth)/                   # Grupo sin tab bar
│   │   ├── _layout.tsx
│   │   ├── login.tsx             # Login email/teléfono + Google
│   │   ├── register.tsx          # Registro
│   │   └── onboarding.tsx        # Selección de rol + completar perfil
│   ├── (client)/                 # Tab bar para clientes
│   │   ├── _layout.tsx           # Tab bar: Inicio | Explorar | Solicitudes | Perfil
│   │   ├── home.tsx              # Grid de categorías + solicitudes recientes
│   │   ├── explore.tsx           # Listado y filtro de prestadores
│   │   ├── requests.tsx          # Mis solicitudes activas e historial
│   │   └── profile.tsx           # Perfil del cliente
│   ├── (provider)/               # Tab bar para prestadores
│   │   ├── _layout.tsx           # Tab bar: Inicio | Trabajos | Reservas | Perfil
│   │   ├── home.tsx              # Dashboard: trabajos disponibles en mi categoría
│   │   ├── jobs.tsx              # Solicitudes abiertas en mis categorías
│   │   ├── bookings.tsx          # Mis trabajos confirmados y activos
│   │   └── profile.tsx           # Mi perfil público + estadísticas
│   └── (modals)/                 # Pantallas modales (stack)
│       ├── provider/[id].tsx     # Perfil detallado de un prestador
│       ├── job/[id].tsx          # Detalle de solicitud + ofertas
│       ├── booking/[id].tsx      # Detalle de reserva + flujo de review
│       ├── new-request.tsx       # Formulario nueva solicitud (cliente)
│       └── new-bid.tsx           # Formulario nueva oferta (prestador)
│
├── components/
│   ├── ui/                       # Primitivos reutilizables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   ├── Rating.tsx
│   │   ├── Skeleton.tsx
│   │   └── EmptyState.tsx
│   ├── provider/                 # Componentes del dominio prestador
│   │   ├── ProviderCard.tsx      # Card en listado de exploración
│   │   ├── ProviderHeader.tsx    # Header del perfil
│   │   ├── ServicesList.tsx      # Servicios que ofrece
│   │   └── ReviewsList.tsx       # Reseñas recibidas
│   ├── job/                      # Componentes del dominio solicitudes
│   │   ├── JobRequestCard.tsx
│   │   ├── BidCard.tsx
│   │   └── JobStatusBadge.tsx
│   └── shared/
│       ├── CategoryGrid.tsx      # Grid de categorías en home
│       ├── WhatsAppButton.tsx    # Botón "Contactar por WhatsApp"
│       └── NotificationBell.tsx
│
├── hooks/
│   ├── useAuth.ts                # Estado de sesión Supabase
│   ├── useProviders.ts           # TanStack Query: listado y filtros
│   ├── useJobRequests.ts         # TanStack Query: solicitudes
│   ├── useBids.ts                # TanStack Query: ofertas
│   ├── useBookings.ts            # TanStack Query: reservas
│   └── useNotifications.ts      # Expo Notifications
│
├── lib/
│   ├── supabase.ts               # Supabase client (con SecureStore)
│   ├── notifications.ts          # Expo Push helpers
│   └── whatsapp.ts               # Helpers para deep link WhatsApp
│
├── stores/
│   ├── authStore.ts              # Zustand: perfil local, rol activo
│   └── uiStore.ts                # Zustand: modales, filtros activos
│
├── constants/
│   ├── Colors.ts                 # Tokens de color
│   ├── Typography.ts             # Escalas de fuente Poppins
│   ├── Spacing.ts                # Escala de espaciado
│   └── Categories.ts             # 15 categorías con slugs e íconos
│
├── types/
│   └── index.ts                  # Tipos TypeScript compartidos
│
├── assets/
│   ├── images/                   # App icon, splash, onboarding illustrations
│   └── fonts/                    # Poppins (Regular, Medium, SemiBold, Bold)
│
├── app.json                      # Configuración Expo
├── eas.json                      # Perfiles de build EAS
├── tailwind.config.js            # Tema NativeWind con colores custom
└── tsconfig.json                 # TypeScript strict

oficios-playa-admin/              # Panel admin separado (Next.js)
├── app/
│   ├── layout.tsx
│   ├── page.tsx                  # Dashboard resumen
│   ├── providers/page.tsx        # Aprobar/rechazar prestadores
│   └── reports/page.tsx          # Reseñas reportadas
├── lib/
│   └── supabase-admin.ts         # Supabase con service_role key
└── ...
```

---

## 4. Modelo de Datos

### Entidades

**service_categories** — Categorías de servicio (seed fijo)
| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID PK | gen_random_uuid() |
| name | TEXT | "Plomería", "Pintura", etc. |
| slug | TEXT UNIQUE | "plomeria", "pintura" |
| icon | TEXT | Nombre de ícono o emoji |
| description | TEXT | Descripción corta |
| created_at | TIMESTAMPTZ | now() |

**profiles** — Perfil base de usuario (extiende auth.users)
| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID PK | FK → auth.users(id) |
| full_name | TEXT | Nombre completo |
| phone | TEXT | WhatsApp del usuario |
| avatar_url | TEXT | URL en Supabase Storage |
| role | TEXT[] | ['client'] o ['provider'] o ['client','provider'] |
| expo_push_token | TEXT | Token para push notifications |
| created_at | TIMESTAMPTZ | now() |
| updated_at | TIMESTAMPTZ | now() |

**provider_profiles** — Perfil extendido del prestador
| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID PK | |
| user_id | UUID UNIQUE FK | → profiles(id) |
| bio | TEXT | Descripción personal |
| years_experience | INTEGER | Default 0 |
| verified | BOOLEAN | Default false — admin activa |
| rating_avg | NUMERIC(3,2) | Calculado al guardar reviews |
| total_reviews | INTEGER | Contador |
| coverage_area | TEXT | Default "Playa del Carmen" |
| portfolio_urls | TEXT[] | URLs de fotos de trabajos anteriores |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

**provider_services** — Qué categorías ofrece cada prestador
| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID PK | |
| provider_id | UUID FK | → provider_profiles(id) |
| category_id | UUID FK | → service_categories(id) |
| price_from | NUMERIC(10,2) | Precio mínimo referencial |
| price_unit | TEXT | 'por trabajo' / 'por hora' / 'a convenir' |
| UNIQUE | (provider_id, category_id) | Un prestador, una vez por categoría |

**job_requests** — Solicitudes publicadas por clientes
| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID PK | |
| client_id | UUID FK | → profiles(id) |
| category_id | UUID FK | → service_categories(id) |
| title | TEXT | Ej: "Arreglar fuga en cocina" |
| description | TEXT | Detalle del trabajo |
| photos | TEXT[] | URLs en Supabase Storage |
| location | TEXT | Colonia/zona en Playa del Carmen |
| budget_min | NUMERIC(10,2) | Opcional |
| budget_max | NUMERIC(10,2) | Opcional |
| status | TEXT | open / in_progress / completed / cancelled |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |
| deleted_at | TIMESTAMPTZ | Soft delete |

**job_bids** — Ofertas de prestadores a solicitudes
| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID PK | |
| job_request_id | UUID FK | → job_requests(id) |
| provider_id | UUID FK | → provider_profiles(id) |
| price | NUMERIC(10,2) | Precio ofertado |
| message | TEXT | Mensaje al cliente |
| status | TEXT | pending / accepted / rejected |
| created_at | TIMESTAMPTZ | |
| UNIQUE | (job_request_id, provider_id) | Un prestador oferta una vez por solicitud |

**bookings** — Trabajo confirmado entre cliente y prestador
| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID PK | |
| job_request_id | UUID FK | → job_requests(id) |
| bid_id | UUID FK | → job_bids(id) (nullable si fue contacto directo) |
| client_id | UUID FK | → profiles(id) |
| provider_id | UUID FK | → provider_profiles(id) |
| status | TEXT | confirmed / in_progress / completed / disputed / cancelled |
| scheduled_at | TIMESTAMPTZ | Fecha acordada |
| completed_at | TIMESTAMPTZ | Fecha real de finalización |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

**reviews** — Calificaciones post-trabajo
| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID PK | |
| booking_id | UUID FK | → bookings(id) |
| reviewer_id | UUID FK | → profiles(id) |
| reviewee_id | UUID FK | → profiles(id) |
| rating | INTEGER | 1-5, CHECK constraint |
| comment | TEXT | Texto de la reseña |
| created_at | TIMESTAMPTZ | |
| UNIQUE | (booking_id, reviewer_id) | Un review por parte por reserva |

### Relaciones
- `profiles` 1→1 `provider_profiles` (solo si tiene rol provider)
- `provider_profiles` N→N `service_categories` via `provider_services`
- `profiles` (client) 1→N `job_requests`
- `job_requests` 1→N `job_bids`
- `job_bids` (accepted) 1→1 `bookings`
- `bookings` 1→N `reviews` (máx 2: cliente califica prestador y viceversa)

### Schema SQL

```sql
-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Categorías de servicio
CREATE TABLE service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Perfiles base (extiende auth.users)
CREATE TABLE profiles (
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
CREATE TABLE provider_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  bio TEXT,
  years_experience INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  rating_avg NUMERIC(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  coverage_area TEXT DEFAULT 'Playa del Carmen',
  portfolio_urls TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Servicios del prestador
CREATE TABLE provider_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
  price_from NUMERIC(10,2),
  price_unit TEXT DEFAULT 'a convenir',
  UNIQUE(provider_id, category_id)
);

-- Solicitudes de trabajo
CREATE TABLE job_requests (
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
CREATE TABLE job_bids (
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
CREATE TABLE bookings (
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
CREATE TABLE reviews (
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
CREATE INDEX idx_job_requests_client_id ON job_requests(client_id);
CREATE INDEX idx_job_requests_category_id ON job_requests(category_id);
CREATE INDEX idx_job_requests_status ON job_requests(status);
CREATE INDEX idx_job_bids_job_request_id ON job_bids(job_request_id);
CREATE INDEX idx_job_bids_provider_id ON job_bids(provider_id);
CREATE INDEX idx_bookings_client_id ON bookings(client_id);
CREATE INDEX idx_bookings_provider_id ON bookings(provider_id);
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX idx_provider_services_provider_id ON provider_services(provider_id);
CREATE INDEX idx_provider_services_category_id ON provider_services(category_id);

-- Trigger: crear profile al registrarse
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
  ('Impermeabilización', 'impermeabilizacion', '💧', 'Techos, azoteas, muros, impermeabilizante');

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- profiles: cada usuario ve y edita solo su perfil; todos pueden ver perfiles públicos
CREATE POLICY "Profiles públicos para lectura" ON profiles FOR SELECT USING (true);
CREATE POLICY "Usuario edita su propio perfil" ON profiles FOR UPDATE USING (auth.uid() = id);

-- provider_profiles: lectura pública, escritura solo del dueño
CREATE POLICY "Provider profiles públicos" ON provider_profiles FOR SELECT USING (true);
CREATE POLICY "Provider edita su perfil" ON provider_profiles
  FOR ALL USING (user_id = auth.uid());

-- provider_services: lectura pública, escritura del dueño
CREATE POLICY "Provider services públicos" ON provider_services FOR SELECT USING (true);
CREATE POLICY "Provider gestiona sus servicios" ON provider_services
  FOR ALL USING (provider_id IN (SELECT id FROM provider_profiles WHERE user_id = auth.uid()));

-- service_categories: solo lectura para todos
CREATE POLICY "Categorías solo lectura" ON service_categories FOR SELECT USING (true);

-- job_requests: cliente ve las suyas; prestadores ven las abiertas en sus categorías
CREATE POLICY "Cliente ve sus solicitudes" ON job_requests
  FOR SELECT USING (client_id = auth.uid() OR status = 'open');
CREATE POLICY "Cliente crea solicitudes" ON job_requests
  FOR INSERT WITH CHECK (client_id = auth.uid());
CREATE POLICY "Cliente actualiza sus solicitudes" ON job_requests
  FOR UPDATE USING (client_id = auth.uid());

-- job_bids: prestador ve y crea sus ofertas; cliente ve las de sus solicitudes
CREATE POLICY "Ver ofertas relevantes" ON job_bids
  FOR SELECT USING (
    provider_id IN (SELECT id FROM provider_profiles WHERE user_id = auth.uid())
    OR job_request_id IN (SELECT id FROM job_requests WHERE client_id = auth.uid())
  );
CREATE POLICY "Prestador crea ofertas" ON job_bids
  FOR INSERT WITH CHECK (
    provider_id IN (SELECT id FROM provider_profiles WHERE user_id = auth.uid())
  );

-- bookings: cliente y prestador ven las suyas
CREATE POLICY "Ver reservas propias" ON bookings
  FOR SELECT USING (
    client_id = auth.uid()
    OR provider_id IN (SELECT id FROM provider_profiles WHERE user_id = auth.uid())
  );

-- reviews: lectura pública; escritura solo del reviewer
CREATE POLICY "Reviews públicas" ON reviews FOR SELECT USING (true);
CREATE POLICY "Reviewer crea su review" ON reviews
  FOR INSERT WITH CHECK (reviewer_id = auth.uid());
```

---

## 5. Edge Functions (Supabase)

| Función | Trigger | Qué hace |
|---------|---------|---------|
| `send-push-notification` | Llamada manual desde cliente | Envía push via Expo Push API al token del usuario |
| `accept-bid` | POST desde cliente | Acepta oferta → crea booking → notifica prestador → cierra otras ofertas |
| `complete-booking` | POST desde cliente | Marca booking como completed → pide review a ambas partes |
| `notify-providers-new-job` | Database trigger en job_requests | Notifica a todos los prestadores verificados de esa categoría |

### Ejemplo: `accept-bid` (pseudocódigo)
```typescript
// supabase/functions/accept-bid/index.ts
// 1. Verificar que el caller es el client_id de la job_request
// 2. UPDATE job_bids SET status='accepted' WHERE id = bid_id
// 3. UPDATE job_bids SET status='rejected' WHERE job_request_id = ... AND id != bid_id
// 4. INSERT INTO bookings (job_request_id, bid_id, client_id, provider_id, status='confirmed')
// 5. UPDATE job_requests SET status='in_progress' WHERE id = job_request_id
// 6. Llamar send-push-notification al prestador: "¡Tu oferta fue aceptada!"
```

---

## 6. Arquitectura de Pantallas

### Rutas y Pantallas

| Ruta | Pantalla | Descripción |
|------|---------|-------------|
| `/(auth)/login` | Login | Email/contraseña + Google OAuth |
| `/(auth)/register` | Registro | Nombre, email, contraseña, teléfono |
| `/(auth)/onboarding` | Onboarding | Selección de rol + foto de perfil |
| `/(client)/home` | Inicio Cliente | Grid de 15 categorías + solicitudes recientes del usuario |
| `/(client)/explore` | Explorar | Lista de prestadores con filtro por categoría / zona / rating |
| `/(client)/requests` | Mis Solicitudes | Solicitudes activas con contador de ofertas recibidas |
| `/(client)/profile` | Perfil Cliente | Info personal, historial, configuración |
| `/(provider)/home` | Inicio Prestador | Dashboard: trabajos disponibles en mis categorías hoy |
| `/(provider)/jobs` | Solicitudes Abiertas | Solicitudes activas de clientes en mis categorías |
| `/(provider)/bookings` | Mis Reservas | Trabajos confirmados y activos |
| `/(provider)/profile` | Mi Perfil | Perfil público, servicios, portfolio, rating |
| `/(modals)/provider/[id]` | Perfil Prestador | Detalle completo: bio, servicios, reviews, botón WhatsApp |
| `/(modals)/job/[id]` | Detalle Solicitud | Descripción + fotos + ofertas recibidas (cliente) / botón ofertar (prestador) |
| `/(modals)/booking/[id]` | Detalle Reserva | Estado, datos de contacto, marcar completado, review |
| `/(modals)/new-request` | Nueva Solicitud | Formulario: categoría, título, descripción, fotos, zona, presupuesto |
| `/(modals)/new-bid` | Nueva Oferta | Precio, mensaje al cliente |

### Jerarquía de Componentes — Home Cliente

```
app/(client)/home.tsx
├── SafeAreaView
├── HomeHeader (saludo + avatar + notificaciones)
├── SearchBar (navega a explore con query)
├── CategoryGrid
│   └── CategoryCard × 15 (ícono, nombre, tap → explore filtrado)
├── SectionHeader "Mis solicitudes recientes"
└── FlatList<JobRequestCard>
    └── JobRequestCard
        ├── CategoryBadge
        ├── Title + Location
        ├── JobStatusBadge (open / in_progress)
        └── BidCountBadge ("3 ofertas")
```

### Jerarquía de Componentes — Perfil de Prestador (modal)

```
app/(modals)/provider/[id].tsx
├── ScrollView
├── ProviderHeader
│   ├── Avatar (circular, con VerifiedBadge si verified=true)
│   ├── FullName + RatingStars + TotalReviews
│   └── CoverageArea + YearsExperience
├── WhatsAppButton (abre wa.me/52{phone})
├── SectionHeader "Servicios"
├── ServicesList
│   └── ServiceRow × n (categoría + precio referencial)
├── SectionHeader "Portfolio"
├── PortfolioGrid (imágenes de trabajos anteriores)
├── SectionHeader "Reseñas"
└── ReviewsList
    └── ReviewCard × n (avatar reviewer + rating + comentario + fecha)
```

### Gestión de Estado

- **TanStack Query**: todas las queries a Supabase (providers, jobs, bids, bookings, reviews). Caché de 5 min, revalidación en foco de pantalla.
- **Zustand `authStore`**: perfil del usuario logueado, rol activo (client/provider cuando tiene los dos), flag `isOnboarded`.
- **Zustand `uiStore`**: filtros activos en explore (categoría, zona), estado de modales.
- **Supabase Realtime**: suscripción a `job_bids` en la pantalla de detalle de solicitud para mostrar nuevas ofertas en tiempo real.

---

## 7. Sistema de Diseño

### Colores

| Token | Hex | Uso |
|-------|-----|-----|
| `primary` | `#0891B2` | Botones principales, íconos activos, links |
| `primary-light` | `#0EA5E9` | Gradientes, hover states |
| `secondary` | `#EA580C` | CTAs secundarios, badges de nueva oferta |
| `accent` | `#059669` | Verificado, completado, ratings positivos |
| `background` | `#F0F9FF` | Fondo general de la app |
| `surface` | `#FFFFFF` | Cards, inputs, modales |
| `text-primary` | `#0C4A6E` | Títulos y texto principal |
| `text-secondary` | `#64748B` | Subtítulos, metadata, fechas |
| `border` | `#E2E8F0` | Bordes de cards e inputs |
| `danger` | `#EF4444` | Errores, alertas, cancelar |
| `warning` | `#F59E0B` | Estrellas de rating |
| `gradient-hero` | `#0891B2 → #0EA5E9` | Header de home, banners |

### Tipografía

| Rol | Fuente | Tamaño | Peso |
|-----|--------|--------|------|
| Display / Hero | Poppins | 28-32px | 700 Bold |
| H1 | Poppins | 22-24px | 700 Bold |
| H2 | Poppins | 18-20px | 600 SemiBold |
| H3 / Label | Poppins | 15-16px | 600 SemiBold |
| Body | Poppins | 14-15px | 400 Regular |
| Caption / Meta | Poppins | 12px | 400 Regular |
| Botones | Poppins | 15-16px | 600 SemiBold |

### Espaciado y Layout

- Base: 4px — escala: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64
- Border radius: 8px inputs, 12px botones, 16px cards, 999px pills y avatares
- Sombra estándar: `shadow-sm` (elevation 2) en cards
- Padding horizontal de pantalla: 16px
- Tab bar: 64px de alto, con labels debajo de íconos

### Estilo General
Redondeado, colorido y espacioso. Íconos de Expo Vector Icons (Ionicons). Gradiente azul en headers. Cards blancas con sombra suave. Botones con padding generoso (py-4). Avatar circular con ring de color `primary` cuando verificado. Animaciones de entrada con `react-native-reanimated` (FadeInDown para listas).

### Configuración NativeWind (tailwind.config.js)

```js
module.exports = {
  content: ['./app/**/*.tsx', './components/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#0891B2', light: '#0EA5E9' },
        secondary: '#EA580C',
        accent: '#059669',
        background: '#F0F9FF',
        surface: '#FFFFFF',
        'text-primary': '#0C4A6E',
        'text-secondary': '#64748B',
        danger: '#EF4444',
        warning: '#F59E0B',
      },
      fontFamily: {
        'poppins': ['Poppins_400Regular'],
        'poppins-medium': ['Poppins_500Medium'],
        'poppins-semibold': ['Poppins_600SemiBold'],
        'poppins-bold': ['Poppins_700Bold'],
      },
    },
  },
  plugins: [],
}
```

---

## 8. Autenticación y Autorización

### Flujo de Auth

```
1. App abre → root _layout.tsx verifica sesión Supabase (SecureStore)
2. Sin sesión → redirige a /(auth)/login
3. Login exitoso → verifica si profile.role tiene al menos un valor
   - Sin rol (primera vez) → redirige a /(auth)/onboarding
   - Con rol → redirige a /(client)/home o /(provider)/home según rol principal
4. Onboarding: usuario elige si es Cliente, Prestador, o Ambos
   - Si elige Prestador → flujo extra: crear provider_profile, seleccionar categorías
5. Con sesión activa → Supabase refresca el token automáticamente
```

### Rutas Protegidas

| Grupo | Protección |
|-------|-----------|
| `/(auth)/*` | Solo sin sesión (redirect si ya logueado) |
| `/(client)/*` | Requiere auth + rol 'client' en profile.role |
| `/(provider)/*` | Requiere auth + rol 'provider' en profile.role |
| `/(modals)/*` | Requiere auth |
| `service_categories` | Público (lectura) |
| Perfiles de prestadores | Público (lectura) |

### Roles y Permisos

| Rol | Puede hacer |
|-----|------------|
| `client` | Buscar prestadores, ver perfiles, publicar solicitudes, aceptar ofertas, calificar |
| `provider` | Crear perfil de prestador, ver solicitudes, hacer ofertas, gestionar reservas, calificar |
| `both` | Todo lo anterior, cambia de vista con toggle en la app |
| `admin` (panel web) | Verificar/rechazar prestadores, moderar reseñas |

### Sesión
- JWT almacenado en `expo-secure-store` (encriptado en el dispositivo)
- Supabase SDK maneja el refresh automático
- En `lib/supabase.ts`: configurar `storage` con `ExpoSecureStoreAdapter`
- RLS policies en todas las tablas garantizan que cada usuario solo accede a sus datos

---

## 9. Orden de Construcción

**ESTA ES LA SECCIÓN MÁS CRÍTICA. Seguir en orden estricto.**

---

**Paso 1: Scaffolding del Proyecto**

```bash
npx create-expo-app@latest oficios-playa --template blank-typescript
cd oficios-playa
npx expo install expo-router expo-constants expo-linking expo-status-bar
npx expo install nativewind tailwindcss
npx expo install @expo-google-fonts/poppins expo-font
npx expo install expo-secure-store
```

- Configurar `app.json`: name="OficiosPlaya", slug="oficios-playa", bundleIdentifier="com.oficiosplaya.app"
- Configurar Expo Router como entry point en `package.json` (`"main": "expo-router/entry"`)
- Crear `tailwind.config.js` con los colores y fuentes del sistema de diseño
- Agregar `babel.config.js` con preset nativewind
- Crear `constants/Colors.ts`, `constants/Typography.ts`, `constants/Spacing.ts`

**Entregable:** App vacía que bootea en simulador iOS y Android.

---

**Paso 2: Supabase Setup**

- Crear proyecto en supabase.com: nombre "oficios-playa", región "us-east-1" (más cercana a México)
- Guardar `SUPABASE_URL` y `SUPABASE_ANON_KEY` en `.env.local`
- Instalar: `npm install @supabase/supabase-js`
- Crear `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
}

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { storage: ExpoSecureStoreAdapter, autoRefreshToken: true, persistSession: true } }
)
```

**Entregable:** Cliente Supabase configurado y conectado.

---

**Paso 3: Schema de Base de Datos**

- En el SQL Editor de Supabase, ejecutar todo el schema del Paso 4 de este blueprint (en orden: extensiones → tablas → índices → triggers → seed → RLS policies)
- Verificar en Table Editor que las 8 tablas existen y la seed de 15 categorías está cargada
- Habilitar Google OAuth en Supabase Auth → Providers → Google (configurar OAuth app en Google Cloud Console)

**Entregable:** Base de datos lista con schema completo y datos iniciales.

---

**Paso 4: Flujo de Auth**

- Crear `app/_layout.tsx`: verificar sesión, redirigir según estado
- Crear `app/(auth)/_layout.tsx`: stack navigator sin tab bar
- Crear `app/(auth)/login.tsx`: formulario email + contraseña + botón Google OAuth
- Crear `app/(auth)/register.tsx`: nombre, email, teléfono, contraseña
- Crear `app/(auth)/onboarding.tsx`: selección de rol (cards grandes: "Busco servicios" / "Ofrezco servicios" / "Ambos") + foto de perfil
- Crear `hooks/useAuth.ts`: expone `user`, `profile`, `signIn`, `signOut`, `signUp`
- Crear `stores/authStore.ts`: Zustand con `profile` y `activeRole`

**Entregable:** Usuario puede registrarse, hacer onboarding y la app lo lleva a la pantalla correcta.

---

**Paso 5: Componentes UI Base**

Crear todos los primitivos en `components/ui/`:

- `Button.tsx` — variantes: primary, secondary, ghost, danger; estados: loading, disabled
- `Input.tsx` — con label, error state, íconos opcionales
- `Card.tsx` — fondo blanco, sombra sm, radius 16
- `Badge.tsx` — variantes: primary, secondary, accent, warning, danger
- `Avatar.tsx` — circular, con VerifiedBadge opcional, fallback con iniciales
- `Rating.tsx` — 5 estrellas (expo-vector-icons), muestra número de reviews
- `Skeleton.tsx` — placeholder animado para loading states
- `EmptyState.tsx` — ilustración + título + subtítulo + CTA opcional

**Entregable:** Storybook mental — cada componente funciona en aislamiento.

---

**Paso 6: Home y Categorías (Cliente)**

- Cargar fuentes Poppins en root layout con `useFonts`
- Crear `app/(client)/_layout.tsx`: tab bar con 4 tabs (Inicio, Explorar, Solicitudes, Perfil)
- Crear `app/(client)/home.tsx`: header con gradiente + grid de categorías + FlatList de solicitudes recientes
- Crear `components/shared/CategoryGrid.tsx` y `components/provider/CategoryCard.tsx`
- Conectar datos reales de `service_categories` vía TanStack Query

**Entregable:** Home del cliente con las 15 categorías funcionando.

---

**Paso 7: Perfiles de Prestadores**

- Crear `app/(client)/explore.tsx`: FlatList de prestadores + filtro por categoría (Pills horizontales) + buscador
- Crear `components/provider/ProviderCard.tsx`: avatar, nombre, rating, categorías principales, precio desde
- Crear `app/(modals)/provider/[id].tsx`: perfil completo — bio, servicios, portfolio (grid de fotos), reseñas
- Crear `components/shared/WhatsAppButton.tsx`:

```typescript
import { Linking } from 'react-native'
const openWhatsApp = (phone: string, name: string) => {
  const msg = encodeURIComponent(`Hola ${name}, te encontré en OficiosPlaya y me interesa tu servicio.`)
  Linking.openURL(`https://wa.me/52${phone}?text=${msg}`)
}
```

- Crear `hooks/useProviders.ts` con filtros por categoría

**Entregable:** Cliente puede explorar prestadores y contactar por WhatsApp.

---

**Paso 8: Flujo de Prestador — Perfil y Onboarding**

- Crear `app/(provider)/_layout.tsx`: tab bar propio del prestador
- Extender `app/(auth)/onboarding.tsx`: si elige prestador → pantalla extra para completar `provider_profiles` (bio, años de experiencia, cobertura) y seleccionar categorías con precios
- Crear `app/(provider)/profile.tsx`: vista del propio perfil público + botón editar
- Crear `hooks/useProviderProfile.ts`

**Entregable:** Prestador puede registrarse con perfil completo.

---

**Paso 9: Solicitudes de Trabajo (Cliente)**

- Crear `app/(modals)/new-request.tsx`:
  - Seleccionar categoría (grid)
  - Título y descripción
  - Subir fotos (expo-image-picker → Supabase Storage)
  - Zona/colonia
  - Presupuesto estimado (opcional)
- Crear `app/(client)/requests.tsx`: lista de mis solicitudes con estado y contador de ofertas
- Crear `app/(modals)/job/[id].tsx` (vista cliente): descripción completa + lista de ofertas recibidas
- Instalar: `npx expo install expo-image-picker`

**Entregable:** Cliente puede publicar una solicitud con fotos.

---

**Paso 10: Sistema de Ofertas (Prestador)**

- Crear `app/(provider)/jobs.tsx`: solicitudes abiertas en mis categorías, ordenadas por fecha
- Crear `app/(modals)/job/[id].tsx` (vista prestador): detalle + formulario de oferta
- Crear `app/(modals)/new-bid.tsx`: precio propuesto + mensaje al cliente
- Suscripción Supabase Realtime en `app/(modals)/job/[id].tsx` para mostrar nuevas ofertas en tiempo real
- Flujo de aceptación: en la vista cliente del job, botón "Aceptar" en cada oferta → llama Edge Function `accept-bid`

**Entregable:** Ciclo completo cliente publica → prestador oferta → cliente acepta.

---

**Paso 11: Reservas y Reseñas**

- Crear `app/(client)/bookings.tsx` y `app/(provider)/bookings.tsx`
- Crear `app/(modals)/booking/[id].tsx`: estado de la reserva, datos de contacto mutuo, botón "Marcar como completado"
- Al marcar completado → llama Edge Function `complete-booking` → ambos reciben notificación para calificar
- Crear flow de review: modal con 5 estrellas + comentario opcional
- Actualizar rating en `provider_profiles` vía trigger SQL del Paso 3

**Entregable:** Ciclo completo hasta calificación final.

---

**Paso 12: Push Notifications**

```bash
npx expo install expo-notifications expo-device
```

- En `app/(auth)/onboarding.tsx`: pedir permiso de notificaciones y guardar token en `profiles.expo_push_token`
- Crear `lib/notifications.ts`: helpers para registrar token y manejar notificaciones recibidas
- Crear Edge Function `send-push-notification`:

```typescript
// Llama Expo Push API: https://exp.host/--/api/v2/push/send
const response = await fetch('https://exp.host/--/api/v2/push/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ to: expoPushToken, title, body, data })
})
```

- Trigger en base de datos: al insertar `job_requests`, notificar a prestadores verificados de esa categoría
- Notificaciones clave: nueva solicitud en mi categoría, nueva oferta recibida, oferta aceptada, trabajo completado, nueva reseña

**Entregable:** Notificaciones push funcionando en dispositivo real.

---

**Paso 13: Panel Admin (Next.js)**

```bash
npx create-next-app@latest oficios-playa-admin --typescript --tailwind --app
cd oficios-playa-admin
npm install @supabase/supabase-js
```

- Conectar con `SUPABASE_SERVICE_ROLE_KEY` (bypass RLS para admin)
- Crear `app/providers/page.tsx`: tabla de prestadores pendientes (`verified = false`) con botones Aprobar / Rechazar
- Aprobar: `UPDATE provider_profiles SET verified = true WHERE id = ...` + push notification al prestador
- Proteger con autenticación básica (middleware Next.js + variable de entorno con credenciales admin)

**Entregable:** Admin puede verificar prestadores desde el navegador.

---

**Paso 14: Polish y Detalles**

- Loading skeletons en todas las listas (Paso 5 ya los definió)
- `expo-haptics`: feedback táctil en botones primarios y acciones importantes
- `react-native-reanimated`: FadeInDown en items de lista, spring en modales
- Empty states con ilustraciones en Explorar (sin prestadores), Solicitudes (sin solicitudes) y Reservas
- Pull-to-refresh en todas las listas (TanStack Query `refetch`)
- Handle de errores: toast notifications con `react-native-toast-message`
- Deep linking: configurar `scheme: "oficiosplaya"` en app.json

**Entregable:** App pulida y con feedback visual completo.

---

**Paso 15: Build y Distribución**

```bash
npm install -g eas-cli
eas login
eas build:configure
```

Configurar `eas.json`:
```json
{
  "build": {
    "development": { "developmentClient": true, "distribution": "internal" },
    "preview": { "distribution": "internal" },
    "production": {}
  }
}
```

- Preparar assets: app icon 1024×1024 (fondo `#0891B2`, ícono blanco), splash screen, screenshots por dispositivo
- Crear cuentas: Apple Developer Program ($99/año), Google Play Console ($25 único)
- `eas build --platform all --profile production`
- `eas submit --platform ios` → TestFlight → revisión App Store
- `eas submit --platform android` → Google Play Console → revisión interna → producción

**Entregable:** App en TestFlight y Play Console lista para beta testing.

---

## 10. Variables de Entorno

### App (React Native / Expo)

| Variable | Descripción | Dónde obtener |
|----------|-------------|---------------|
| `EXPO_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase | supabase.com → Settings → API |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima pública de Supabase | supabase.com → Settings → API |
| `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps para react-native-maps | console.cloud.google.com → Maps SDK |

### Admin Panel (Next.js)

| Variable | Descripción | Dónde obtener |
|----------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Mismo URL de Supabase | supabase.com → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave con permisos admin (NUNCA en la app móvil) | supabase.com → Settings → API |
| `ADMIN_PASSWORD` | Password para el panel admin | Definirlo tú |

### Comandos de setup inicial

```bash
# Clonar e instalar
git clone <repo>
cd oficios-playa
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase y Google Maps

# Ejecutar en simulador
npx expo start

# Ejecutar en dispositivo físico (recomendado para notificaciones)
npx expo start --tunnel

# Build de desarrollo
eas build --profile development --platform ios
```

---

## 11. Dependencias

### Core (app móvil)

| Paquete | Propósito |
|---------|-----------|
| `expo` | Framework base |
| `expo-router` | Navegación file-based |
| `react-native` | Runtime |
| `@supabase/supabase-js` | Cliente backend |
| `expo-secure-store` | Almacenamiento seguro del JWT |
| `nativewind` | Tailwind para React Native |
| `tailwindcss` | Base de NativeWind |
| `@tanstack/react-query` | Server state management |
| `zustand` | Client state management |
| `@expo-google-fonts/poppins` | Tipografía |
| `expo-font` | Carga de fuentes |
| `expo-image-picker` | Seleccionar fotos del dispositivo |
| `expo-notifications` | Push notifications |
| `expo-haptics` | Feedback táctil |
| `react-native-reanimated` | Animaciones |
| `react-native-maps` | Mapas (opcional V1) |
| `react-native-toast-message` | Notificaciones en pantalla |
| `@expo/vector-icons` | Íconos (Ionicons) |

### Dev (app móvil)

| Paquete | Propósito |
|---------|-----------|
| `typescript` | Tipado |
| `@types/react` | Tipos React |
| `eslint` | Linting |
| `prettier` | Formato de código |

---

## 12. Estrategia de Despliegue

### App Móvil
- **Build**: EAS Build — compila en la nube de Expo, no necesita Mac local para iOS
- **iOS**: EAS Submit → TestFlight (beta) → App Store Connect → Revisión Apple (1-3 días)
- **Android**: EAS Submit → Google Play Console → Revisión interna → Producción (horas a días)
- **OTA Updates**: `eas update --branch production` para parches de JS sin nueva revisión

### Admin Panel
- **Hosting**: Vercel (plan gratuito suficiente para comenzar)
- **Deploy**: push a `main` → Vercel deploya automáticamente
- **URL**: `admin.oficiosplaya.com` o subdominio

### Entornos

| Entorno | App | Admin | Base de datos |
|---------|-----|-------|---------------|
| Development | Expo Go / Dev Client | localhost:3000 | Supabase proyecto "dev" |
| Preview | EAS Build internal | Vercel preview | Supabase proyecto "dev" |
| Production | App Store / Play Store | Vercel production | Supabase proyecto "prod" |

---

## 13. Estrategia de Testing

### Tests Unitarios (Vitest)
- Lógica de negocio pura: cálculos de ratings, validaciones de formulario, helpers de WhatsApp
- Hooks de Zustand: stores de auth y UI

### Tests de Integración
- Edge Functions de Supabase: testear `accept-bid` y `complete-booking` con Supabase local (`supabase start`)
- RLS policies: verificar que usuario A no puede ver datos de usuario B

### Tests E2E (Maestro — recomendado sobre Detox para facilidad)
```yaml
# Flujo crítico: cliente publica solicitud
- launchApp
- tapOn: "Busco servicios"          # onboarding
- tapOn: "Plomería"                  # categoría
- tapOn: "Nueva Solicitud"
- inputText: selector: "Título", text: "Fuga en cocina"
- tapOn: "Publicar"
- assertVisible: "Tu solicitud fue publicada"
```

Flujos E2E prioritarios:
1. Registro + onboarding completo
2. Cliente publica solicitud → prestador oferta → cliente acepta
3. Booking completado → ambas partes califican

---

## 14. Skills a Usar Durante la Construcción

| Skill | En qué paso | Para qué |
|-------|-------------|---------|
| `/frontend-design` | Pasos 5, 6, 7 | Generar UI components production-grade con el sistema de diseño definido |
| `/playwright-cli` | Paso 13 (admin) | Testear flujos del panel admin en el navegador |

---

## 15. CLAUDE.md para el Proyecto Target

```markdown
# OficiosPlaya

App móvil iOS + Android que conecta clientes con prestadores de servicios del hogar en Playa del Carmen. Marketplace de dos lados: búsqueda directa de prestadores y sistema de solicitudes + ofertas.

## Comandos

- `npx expo start` — Iniciar servidor de desarrollo
- `npx expo start --tunnel` — Para dispositivo físico (push notifications)
- `eas build --profile development --platform ios` — Build de desarrollo iOS
- `eas build --platform all --profile production` — Build de producción
- `eas update --branch production` — OTA update
- `npx supabase start` — Supabase local para tests

## Tech Stack

React Native + Expo SDK 52 + TypeScript + NativeWind v4 + Supabase + TanStack Query v5 + Zustand + EAS Build

## Arquitectura

### Estructura de Directorios
- `app/` — Expo Router: grupos (auth), (client), (provider), (modals)
- `components/ui/` — Primitivos: Button, Input, Card, Badge, Avatar, Rating, Skeleton
- `components/provider/` — ProviderCard, ProviderHeader, ServicesList, ReviewsList
- `components/job/` — JobRequestCard, BidCard, JobStatusBadge
- `hooks/` — TanStack Query hooks: useProviders, useJobRequests, useBids, useBookings
- `stores/` — Zustand: authStore (perfil, rol activo), uiStore (filtros, modales)
- `lib/supabase.ts` — Cliente Supabase con SecureStore
- `lib/notifications.ts` — Expo Push helpers
- `constants/` — Colors, Typography, Spacing (valores exactos, no vague)

### Flujo de Datos
Usuario → Supabase Auth (JWT en SecureStore) → Supabase DB con RLS → TanStack Query cache → UI

### Patrones Clave
- TanStack Query para TODO lo que viene de Supabase. Nunca fetch manual con useEffect.
- Zustand solo para estado de UI y perfil local. NO duplicar estado del servidor.
- RLS policies en Supabase son la única capa de seguridad del lado del servidor — respetar y no bypassear.
- Acciones importantes (accept-bid, complete-booking) van por Edge Functions, no por queries directas del cliente.

### Roles de Usuario
- `client` → tab group `/(client)/`
- `provider` → tab group `/(provider)/`
- `both` → toggle en la app, puede cambiar de vista
- Admin → panel web Next.js separado, nunca desde la app móvil

## Sistema de Diseño

### Colores
- primary: #0891B2 (Azul Caribe)
- primary-light: #0EA5E9
- secondary: #EA580C (Naranja Sol)
- accent: #059669 (Verde Esmeralda — verificado, completado)
- background: #F0F9FF
- surface: #FFFFFF
- text-primary: #0C4A6E
- text-secondary: #64748B
- danger: #EF4444
- warning: #F59E0B (estrellas)

### Tipografía
- Fuente única: Poppins (Regular 400, Medium 500, SemiBold 600, Bold 700)
- Display: 28-32px Bold | H1: 22px Bold | H2: 18px SemiBold | Body: 14px Regular | Caption: 12px

### Estilo
- Border radius: 8px inputs, 12px botones, 16px cards, 999px pills/avatares
- Sombra: shadow-sm en cards
- Padding horizontal de pantalla: 16px
- Tab bar: 64px, íconos Ionicons

## Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| `EXPO_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Anon key de Supabase |
| `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key |

## Reglas No Negociables

1. **TypeScript strict mode.** Sin `any`. Si no sabés el tipo, buscalo.
2. **TanStack Query para todo el server state.** Sin useEffect + fetch manual para datos de Supabase.
3. **Un componente por archivo. Máx 300 líneas.** Si crece, extraé sub-componentes.
4. **Nunca exponer SUPABASE_SERVICE_ROLE_KEY en la app móvil.** Solo en el admin panel (servidor).
5. **Probar en iOS y Android.** Las diferencias de safe area, teclado y gestos son reales.
6. **RLS policies son obligatorias en toda tabla nueva.** Sin excepción.
7. **El botón de WhatsApp es el mecanismo de contacto V1.** No implementar chat in-app hasta V2.
```

---

## 16. Reglas No Negociables para el Builder

1. **TypeScript strict mode** — `"strict": true` en tsconfig.json. Sin `any` ni `@ts-ignore`.
2. **TanStack Query para server state** — Nunca hacer fetch manual con `useEffect` para datos de Supabase. Toda query va en un hook custom con `useQuery`.
3. **RLS en toda tabla nueva** — Si se agrega una tabla al schema, debe tener policies de RLS activadas antes de usar en producción.
4. **SUPABASE_SERVICE_ROLE_KEY nunca en la app móvil** — Solo en el admin panel Next.js en el servidor. La app móvil solo usa la `anon key`.
5. **Un componente por archivo, máximo 300 líneas** — Si un componente crece, extraer sub-componentes.
6. **Probar en dispositivo físico para push notifications** — Expo Go en simulador no soporta notificaciones reales.
7. **El contacto V1 es WhatsApp** — No implementar chat in-app hasta tener volumen de usuarios que lo justifique.
8. **Seguir el orden de construcción del Paso 9** — Cada paso depende del anterior. No saltear pasos.
9. **Idioma de la UI: Español** — Todos los textos, labels, placeholders y mensajes de error en español.
10. **Commits en inglés, código en inglés, UI en español** — Mantener esta separación en todo el proyecto.
