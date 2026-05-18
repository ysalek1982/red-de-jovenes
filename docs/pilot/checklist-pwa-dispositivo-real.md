# Checklist PWA en dispositivo real

## Chrome Android

1. Abrir la URL de la app en Chrome.
2. Confirmar que carga `/entrar` si no hay sesion.
3. Iniciar sesion con un usuario piloto.
4. Tocar el menu del navegador.
5. Elegir “Instalar app” o “Agregar a pantalla principal”.
6. Confirmar que aparece el icono de Red de Jovenes.
7. Abrir la app desde el icono.
8. Confirmar que abre en modo app, sin barra completa del navegador.
9. Confirmar que mantiene sesion o permite iniciar sesion correctamente.
10. Navegar por `/app`, oracion, foros, devocional, juegos y mapa.
11. Activar modo avion o desconectar internet.
12. Abrir una ruta publica o recargar para validar fallback offline.
13. Volver a conectar internet y confirmar que Supabase responde.
14. Desinstalar la app desde el sistema si la prueba termino.

## Edge o Chrome Desktop

1. Abrir la URL de la app.
2. Confirmar que aparece la opcion de instalacion en la barra o menu.
3. Instalar la app.
4. Abrir desde el acceso instalado.
5. Iniciar sesion.
6. Navegar por modulos principales.
7. Cerrar y reabrir la app instalada.
8. Confirmar que la sesion no se rompe.
9. Probar offline fallback con red desconectada.
10. Desinstalar desde el menu de la app o configuracion del navegador.

## Problemas frecuentes

| Problema | Posible causa | Accion |
| --- | --- | --- |
| No aparece instalar | Navegador no compatible o criterios PWA no detectados | Probar Chrome/Edge actualizado y revisar manifest/SW |
| Abre en navegador normal | Instalacion incompleta | Reinstalar desde el menu del navegador |
| No mantiene sesion | Storage del navegador bloqueado | Revisar configuracion de privacidad o usar perfil limpio |
| Offline no muestra fallback | SW no actualizado | Recargar, esperar registro del service worker y repetir |
| Icono incorrecto | Cache del navegador | Desinstalar, limpiar cache y reinstalar |

## Resultado esperado

La app debe sentirse instalable, abrir desde icono, mantener el login y mostrar fallback offline sin cachear respuestas sensibles de Supabase.
