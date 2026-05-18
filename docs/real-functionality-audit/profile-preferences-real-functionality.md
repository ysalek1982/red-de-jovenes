# Perfil y preferencias - funcionalidad real

Fecha: 2026-05-18

## Resultado

Perfil y preferencias funcionan como experiencia personal editable y persistente.

## Validado

- Editar nombre completo.
- Editar username con validacion.
- Editar ciudad, pais e iglesia.
- Editar bio.
- Avatar URL con vista previa.
- Preferencias de devocional, oracion y comunidad cargan.
- Preferencias se guardan y persisten.
- Rol visible para admin.
- Usuario no edita perfil/preferencias ajenas.

## QA

- `npm run qa:functional`: valida perfil y preferencias.
- `npm run qa:rls`: valida bloqueo de perfil ajeno.

## Pendientes

- Subida real de avatar con Supabase Storage queda para fase futura.
