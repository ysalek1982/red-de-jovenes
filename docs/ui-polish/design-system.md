# Sistema visual base - Fase 37

## Objetivo

Unificar la experiencia visual sin redisenar la aplicacion ni tocar logica critica. El sistema se agrega como una capa pequena de utilidades CSS en `src/index.css`, reutilizable por las pantallas actuales.

## Tokens y patrones

| Elemento | Clase | Uso |
|---|---|---|
| Pagina privada | `app-page` | Fondo, padding superior e inferior con safe-area movil. |
| Contenedor | `app-shell-inner` | Ancho maximo y padding consistente. |
| Card principal | `app-card` | Bloques de contenido principales. |
| Card secundaria | `app-card-soft` | Listas internas o elementos repetidos. |
| Card destacada | `app-card-accent` | Versiculo, CTA o estado espiritual relevante. |
| Kicker | `app-kicker` | Etiqueta superior de seccion. |
| Titulo | `app-section-title` | Titulos de seccion con jerarquia consistente. |
| Texto secundario | `app-muted` | Descripciones y empty states breves. |
| Chip | `app-chip` | Filtros, estados y acciones compactas. |
| Chip activo | `app-chip-active` | Filtro seleccionado o estado activo. |
| Boton principal | `app-button-primary` | Accion primaria del flujo. |
| Boton secundario | `app-button-secondary` | Accion alternativa. |
| Boton peligro discreto | `app-button-danger` | Eliminar, salir o acciones delicadas. |
| Input | `app-input` | Inputs y textareas oscuros. |
| Select | `app-select` | Selectores tactiles. |
| Empty state | `app-empty` | Estados sin datos con tono pastoral. |
| Alerta OK | `app-alert` | Confirmaciones y feedback positivo. |
| Alerta aviso | `app-alert-warning` | Avisos no criticos. |
| Scroll horizontal | `app-scroll-x` | Filtros en chips sin barra visible. |

## Decisiones

- Se mantiene el concepto visual cristiano/PWA con fondo oscuro, acentos calidos y verdes.
- No se agregan datos falsos ni nuevas funcionalidades.
- No se toca Auth, RLS, Gemini, Biblia completa ni secrets.
- Se mantiene Seguridad fuera de la navegacion principal.
- Las clases nuevas reducen repeticion, pero no fuerzan una migracion completa de todos los componentes en esta fase.

## QA visual requerido

- Revisar mobile 360px, 375px, 414px y tablet.
- Confirmar que bottom nav no tape formularios.
- Confirmar contraste, focus states y botones tactiles.
- Validar que las rutas criticas siguen pasando QA funcional.

