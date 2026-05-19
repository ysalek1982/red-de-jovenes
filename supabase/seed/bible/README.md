# Importacion de Biblia completa

Este directorio acepta archivos locales para importar versiculos biblicos autorizados.

## Regla de licencia

No subir a Git archivos con textos biblicos completos si no hay licencia clara. Para piloto, la migracion inicial solo carga un set corto de versiculos base de RVR1909 marcada como dominio publico/verificacion requerida.

## Formato JSON soportado

```json
{
  "metadata": {
    "translation_code": "RVR1909",
    "translation_name": "Reina-Valera 1909",
    "language": "es",
    "license": "Dominio publico verificado",
    "source_name": "Fuente autorizada",
    "source_url": "https://...",
    "is_public_domain": true
  },
  "verses": [
    {
      "translation_code": "RVR1909",
      "book_code": "JHN",
      "book_name": "Juan",
      "testament": "new",
      "book_order": 43,
      "chapters_count": 21,
      "chapter": 3,
      "verse": 16,
      "verse_text": "..."
    }
  ]
}
```

## Formato CSV soportado

Encabezados requeridos:

```csv
translation_code,translation_name,language,license,source_name,source_url,is_public_domain,book_code,book_name,testament,book_order,chapters_count,chapter,verse,verse_text
RVR1909,Reina-Valera 1909,es,Dominio publico verificado,Fuente autorizada,https://...,true,JHN,Juan,new,43,21,3,16,...
```

## Ejecucion

```powershell
npm run admin:import-bible -- --file C:\ruta\biblia-autorizada.json --dry-run
npm run admin:import-bible -- --file C:\ruta\biblia-autorizada.json --confirm-license
```

El script usa Supabase con variables locales seguras. No usa frontend ni variables `VITE_*` para llaves administrativas.
