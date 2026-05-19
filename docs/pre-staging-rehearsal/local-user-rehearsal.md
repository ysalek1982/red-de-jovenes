# Ensayo local con usuarios piloto simulados

Fecha: 2026-05-18

## Objetivo

Validar que los recorridos principales de piloto cerrado funcionan de forma repetible usando usuarios QA reales y administrador, sin `service_role` en frontend.

## Comandos ejecutados

```bash
npm run qa:journeys
npm run lint
npm run build
```

## Escenario A - Joven nuevo

| Paso | Resultado |
| --- | --- |
| Iniciar sesion con usuario QA A | OK |
| Completar perfil | OK |
| Leer devocional | OK |
| Marcar devocional como leido | OK |
| Guardar devocional favorito | OK |
| Crear peticion de oracion | OK |
| Publicar en Foros con la Palabra | OK |
| Jugar flujo con puntaje | OK |
| Sugerir comunidad | OK |
| Cerrar sesion | OK |

## Escenario B - Joven participante

| Paso | Resultado |
| --- | --- |
| Iniciar sesion con usuario QA B | OK |
| Orar por peticion de otro usuario | OK |
| Comentar publicacion de otro usuario | OK |
| Reaccionar con Amen | OK |
| Reportar contenido | OK |
| Verificar bloqueo de admin | OK |
| Cerrar sesion | OK |

## Escenario C - Admin/lider

| Paso | Resultado |
| --- | --- |
| Iniciar sesion como admin | OK |
| Revisar/moderar reporte | OK |
| Aprobar sugerencia de comunidad | OK |
| Crear grupo activo desde aprobacion | OK |
| Confirmar bloqueo de no-admin | OK |
| Cerrar sesion | OK |

## Escenario D - Seguridad

| Paso | Resultado |
| --- | --- |
| Usuario crea reporte | OK |
| Admin revisa reporte | OK |
| Admin cambia estado | OK |
| Usuario normal no ve reportes ajenos | OK |

## Resultado

`npm run qa:journeys` devolvio:

- `QA_JOURNEYS_OK`
- `cleanupWarnings`: `[]`

## Estado final

**LOCAL_USER_REHEARSAL_OK**
