# Pulido visual cristiano - landing y app

Fecha: 2026-06-05

## Enfoque

Se aplicó una dirección visual cristiana cálida para que la landing, la app privada y el Admin/CMS se sientan parte del mismo producto:

- fondo profundo tipo noche;
- acentos dorados, olivo y esmeralda;
- tarjetas translúcidas con textura sutil;
- botones redondeados y táctiles;
- navegación móvil con lenguaje claro;
- microcopy en español y sin caracteres rotos;
- sin métricas ni testimonios ficticios en la landing.

## Cambios principales

| Área | Mejora |
| --- | --- |
| Landing | Secciones con paneles `faith-*`, hero más editorial, contenido sin métricas inventadas. |
| Componentes base | Botones, inputs, textareas, cards y badges ahora comparten el tema de la app. |
| Auth | Formularios heredan controles oscuros, legibles y consistentes. |
| AppShell | Textos corregidos, menú “Más” más claro y sin módulos retirados. |
| Admin/CMS | Centro CMS más claro, grilla de categorías ajustada y textos con acentos. |
| Rutas | Fallback lazy loading más humano y con acentos correctos. |
| Demo pública | Datos rotulados como ejemplo visual, sin cifras de adopción ficticias. |
| Accesibilidad | Menú “Más” con foco inicial, cierre por Escape y trampa básica de tabulación. |

## Decisiones

- No se tocaron Auth/RLS, Biblia corpus, Gemini, Supabase secrets ni service role.
- No se agregó ningún módulo nuevo.
- No se reintrodujo “Seguridad” como módulo visible.
- El contenido de landing evita adoptar cifras como si fueran datos reales del piloto.
- La ruta `/app/seguridad` queda redirigida al inicio privado para no exponer un módulo visible retirado.

## Pendiente recomendado

- Validar visualmente en teléfono físico antes de abrir el piloto a más usuarios.
- Capturar screenshots de landing, `/app`, `/app/biblia`, `/app/foros` y `/app/admin` después del deploy.
