# Importador de Biblia completa

## Objetivo

Permitir cargar una traduccion completa solo cuando exista fuente con licencia clara o dominio publico.

## Script

```powershell
npm run admin:import-bible -- --file C:\ruta\biblia-autorizada.json
```

## Variables locales

El script lee:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

desde `.env.admin.local` o variables del entorno. Ese archivo esta ignorado por Git.

## Formatos

JSON:

```json
[
  {
    "translation_code": "RVR1909",
    "book_code": "JHN",
    "chapter": 3,
    "verse": 16,
    "verse_text": "..."
  }
]
```

CSV:

```csv
translation_code,book_code,chapter,verse,verse_text
RVR1909,JHN,3,16,...
```

## Seguridad

- No usa `service_role` en frontend.
- No versiona textos completos sin licencia.
- Usa upsert por `translation_code,book_code,chapter,verse`.
- Reporta conteos sin imprimir secretos.
