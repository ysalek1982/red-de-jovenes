# Gobierno de importacion de Biblia completa

## Objetivo

Evitar cargar traducciones sin permiso o con licencia dudosa.

## Requisitos obligatorios

Cada importacion debe incluir metadata:

- `translation_code`
- `translation_name`
- `license`
- `source_name`
- `source_url`
- `is_public_domain` o `license_confirmed`

## Comandos

Dry-run:

```powershell
npm run admin:import-bible -- --file archivo.json --dry-run
```

Importacion real:

```powershell
npm run admin:import-bible -- --file archivo.json --confirm-license
```

## Formato recomendado

```json
{
  "metadata": {
    "translation_code": "RVR1909",
    "translation_name": "Reina-Valera 1909",
    "license": "Dominio publico",
    "source_name": "Fuente verificada",
    "source_url": "https://...",
    "is_public_domain": true
  },
  "verses": []
}
```

## QA

- `npm run qa:bible-importer`
- Resultado esperado: `QA_BIBLE_IMPORT_GOVERNANCE_OK`
