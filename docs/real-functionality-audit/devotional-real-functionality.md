# Devocional - funcionalidad real

Fecha: 2026-05-18

## Resultado

El modulo devocional muestra contenido real administrable y progreso personal.

## Validado

- Muestra devocional activo del dia cuando existe.
- Si no hay devocional del dia, usa el ultimo activo.
- Muestra titulo, versiculo, referencia, reflexion y oracion final si existe.
- Permite marcar como leido.
- Permite guardar y quitar favorito.
- Muestra favoritos.
- Muestra historial reciente.
- Muestra progreso real de lectura/favoritos.
- Admin puede crear y editar devocionales.
- Usuario normal no puede escribir devocionales por RLS.

## QA

- `npm run qa:functional`: valida lectura, leido y favorito.
- `npm run qa:admin`: valida escritura admin de devocional.
- `npm run qa:rls`: valida bloqueo de escritura devocional para usuario normal.

## Pendientes

- Quitar "leido" no esta implementado por diseno actual; el registro funciona como historial espiritual.
