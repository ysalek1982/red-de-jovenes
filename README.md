# Red de Jóvenes

Landing/app cristiana moderna tipo red social/PWA, reconstruida a partir del prototipo publicado en Lovable.

El concepto central es: **“La red social cristiana de la nueva generación”** y **“Conectando jóvenes en Cristo.”**

La experiencia principal se centra en comunidad cristiana juvenil, oración, devocionales, posts con la Palabra, perfiles de jóvenes y una base PWA instalable.

## Stack usado

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React
- Supabase Auth, Postgres y RLS

## Instalación

```bash
npm install
```

## Configuración de Supabase

Copia el archivo de ejemplo y completa solo secretos en tu archivo local ignorado por Git:

```bash
cp .env.local.example .env.local
```

Variables frontend necesarias:

```bash
VITE_SUPABASE_URL=https://ntlzlfbztryasbmjnynq.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_lzWu99dOnbt0eJVBgQ1fsw_jOy6bTC-
```

Variables locales para CLI o conexión de base de datos:

```bash
SUPABASE_PROJECT_REF=ntlzlfbztryasbmjnynq
SUPABASE_DB_HOST=db.ntlzlfbztryasbmjnynq.supabase.co
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=REEMPLAZAR_SOLO_EN_ENV_LOCAL
SUPABASE_POOLER_HOST=aws-1-us-east-2.pooler.supabase.com
SUPABASE_POOLER_PORT=5432
SUPABASE_POOLER_DB=postgres
SUPABASE_POOLER_USER=postgres.ntlzlfbztryasbmjnynq
SUPABASE_POOLER_PASSWORD=REEMPLAZAR_SOLO_EN_ENV_LOCAL
```

No escribas contraseñas reales, connection strings privadas ni llaves privadas de backend en archivos versionados.

## Ejecución local

```bash
npm run dev
```

La aplicación queda disponible normalmente en `http://localhost:5173`.

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## QA autenticado local

Configura dos usuarios QA confirmados en `.env.qa.local`:

```text
QA_USER_A_EMAIL: correo QA A
QA_USER_A_PASSWORD: contraseña QA A
QA_USER_B_EMAIL: correo QA B
QA_USER_B_PASSWORD: contraseña QA B
```

Luego ejecuta:

```bash
npm run qa:auth
npm run qa:rls
```

Los scripts no imprimen correos ni contrasenas. Si faltan variables locales devuelven `BLOCKED_MISSING_QA_ENV`.

## Supabase CLI

```bash
npx supabase login
npx supabase link --project-ref ntlzlfbztryasbmjnynq
npx supabase db push --dry-run
npx supabase db push
npx supabase gen types typescript --project-id ntlzlfbztryasbmjnynq --schema public > src/types/supabase.generated.ts
```

La migración inicial prepara autenticación, perfiles, peticiones de oración, posts, devocionales, testimonios y grupos con RLS.

## Rutas principales

Públicas:

- `/` entrada de app: redirige a `/entrar` sin sesión o `/app` con sesión.
- `/landing`
- `/entrar`
- `/crear-cuenta`
- `/demo`

Privadas:

- `/app`
- `/app/oracion`
- `/app/comunidad`
- `/app/foros`
- `/app/devocional`
- `/app/juegos`
- `/app/mapa`
- `/app/perfil`
- `/app/admin`

La landing pública usa anclas internas:

- `/landing#mision`
- `/landing#funciones`
- `/landing#testimonios`
- `/landing#comunidad`

## Funcionalidad actual

- Landing cristiana/PWA con estética oscura, glassmorphism y contenido alineado al prototipo Lovable.
- Registro y login con Supabase Auth.
- Ruta privada protegida por sesión.
- Perfil editable conectado a `profiles`.
- Sala de oración conectada a `prayer_requests`.
- Feed de comunidad conectado a `posts`.
- Devocional diario conectado a `devotionals` con fallback al último disponible.
- Navegación privada mobile-first.
- Manifest, metadata, service worker y fallback offline básico.

## Estructura principal

```text
src/
  components/
    layout/       Header, footer, layout global y AppShell privado.
    ui/           Componentes base reutilizables.
  data/
    landingData.ts Contenido de la landing cristiana/PWA.
  features/
    auth/
    community/
    devotionals/
    prayer/
    profile/
  pages/
    Home.tsx
    AppHome.tsx
    PrayerRoomPage.tsx
    CommunityFeedPage.tsx
    DevotionalPage.tsx
    AppProfile.tsx
  routes/
    AppRoutes.tsx
```

## PWA

- Manifest: `public/manifest.webmanifest`.
- Service worker: `public/sw.js`.
- Fallback offline: `public/offline.html`.
- Documentación: `docs/pwa-setup.md`.

## Assets visuales

Los archivos en `public/assets` se usan para mantener paridad visual con el prototipo:

- `hero-youth.jpg`: fondo principal de jóvenes adorando.
- `cross-glow.jpg`: cruz luminosa del hero.
- `bible-study.jpg`: apoyo visual del mockup PWA.

Estos assets fueron tomados de la referencia pública de Lovable para reconstrucción visual. Deben considerarse temporales: antes de producción conviene reemplazarlos por imágenes propias o por recursos con licencia confirmada.

## QA y documentación

- `docs/supabase-qa.md`
- `docs/auth-profile-qa.md`
- `docs/prayer-room-qa.md`
- `docs/community-feed-qa.md`
- `docs/devotional-qa.md`
- `docs/pwa-setup.md`
- `docs/security-rls-qa.md`
- `docs/visual-polish-qa.md`
- `docs/qa-auth-setup.md`
- `docs/qa-stabilization-report.md`
- `docs/performance-qa.md`
- `docs/visual-qa-phase-10.md`
- `docs/stabilization-final-report.md`
- `docs/nightly-work-plan.md`
- `docs/nightly-progress-log.md`
- `docs/nightly-final-report.md`

## Bloqueos conocidos

- Supabase puede bloquear login con `Email not confirmed` si el usuario QA no confirmó su correo.
- Durante la sesión nocturna Supabase respondió `email rate limit exceeded`, por lo que algunas pruebas dinámicas autenticadas quedaron pendientes.

## Próximas fases sugeridas

- Confirmar un usuario QA o ajustar temporalmente confirmación de email para pruebas.
- Ejecutar QA dinámico completo de RLS con dos usuarios.
- Agregar tests automatizados de rutas protegidas y servicios.
- Reemplazar assets temporales por recursos propios o con licencia confirmada.
- Evaluar code splitting para reducir el warning de chunk grande.
