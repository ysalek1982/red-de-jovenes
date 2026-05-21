# Guia rapida para usuarios

Fecha: 2026-05-21

## Implementacion

Se agrego la ruta privada `/app/guia` como pagina mobile-first y lazy-loaded.

La guia aparece en el menu "Mas" y no reemplaza ningun modulo existente.

## Contenido

| Tema | Accion |
| --- | --- |
| Biblia | Leer, buscar y guardar versiculos. |
| Oracion | Pedir oracion o acompanar una peticion. |
| Foros | Compartir reflexion, pregunta, testimonio o palabra de animo. |
| Juegos | Jugar y guardar puntaje. |
| Comunidad | Buscar ciudad, unirse o sugerir comunidad. |
| Perfil | Completar datos personales no sensibles. |
| Reportes | Avisar a un lider con respeto. |
| PWA | Instalar si el navegador lo permite. |

## Validacion

- `/app/guia` queda protegida por Auth dentro de `AppShell`.
- `qa:functional` incluye la ruta.
- Seguridad no vuelve al menu visible como modulo principal.
