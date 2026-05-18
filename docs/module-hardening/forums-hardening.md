# Endurecimiento de Foros con la Palabra

## Rutas revisadas

- `/app/foros`
- `/app/comunidad`

## Hallazgos

| Punto | Estado antes | Accion |
| --- | --- | --- |
| Crear publicacion | Funcional con Supabase | Cubierto por QA especifico |
| Versiculo opcional | Funcional | Cubierto por QA especifico |
| Comentarios | Funcionales | Cubierto por QA especifico |
| Reaccion Amen | Funcional con unique constraint | Cubierto por QA especifico |
| Publicaciones ajenas | RLS bloquea update/delete | Cubierto por QA especifico |
| Reportar post | Funcional | Sin cambio |
| Reportar comentario | Faltaba accion visible | Corregido |
| Temas sugeridos | Se mostraban con conteos demo que podian parecer reales | Corregido con etiqueta de guia sugerida |

## Correcciones realizadas

- Se agrego reporte de comentarios.
- Los temas sugeridos ahora se presentan como guias de conversacion, no actividad real.
- Se retiro el uso visible de contadores demo en esos temas.
- Se agrego `npm run qa:forums`.

## QA especifico

Comando:

```bash
npm run qa:forums
```

Cubre:

- crear post con referencia y texto biblico;
- crear comentario;
- crear reaccion Amen;
- impedir reaccion duplicada;
- reportar comentario;
- impedir que usuario B edite post de usuario A;
- impedir que usuario B elimine comentario de usuario A;
- limpiar post QA.

## Estado

**Funcional para piloto.**
