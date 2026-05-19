# Admin Biblia completo

## Panel

El panel Admin Biblia muestra:

- Traducciones cargadas.
- Cantidad de libros.
- Cantidad de versiculos.
- Licencia y fuente.
- Estadisticas por traduccion.
- Diagnostico de capitulos sin versiculos.
- Planes de lectura activos.
- Versiculo diario programable.
- Prueba de versiculo aleatorio.

## Diagnostico

Vistas usadas:

- `bible_translation_stats`
- `bible_missing_chapters_report`

## Importacion

La importacion completa queda por script administrativo local. El frontend no carga archivos biblicos completos ni usa llaves admin.

## Seguridad

Admin opera por Edge Function autenticada y rol admin. El frontend mantiene solo publishable key.
