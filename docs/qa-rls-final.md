# QA RLS final

## Objetivo

Validar aislamiento real de datos con usuarios QA A/B confirmados usando solo
publishable key y políticas RLS.

## Comandos

```bash
npm run qa:rls
npm run lint
npm run build
```

## Resultado

- `npm run qa:rls`: `QA_RLS_OK`.

## Escrituras propias usuario A

- Actualizar perfil propio: OK.
- Crear post propio: OK.
- Crear petición propia: OK.
- Crear soporte “Estoy orando”: OK.
- Crear comentario propio: OK.
- Crear reacción “Amén”: OK.

## Lecturas permitidas usuario B

- Leer posts: OK.
- Leer peticiones públicas: OK.
- Leer devocionales: OK.

## Escrituras ajenas denegadas usuario B

- Modificar post de usuario A: DENIED.
- Modificar petición de usuario A: DENIED.
- Modificar comentario de usuario A: DENIED.
- Modificar perfil de usuario A: DENIED.
- Asignarse rol admin: DENIED.
- Crear devocional como no admin: DENIED.
- `has_role('admin')`: DENIED/FALSE.

## Limpieza

Los datos QA temporales se limpiaron sin advertencias.

## Validaciones

- `npm run lint`: OK.
- `npm run build`: OK, con warning no bloqueante de chunk grande.

## Migraciones

No fue necesario crear migración adicional. Las políticas existentes cubrieron el
flujo esperado.
