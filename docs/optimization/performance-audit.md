# Auditoria tecnica de rendimiento

Release base: `pilot-v1.1.1`  
Fecha: 2026-05-21

## Build auditado

Comando ejecutado:

`npm run build`

Resultado:

- TypeScript: OK.
- Vite build: OK.
- CSS principal: `49.55 kB` gzip `8.88 kB`.
- JS principal: `473.55 kB` gzip `138.15 kB`.
- Chunk mas pesado de pagina: `AdminHome` `59.89 kB` gzip `13.14 kB`.
- Otros chunks relevantes:
  - `WorldMapPage`: `21.30 kB` gzip `5.84 kB`.
  - `BiblePage`: `17.02 kB` gzip `4.67 kB`.
  - `AppShell`: `17.20 kB` gzip `5.06 kB`.
  - `AppHome`: `16.70 kB` gzip `4.77 kB`.

Warning observado:

- Vite/Rolldown reporto tiempos de plugin altos en `vite:css`, `vite:css-post` y `vite:build-html`.
- No es bloqueo funcional ni indica bundle grande. Se documenta como observacion.

## Lazy loading actual

`src/routes/AppRoutes.tsx` ya usa `React.lazy` y `Suspense` para rutas publicas y privadas.

Rutas pesadas ya separadas:

- Biblia.
- Juegos.
- Mapa.
- Admin.
- Mensajes.
- Eventos.
- Discipulado.
- Construir.
- Perfil.
- Foros.
- Oracion.

Brecha detectada:

- El fallback era muy simple y frio.
- No habia error boundary por modulo.
- Si un modulo fallaba durante carga/render, podia romper la experiencia completa o mostrar pantalla blanca.

## Consultas Supabase

Se detectaron consultas `select('*')` en varios servicios. No todas son riesgosas porque muchas tablas son pequeñas o protegidas por RLS, pero hay oportunidades:

- `messages`: limitar cantidad de mensajes por conversacion.
- `notifications`: limitar notificaciones recientes.
- `community`, `prayer`, `events`, `discipleship`: mantener limites razonables en feeds.
- `admin`: evitar cargar secciones enormes sin paginacion si el piloto crece.
- `bibleService`: mantener busqueda con `limit`, no traer corpus completo al cliente.

Decision de alcance:

- No tocar RLS ni reglas de acceso.
- No modificar corpus biblico.
- Aplicar optimizaciones de bajo riesgo en servicios con listas.
- Documentar pendientes para paginacion avanzada post-piloto.

## PWA y cache

`public/sw.js`:

- No cachea requests externos, por lo tanto no cachea Supabase.
- Cachea assets locales estaticos.
- Usa fallback offline para navegacion.

Riesgo detectado:

- `CACHE_NAME` sigue en `red-de-jovenes-v2`; si se modifica cache, conviene versionarlo.
- Mantener offline fallback simple para evitar servir datos obsoletos.

## Seguridad frontend

Validaciones rapidas:

- `src/lib/supabase.ts` usa solo `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`.
- No se detecto `service_role` ni `GEMINI_API_KEY` en `src`.
- `localStorage` solo se usa para descarte del prompt de instalacion PWA.
- Seguridad no esta en el menu principal.

## Riesgos

- Admin concentra mucha UI en un solo chunk, pero esta lazy-loaded y solo lo usan admins.
- Paginacion avanzada requeriria mas cambios de UI y QA; no se incluye en esta fase salvo limites existentes/seguros.
- La prueba fisica PWA/movil sigue siendo necesaria para confirmar sensacion real.

## Plan aplicado

1. Mejorar fallback de rutas lazy.
2. Agregar error boundaries por modulo.
3. Revisar/ajustar consultas de listas sin tocar permisos.
4. Mejorar estados accesibles y PWA/cache si hace falta.
5. Ejecutar QA integral local y staging.
