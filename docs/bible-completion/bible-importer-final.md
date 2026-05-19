# Importador final de Biblia

Script: `scripts/import-bible-verses.mjs`

Comando:

```powershell
npm run admin:import-bible -- --file archivo.json --dry-run
npm run admin:import-bible -- --file archivo.json --confirm-license
npm run admin:import-bible -- --file archivo.csv --dry-run
npm run admin:import-bible -- --file archivo.csv --confirm-license
```

## Formatos

Soporta JSON y CSV con:

- `translation_code`
- `translation_name`
- `language`
- `license`
- `source_name`
- `source_url`
- `is_public_domain`
- `book_code`
- `book_name`
- `testament`
- `book_order`
- `chapters_count`
- `chapter`
- `verse`
- `verse_text`

## Validaciones

- Bloquea importacion sin licencia.
- Bloquea importacion sin fuente.
- Bloquea escritura sin `--confirm-license`.
- Valida enteros para capitulo/versiculo.
- Valida texto no vacio.
- Detecta duplicados de archivo.
- Usa upsert para no duplicar filas.
- Reporta leidos, insertados, actualizados, omitidos, errores y tiempo.

## Muestra

Archivo creado:

`supabase/seed/bible/sample-bible-import-full-format.json`

Contiene pocos versiculos de ejemplo para validar formato; no es una Biblia completa.
