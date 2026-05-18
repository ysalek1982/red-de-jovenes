# Endurecimiento de mapa mundial

## Ruta revisada

- `/app/mapa`

## Hallazgos

| Punto | Estado antes | Accion |
| --- | --- | --- |
| Lista de comunidades | Funcional con `groups` | Sin cambio |
| Filtro por pais | Funcional | Sin cambio |
| Busqueda por ciudad/iglesia | Funcional | Sin cambio |
| Sugerir comunidad | Funcional con `group_suggestions` | Sin cambio |
| Metricas | Usaban valores de landing como fallback | Corregido |
| Mapa visual | Simulado | Etiquetado como referencia visual |

## Correcciones realizadas

- El titulo ya no promete “47 paises” dentro de la vista privada.
- Los KPIs muestran datos reales: comunidades, paises y resultados visibles.
- El mapa se presenta como referencia visual, mientras la lista indica datos reales de Supabase.

## QA

- `npm run qa:functional` valida lectura de grupos y creacion de sugerencia.
- Admin revisa sugerencias en `/app/admin`.

## Estado

**Funcional base para piloto.**

Pendiente futuro: mapa geografico real con coordenadas si el piloto confirma necesidad.
