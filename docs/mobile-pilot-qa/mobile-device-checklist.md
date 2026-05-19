# Checklist de prueba movil real

Fecha: 2026-05-19

URL staging: https://red-de-jovenes.vercel.app/

## Ambientes a probar

- Chrome Android.
- Edge o Chrome Desktop.
- Modo responsive del navegador.
- PWA instalada, si el navegador ofrece instalacion.

## Checklist principal

| Paso | Resultado esperado | Estado |
| --- | --- | --- |
| Abrir `https://red-de-jovenes.vercel.app/` | La app abre y sin sesion redirige a `/entrar`. | Pendiente dispositivo |
| Ver login | La pantalla de acceso es legible y no se corta. | Pendiente dispositivo |
| Iniciar sesion | El usuario llega a `/app`. | Pendiente dispositivo |
| Ver `/app` | Home privado carga sin desbordes. | Pendiente dispositivo |
| Usar bottom nav: Inicio | Navega a `/app` y marca activo. | Pendiente dispositivo |
| Usar bottom nav: Oracion | Navega a `/app/oracion` y marca activo. | Pendiente dispositivo |
| Usar bottom nav: Foros | Navega a `/app/foros` y marca activo. | Pendiente dispositivo |
| Usar bottom nav: Juegos | Navega a `/app/juegos` y marca activo. | Pendiente dispositivo |
| Usar bottom nav: Mapa | Navega a `/app/mapa` y marca activo. | Pendiente dispositivo |
| Abrir `Mas` | Muestra Devocional, Perfil, Admin si corresponde y Cerrar sesion. | Pendiente dispositivo |
| Ver Devocional desde `Mas` | Navega a `/app/devocional`. | Pendiente dispositivo |
| Ver Perfil desde `Mas` | Navega a `/app/perfil`. | Pendiente dispositivo |
| Ver Administracion con admin | Admin ve el acceso y abre `/app/admin`. | Pendiente dispositivo |
| Ver Administracion con no admin | No admin no ve el acceso y queda bloqueado. | Pendiente dispositivo |
| Cerrar sesion desde `Mas` | Vuelve a `/entrar`. | Pendiente dispositivo |
| Revisar botones inferiores | Ningun boton queda tapado por el bottom nav. | Pendiente dispositivo |
| Revisar formularios | Hay espacio inferior suficiente al escribir. | Pendiente dispositivo |
| Jugar con el dedo | Juegos responden a taps sin precision excesiva. | Pendiente dispositivo |
| Cerrar panel `Mas` | El boton cerrar funciona y no deja overlay atrapado. | Pendiente dispositivo |
| Activar teclado movil | El teclado no rompe login, perfil, oracion, foros ni mapa. | Pendiente dispositivo |

## Notas

Esta lista requiere dispositivo o navegador real. Desde Codex se validan rutas, build, QA funcional, PWA base y scripts automatizados; la ergonomia tactil final queda como prueba humana obligatoria antes del piloto masivo.
