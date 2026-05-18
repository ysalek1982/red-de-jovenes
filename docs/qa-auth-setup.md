# Setup QA de autenticacion

Fecha: 2026-05-17

## Estado actual

- `.env.local` existe y esta ignorado por Git.
- `VITE_SUPABASE_URL` esta disponible localmente.
- `VITE_SUPABASE_PUBLISHABLE_KEY` esta disponible localmente.
- No se detectaron credenciales locales para `QA_USER_A_EMAIL`, `QA_USER_A_PASSWORD`, `QA_USER_B_EMAIL` ni `QA_USER_B_PASSWORD`.
- No se pudo confirmar si existe usuario QA confirmado porque no hay credenciales QA locales disponibles.

## Variables QA necesarias

Agrega estas variables en `.env.qa.local`, que debe permanecer ignorado por Git:

```text
QA_USER_A_EMAIL: correo QA A
QA_USER_A_PASSWORD: contraseña QA A
QA_USER_B_EMAIL: correo QA B
QA_USER_B_PASSWORD: contraseña QA B
```

No uses correos personales ni contrasenas reales de usuarios finales. Usa cuentas QA controladas.

## Requisitos en Supabase

Para ejecutar QA autenticado completo, los usuarios QA deben cumplir una de estas condiciones:

- Estar confirmados manualmente en Supabase Auth.
- O tener la confirmacion de email desactivada temporalmente en el proyecto durante QA.

Si Supabase responde `Email not confirmed`, el estado esperado es:

```text
BLOCKED_EMAIL_CONFIRMATION
```

Si Supabase responde rate limit de email, el estado esperado es:

```text
BLOCKED_EMAIL_RATE_LIMIT
```

## Flujo recomendado

1. Crear dos usuarios QA desde `/crear-cuenta` o desde Supabase Auth.
2. Confirmarlos manualmente en Supabase Auth si la confirmacion de email esta activa.
3. Guardar sus credenciales solo en `.env.qa.local` o variables de entorno.
4. Ejecutar `npm run qa:auth`.
5. Ejecutar `npm run qa:rls`.

## Script disponible

```bash
npm run qa:auth
```

El script lee credenciales QA desde `.env.qa.local` o variables de entorno del sistema. El resultado no imprime correos ni contrasenas; solo muestra estados anonimizados por `USER_A` y `USER_B`.

Si faltan variables QA, devuelve:

```text
BLOCKED_MISSING_QA_ENV
```

## Seguridad

- No versionar `.env.local` ni `.env.qa.local`.
- No escribir contrasenas en README, docs, commits, logs ni codigo fuente.
- No usar service role key en frontend ni en estos scripts QA.
