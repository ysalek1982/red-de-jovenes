# Dry-run de importacion RVR1909

Fecha: 2026-05-19

## Comando ejecutado

```powershell
npm run admin:import-bible -- --file ".\supabase\seed\bible\ebible-rvr1909\rvr1909-normalized.json" --dry-run
```

## Resultado

`BIBLE_IMPORT_DRY_RUN_OK`

El importador valido el corpus normalizado sin escribir datos en Supabase.

## Evidencia

| Campo | Resultado |
| --- | --- |
| Traduccion | `RVR1909` |
| Nombre | Reina-Valera 1909 |
| Fuente | eBible RVR1909 / spaRV1909 |
| URL fuente | https://ebible.org/bible/details.php?id=spaRV1909 |
| Licencia | public domain |
| Dominio publico | Si |
| Libros leidos | 66 |
| Capitulos leidos | 1189 |
| Versiculos leidos | 31084 |
| Duplicados | 0 |
| Omitidos | 0 |
| Errores | 0 |
| Tiempo | 239 ms |

## Decision

`READY_TO_IMPORT`

La importacion real queda habilitada porque el dry-run paso licencia, fuente, conteos y validaciones estructurales.
