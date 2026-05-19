# Decision de corpus biblico autorizado

Fecha: 2026-05-19

## Resultado

`CORPUS_AUTHORIZED_READY_TO_IMPORT`

Se identifico una fuente completa en espanol con licencia explicita compatible para importacion legal: **Santa Biblia - Reina Valera 1909 (`spaRV1909`) publicada por eBible.org**.

No se importo ningun texto durante esta verificacion.

## Decision operativa

Fuente seleccionada para importacion futura:

- Traduccion: Reina Valera 1909
- Codigo recomendado: `RVR1909` o `spaRV1909`
- Fuente: eBible.org
- URL de ficha: https://ebible.org/bible/details.php?id=spaRV1909
- Licencia indicada por la fuente: public domain / Dominio Publico
- Alcance: Biblia completa en espanol, Reina Valera 1909
- Formatos disponibles: HTML movil, EPUB, MOBI, PDF, Crosswire Sword, texto plano por capitulos, Word XML, VPL + SQL, Browser Bible, USFX, USFM, OSIS y XeTeX
- Formato recomendado para pipeline: USFM, USFX, OSIS o VPL + SQL, convertido a JSON/CSV del importador antes de cargar a Supabase
- Estado: listo legalmente para preparar importacion, pendiente conversion tecnica y dry-run

## Evidencia revisada

| Fuente | URL | Licencia/estado | Alcance | Formato | Decision |
| --- | --- | --- | --- | --- | --- |
| eBible RVR1909 | https://ebible.org/bible/details.php?id=spaRV1909 | La ficha indica `public domain` y `Dominio Publico` | Biblia completa RVR1909 | Incluye formatos de lectura y desarrollador: USFM, USFX, OSIS, VPL + SQL, texto plano y otros | Aprobada como fuente principal |
| eBible RVR1909 con formatos developer | https://ebible.org/bible/details.php?all=1&id=spaRV1909 | Misma ficha, misma indicacion de dominio publico | Biblia completa RVR1909 | Expone enlaces directos a `spaRV1909_usfm.zip`, `spaRV1909_usfx.zip`, `spaRV1909_osis.zip`, `spaRV1909_vpl.zip` | Aprobada para descarga/conversion controlada |
| Wikisource RVR1909 | https://es.wikisource.org/wiki/Categor%C3%ADa:Biblia_Reina-Valera_1909 | Texto disponible bajo Creative Commons Atribucion-CompartirIgual 4.0 segun pie de Wikisource | Categoria con Antiguo y Nuevo Testamento; 1255 paginas listadas | Paginas wiki, PDF/impresion, no corpus estructurado unico | No seleccionada para importacion automatica; util como referencia secundaria |
| Project Gutenberg ebook 5881 | https://www.gutenberg.org/ebooks/5881 | Public domain in the USA | Nuevo Testamento RVR1909 solamente | HTML, EPUB, Kindle, texto plano | No suficiente para corpus completo; podria servir solo como referencia NT |
| Archivos locales `supabase/seed/bible/` | Local | Muestras internas, no corpus completo | 2 archivos sample + README | JSON sample | No son corpus completo; sirven para QA del importador |
| `data/bible/` | Local | No existe | No aplica | No aplica | Sin corpus local |

## Por que eBible queda aprobado

1. La ficha declara explicitamente dominio publico.
2. Identifica la traduccion como Reina Valera 1909 en espanol.
3. Ofrece formatos completos y estructurados para desarrolladores.
4. Evita scraping: la fuente proporciona archivos descargables.
5. Evita versiones modernas con copyright.

## Condiciones antes de importar

Antes de cargar a Supabase:

1. Descargar manualmente un formato estructurado desde eBible, preferiblemente USFM, USFX, OSIS o VPL + SQL.
2. Conservar el archivo fuente y su metadata fuera del frontend.
3. Convertir a JSON/CSV compatible con `scripts/import-bible-verses.mjs`.
4. Incluir metadata obligatoria:
   - `translation_code`
   - `translation_name`
   - `language`
   - `license`
   - `source_name`
   - `source_url`
   - `is_public_domain`
5. Ejecutar primero:

```powershell
npm run admin:import-bible -- --file C:\ruta\spaRV1909-convertido.json --dry-run
```

6. Revisar conteos de libros, capitulos, versiculos, duplicados y errores.
7. Solo si el dry-run coincide con el corpus esperado:

```powershell
npm run admin:import-bible -- --file C:\ruta\spaRV1909-convertido.json --confirm-license
```

## Exclusiones

No se aprueban para importacion:

- Reina-Valera 1960.
- NVI.
- NTV.
- DHH.
- Cualquier version moderna sin permiso escrito.
- Fuentes obtenidas por scraping no autorizado.
- Archivos sin licencia y fuente documentadas.

## Estado final

`CORPUS_AUTHORIZED_READY_TO_IMPORT`

La autorizacion legal queda resuelta para RVR1909 desde eBible. La importacion todavia no se ejecuta y queda pendiente la conversion tecnica a JSON/CSV y validacion por dry-run.
