# Resultado de importacion RVR1909

Fecha: 2026-05-19

## Comando ejecutado

```powershell
npm run admin:import-bible -- --file ".\supabase\seed\bible\ebible-rvr1909\rvr1909-normalized.json" --confirm-license
```

## Resultado

`BIBLE_IMPORT_OK`

La Biblia RVR1909 fue importada en Supabase desde el corpus autorizado de eBible.

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
| Versiculos leidos/importados | 31084 |
| Insertados | 31069 |
| Actualizados | 15 |
| Omitidos | 0 |
| Duplicados | 0 |
| Errores | 0 |
| Tiempo | 22218 ms |

## Nota operativa

El corpus eBible contenia 18 marcadores de versiculo sin texto. Fueron omitidos durante la conversion para cumplir la regla de no almacenar `verse_text` vacio. La importacion real recibio 31084 versiculos con texto.

## Dictamen

`BIBLE_IMPORT_COMPLETE`
