# Configuración Supabase Auth para staging

## Objetivo

Preparar Supabase Auth para que login, registro y recuperación de contraseña funcionen correctamente cuando exista una URL staging pública.

## Estado de código revisado

| Archivo | Resultado |
| --- | --- |
| `src/features/auth/authService.ts` | OK. Recuperación usa `window.location.origin` y redirige a `/actualizar-contrasena`. |
| `src/pages/RecoverPasswordPage.tsx` | OK. Solicita email y llama a Supabase reset password. |
| `src/pages/UpdatePasswordPage.tsx` | OK. Actualiza contraseña con sesión de recovery. |
| `src/pages/SignInPage.tsx` | OK. Login usa Supabase Auth. |
| `src/pages/CreateAccountPage.tsx` | OK. Registro usa Supabase Auth y metadata. |
| `src/routes/AppRoutes.tsx` | OK. Existe ruta pública `/actualizar-contrasena`. |
| `scripts/qa-functional-routes.mjs` | Actualizado para incluir `/actualizar-contrasena` en QA funcional. |

No se encontró hardcode de `localhost` ni `127.0.0.1` en el flujo de recuperación dentro de `src/`.

## Configuración requerida en Supabase Dashboard

Ruta:

`Authentication` → `URL Configuration`

### Site URL

Configurar con la URL principal de staging cuando esté disponible:

```text
https://URL-STAGING
```

### Redirect URLs

Agregar:

```text
https://URL-STAGING/**
https://URL-STAGING/actualizar-contrasena
https://URL-STAGING/entrar
https://URL-STAGING/crear-cuenta
https://URL-STAGING/app
http://localhost:8080/**
http://127.0.0.1:8080/**
```

Reemplazar `https://URL-STAGING` por el dominio real de Vercel u otro hosting.

## Flujo esperado de recuperación

1. Usuario abre `/recuperar`.
2. Ingresa su correo.
3. Supabase envía email de recuperación.
4. El enlace debe abrir `https://URL-STAGING/actualizar-contrasena`.
5. Usuario define nueva contraseña.
6. La app redirige a `/app`.
7. Login posterior funciona con la nueva contraseña.

## Bloqueo actual

No existe URL staging real generada desde este entorno. La configuración exacta de Site URL y Redirect URLs debe completarse al crear el deploy.

Estado: `BLOCKED_PENDING_STAGING_URL`.

## Validaciones locales

| Comando | Resultado |
| --- | --- |
| `npm run lint` | OK |
| `npm run build` | OK |
| `npm run qa:functional` | OK con `/actualizar-contrasena` incluido tras la actualización. |
