# Auditoria de accesibilidad

## Mejoras aplicadas

- Fallback de carga con `aria-live="polite"` y `aria-busy="true"`.
- Error boundary con `role="alert"`.
- Buscador global:
  - boton de limpiar con area tactil mayor;
  - icono marcado como decorativo;
  - resultados con `role="listbox"` y opciones.
- Notificaciones:
  - boton "Leidas" con `aria-label`;
  - lista de notificaciones con roles de lista.
- Feedback del piloto:
  - formulario/modal con `role="dialog"`;
  - `aria-modal="true"`;
  - titulo enlazado con `aria-labelledby`.
- Inputs moviles a `16px` para reducir zoom accidental en iOS.

## Revision

Se conservaron:

- foco visible mediante clases existentes `focus-visible`;
- labels en formularios principales;
- botones tactiles del bottom nav;
- textos de error sin stack trace;
- Seguridad fuera del menu visible.

## Pendientes

- Auditoria con lector de pantalla real.
- Prueba completa con teclado en desktop.
- Revision de contraste con herramienta automatizada externa.
