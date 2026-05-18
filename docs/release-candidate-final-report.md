# Release Candidate final - Red de Jovenes

Fecha: 2026-05-18  
Proyecto Supabase: `ntlzlfbztryasbmjnynq`

## 1. Resumen ejecutivo

Red de Jovenes queda en estado **LISTO PARA PILOTO** como app cristiana/PWA para jovenes.

La Fase 15 elimino el bloqueo de QA dinamico creando usuarios QA A/B confirmados mediante script local seguro, valido Auth real, valido RLS real entre dos usuarios, reviso rutas publicas y privadas, reviso PWA, optimizo la carga de rutas y ejecuto auditoria final de secretos.

No se detectaron secretos versionados. La app mantiene el concepto visual y funcional del prototipo Lovable: red social cristiana moderna con login como entrada, landing conservada en `/landing`, demo publico en `/demo` y experiencia privada centrada en oracion, foros, devocional, juegos, mapa, seguridad, perfil y administracion protegida.

## 2. Estado general

| Area | Estado | Evidencia |
| --- | --- | --- |
| Release Candidate | LISTO PARA PILOTO | Fase 15 completada |
| Auth QA | OK | `QA_AUTH_OK` |
| RLS QA | OK | `QA_RLS_OK` |
| Rutas funcionales | OK | `QA_FUNCTIONAL_ROUTES_OK` |
| PWA | OK | manifest, SW, offline fallback e install prompt revisados |
| Seguridad | OK | sin secretos reales versionados |
| Lint | OK | `npm run lint` |
| Build | OK | `npm run build` sin warning de chunk grande |

## 3. Tabla de rutas

| Ruta | Tipo | Estado |
| --- | --- | --- |
| `/` | Entrada PWA | Redirige a `/entrar` sin sesion y a `/app` con sesion |
| `/landing` | Publica | Landing Lovable conservada |
| `/demo` | Publica | Demo de producto completo |
| `/entrar` | Publica | Login Supabase |
| `/crear-cuenta` | Publica | Registro Supabase |
| `/recuperar` | Publica | Recuperacion de contrasena |
| `/app` | Privada | Inicio privado |
| `/app/oracion` | Privada | Sala de oracion global |
| `/app/comunidad` | Privada | Alias funcional de foros |
| `/app/foros` | Privada | Foros con la Palabra |
| `/app/devocional` | Privada | Devocional diario |
| `/app/juegos` | Privada | Juegos de fe |
| `/app/mapa` | Privada | Mapa mundial |
| `/app/seguridad` | Privada | Espacio seguro y reportes |
| `/app/perfil` | Privada | Perfil editable |
| `/app/admin` | Privada admin | Protegida por rol admin |

## 4. Tabla de modulos

| Modulo | Estado | Notas |
| --- | --- | --- |
| Auth | Funcional | QA A/B confirmado con login y sesion |
| Perfil | Funcional | Lectura/edicion de datos propios |
| Oracion | Funcional | Crear peticiones y registrar soporte |
| Foros | Funcional | Posts, comentarios y reacciones |
| Devocional | Funcional | Lectura, marcar leido y favorito |
| Juegos | Funcional base | Juegos frontend y puntaje preparado |
| Mapa | Funcional base | Grupos, filtros y sugerencias |
| Seguridad | Funcional base | Reportes de contenido |
| Preferencias | Funcional base | Preferencias de notificaciones |
| Admin | Funcional inicial | Acceso solo admin y datos de moderacion |
| PWA | Funcional base | Instalacion, manifest, SW y fallback offline |

## 5. Estado Supabase

Supabase CLI operativo y migraciones local/remoto alineadas.

Migraciones alineadas:

- `20260517214049_initial_red_de_jovenes`
- `20260517224917_add_user_roles`
- `20260517225433_add_user_roles_unique_constraint`
- `20260518010000_enhance_profiles_onboarding`
- `20260518020000_add_prayer_supports`
- `20260518030000_add_post_comments_reactions`
- `20260518040000_add_devotional_progress`
- `20260518050000_enhance_groups_suggestions`
- `20260518060000_add_content_reports`
- `20260518070000_add_admin_moderation_policies`
- `20260518080000_add_notification_preferences`

No se crearon migraciones nuevas durante Fase 15.

## 6. Resultado QA Auth

Comando:

```bash
npm run qa:auth
```

Resultado:

- `QA_AUTH_OK`
- Usuario QA A: login, sesion, perfil, devocionales, posts y peticiones OK.
- Usuario QA B: login, sesion, perfil, devocionales, posts y peticiones OK.
- Logout probado por script.

## 7. Resultado QA RLS

Comando:

```bash
npm run qa:rls
```

Resultado:

- `QA_RLS_OK`
- Usuario A puede escribir datos propios.
- Usuario B puede leer datos permitidos.
- Usuario B no puede modificar perfil, posts, comentarios ni peticiones del Usuario A.
- Usuario B no puede manipular roles admin.
- Usuario B no puede escribir devocionales con permisos de cliente.

## 8. Resultado PWA

Revisado:

- `public/manifest.webmanifest`
- `public/sw.js`
- `public/offline.html`
- `src/components/pwa/InstallPrompt.tsx`
- `index.html`

Resultado:

- `start_url`: `/`
- `scope`: `/`
- `display`: `standalone`
- theme/background definidos.
- offline fallback disponible.
- install prompt visible tambien en mobile.
- SW evita cachear endpoints sensibles de Supabase.

Pendiente recomendado: prueba manual final en Chrome Android y Edge/Chrome Desktop instalando la app desde un dispositivo real.

## 9. Resultado lint y build

Comandos:

```bash
npm run lint
npm run build
```

Resultado:

- Lint OK.
- Build OK.
- Warning de chunk grande resuelto mediante lazy loading de rutas publicas.

## 10. Estado de secretos

Resultado: OK.

Se confirmo que:

- `.env.admin.local` esta ignorado.
- `.env.qa.local` esta ignorado.
- `.env.local` esta ignorado.
- No hay secretos reales en docs.
- No hay service role en `src/`.
- Los scripts locales usan service role solo desde variables locales ignoradas.
- No se versionaron contrasenas QA ni admin.

## 11. Commits de Fase 15

| Fase | Commit |
| --- | --- |
| 15.1 | `1350779 Prepara usuarios QA automatizados` |
| 15.2 | `5ef8048 Valida Auth QA final` |
| 15.3 | `8bf55c2 Valida RLS QA final` |
| 15.4 | `cc644d5 Valida rutas funcionales finales` |
| 15.5 | `5ec2c3a Valida PWA instalable final` |
| 15.6 | `e58f154 Optimiza carga de rutas` |
| 15.7 | `d41525e Audita seguridad de release candidate` |
| Ajuste QA | `c7d67a7 Corrige QA funcional idempotente` |
| 15.8 | `Documenta release candidate final` |

## 12. Riesgos

- La instalacion PWA debe confirmarse en dispositivos reales antes de anunciar produccion abierta.
- El modulo admin es funcional inicial, no una consola completa de operaciones.
- Los juegos son primera version funcional; pueden requerir balance de contenido, mas preguntas y persistencia mas rica.
- Los reportes y moderacion requieren proceso humano definido para piloto.

## 13. Pendientes recomendados

1. Prueba piloto con grupo pequeno de jovenes y moderadores.
2. Verificacion manual PWA en Android y desktop.
3. Definir proceso pastoral/moderacion para reportes.
4. Agregar mas devocionales y contenido de juegos.
5. Preparar observabilidad basica de errores para piloto.

## 14. Recomendacion de siguiente fase

Iniciar piloto cerrado con usuarios reales, moderadores definidos y checklist de soporte. Mantener el scope controlado: comunidad, oracion, devocional, juegos, mapa y seguridad.
