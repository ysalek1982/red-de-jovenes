# Reporte final del ensayo general pre-staging

Fecha: 2026-05-18

## Dictamen

**LISTO PARA STAGING REAL**

## Resumen ejecutivo

Se ejecuto el ensayo general local del piloto cerrado sin trabajar Vercel, staging ni deployment. La app conserva el concepto cristiano/PWA, no se agregaron modulos nuevos y se valido que los datos semilla, recorridos de usuario, permisos, QA e idempotencia funcionan de forma repetible.

## Estado de datos semilla

| Area | Estado |
| --- | --- |
| Devocionales activos | OK |
| Devocionales piloto | 7 registros base |
| Comunidades activas | OK |
| Comunidades Bolivia | Santa Cruz, La Paz y Cochabamba OK |
| Comunidades internacionales piloto | OK |
| Juegos | 15 preguntas por juego |
| Normas de comunidad | OK |

## Estado de devocionales

- Tienen titulo, referencia, reflexion, oracion y fecha valida.
- No hay duplicados por fecha.
- Devocional del dia o fallback disponible.
- Progreso y favoritos son idempotentes.

## Estado de comunidades/mapa

- Mapa lee comunidades reales de Supabase.
- Filtros por pais y ciudad funcionan.
- Busqueda funciona.
- No se detectaron duplicados basicos por nombre + pais + ciudad.
- No se detectaron contactos personales ficticios.
- Sugerencias y aprobacion admin funcionan.

## Estado de juegos

- Versiculo Rapido: 15 preguntas.
- Trivia Biblica: 15 preguntas.
- Opciones completas.
- Respuestas correctas validas.
- Puntaje e historial propio funcionan.
- Usuario no puede escribir puntajes ajenos.

## Estado de escenarios de usuario

| Escenario | Estado |
| --- | --- |
| Joven nuevo | OK |
| Joven participante | OK |
| Admin/lider | OK |
| Seguridad/reportes | OK |

## Estado de permisos/RLS

- Usuario normal no accede a admin.
- Usuario normal no aprueba comunidades.
- Usuario normal no crea grupos activos.
- Usuario normal no crea devocionales.
- Usuario normal no cambia reportes.
- Usuarios no modifican datos ajenos.
- Admin puede moderar reportes, devocionales y sugerencias.

## Estado admin

Admin operativo para:

- revisar/moderar reportes;
- crear/editar devocionales;
- aprobar sugerencias de comunidad;
- validar bloqueo de no-admin.

## Resultado QA

| Comando | Resultado |
| --- | --- |
| `npm run lint` | OK |
| `npm run build` | OK |
| `npm run smoke:build` | `SMOKE_BUILD_OK` |
| `npm run qa:seed` | `QA_SEED_DATA_OK` |
| `npm run qa:auth` | `QA_AUTH_OK` |
| `npm run qa:rls` | `QA_RLS_OK` |
| `npm run qa:functional` | `QA_FUNCTIONAL_ROUTES_OK` |
| `npm run qa:prayer` | `QA_PRAYER_OK` |
| `npm run qa:forums` | `QA_FORUMS_OK` |
| `npm run qa:admin` | `QA_ADMIN_OK` |
| `npm run qa:games` | `QA_GAMES_OK` |
| `npm run qa:map` | `QA_MAP_OK` |
| `npm run qa:journeys` | `QA_JOURNEYS_OK` |

## Bugs encontrados

No se detectaron bugs nuevos en Fase 25. La correccion de progreso devocional idempotente fue resuelta en Fase 24 con migracion incremental y se valido nuevamente aqui.

## Bugs corregidos

No hubo cambios de codigo funcional durante Fase 25. Se agrego un script QA de datos semilla y documentacion de ensayo.

## Riesgos

- Recovery por email requiere URL staging y redirect URLs.
- PWA instalada requiere HTTPS y navegador/dispositivo compatible.
- Comunidades base son contenido editable de piloto y deben curarse antes de produccion.
- Devocionales/preguntas deben revisarse pastoralmente antes de piloto amplio.

## Pendientes reales

- Desplegar staging.
- Configurar Supabase Auth para la URL staging.
- Probar registro real con usuarios piloto.
- Probar recovery de password por email.
- Probar PWA instalada en dispositivo real.

## Recomendacion

Avanzar a staging real. Repetir QA completo con `QA_APP_BASE_URL` y completar pruebas manuales de PWA/recovery sobre HTTPS.
