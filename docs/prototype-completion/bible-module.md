# Modulo Biblia

## Ruta

`/app/biblia`

## Funciones

- Versiculo del momento.
- Guardar versiculo propio.
- Agregar nota personal.
- Copiar versiculo.
- Compartir reflexion en Foros.
- Planes base:
  - 21 dias en los Salmos.
  - Jesus en los Evangelios.
  - Identidad en Cristo.
- Marcar lectura como completada.
- Subrayar fragmento breve.
- Ver versiculos guardados y subrayados.

## Datos

Tablas:
- `bible_saved_verses`
- `bible_reading_progress`
- `bible_highlights`

## Seguridad

Cada usuario lee y escribe solo sus guardados, progreso y subrayados. No se usa `service_role` en frontend.

## QA

Script: `npm run qa:bible`  
Resultado esperado: `QA_BIBLE_OK`
