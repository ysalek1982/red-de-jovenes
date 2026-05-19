# Importacion de Biblia completa

Este directorio acepta archivos locales para importar versiculos biblicos autorizados.

## Regla de licencia

No subir a Git archivos con textos biblicos completos si no hay licencia clara. Para piloto, la migracion inicial solo carga un set corto de versiculos base de RVR1909 marcada como dominio publico/verificacion requerida.

## Formato JSON soportado

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

## Formato CSV soportado

Encabezados requeridos:

```csv
translation_code,book_code,chapter,verse,verse_text
RVR1909,JHN,3,16,...
```

## Ejecucion

```powershell
npm run admin:import-bible -- --file C:\ruta\biblia-autorizada.json
```

El script usa Supabase con variables locales seguras. No usa frontend ni variables `VITE_*` para llaves administrativas.
