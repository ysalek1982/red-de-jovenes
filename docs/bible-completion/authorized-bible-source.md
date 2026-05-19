# Fuente biblica autorizada

Regla operativa: no se carga una Biblia completa si no existe archivo local con fuente, licencia y permiso verificables.

## Opciones revisadas

| Traduccion | Fuente | Licencia | Estado | Puede importarse | Observacion |
| --- | --- | --- | --- | --- | --- |
| RVR1909 | eBible `spaRV1909` | Public domain indicado por eBible | Permitida si se descarga archivo autorizado y se conserva metadata | Si | Fuente consultada: https://ebible.org/bible/details.php?id=spaRV1909 |
| RVR1909 | Wikisource categoria Biblia Reina-Valera 1909 | Repositorio publico de textos | Referencia util, requiere cuidado para importar de forma estructurada | Condicional | Fuente consultada: https://es.wikisource.org/wiki/Categor%C3%ADa:Biblia_Reina-Valera_1909 |
| RVR1909 Nuevo Testamento | Project Gutenberg ebook 5881 | Public domain in USA | Solo NT; util como referencia, no corpus completo AT+NT | Condicional | Fuente consultada: https://www.gutenberg.org/ebooks/5881 |
| RVR1960 u otras modernas | Sociedades biblicas/editoriales | Copyright/licencia moderna | No disponible en repo | No | Requiere autorizacion explicita por escrito. |

## Decision

No se importo una Biblia completa durante esta fase. El sistema queda preparado para importar RVR1909 u otra traduccion solo cuando el archivo local incluya metadata completa y se ejecute con `--confirm-license`.
