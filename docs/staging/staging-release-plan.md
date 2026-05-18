# Plan de release staging

## Estado base

- Proyecto: Red de Jóvenes.
- Rama: `codex/red-de-jovenes-inicial`.
- Commit base: `385fc37 Documenta endurecimiento funcional por modulos`.
- Fecha de preparación: 2026-05-18.
- Supabase project ref: `ntlzlfbztryasbmjnynq`.
- Migraciones local/remoto alineadas hasta `20260518080000`.

## Módulos incluidos

| Módulo | Estado para release |
| --- | --- |
| Auth/Login | Incluido con Supabase Auth real. |
| Registro/Onboarding | Incluido con creación de perfil. |
| Recuperación de contraseña | Incluida con redirección dinámica a `/actualizar-contrasena`. |
| Perfil | Incluido con edición de datos propios. |
| Inicio privado `/app` | Incluido con resumen y accesos a módulos. |
| Sala de oración | Incluida con creación, soporte, estado respondida y RLS. |
| Foros con la Palabra | Incluido con posts, comentarios, reacciones y reportes. |
| Devocional diario | Incluido con lectura, favorito, historial y fallback. |
| Juegos de fe | Incluido con juegos frontend y puntajes. |
| Mapa mundial | Incluido con grupos, filtros y sugerencias. |
| Espacio seguro/reportes | Incluido con creación de reportes. |
| Preferencias | Incluidas con persistencia de preferencias. |
| Panel admin | Incluido y protegido por rol. |
| PWA/offline/install | Incluida con manifest, service worker y fallback offline. |
| Landing/demo/routing | Incluidos con `/landing`, `/demo` y entrada `/`. |

## Variables requeridas para hosting frontend

Configurar únicamente estas variables en Vercel u otro hosting frontend:

```env
VITE_SUPABASE_URL=https://ntlzlfbztryasbmjnynq.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

No configurar en hosting frontend:

- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`
- `QA_USER_A_PASSWORD`
- `QA_USER_B_PASSWORD`
- contraseñas de base de datos
- connection strings privadas
- archivos `.env.admin.local` o `.env.qa.local`

## Validaciones base ejecutadas

| Comando | Resultado |
| --- | --- |
| `npm run lint` | OK |
| `npm run build` | OK |
| `npm run smoke:build` | `SMOKE_BUILD_OK` |
| `npm run qa:auth` | `QA_AUTH_OK` |
| `npm run qa:rls` | `QA_RLS_OK` |
| `npm run qa:functional` | `QA_FUNCTIONAL_ROUTES_OK` |
| `npm run qa:prayer` | `QA_PRAYER_OK` |
| `npm run qa:forums` | `QA_FORUMS_OK` |

## Riesgos

| Riesgo | Impacto | Mitigación |
| --- | --- | --- |
| No hay URL staging real todavía | No se puede certificar contra dominio público. | Crear proyecto en Vercel y repetir certificación sobre la URL generada. |
| Supabase Auth sin Site URL staging | Recovery/login por email puede redirigir incorrectamente. | Configurar Site URL y Redirect URLs antes del piloto. |
| PWA no probada en dispositivo real desde staging | Instalación real puede variar por navegador. | Ejecutar checklist PWA en Android y desktop con URL staging. |
| Usuarios piloto reales sin confirmación de email | Bloqueo de login si la confirmación está activa. | Definir política de confirmación y validar correos salientes en Supabase. |

## Checklist de despliegue

1. Crear proyecto staging en Vercel.
2. Conectar repositorio y rama `codex/red-de-jovenes-inicial` o rama de release.
3. Configurar framework `Vite`.
4. Configurar build command `npm run build`.
5. Configurar output directory `dist`.
6. Agregar solo variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`.
7. Verificar SPA fallback a `index.html`.
8. Configurar Supabase Auth con la URL staging.
9. Ejecutar certificación funcional por módulo sobre la URL staging.
10. Registrar hallazgos antes de iniciar piloto.
