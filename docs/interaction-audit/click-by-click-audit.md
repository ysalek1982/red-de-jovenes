# Auditoria click por click

Fecha: 2026-05-18

## Matriz general

| Modulo | Ruta | Elemento | Tipo | Accion esperada | Resultado actual | Problema | Correccion | Estado final |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Navegacion publica | `/landing` | Links Mision/Funciones/Testimonios/Comunidad | navegacion | Ir a anclas reales | OK | Ninguno | Sin cambios | OK |
| Entrada app | `/` | Redireccion | navegacion | Sin sesion a `/entrar`, con sesion a `/app` | OK | Ninguno | Sin cambios | OK |
| Rutas privadas | `/app/**` | Proteccion | navegacion | Bloquear sin sesion | OK | Ninguno | Validado por browser/scripts | OK |
| Admin | `/app/admin` | Proteccion rol | navegacion | Bloquear no admin | OK | Ninguno | Validado por QA admin | OK |
| Foros alias | `/app/comunidad`, `/app/foros` | Rutas | navegacion | Una experiencia clara | Parcial | Dos rutas mostraban lo mismo | Navegacion apunta a `/app/foros`; `/app/comunidad` redirige | OK |
| AppShell | `/app/**` | Barra de busqueda visual | estado | No simular buscador inexistente | Parcial | Parecia input muerto | Reemplazada por mensaje estatico | OK |
| Inicio privado | `/app` | "Tu historia" y historias mock | estado | No mostrar datos ficticios como reales | Parcial | Tira visual no conectada a backend | Eliminada | OK |
| Demo publico | `/demo` | Boton "Estoy orando" | boton | Llevar a flujo real | Fallaba | Boton sin accion | Convertido en link a crear cuenta | OK |
| Mapa | `/app/mapa` | Nodos del mapa | filtro | Filtrar por pais | OK tras Fase 22 | Ninguno | Validado | OK |
| Mapa | `/app/mapa` | Formulario sugerencia | formulario | Guardar en Supabase | OK | Ciudad/contacto necesitaban validacion fuerte | Ciudad requerida y link validado | OK |
| Oracion | `/app/oracion` | Acciones usuario | accion usuario | Dar feedback claro | Parcial | Exitos usaban estado de error o no avisaban | Mensajes de exito separados | OK |
| Foros | `/app/foros` | Acciones usuario | accion usuario | Dar feedback claro | Parcial | Exitos usaban estado de error o no avisaban | Mensajes de exito separados | OK |
| Devocional | `/app/devocional` | Leer/guardar/favorito | boton | Persistir progreso | OK | Ninguno | Validado | OK |
| Juegos | `/app/juegos` | Juegos/puntajes | boton | Guardar progreso propio | OK | Ninguno | Validado | OK |
| Seguridad | `/app/seguridad` | Crear reporte | formulario | Guardar reporte | OK | Ninguno | Validado | OK |
| Perfil | `/app/perfil` | Perfil/preferencias | formulario/toggle | Persistir cambios | OK | Ninguno | Validado | OK |
| PWA | Global | Instalar/descartar | boton | Prompt real si disponible | OK local | Requiere HTTPS para prueba completa | Documentado | OK local |

## Validacion base

- `npm run lint`: OK
- `npm run build`: OK
- `npm run qa:functional`: OK
- Browser local:
  - `/demo` muestra enlaces reales.
  - `/app/mapa` sin sesion redirige a login.
