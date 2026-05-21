# Lazy loading de rutas principales

## Estado previo

`src/routes/AppRoutes.tsx` ya usaba `React.lazy` y `Suspense` para separar las rutas principales en chunks independientes.

## Ajuste aplicado

Se mantuvo la estrategia existente y se mejoro el fallback visual:

- mensaje humano por modulo;
- spinner ligero con CSS;
- `aria-live="polite"`;
- `aria-busy="true"`;
- texto: `Cargando [modulo]...`;
- sin pantalla blanca durante la carga lazy.

## Rutas lazy-loaded

- Landing.
- Auth publico.
- Home privado.
- Perfil.
- Biblia.
- Oracion.
- Foros.
- Devocional.
- Juegos.
- Mapa / Comunidad.
- Eventos.
- Discipulado.
- Mensajes.
- Construir la Red.
- Admin.
- Seguridad oculta.

## Decision

No se agrego preload agresivo para no aumentar la carga inicial. Admin, Biblia y Mapa siguen en chunks separados porque son los modulos mas pesados o menos necesarios para la primera pantalla.

## Riesgo

Riesgo bajo: solo cambia el fallback de `Suspense`, no la logica de Auth/RLS ni los modulos internos.
