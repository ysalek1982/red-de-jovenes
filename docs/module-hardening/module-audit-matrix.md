# Matriz maestra de auditoria funcional

Fecha: 2026-05-18  
Base auditada: `529a91f Prepara despliegue staging para piloto`

## Validacion inicial

| Comando | Resultado |
| --- | --- |
| `npm run lint` | OK |
| `npm run build` | OK |
| `npm run qa:auth` | `QA_AUTH_OK` |
| `npm run qa:rls` | `QA_RLS_OK` |
| `npm run smoke:build` | `SMOKE_BUILD_OK` |

## Matriz

| Modulo | Ruta | Estado actual | Funciona realmente | Que funciona | Que no funciona | Que esta incompleto | Riesgo | Accion requerida | Prioridad | Estado final |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Auth/Login | `/`, `/entrar` | Conectado a Supabase | Si | Login, sesion, errores base, redireccion por sesion | Recuperacion depende de configuracion Supabase | QA browser/manual de errores especificos | Usuarios pueden confundirse si email confirmation cambia | Documentar casos y mantener QA Auth | Alta | En endurecimiento |
| Registro/Onboarding | `/crear-cuenta` | Conectado a Supabase | Si | Registro con metadata y perfil por trigger | Username duplicado depende de validacion frontend/DB | Mensajes de confirmacion por email dependen de Auth config | Registro piloto puede bloquearse si Auth requiere email y redirects no estan listos | Revisar docs y mensajes | Alta | En endurecimiento |
| Recuperacion de contrasena | `/recuperar` | Implementada con Supabase | Parcial | Solicita reset por email | Flujo completo depende de Site URL/Redirect URLs | Prueba real en staging pendiente | Usuarios no podran recuperar acceso si redirects estan mal | Documentar dependencia de deploy | Media | En endurecimiento |
| Perfil | `/app/perfil` | Editable | Si | Perfil, bio, ubicacion, preferencias | Avatar visual limitado a URL | QA especifico de no editar ajeno esta en RLS general | Perfil incompleto reduce comunidad | Checklist y QA RLS | Alta | En endurecimiento |
| Inicio privado | `/app` | Funcional | Si | Saludo, resumen, accesos, datos reales | Depende de datos existentes para mostrar actividad | QA visual responsive manual | Navegacion inicial puede parecer vacia con pocos datos | Revisar copy/empty states | Media | En endurecimiento |
| Sala de oracion | `/app/oracion` | Funcional | Si | Crear, listar, apoyar, marcar respondida, borrar propia | No hay QA dedicado por modulo | Reporte integrado depende de Safety | Riesgo si contador o duplicados fallan | Crear QA especifico | Alta | En endurecimiento |
| Foros con la Palabra | `/app/foros`, `/app/comunidad` | Funcional | Si | Posts, versiculo, comentarios, Amen, borrar propia | No hay QA dedicado por modulo | Reporte de comentario debe revisarse | Riesgo de interaccion duplicada o permisos | Crear QA especifico | Alta | En endurecimiento |
| Devocional diario | `/app/devocional` | Funcional | Si | Devocional, fallback, leido, favorito, historial | Depende de seed/contenido admin | Quitar favorito debe validarse manualmente | Sin contenido nuevo se agota experiencia | Documentar y QA funcional | Media | En endurecimiento |
| Juegos de fe | `/app/juegos` | Frontend funcional base | Parcial | Versiculo Rapido, Trivia, puntaje | Persistencia de puntaje puede no estar conectada si no hay tabla | QA automatizado pendiente | Puede sentirse liviano para piloto prolongado | Documentar alcance base | Media | En endurecimiento |
| Mapa mundial | `/app/mapa` | Funcional base | Si | Grupos, filtros, sugerencias | Mapa es visual/simulado, no geolocalizacion real | QA especifico pendiente | Usuario puede esperar mapa real interactivo | Aclarar alcance y revisar sugerencias | Media | En endurecimiento |
| Espacio seguro/reportes | `/app/seguridad` | Funcional base | Si | Normas y reportes | Reportar desde todos los objetos requiere revision UI | Moderacion humana pendiente | Reportes sin proceso operativo son riesgo pastoral | Documentar y QA | Alta | En endurecimiento |
| Preferencias/notificaciones | `/app/perfil` | Funcional base | Si | Preferencias guardadas | Push real no implementado | Debe decir claramente que son preferencias futuras | Expectativa incorrecta de notificaciones reales | Documentar alcance | Media | En endurecimiento |
| Panel admin | `/app/admin` | Funcional inicial | Si | KPIs, listas, devocional, reportes, sugerencias | No es consola completa | QA admin automatizado limitado | Operacion piloto depende de admin | Checklist y docs | Alta | En endurecimiento |
| PWA/offline/install | Manifest/SW | Base instalable | Parcial | Manifest, SW, fallback, smoke build | Instalacion real en dispositivo pendiente | Iconos PNG/maskables avanzados no agregados | PWA puede variar por navegador | Mantener checklist real | Media | En endurecimiento |
| Landing/demo/routing | `/landing`, `/demo`, rutas | Funcional | Si | Entrada a login, landing, demo, privadas protegidas | SPA fallback depende de hosting | QA de deploy pendiente | Refresh en staging falla si fallback mal configurado | Documentar hosting | Alta | En endurecimiento |
| Supabase/RLS | DB/RLS | Validado | Si | QA Auth/RLS A/B, migraciones alineadas | Politicas futuras deben seguir incrementales | Monitoreo en piloto pendiente | Cambios futuros pueden romper aislamiento | Mantener QA antes de deploy | Alta | En endurecimiento |

## Hallazgos iniciales

1. La cobertura automatizada general es fuerte, pero falta separar QA por modulo para oracion y foros.
2. PWA esta lista como base, pero la instalacion real sigue pendiente de dispositivo.
3. Recuperacion de contrasena depende de Site URL y Redirect URLs del hosting final.
4. Juegos de fe son funcionales en frontend, pero deben presentarse como primera version de piloto, no producto final.
5. Admin es suficiente para piloto, no para operacion publica amplia.
