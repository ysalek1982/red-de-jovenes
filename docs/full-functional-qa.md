# QA funcional integral

## Resumen

Se ejecutó QA funcional disponible para la app Red de Jóvenes después de las
fases de desarrollo integral. La validación estática y de build pasa. QA Auth/RLS
dinámico sigue bloqueado porque `.env.qa.local` existe, pero no contiene las
credenciales A/B requeridas.

## Rutas revisadas

| Ruta | Estado esperado | Resultado |
| --- | --- | --- |
| `/` | Redirige a `/entrar` sin sesión o `/app` con sesión | Implementado |
| `/landing` | Landing pública Lovable/PWA | Implementado |
| `/demo` | Demo público del producto | Implementado |
| `/entrar` | Login Supabase | Implementado |
| `/crear-cuenta` | Registro Supabase | Implementado |
| `/recuperar` | Recuperación por email | Implementado |
| `/app` | Inicio privado | Implementado |
| `/app/oracion` | Sala de oración global | Implementado |
| `/app/foros` y `/app/comunidad` | Foros con la Palabra | Implementado |
| `/app/devocional` | Devocional diario | Implementado |
| `/app/juegos` | Juegos de fe funcionales | Implementado |
| `/app/mapa` | Mapa mundial de comunidades | Implementado |
| `/app/seguridad` | Espacio seguro y reportes | Implementado |
| `/app/perfil` | Perfil y preferencias | Implementado |
| `/app/admin` | Admin protegido por rol | Implementado |

## Comandos ejecutados

| Comando | Resultado |
| --- | --- |
| `npm run lint` | OK |
| `npm run build` | OK, warning no bloqueante de chunk grande |
| `npm run qa:auth` | `BLOCKED_MISSING_QA_ENV` |
| `npm run qa:rls` | `BLOCKED_MISSING_QA_ENV` |

## Bloqueo QA A/B

`.env.qa.local` existe, pero faltan:

- `QA_USER_A_EMAIL`
- `QA_USER_A_PASSWORD`
- `QA_USER_B_EMAIL`
- `QA_USER_B_PASSWORD`

No se inventaron resultados dinámicos de Auth/RLS.

## Seguridad

- No se usó service role en frontend.
- Los scripts QA leen credenciales solo desde entorno local.
- No se documentaron correos ni contraseñas QA reales.

## Pendientes

- Completar `.env.qa.local` con dos usuarios QA reales y confirmados.
- Ejecutar nuevamente `npm run qa:auth` y `npm run qa:rls`.
- Ejecutar QA visual en navegador real para 375px, 768px, 1024px y 1440px.
