# Mejora UI Biblia

## Cambios

- `/app/biblia` ahora lee traducciones, libros y versiculos desde Supabase.
- Se agrego versiculo aleatorio desde RPC `get_random_bible_verse`.
- Se agrego boton "Otro versiculo".
- Se agrego selector de traduccion, libro y capitulo.
- Se agrego lectura de capitulo con RPC `get_bible_chapter`.
- Se mantiene guardar, subrayar, copiar y compartir en Foros.
- El home usa versiculo desde base de datos con fallback local.

## Estado Biblia completa

La Biblia completa todavia no esta importada. El sistema tiene un set base de versiculos RVR1909 y el importador `admin:import-bible` para cargar una traduccion autorizada.

## QA

- `npm run qa:bible-db`
- `npm run qa:bible-random`
