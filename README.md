# Red de Jóvenes

Landing/app cristiana moderna tipo red social/PWA, reconstruida a partir del prototipo publicado en Lovable.

La experiencia principal presenta una red para jóvenes en Cristo con comunidad, oración, foros con la Palabra, juegos de fe, devocional diario, mapa mundial y una app instalable.

## Stack usado

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React

## Instalación

```bash
npm install
```

## Configuración de Supabase

Copia el archivo de ejemplo y completa solo los secretos en tu archivo local ignorado por Git:

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

No escribas contraseñas reales, connection strings privadas ni service role keys en archivos versionados.

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

## Supabase CLI

Cuando el CLI esté instalado y autenticado:

```bash
supabase login
supabase init
supabase link --project-ref ntlzlfbztryasbmjnynq
supabase db push
```

La migración inicial está en `supabase/migrations` y prepara autenticación, perfiles, peticiones de oración, posts, devocionales, testimonios y grupos con RLS.

## Rutas principales

- `/`
- `/entrar`
- `/crear-cuenta`
- `/demo`
- `/app`

La página principal usa anclas internas:

- `#mision`
- `#funciones`
- `#testimonios`
- `#comunidad`

## Estructura principal

```text
src/
  components/
    layout/       Header, footer y layout global.
    ui/           Componentes base reutilizables.
  data/
    landingData.ts Contenido de la landing cristiana/PWA.
    mockData.ts    Datos heredados no enlazados en la experiencia principal.
  pages/
    Home.tsx
    PlaceholderPage.tsx
  routes/
    AppRoutes.tsx
```

## Assets visuales

Los archivos en `public/assets` se usan para mantener paridad visual con el prototipo:

- `hero-youth.jpg`: fondo principal de jóvenes adorando.
- `cross-glow.jpg`: cruz luminosa del hero.
- `bible-study.jpg`: apoyo visual del mockup PWA.

Estos assets fueron tomados de la referencia pública de Lovable para reconstrucción visual. Deben considerarse temporales: antes de producción conviene reemplazarlos por imágenes propias o por recursos con licencia confirmada.

## Próximas fases sugeridas

- Crear flujos reales de registro e ingreso.
- Implementar demo navegable de sala de oración, foros, devocional y mapa.
- Añadir manifest PWA, service worker y modo instalable real.
- Aplicar la migración con `supabase db push` en un entorno autenticado.
- Agregar pruebas visuales y de navegación.
