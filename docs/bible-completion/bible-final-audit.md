# Auditoria final del modulo Biblia

Fecha: 2026-05-19

## Estado actual

El modulo Biblia existe en `/app/biblia` y usa Supabase con RLS. La lectura completa esta preparada, pero el corpus completo no fue importado porque no hay un archivo local completo con licencia y fuente verificadas.

## Tablas

| Tabla | Estado |
| --- | --- |
| `bible_translations` | Activa. 2 traducciones/entradas registradas: `RVR1909` base y `RVR1909_SAMPLE_FULL` de prueba del importador. |
| `bible_books` | Activa. 66 libros cargados. |
| `bible_verses` | Activa. 17 versiculos cargados entre base y muestra QA. |
| `bible_daily_verses` | Activa. Hay versiculo diario programado para 2026-05-19. |
| `bible_saved_verses` | Activa. Guardados propios por usuario. |
| `bible_highlights` | Activa. Subrayados propios por usuario. |
| `bible_reading_progress` | Activa. Progreso simple legado. |
| `bible_reading_plans` | Nueva. 5 planes activos. |
| `bible_reading_plan_days` | Nueva. Dias de planes iniciales. |
| `bible_plan_progress` | Nueva. Progreso propio por dia de plan. |

## RPC y vistas

| Objeto | Estado |
| --- | --- |
| `get_random_bible_verse` | OK. Devuelve versiculo base aleatorio. |
| `get_bible_chapter` | OK. Devuelve capitulos importados y empty state si falta corpus. |
| `search_bible_verses` | Nuevo. Busca palabra, frase o referencia. |
| `get_daily_bible_verse` | Nuevo. Usa programado por fecha y fallback aleatorio. |
| `bible_translation_stats` | Nueva. Estadisticas de completitud por traduccion. |
| `bible_missing_chapters_report` | Nueva. Diagnostico de capitulos sin versiculos. |

## Brechas reales

- Corpus completo pendiente: no se importa sin archivo autorizado.
- RVR1909 base solo tiene 15 versiculos seleccionados.
- `RVR1909_SAMPLE_FULL` existe solo para validar importador y no representa una Biblia completa.
- La IA biblica funciona en modo gobernado; si Gemini no esta configurado, las acciones quedan en flujo de revision/cola.

## Estado final

Biblia funcional para piloto avanzado con busqueda, lector, planes, versiculo diario, guardados, subrayados, notas, IA asistida y panel admin. Corpus completo: pendiente hasta fuente autorizada.
