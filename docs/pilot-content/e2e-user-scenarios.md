# Escenarios reales end-to-end

Fecha: 2026-05-18

## Objetivo

Validar que Red de Jovenes no solo tiene modulos aislados, sino recorridos coherentes para jovenes, participantes, lideres/admin y seguridad comunitaria.

## Escenario 1 - Joven nuevo

1. Crear cuenta.
2. Confirmar correo si Supabase lo exige.
3. Iniciar sesion.
4. Completar perfil: ciudad, pais, iglesia y bio.
5. Leer devocional del dia.
6. Marcar devocional como leido.
7. Guardar devocional como favorito.
8. Crear peticion de oracion.
9. Publicar en Foros con la Palabra con una referencia biblica.
10. Jugar Trivia Biblica.
11. Buscar una comunidad en el Mapa Mundial.

## Escenario 2 - Joven participante

1. Iniciar sesion.
2. Orar por una peticion de otro joven.
3. Comentar una publicacion en los foros.
4. Reaccionar con "Amen".
5. Guardar un devocional favorito.
6. Sugerir una comunidad local.

## Escenario 3 - Admin/lider

1. Iniciar sesion con usuario administrador.
2. Revisar reportes pendientes.
3. Cambiar estado de un reporte.
4. Crear o editar devocional desde administracion.
5. Revisar sugerencias de comunidades.
6. Aprobar una comunidad.
7. Confirmar que la comunidad aparece activa en el mapa.

## Escenario 4 - Seguridad

1. Un usuario reporta una publicacion, comentario, peticion o perfil.
2. Otro usuario normal no puede ver reportes ajenos.
3. Admin revisa el reporte.
4. Admin cambia estado y agrega nota interna.
5. El reporte queda trazable sin exponer datos innecesarios.

## Script automatizado

Se agrego:

```bash
npm run qa:journeys
```

El script usa solo publishable key y credenciales QA/admin locales ignoradas por Git. No usa `service_role`.

Cobertura automatizada:

- Actualizacion de perfil.
- Lectura y progreso de devocional.
- Creacion de peticion.
- Soporte de oracion por otro usuario.
- Publicacion, comentario y reaccion.
- Puntaje de juego.
- Sugerencia de comunidad.
- Reporte de contenido.
- Moderacion admin.
- Aprobacion de comunidad.
- Bloqueo de admin para usuario normal.
- Privacidad de reportes.

## Pendientes manuales

- Creacion de cuenta nueva depende de email real y configuracion de confirmacion en Supabase.
- Recuperacion de contrasena requiere URL staging y redirect URLs configuradas.
