# Endurecimiento de espacio seguro y reportes

## Ruta revisada

- `/app/seguridad`

## Auditoria

| Punto | Estado |
| --- | --- |
| Normas de comunidad | Visibles y con tono pastoral |
| Reportar desde pagina | Funcional usando `content_reports` |
| Reportar post | Funcional desde foros |
| Reportar oracion | Funcional desde sala de oracion |
| Reportar comentario | Agregado en foros |
| Motivo obligatorio | Validado en formulario |
| Detalle opcional | Disponible |
| Usuario ve reportes propios | Funcional |
| Usuario no ve reportes ajenos | Cubierto por RLS |
| Admin ve reportes pendientes | Funcional en `/app/admin` |

## Correcciones relacionadas

- Se agrego accion visible para reportar comentarios en Foros con la Palabra.
- La documentacion de piloto ya define proceso pastoral de moderacion.

## QA

- `npm run qa:forums` valida reporte de comentario.
- `npm run qa:functional` valida creacion de reporte.
- `npm run qa:rls` valida limites generales de escritura/roles.

## Estado

**Funcional para piloto.**

Pendiente operativo: asignar responsable humano para revisar reportes diariamente.
