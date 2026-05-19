# Conversion eBible RVR1909 a formato interno

Fecha: 2026-05-19

## Comando ejecutado

```powershell
npm run admin:convert-ebible-rvr1909
```

## Resultado

`EBIBLE_RVR1909_CONVERSION_OK`

El convertidor leyo el ZIP oficial de eBible, extrajo `spaRV1909_vpl.txt`, normalizo codigos de libros al esquema interno de Red de Jovenes y genero el archivo JSON compatible con el importador administrativo.

## Archivos generados

| Archivo | Proposito |
| --- | --- |
| `scripts/convert-ebible-rvr1909.mjs` | Convertidor oficial para esta fuente |
| `supabase/seed/bible/ebible-rvr1909/rvr1909-normalized.json` | Corpus normalizado listo para dry-run/importacion |
| `supabase/seed/bible/ebible-rvr1909/conversion-report.json` | Evidencia de conversion y conteos |

## Conteos

| Metrica | Resultado |
| --- | ---: |
| Libros | 66 |
| Capitulos | 1189 |
| Capitulos esperados | 1189 |
| Versiculos con texto | 31084 |
| Marcadores de versiculo vacios omitidos | 18 |
| Duplicados | 0 |
| Errores | 0 |

## Nota sobre marcadores vacios

El VPL oficial incluye 18 referencias sin texto, usadas como marcadores de versificacion. No se importan como versiculos vacios porque la regla del modulo Biblia exige no almacenar `verse_text` vacio. El contenido biblico textual queda preservado desde las lineas con texto del corpus eBible.

## Puntos de control

| Control | Resultado |
| --- | --- |
| Genesis 1 existe | OK |
| Salmos 23 existe | OK |
| Juan 3 existe | OK |
| Apocalipsis 22 existe | OK |
| SHA-256 fuente | `B331BC607A569F8EE0FFC0A93DB7D4FF6342FC93E5C5AFE0C8D0AF3221BED5AD` |

## Decision

`READY_FOR_IMPORT_DRY_RUN`
