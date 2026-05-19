# Fase 30.1 - Auditoria inicial Biblia e IA Gemini

Fecha: 2026-05-19

## Estado actual del modulo Biblia

- Ruta existente: `/app/biblia`.
- Servicio existente: `src/features/bible/bibleService.ts`.
- Funciones actuales:
  - versiculo del momento hardcodeado;
  - planes de lectura locales;
  - guardar versiculos propios;
  - progreso de lectura propio;
  - subrayados propios;
  - compartir una reflexion en Foros.

## Tablas biblicas existentes

Actualmente existen tablas de experiencia personal:

- `bible_saved_verses`
- `bible_reading_progress`
- `bible_highlights`

No existe todavia texto biblico estructurado en base de datos. No existen:

- `bible_translations`
- `bible_books`
- `bible_verses`
- `bible_daily_verses`

## Brechas para lectura biblica real

- Falta registrar traducciones y licencia.
- Falta catalogo de libros con orden, testamento y cantidad de capitulos.
- Falta almacenar versiculos por traduccion/libro/capitulo/versiculo.
- Falta RPC para versiculo aleatorio.
- Falta RPC para lectura por capitulo.
- Falta importador seguro para cargar una Biblia completa con licencia clara.

## Estado actual de IA

- No existe configuracion Gemini.
- No existen Edge Functions para IA.
- No existe auditoria de acciones IA.
- No existe cola de acciones aprobables.
- No existe panel admin de IA.

## Riesgos de seguridad

- La key Gemini nunca debe estar en `VITE_*`.
- React no debe llamar Gemini directamente.
- La API key no debe versionarse ni imprimirse.
- Las acciones de moderacion o destructivas no deben ejecutarse sin aprobacion admin.
- Los logs de IA no deben guardar datos sensibles completos ni secretos.
- Para Biblia completa, se requiere fuente de dominio publico o licencia documentada.

## Plan de implementacion

1. Crear tablas biblicas estructuradas y seeds base RVR1909 de dominio publico.
2. Crear RPC `get_random_bible_verse` y `get_bible_chapter`.
3. Crear importador local/admin para Biblia completa.
4. Mejorar UI de `/app/biblia` para traduccion/libro/capitulo/versiculo aleatorio.
5. Crear tablas de configuracion Gemini, logs y cola de acciones.
6. Crear Edge Functions:
   - `admin-ai-settings`;
   - `ai-generate`;
   - `ai-action-executor`.
7. Agregar panel admin IA con estado enmascarado.
8. Agregar guardrails pastorales.
9. Crear QA Biblia/IA y validar local/staging.
