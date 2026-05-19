# Resultado de importacion de corpus biblico

## Dictamen

`PENDING_AUTHORIZED_BIBLE_CORPUS`

## Estado

No se importo una Biblia completa porque no existe en el repositorio un archivo completo con licencia/fuente verificadas.

## Datos cargados

- `RVR1909`: 15 versiculos base para piloto y QA.
- `RVR1909_SAMPLE_FULL`: 2 versiculos de muestra importados por QA para validar formato completo.
- Libros: 66.
- Versiculos totales en Supabase: 17.

## Proxima accion

Seleccionar fuente autorizada, descargar archivo estructurado fuera del frontend y ejecutar:

```powershell
npm run admin:import-bible -- --file C:\ruta\biblia-autorizada.json --dry-run
npm run admin:import-bible -- --file C:\ruta\biblia-autorizada.json --confirm-license
```
