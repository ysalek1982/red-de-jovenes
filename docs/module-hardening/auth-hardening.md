# Endurecimiento de Auth, registro y recuperacion

## Rutas revisadas

- `/`
- `/entrar`
- `/crear-cuenta`
- `/recuperar`
- `/actualizar-contrasena`

## Hallazgos

| Punto | Estado antes | Accion |
| --- | --- | --- |
| Entrada `/` | Redirigia por sesion correctamente | Sin cambio |
| Login | Funcional con Supabase | Se reforzaron mensajes de error para rate limit y credenciales invalidas |
| Registro | Funcional con metadata y trigger `profiles` | Documentado como OK; duplicados dependen de Auth/DB |
| Recuperacion | Enviaba email, pero redirigia a `/entrar` sin pantalla para nueva contrasena | Corregido con ruta `/actualizar-contrasena` |
| Logout | Cubierto por AppShell y QA | Sin cambio |

## Correcciones realizadas

- `sendPasswordResetEmail()` ahora usa redirect a `/actualizar-contrasena`.
- Se agrego `updatePassword()` en `authService`.
- Se creo `UpdatePasswordPage`.
- Se registro la ruta `/actualizar-contrasena`.
- Se mejoraron mensajes de login para:
  - email no confirmado;
  - rate limit;
  - credenciales invalidas.

## QA

Validaciones automatizadas:

- `npm run qa:auth`: cubre login real de usuarios QA A/B.
- `npm run qa:rls`: confirma aislamiento posterior al login.

Pendiente manual de staging:

- probar envio real de email de recuperacion;
- confirmar que Supabase Site URL y Redirect URLs incluyen la URL staging;
- abrir el enlace de recuperacion desde correo y actualizar contrasena.

## Estado

**Funcional para piloto con observacion operativa:** el cambio cierra el flujo de nueva contrasena en la app, pero la entrega del email depende de configuracion Supabase y URL staging.
