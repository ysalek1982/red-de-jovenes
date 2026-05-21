# Diagnóstico de scroll móvil

Release base: `pilot-v1.1.0`  
URL staging: `https://red-de-jovenes.vercel.app/`

## Hallazgo general

La aplicación usa React Router con un `AppShell` persistente para rutas privadas. Al cambiar entre módulos desde bottom nav, menú “Más” o enlaces internos, no existía un reset global de scroll/foco. En móviles esto permite que el navegador conserve la posición anterior, por lo que una página nueva puede abrirse visualmente abajo.

También se detectaron interacciones internas que cambian estado o renderizan secciones nuevas sin desplazar el viewport al contenido relevante.

## Matriz de diagnóstico

| Ruta | Acción | Problema | Corrección requerida |
|---|---|---|---|
| Todas | Navegar entre rutas privadas | No hay `ScrollToTop` global ni `history.scrollRestoration = manual` | Crear componente global que resetee scroll/foco en cada cambio de ruta |
| Todas | Navegación con hash | El reset global podría ignorar anchors si se aplica sin control | Respetar `location.hash` y enfocar el destino con `scroll-margin-top` |
| `/app` y rutas privadas | Navegar desde bottom nav | El menú no fuerza reset inmediato ni libera foco del botón anterior | Cerrar panel “Más”, resetear scroll y mover foco al contenido |
| `/app` y rutas privadas | Navegar desde menú “Más” | El panel puede quedar abierto o con scroll interno anterior | Cerrar panel, resetear scroll interno y ventana |
| `/app/foros` | Publicar, comentar o cambiar filtros | El feed puede actualizarse manteniendo al usuario abajo | Scroll al inicio del feed o al post afectado |
| `/app/foros` | Abrir comentarios | La sección expandida puede quedar fuera de pantalla | Enfocar/mostrar el post donde se abren comentarios |
| `/app/oracion` | Crear petición o cambiar filtros | La nueva lista puede quedar fuera del viewport | Scroll al listado o formulario relevante |
| `/app/biblia` | Cambiar libro/capítulo | El capítulo nuevo puede renderizarse manteniendo scroll previo | Scroll al inicio del lector y reset del contenedor interno |
| `/app/biblia` | Buscar o abrir explicación IA | Resultados/panel pueden aparecer fuera de pantalla | Scroll al bloque de resultados o explicación |
| `/app/juegos` | Iniciar, repetir o terminar juego | La pregunta/resultado puede quedar fuera del viewport | Scroll al área de juego o resultado |
| `/app/mapa` | Filtrar, seleccionar comunidad o sugerir | La card/formulario puede quedar fuera de la vista | Scroll a resultados, detalle o formulario |
| `/app/eventos` | Filtrar o crear evento | El listado actualizado puede mantener scroll antiguo | Scroll al listado |
| `/app/mensajes` | Abrir conversación | Debe ir al final del chat solo dentro del panel, no en la página completa | Controlar scroll del contenedor de mensajes |
| `/app/admin` | Cambiar secciones o navegar desde el shell | Puede abrirse en posición previa | Scroll global al inicio de sección/página |
| CSS global | `html { scroll-behavior: smooth; }` | El scroll automático puede sentirse tardío o mantener animaciones no deseadas en navegación | Usar scroll automático para navegación y márgenes de anclaje |

## Decisión

Aplicar un hotfix de alcance reducido:

- Reset global de scroll/foco en cambios de ruta.
- Reset explícito en `AppShell` y bottom nav.
- Scroll contextual en Foros y módulos con listas/formularios.
- Soporte CSS para anchors, safe area y bottom nav.
- QA automatizable para navegación móvil.
