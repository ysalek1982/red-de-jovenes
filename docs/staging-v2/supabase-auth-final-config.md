# Configuracion final de Supabase Auth para staging

Fecha: 2026-05-18

## Objetivo

Dejar preparado el checklist exacto para que Auth funcione en la URL staging real una vez Vercel genere el dominio.

## Configuracion requerida en Supabase

En el dashboard de Supabase:

`Authentication` -> `URL Configuration`

### Site URL

Reemplazar por la URL staging real:

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

Mantener las URLs locales mientras se use QA local.

## Revision de codigo

Archivos revisados:

- `src/features/auth/authService.ts`
- `src/pages/SignInPage.tsx`
- `src/pages/UpdatePasswordPage.tsx`
- `src/pages/CreateAccountPage.tsx`

Resultado:

- Recuperacion de password usa `redirectTo` dinamico basado en `window.location.origin`.
- La ruta de recuperacion final es `/actualizar-contrasena`.
- No hay URL de localhost hardcodeada en `src/`.
- No hay URL de Vercel hardcodeada en `src/`.
- Login y registro usan Supabase Auth normal con publishable key.

## Flujo esperado en staging

1. Usuario solicita recuperacion desde `https://URL-STAGING/recuperar`.
2. Supabase envia email con redirect permitido.
3. El enlace abre `https://URL-STAGING/actualizar-contrasena`.
4. Usuario define nueva contrasena.
5. La app lo redirige a `/app`.

## Pruebas pendientes hasta tener URL

- Solicitar recuperacion con email real controlado.
- Confirmar llegada del email.
- Abrir el enlace desde el correo.
- Confirmar que no cae en localhost.
- Cambiar contrasena e iniciar sesion.

Estado: **PENDIENTE_URL_STAGING**.
