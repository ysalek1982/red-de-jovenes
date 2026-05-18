# QA Auth final

## Objetivo

Validar autenticación real con usuarios QA A/B confirmados y credenciales
locales no versionadas.

## Comandos

```bash
npm run qa:auth
npm run lint
npm run build
```

## Resultado

- `npm run qa:auth`: `QA_AUTH_OK`.
- Usuario A:
  - login: OK
  - sesión: OK
  - perfil propio: OK
  - lectura de devocionales: OK
  - lectura de posts: OK
  - lectura de peticiones: OK
  - logout: OK
- Usuario B:
  - login: OK
  - sesión: OK
  - perfil propio: OK
  - lectura de devocionales: OK
  - lectura de posts: OK
  - lectura de peticiones: OK
  - logout: OK

## Validaciones

- `npm run lint`: OK.
- `npm run build`: OK, con warning no bloqueante de chunk grande.

## Seguridad

Las credenciales reales permanecen solo en `.env.qa.local`, ignorado por Git.
No se copiaron correos privados ni contraseñas reales a esta documentación.
