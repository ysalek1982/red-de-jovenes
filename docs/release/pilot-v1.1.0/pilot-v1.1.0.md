# Release pilot-v1.1.0

Fecha: 2026-05-21

## Dictamen

LISTO PARA PILOTO CERRADO MONITOREADO CON INTERFACES MEJORADAS

## URL

https://red-de-jovenes.vercel.app/

## Diferencia contra pilot-v1.0.0

| Area | Mejora |
| --- | --- |
| Interfaces | Sistema visual unificado para cards, botones, chips, alertas, inputs y empty states. |
| Navegacion movil | Bottom nav y panel "Mas" mas claros, tactiles y con safe-area. |
| Biblia | Lectura, busqueda, planes, guardados e IA con mejor jerarquia visual. |
| Comunidad | Home, foros, oracion, mapa y perfil con sensacion mas social y pastoral. |
| Juegos | Cards, progreso, feedback y resultados mas claros en mobile. |
| Admin | Secciones y KPIs mas ordenados, con evidencia QA separada de datos reales. |
| Accesibilidad | Mejor foco visual, targets tactiles y correccion de overflow mobile. |

## Modulos disponibles

- Landing publica.
- Auth: entrar, crear cuenta, recuperar y actualizar contrasena.
- Inicio privado comunitario.
- Biblia.
- Devocional.
- Oracion.
- Foros.
- Juegos.
- Comunidad/Mapa.
- Eventos.
- Discipulado.
- Mensajes.
- Construir la Red.
- Perfil.
- Busqueda global.
- Notificaciones internas.
- Feedback piloto.
- Admin.
- Admin Biblia.
- Admin IA.
- Reportes y moderacion interna.

## Biblia completa

| Campo | Estado |
| --- | --- |
| Fuente | eBible RVR1909 / spaRV1909 |
| Licencia | Public domain |
| Libros | 66 |
| Capitulos | 1189 |
| Versiculos | 31084 |
| Estado | Importada y validada |

## IA Gemini

- Preparada via Supabase Edge Functions.
- Panel admin disponible.
- Guardrails pastorales y limites de uso disponibles.
- Key real pendiente.
- No activada automaticamente.

## QA local

Resultado: OK.

Validado:

- lint;
- build;
- smoke build;
- rutas funcionales;
- Auth/RLS;
- Admin;
- Biblia corpus;
- journeys;
- comunidad;
- foros;
- oracion;
- juegos;
- mapa;
- eventos;
- discipulado;
- mensajes;
- busqueda;
- notificaciones;
- feedback;
- incidentes.

## QA staging

Resultado: OK.

Validado contra:

https://red-de-jovenes.vercel.app/

Deployment:

`https://red-de-jovenes-6ht8e7vdh-ysaleks-projects.vercel.app`

## Pendientes humanos

- Prueba PWA fisica en Android/Desktop.
- Recovery real desde inbox.
- Gemini real si el admin decide activar IA.
- Revision pastoral de planes/prompts.
- Prueba con jovenes reales durante piloto.

## Riesgos

- Uso de IA sin criterio pastoral si se activa sin capacitacion.
- Moderacion diaria necesaria durante piloto.
- Usuarios menores: reforzar privacidad y acompanamiento.
- Feedback real puede exponer ajustes UX no detectados en QA automatizado.

## Recomendacion

Iniciar piloto cerrado de 7 dias con monitoreo diario, feedback activo y reunion de cierre para decidir si se extiende el piloto o se prepara beta.
