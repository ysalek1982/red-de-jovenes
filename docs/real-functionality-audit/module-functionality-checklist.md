# Checklist de funcionalidad real por modulo

Fecha: 2026-05-18

## Criterio

Un modulo se considera funcional si carga sin error, usa datos reales o datos demo identificados, permite la operacion principal esperada, respeta RLS, muestra estados de carga/error/vacio y no deja botones decorativos.

## Matriz

| Modulo | Ruta | Funcion esperada | Funciona realmente? | Usa datos reales? | Puede crear datos? | Puede actualizar datos? | Puede eliminar/cerrar datos? | Respeta RLS? | Estados loading/error/empty | Movil | Problemas encontrados | Accion requerida | Estado final |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Auth/Login | `/entrar` | Login con Supabase | Si | Si | No aplica | Sesion | Logout | Si | Si | Si | Ninguno bloqueante | Mantener QA | OK |
| Registro | `/crear-cuenta` | Crear usuario y perfil | Si | Si | Si | Perfil via trigger | No aplica | Si | Si | Si | Confirmacion email depende de config | Documentado | OK |
| Recuperacion | `/recuperar`, `/actualizar-contrasena` | Reset password | Parcial | Si | No aplica | Password | No aplica | Supabase | Si | Si | Requiere email real/URL staging | Documentar como pendiente externo | Observacion |
| Perfil | `/app/perfil` | Editar perfil y preferencias | Si | Si | Preferencias | Perfil/preferencias | No aplica | Si | Si | Si | Sin subida real de avatar | Documentar Storage futuro | OK |
| Inicio privado | `/app` | Centro de usuario | Si | Si | No aplica | No aplica | No aplica | Si | Si | Si | Ninguno bloqueante | Verificar sin metricas falsas | OK |
| Oracion | `/app/oracion` | Peticiones y soporte | Si | Si | Si | Propias/respondida | Propias si aplica | Si | Si | Si | Ninguno bloqueante | QA especifico | OK |
| Foros con la Palabra | `/app/foros` | Posts, comentarios, reacciones | Si | Si | Si | Propios | Propios | Si | Si | Si | Ninguno bloqueante | QA especifico | OK |
| Devocional | `/app/devocional` | Lectura diaria y progreso | Si | Si | Admin | Admin | Favoritos propios | Si | Si | Si | Quitar lectura no aplica | Documentar regla | OK |
| Juegos | `/app/juegos` | Juegos y puntaje propio | Si | Preguntas locales + puntajes reales | Puntaje | No aplica | Propio en QA | Si | Si | Si | Preguntas locales son contenido app | Documentar | OK |
| Mapa Mundial | `/app/mapa` | Directorio real de comunidades | Parcial | Si | Sugerencias | Admin | Admin | Si | Parcial | Si | Mapa decorativo, sin mis sugerencias, sin ciudad/filtros completos, sin descripcion | Corregir prioritariamente | En correccion |
| Espacio seguro/reportes | `/app/seguridad` | Normas y reportes | Si | Si | Reporte | Admin | Admin cambia estado | Si | Si | Si | Ninguno bloqueante | QA/admin | OK |
| Preferencias | `/app/perfil` | Guardar preferencias | Si | Si | Si por defecto/upsert | Si | No aplica | Si | Si | Si | Push real no implementado | Documentado | OK |
| Admin | `/app/admin` | Operacion de piloto | Parcial | Si | Devocional/admin | Reportes/sugerencias/devocionales | No aplica | Si | Si | Si | KPIs debian enfocarse en pendientes/activos y evitar duplicados de grupos | Corregir | En correccion |
| PWA local/offline | App instalada | Manifest, SW, offline | Si local | Assets reales | No aplica | No aplica | No aplica | No cachea Supabase | Si | Pendiente dispositivo | Prueba real requiere HTTPS/staging | Documentado |
| Demo publico | `/demo` | Demo sin login | Si | Mock identificado como demo | No aplica | No aplica | No aplica | No aplica | Si | Si | Es demo publico | Mantener | OK |

## Validaciones iniciales

| Comando | Resultado |
| --- | --- |
| `npm run lint` | OK |
| `npm run build` | OK |
| `npm run smoke:build` | OK |
| `npm run qa:auth` | OK |
| `npm run qa:rls` | OK |
| `npm run qa:functional` | OK |
| `npm run qa:prayer` | OK |
| `npm run qa:forums` | OK |
| `npm run qa:admin` | OK |
| `npm run qa:games` | OK |
| `npm run qa:map` | OK |
