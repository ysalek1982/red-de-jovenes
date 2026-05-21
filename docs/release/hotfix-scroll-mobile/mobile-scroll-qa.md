# QA de scroll movil

Script agregado: `npm run qa:mobile-scroll`

## Cobertura automatizada

El script valida de forma estatica que existan los guardrails del hotfix:

- `ScrollToTop` integrado en el root.
- `history.scrollRestoration = manual`.
- soporte de hash y foco accesible.
- `scroll-behavior: auto` y `scroll-margin-top`.
- reset explicito en `AppShell`.
- refs de scroll en Foros, Biblia, Juegos, Mapa y Mensajes.

Cuando `QA_APP_BASE_URL` esta configurado, tambien verifica que las rutas clave no devuelvan `404` ni error de servidor.

## Validacion manual requerida en telefono fisico

1. Abrir `/app`.
2. Hacer scroll abajo.
3. Tocar `Foros`.
4. Confirmar que abre arriba.
5. Hacer scroll abajo.
6. Tocar `Biblia`.
7. Confirmar que abre arriba.
8. Tocar `Mas > Comunidad`.
9. Confirmar que abre arriba.
10. Abrir comentarios en Foros y confirmar que el post queda visible.
11. Cambiar capitulo en Biblia y confirmar que el lector inicia arriba.
12. Iniciar un juego y confirmar que la pregunta queda visible.

Resultado esperado del script: `QA_MOBILE_SCROLL_OK`.
