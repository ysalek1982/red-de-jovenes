# Perfil - auditoria click por click

Fecha: 2026-05-18

## Validado

- Editar nombre.
- Editar username.
- Validacion de username.
- Avatar URL valida con vista previa.
- Avatar URL invalida manejada visualmente por fallback del navegador.
- Bio.
- Ciudad/pais.
- Iglesia.
- Guardar preferencias.
- Persistencia de preferencias.
- Mensajes claros.
- No editar ajenas por RLS.

## QA

- `npm run qa:functional`: OK para perfil/preferencias.
- `npm run qa:rls`: OK para bloqueo de perfil ajeno.

## Estado final

OK.
