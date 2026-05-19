# Buscador global

## Ubicacion

- Header privado desktop.
- Header movil mediante lupa/campo compacto.

## Busca en

- Publicaciones.
- Comunidades activas.
- Eventos activos.
- Devocionales activos.
- Perfiles visibles por RLS.
- Versiculos guardados propios.
- Tracks de discipulado activos.

## Seguridad

La busqueda usa el cliente normal de Supabase y respeta RLS. No se exponen conversaciones ni reportes.

## QA

Script: `npm run qa:search`  
Resultado esperado: `QA_SEARCH_OK`
