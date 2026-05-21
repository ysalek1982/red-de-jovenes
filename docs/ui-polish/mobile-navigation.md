# Navegacion movil - Fase 37

## Estado previo

La app ya usaba bottom nav movil con accesos principales:

- Inicio
- Biblia
- Orar
- Foros
- Juegos
- Mas

Seguridad no aparece como modulo visible y se mantiene solo como funcionalidad interna de reportes/moderacion.

## Cambios aplicados

- Estado activo del bottom nav mas evidente con fondo claro y contraste alto.
- Panel "Mas" tratado como bottom sheet: backdrop, handle superior, limite de altura y scroll interno.
- Opciones secundarias en dos columnas para reducir desplazamiento en telefonos.
- Cierre del panel al navegar o tocar el backdrop.
- Botones tactiles con altura minima mayor.
- Safe-area preservada para iPhone/Android.
- Se removio texto instructivo innecesario dentro de "Mas" para evitar ruido.

## Rutas visibles

Bottom nav:

- `/app`
- `/app/biblia`
- `/app/oracion`
- `/app/foros`
- `/app/juegos`

Panel Mas:

- `/app/devocional`
- `/app/mapa`
- `/app/eventos`
- `/app/discipulado`
- `/app/mensajes`
- `/app/perfil`
- `/app/construir`
- `/app/admin` solo admin
- feedback piloto
- cerrar sesion

## QA requerido

- Confirmar que Seguridad no aparece en navegacion visible.
- Confirmar que Admin solo aparece para admin.
- Confirmar que el panel Mas se cierra al navegar.
- Confirmar que el bottom nav no tapa formularios principales.
- Confirmar que desktop conserva navegacion horizontal.

