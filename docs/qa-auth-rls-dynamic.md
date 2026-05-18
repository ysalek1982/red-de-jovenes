# QA dinámico Auth y RLS

Fecha: 2026-05-18

## Objetivo

Validar dinámicamente Auth y RLS con dos usuarios QA reales y confirmados,
usando únicamente la publishable key de Supabase desde scripts locales.

## Configuración local esperada

Archivo local ignorado por Git:

```text
.env.qa.local
```

Archivo de ejemplo versionado:

```text
.env.qa.local.example
```

Variables requeridas:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
QA_USER_A_EMAIL
QA_USER_A_PASSWORD
QA_USER_B_EMAIL
QA_USER_B_PASSWORD
```

## Estado de usuarios QA

Estado actual: `BLOCKED_MISSING_QA_ENV`.

Se verificó que `.env.qa.local` existe y está ignorado por Git, pero no contiene
las variables de credenciales QA A/B necesarias para ejecutar login real con dos
usuarios confirmados.

No se imprimieron correos ni contraseñas en consola ni documentación.

## Resultado `npm run qa:auth`

Resultado actual:

```json
{
  "status": "BLOCKED_MISSING_QA_ENV",
  "missing": [
    "QA_USER_A_EMAIL",
    "QA_USER_A_PASSWORD",
    "QA_USER_B_EMAIL",
    "QA_USER_B_PASSWORD"
  ],
  "hint": "Configura variables QA locales en .env.qa.local o variables de entorno."
}
```

Cobertura preparada cuando existan credenciales:

- Login usuario A.
- Login usuario B.
- Obtener sesión.
- Leer perfil propio.
- Leer devocionales.
- Leer posts.
- Leer peticiones públicas de oración.
- Cerrar sesión.

El script clasifica bloqueos externos como:

- `BLOCKED_EMAIL_CONFIRMATION`
- `BLOCKED_EMAIL_RATE_LIMIT`

## Resultado `npm run qa:rls`

Resultado actual:

```json
{
  "status": "BLOCKED_MISSING_QA_ENV",
  "missing": [
    "QA_USER_A_EMAIL",
    "QA_USER_A_PASSWORD",
    "QA_USER_B_EMAIL",
    "QA_USER_B_PASSWORD"
  ],
  "hint": "Configura dos usuarios QA confirmados en .env.qa.local o variables de entorno."
}
```

Cobertura preparada cuando existan credenciales:

- Usuario A crea post propio.
- Usuario A crea petición de oración propia.
- Usuario A actualiza su perfil.
- Usuario B lee datos públicos permitidos.
- Usuario B intenta modificar post de usuario A.
- Usuario B intenta modificar oración de usuario A.
- Usuario B intenta modificar perfil de usuario A.
- Se espera que las escrituras ajenas sean denegadas por RLS.
- Se limpian datos QA creados por usuario A si la prueba logra crearlos.

## Correcciones aplicadas

- Se agregó `.env.qa.local.example`.
- Se agregó `.env.qa.local` explícitamente a `.gitignore`.
- Los scripts QA ahora leen credenciales QA solo desde `.env.qa.local` o variables
  de entorno.
- Se agregó parsing de valores entre comillas en archivos `.env`.
- `qa:auth` ahora falla si no existe perfil propio, porque el trigger de perfil
  también forma parte del flujo real.
- `qa:rls` ahora exige que las escrituras propias devuelvan fila afectada y
  marca como fallo los errores Auth no bloqueantes.

## Pendientes

Para desbloquear QA dinámico real:

1. Completar `.env.qa.local` localmente con dos usuarios QA reales.
2. Confirmar ambos emails en Supabase Auth.
3. Ejecutar:

```bash
npm run qa:auth
npm run qa:rls
```

Si Supabase devuelve `Email not confirmed`, confirmar los usuarios desde el
Dashboard o ajustar temporalmente la configuración de confirmación de email para
QA. Si devuelve rate limit, esperar la ventana de Supabase antes de reintentar.

## Migraciones

No se creó ni aplicó migración. El bloqueo actual es de configuración local de
usuarios QA, no de esquema ni de políticas RLS.

## Seguridad

- `.env.qa.local` no está versionado.
- No se usó service role en los scripts QA.
- No se escribieron contraseñas, correos QA reales ni tokens privados.
- La prueba RLS usa únicamente el cliente normal de Supabase con publishable key.
