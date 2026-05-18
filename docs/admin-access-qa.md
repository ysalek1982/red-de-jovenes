# QA acceso administrador

Fecha: 2026-05-17

## Objetivo

Verificar funcionalmente el acceso administrador de Red de Jovenes y confirmar que la landing mantiene paridad de contenido con el prototipo inicial de Lovable.

## Validaciones ejecutadas

- `npm run lint`: OK.
- `npm run build`: OK.
- App local disponible en `http://127.0.0.1:5173`.
- Login admin validado con credenciales locales ignoradas por Git.
- Usuario no admin temporal creado con credenciales generadas localmente, probado y eliminado.

## Paridad con prototipo Lovable

Referencia revisada: `https://red-de-jovenes.lovable.app`.

Checklist de contenido local:

- Header con Red de Jovenes, Mision, Funciones, Testimonios y Comunidad.
- Acciones publicas Entrar y Crear cuenta cuando no hay sesion.
- Hero: La red social cristiana de la nueva generacion.
- Hero: Conectando jovenes en Cristo.
- Botones: Unirme ahora y Ver demo.
- Chips: Espacio seguro, Basado en la Palabra, Respaldado por iglesias.
- Metricas: 12.4K, 320, 47, 1.2M.
- Mision con Mateo 5:14.
- Funciones: oracion, Palabra, juegos, mapa, devocional y espacio seguro.
- Seccion PWA instalable.
- Mockup con Devocional del dia y notificacion de Lucia.
- Testimonios de Lucia, Mateo y Sara.
- CTA final: Tu generacion. Tu Red.
- Footer: Hecho con fe y codigo.

Resultado: sin faltantes de contenido detectados en estado publico sin sesion.

## Resultado login admin

- Administrador: `ysalek@gmail.com`.
- Login con Supabase Auth usando publishable key: OK.
- Lectura de roles propios: OK.
- RPC `has_role('admin')`: `true`.
- `/app`: carga correctamente.
- En `/app` aparece acceso privado `Administracion`.
- Sin overflow horizontal detectado.

## Estado `/app/admin`

Resultado con admin:

- Ruta final: `/app/admin`.
- Titulo visible: Panel de administracion.
- Subtitulo visible: Gestion inicial de Red de Jovenes.
- Mensaje visible: Modulo administrativo en preparacion.
- Cards visibles: Usuarios, Oraciones, Publicaciones, Devocionales, Testimonios.
- No muestra `No autorizado`.
- Sin overflow horizontal detectado.

## Resultado usuario no admin

Se creo un usuario QA no admin temporal con service role local, sin guardar credenciales ni imprimir secretos.

Resultado:

- `/app`: carga correctamente.
- No ve acceso `Administracion`.
- `/app/admin`: muestra `No autorizado`.
- No ve el panel administrativo.
- Usuario temporal eliminado correctamente despues de la prueba.

## Seguridad

- `.env.admin.local` existe localmente y esta ignorado por Git.
- No se versionaron contrasenas.
- No se versiono service role key.
- No se imprimieron secretos en documentacion.
- Revision de patrones sensibles versionables: sin coincidencias reales.

## Pendientes

- Probar manualmente el flujo de login en navegador del usuario si se requiere validacion humana visual completa del formulario, ya que el navegador automatizado no pudo escribir inputs por limitacion de portapapeles virtual.
