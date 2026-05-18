# Certificación funcional por módulo en staging

## Resumen

La certificación sobre URL pública de staging no pudo ejecutarse desde este entorno porque no existe un deploy staging disponible y Vercel CLI quedó bloqueado por autenticación/proyecto no enlazado.

- URL staging: no disponible.
- Estado: `BLOQUEADO_SIN_URL_STAGING`.
- Evidencia local previa: QA local completo en `http://127.0.0.1:8080` con resultado OK.

Esta tabla queda lista para completarse inmediatamente después de crear el deploy.

## Evidencia local disponible

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

## Matriz staging

| Módulo | Ruta staging | Prueba | Resultado | Evidencia | Observación |
| --- | --- | --- | --- | --- | --- |
| Auth/Login | `/`, `/entrar` | Redirección `/`, login admin, logout, login usuario normal | `BLOQUEADO_SIN_URL_STAGING` | Pendiente URL pública | Local Auth OK. |
| Registro | `/crear-cuenta` | Crear usuario de prueba, crear profile, confirmar no admin | `BLOQUEADO_SIN_URL_STAGING` | Pendiente URL pública | Requiere Site URL staging en Supabase. |
| Recuperación | `/recuperar`, `/actualizar-contrasena` | Solicitar email, abrir link, cambiar contraseña | `BLOQUEADO_SIN_URL_STAGING` | Pendiente URL pública y correo real | Código usa origin dinámico. |
| Perfil | `/app/perfil` | Editar nombre, username, ciudad, país, iglesia, bio, avatar URL | `BLOQUEADO_SIN_URL_STAGING` | Pendiente URL pública | Local QA funcional cubre perfil. |
| Oración | `/app/oracion` | Crear petición, orar, contador, marcar respondida, bloqueo ajeno | `BLOQUEADO_SIN_URL_STAGING` | Pendiente URL pública | `QA_PRAYER_OK` local. |
| Foros | `/app/foros` | Crear post, versículo, comentar, reaccionar, reportar | `BLOQUEADO_SIN_URL_STAGING` | Pendiente URL pública | `QA_FORUMS_OK` local. |
| Devocional | `/app/devocional` | Marcar leído, guardar favorito, revisar historial | `BLOQUEADO_SIN_URL_STAGING` | Pendiente URL pública | Local QA funcional OK. |
| Juegos | `/app/juegos` | Completar Versículo Rápido y Trivia, ver puntaje, repetir | `BLOQUEADO_SIN_URL_STAGING` | Pendiente URL pública | Local QA funcional OK. |
| Mapa | `/app/mapa` | Filtrar país/ciudad, sugerir comunidad | `BLOQUEADO_SIN_URL_STAGING` | Pendiente URL pública | Local QA funcional OK. |
| Seguridad/reportes | `/app/seguridad` | Crear reporte, validar privacidad de reportes | `BLOQUEADO_SIN_URL_STAGING` | Pendiente URL pública | Local QA funcional OK. |
| Preferencias | `/app/perfil` | Cambiar switches, guardar, refrescar | `BLOQUEADO_SIN_URL_STAGING` | Pendiente URL pública | Local QA funcional OK. |
| Admin | `/app/admin` | Admin ve KPIs/reportes/devocionales; no admin bloqueado | `BLOQUEADO_SIN_URL_STAGING` | Pendiente URL pública | Local QA funcional y RLS OK. |
| PWA | manifest/service worker | Instalar Android/desktop, abrir icono, offline fallback | `BLOQUEADO_SIN_URL_STAGING` | Pendiente dispositivo real con URL pública | Build y smoke PWA OK. |
| Routing | rutas públicas/privadas | Refrescar rutas profundas sin 404 | `BLOQUEADO_SIN_URL_STAGING` | Pendiente URL pública | Local QA rutas OK. |

## Checklist para completar al tener URL staging

1. Registrar la URL exacta.
2. Configurar Supabase Auth Site URL y Redirect URLs.
3. Ejecutar `npm run qa:functional` con `QA_APP_BASE_URL=https://URL-STAGING`.
4. Probar recuperación de contraseña con email real.
5. Probar login admin y usuario normal desde navegador.
6. Probar PWA en Android y desktop.
7. Actualizar esta matriz con evidencia real por módulo.

## Dictamen de esta fase

`BLOQUEADO_SIN_URL_STAGING`: el producto está validado localmente, pero no hay certificación pública staging porque no existe URL de deploy generada desde este entorno.
