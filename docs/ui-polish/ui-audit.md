# Auditoria visual general - Fase 37

Fecha: 2026-05-21  
URL staging: https://red-de-jovenes.vercel.app/  
Release base: `pilot-v1.0.0` con aislamiento de evidencia QA en `5839e63`.

## Dictamen inicial

La aplicacion esta funcional y conserva el concepto de red social cristiana/PWA. La mejora necesaria antes de ampliar el piloto no es de arquitectura, sino de consistencia visual, comodidad movil, jerarquia de informacion, estados vacios y reduccion de friccion en formularios largos.

## Matriz de auditoria

| Ruta | Problema visual | Problema UX | Prioridad | Accion |
|---|---|---|---|---|
| `/` | Landing estable, pero debe mantener anclas principales sin convertirla en portal institucional. | Riesgo de ruido si se agregan accesos internos. | Media | Mantener estructura y solo validar consistencia. |
| `/entrar` | Formularios correctos pero pueden beneficiarse de foco y mensajes mas claros. | Carga/error deben sentirse menos tecnicos. | Media | Reforzar estados compartidos y focus. |
| `/crear-cuenta` | Jerarquia suficiente. | Validaciones deben ser visibles en movil. | Media | Mantener layout y asegurar inputs tactiles. |
| `/recuperar` | Flujo simple. | Recovery depende de correo real y debe explicar sin prometer instantaneidad. | Baja | Revisar textos y estados. |
| `/actualizar-contrasena` | Formulario funcional. | Botones y errores deben conservar espacio tactil. | Baja | Validar responsive. |
| `/app` | Tiene contenido comunitario real, pero se siente denso y con tarjetas muy similares. | Acciones principales compiten con metricas y feed. | Alta | Reordenar jerarquia: saludo, versiculo, acciones rapidas, pulso real. |
| `/app/biblia` | Módulo completo, pero lector puede saturar con acciones por versiculo. | Buscar/leer/guardar debe sentirse mas fluido en telefono. | Alta | Mejorar selectors, lectura, acciones discretas y estados. |
| `/app/devocional` | Funcional. | Debe mantenerse como experiencia espiritual breve. | Media | Pulido visual menor y estados vacios calidos. |
| `/app/oracion` | Funcional, pero algunas cards se sienten como lista administrativa. | El formulario inicial puede ocupar mucho espacio en movil. | Alta | Tono pastoral, filtros como chips y feedback mas humano. |
| `/app/foros` | Funcional, pero el composer y comentarios pueden sentirse densos. | Participar desde movil debe requerir menos esfuerzo visual. | Alta | Composer social, cards limpias, acciones tactiles. |
| `/app/juegos` | Juegos completos. | Durante juego los botones deben ser grandes y el resultado mas motivador. | Alta | Mejor cards, progreso, feedback y resultado final. |
| `/app/mapa` | Mapa/directorio real. | Cards y filtros deben reforzar pertenencia y "mi comunidad". | Alta | Mejor hero, chips, membresia y sugerencia visible. |
| `/app/eventos` | Funcional, pero visualmente basico frente a modulos principales. | Fecha, modalidad y asistencia necesitan jerarquia. | Media | Cards con fecha destacada y filtros claros. |
| `/app/discipulado` | Funcional, pero podria comunicar mejor progreso. | "Accion practica" y compartir deben verse como camino, no formulario suelto. | Media | Progreso visual y card de leccion. |
| `/app/mensajes` | Funcional asincrono. | Lista y conversaciones necesitan lectura tipo mensajeria movil. | Media | Burbujas, empty state pastoral y reportar discreto. |
| `/app/construir` | Funcional. | Puede sentirse como formularios independientes. | Media | Jerarquia de invitar, sugerir y feedback. |
| `/app/perfil` | Completo. | Mucha informacion; necesita cabecera social y secciones mas claras. | Media | Pulir avatar, progreso, comunidades y preferencias. |
| `/app/admin` | Muy completo, pero denso. | Operacion piloto requiere encontrar secciones rapido. | Alta | Ordenar secciones, KPIs y evidencia QA separada. |

## Hallazgos transversales

- La navegacion movil ya tiene bottom nav y no muestra Seguridad como modulo visible.
- El panel "Mas" funciona, pero conviene tratarlo mas como bottom sheet con cierre claro, backdrop y mejor separacion.
- Hay estilos repetidos en cards, chips, botones, alertas, inputs y empty states.
- Muchas pantallas usan fondos y cards similares; falta un sistema visual pequeño para reducir inconsistencias.
- Hay textos sin acentos en algunos archivos por decision historica del codigo; se mantiene consistencia para evitar cambios masivos no funcionales.
- No se detecta necesidad de tocar Auth, RLS, Gemini, Biblia completa o Supabase.

## Plan de correccion

1. Crear utilidades visuales compartidas en CSS para pages, cards, chips, botones, inputs, empty states y safe-area.
2. Pulir AppShell con bottom nav mas claro, panel "Mas" con backdrop y mejor comportamiento movil.
3. Priorizar /app, Biblia, Foros, Oracion, Juegos y Mapa.
4. Aplicar pulido menor a Eventos, Discipulado, Mensajes, Perfil, Construir y Admin.
5. Mantener Seguridad fuera del menu visible.
6. Ejecutar QA completo local y QA staging antes de cerrar.

