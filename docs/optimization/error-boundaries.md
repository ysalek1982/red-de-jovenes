# Error boundaries por modulo

## Objetivo

Evitar pantallas blancas si un modulo lazy-loaded falla al cargar o renderizar.

## Implementacion

Archivos agregados:

- `src/components/errors/AppErrorBoundary.tsx`
- `src/components/errors/ModuleErrorFallback.tsx`

Integracion:

- `src/App.tsx` envuelve la app con un boundary general.
- `src/routes/AppRoutes.tsx` envuelve cada ruta lazy-loaded con un boundary de modulo.
- El boundary se resetea al cambiar `pathname/search`.

## Fallback visible

Mensaje al usuario:

`Algo fallo al cargar este modulo. Intenta nuevamente.`

Acciones:

- `Reintentar`.
- `Volver al inicio`.

## Seguridad

- No se muestra stack trace al usuario.
- Los detalles del error solo se registran en consola durante desarrollo (`import.meta.env.DEV`).

## Alcance

No se modifico Auth/RLS, no se tocaron servicios Supabase y no se cambio la logica de modulos. El cambio se limita a estabilidad de UI.
