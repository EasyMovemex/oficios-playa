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
