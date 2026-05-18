# Prueba PWA en dispositivo real

Fecha: 2026-05-18

## Estado

**PENDING_DEVICE_TEST**

No se ejecuto prueba en dispositivo real porque aun no hay URL staging publica. La base PWA local paso `smoke:build`, pero la instalacion real debe validarse desde el dominio staging final.

## Checklist Chrome Android

1. Abrir `https://URL-STAGING`.
2. Confirmar redireccion a `/entrar` sin sesion.
3. Abrir menu del navegador.
4. Seleccionar instalar app o agregar a pantalla de inicio.
5. Confirmar icono y nombre `Red de Jovenes`.
6. Abrir desde el icono instalado.
7. Iniciar sesion.
8. Navegar:
   - `/app`
   - `/app/oracion`
   - `/app/foros`
   - `/app/devocional`
   - `/app/juegos`
   - `/app/mapa`
9. Activar modo avion.
10. Confirmar fallback offline amigable.
11. Desactivar modo avion y confirmar reconexion.
12. Desinstalar y reinstalar si se actualiza app.

## Checklist Edge/Chrome Desktop

1. Abrir `https://URL-STAGING`.
2. Confirmar icono de instalacion en barra del navegador.
3. Instalar app.
4. Abrir desde ventana instalada.
5. Confirmar que `display: standalone` se respeta.
6. Login desde app instalada.
7. Navegar rutas internas.
8. Refrescar ruta privada.
9. Probar offline fallback.
10. Cerrar sesion.

## Validaciones tecnicas ya cubiertas

- `public/manifest.webmanifest`: presente.
- `public/sw.js`: presente.
- `public/offline.html`: presente.
- `start_url`: `/`.
- `scope`: `/`.
- `display`: `standalone`.
- `npm run smoke:build`: `SMOKE_BUILD_OK`.
- El service worker no debe cachear respuestas sensibles de Supabase.

## Problemas frecuentes

| Problema | Accion |
| --- | --- |
| No aparece instalar | Confirmar HTTPS, manifest valido e iconos disponibles |
| Abre una ruta 404 | Revisar SPA fallback en hosting |
| Recuperacion abre localhost | Revisar Redirect URLs en Supabase |
| Sesion se pierde | Revisar storage del navegador y origen exacto |
| Offline muestra blanco | Revisar `offline.html` y service worker |

## Dictamen

La PWA esta lista a nivel de build, pero la prueba real de instalacion queda pendiente hasta contar con URL staging.
