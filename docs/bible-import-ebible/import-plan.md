# Plan de importacion eBible RVR1909

Fecha: 2026-05-19

## Dictamen de fuente

`CORPUS_AUTHORIZED_READY_TO_IMPORT`

La fuente aprobada para la importacion final es eBible RVR1909 / `spaRV1909`. La ficha oficial declara `public domain` y `Dominio Publico`, identifica la traduccion como Reina-Valera 1909 en espanol y expone formatos estructurados para desarrolladores.

## Fuente aprobada

| Campo | Valor |
| --- | --- |
| Traduccion | Reina-Valera 1909 |
| Codigo interno | `RVR1909` |
| ID fuente | `spaRV1909` |
| Fuente | eBible RVR1909 / spaRV1909 |
| Ficha | https://ebible.org/bible/details.php?id=spaRV1909 |
| Formatos developer | https://ebible.org/bible/details.php?all=1&id=spaRV1909 |
| Descarga seleccionada | https://ebible.org/Scriptures/spaRV1909_vpl.zip |
| Formato seleccionado | VPL ZIP con archivo BibleWorks import + SQL |
| Licencia | public domain / Dominio Publico |
| Alcance | Biblia completa protestante en espanol |

## Estrategia de conversion

1. Descargar el ZIP oficial `spaRV1909_vpl.zip` desde eBible.
2. Registrar metadata local en `supabase/seed/bible/ebible-rvr1909/manifest.json`.
3. Calcular checksum SHA-256 del ZIP antes de convertir.
4. Extraer solo para conversion local; no versionar carpetas temporales.
5. Parsear `spaRV1909_vpl.txt`, cuyo patron es `BOOK CHAPTER:VERSE texto`.
6. Normalizar codigos eBible a codigos internos existentes:
   - `JOH` -> `JHN`
   - `MAR` -> `MRK`
   - `SOL` -> `SNG`
   - otros codigos equivalentes documentados en el convertidor.
7. Generar `rvr1909-normalized.json` con metadata completa por versiculo.
8. Generar `conversion-report.json` con conteos y validaciones.

## Estrategia de validacion

Antes de importar:

1. Verificar checksum de descarga.
2. Confirmar 66 libros.
3. Confirmar 1189 capitulos.
4. Confirmar mas de 30000 versiculos.
5. Confirmar que existen Genesis 1, Salmos 23, Juan 3 y Apocalipsis 22.
6. Confirmar que no hay textos vacios.
7. Confirmar que no hay duplicados por `translation_code + book_code + chapter + verse`.
8. Ejecutar dry-run con el importador oficial:

```powershell
npm run admin:import-bible -- --file ".\supabase\seed\bible\ebible-rvr1909\rvr1909-normalized.json" --dry-run
```

Solo si el dry-run queda `BIBLE_IMPORT_DRY_RUN_OK`, ejecutar importacion real:

```powershell
npm run admin:import-bible -- --file ".\supabase\seed\bible\ebible-rvr1909\rvr1909-normalized.json" --confirm-license
```

## Riesgos controlados

| Riesgo | Control |
| --- | --- |
| Licencia no verificable | Se usa solo ficha oficial eBible con dominio publico |
| Scraping dudoso | No se scrapea; se descarga archivo oficial |
| Codigos de libros incompatibles | Convertidor normaliza contra codigos internos |
| Corpus incompleto | QA exige 66 libros y mas de 30000 versiculos |
| Duplicados | Importador usa upsert y QA revisa duplicados |
| Texto moderno con copyright | Fuente limitada a RVR1909 dominio publico |

## Estado

`READY_FOR_CONVERSION_AND_DRY_RUN`
