# Auditoria de primera experiencia

Fecha: 2026-05-21

Release base: `pilot-v1.2.0`

## Resumen

La app ya funciona como red cristiana juvenil, pero el primer ingreso todavia depende de que el joven descubra por su cuenta que acciones conviene hacer primero. La Fase 41 agrega una capa liviana de orientacion sin crear modulos grandes ni tocar Auth/RLS.

## Hallazgos

| Pantalla | Problema | Riesgo | Accion |
| --- | --- | --- | --- |
| `/crear-cuenta` | Explica el registro, pero no anticipa claramente el camino posterior. | El usuario nuevo puede entrar sin saber cual es su primer paso. | Mantener flujo y reforzar orientacion desde `/app`. |
| `/app` | Tiene acciones y actividad real, pero los primeros pasos no se marcan con estado real. | El usuario no sabe si ya avanzo o que falta para participar. | Agregar checklist de bienvenida basado en datos reales. |
| `/app` | Perfil incompleto se detecta de forma basica. | La red se siente menos comunitaria si muchos perfiles quedan vacios. | Calcular porcentaje y mostrar CTA especifico. |
| `/app/biblia` | Es completa, pero puede intimidar a un usuario nuevo. | Primer uso lento o abandono si no sabe por donde empezar. | Agregar ayuda contextual breve para empezar con Juan 3, Salmos 23 o versiculo diario. |
| `/app/foros` | El composer existe y hay ideas sugeridas, pero el nuevo usuario puede no saber que publicar. | Menor participacion social. | Reforzar microcopy: reflexion, pregunta, testimonio o palabra de animo. |
| `/app/oracion` | El modulo funciona, pero puede sentirse como lista para usuarios nuevos. | Menos apoyo de oracion. | Reforzar mensaje de acompanamiento y CTA de primera accion. |
| `/app/juegos` | Los juegos son jugables, pero el primer CTA debe ser muy directo. | El usuario puede explorar sin jugar. | Mostrar ayuda contextual si no hay historial. |
| `/app/mapa` | Comunidades y membresias funcionan, pero la accion "unirse" necesita contexto inicial. | El usuario puede buscar sin completar pertenencia. | Mostrar guia breve para encontrar o sugerir comunidad. |
| `/app/mensajes` | Mensajes seguros existen, pero nuevo usuario puede no tener conversaciones. | Empty state frio o inaccion. | Reforzar: conectar con jovenes de tus comunidades. |
| `/app/eventos` | Eventos existen, pero el primer uso puede no ser evidente. | Menos confirmaciones de asistencia. | Reforzar empty state y filtros como primer paso. |
| Menu "Mas" | No existe una guia rapida enlazable. | Usuarios piloto dependen de instrucciones externas. | Agregar `/app/guia` accesible desde "Mas". |
| Admin | Hay metricas piloto, pero no hitos de activacion. | Lideres no ven si los jovenes estan llegando a primera accion. | Agregar metricas reales de activacion. |

## Decisiones

- No se agregan tablas ni migraciones.
- El checklist se calcula desde tablas existentes.
- La preferencia de colapso del checklist se guarda en `localStorage` por usuario.
- La guia rapida sera ruta privada `/app/guia`.
- Seguridad sigue fuera del menu visible; los reportes se explican como cuidado comunitario.
