# Estados de carga, vacio y error

## Revision por modulo

| Modulo | Loading | Empty state | Error humano | Recuperacion |
|---|---|---|---|---|
| Home | Carga por servicios existentes | Mensajes de inicio comunitario | Fallback de ruta | Volver a inicio / recargar |
| Biblia | Cargando Biblia | Capitulo no importado / guardados vacios | Mensaje sin stack trace | Reintentar con ruta / error boundary |
| Devocional | Carga devocional | Fallback ultimo activo / vacio util | Mensaje humano | Recargar modulo |
| Oracion | Cargando peticiones | Primera peticion sugerida | `No pudimos cargar...` | Filtros y reintento por navegacion |
| Foros | Cargando comunidad | Primer post sugerido | `No pudimos cargar...` | Reintentar modulo |
| Juegos | Estado activo inmediato | Historial vacio | Puntaje no guardado | Repetir juego |
| Mapa | Cargando comunidades | Sugerir comunidad | `No pudimos cargar...` | Limpiar filtros / sugerir |
| Eventos | Cargando eventos | No hay eventos para filtro | Estado de operacion | Cambiar filtro |
| Discipulado | Tracks disponibles | CTA de continuar | Fallback de ruta | Reintentar modulo |
| Mensajes | Cargando conversaciones | Empezar conversacion | Estado de operacion | Seleccionar/crear conversacion |
| Perfil | Carga perfil | CTA completar perfil | Mensaje humano | Guardar otra vez |
| Admin | Carga panel | Ceros reales | Mensajes de seccion | Reintentar / volver inicio |
| Construir la Red | Estados de sugerencias | CTA invitar/sugerir | Mensaje humano | Reenviar |

## Mejoras aplicadas en esta fase

- Fallback lazy accesible con `aria-live` y `aria-busy`.
- Error boundary por modulo con acciones `Reintentar` y `Volver al inicio`.
- Los errores de render no muestran stack trace al usuario.
- Se conserva el hotfix de scroll movil para que estados nuevos aparezcan en zona visible.

## Decision

No se agregaron pantallas nuevas ni modulos. Los estados existentes se consideran suficientes para piloto, con cobertura adicional de error boundary para fallas inesperadas.
