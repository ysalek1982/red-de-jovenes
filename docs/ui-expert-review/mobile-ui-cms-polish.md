# Revisión experta de interfaces móviles y CMS

Fecha: 2026-06-04

## Dirección visual

Se aplicó una dirección "campamento urbano cristiano": cálida, comunitaria, móvil primero y enfocada en participación real. La intención es que la app se sienta como una red juvenil viva sin convertirse en portal institucional.

## Mejoras aplicadas

| Área | Mejora |
| --- | --- |
| Sistema visual | Fondo menos plano, textura sutil, cards con más profundidad, botones táctiles y estados hover/focus más claros. |
| Navegación móvil | Bottom nav más legible, estado activo con mayor contraste y panel "Más" con mejor jerarquía. |
| Home | Cabecera tipo portada viva con pulso real de posts, oraciones y eventos; acciones rápidas más escaneables. |
| Biblia | Panel principal más cómodo para lectura y textos de acciones corregidos. |
| Foros | Composer más cálido, copy enfocado en edificación y filtros/textos más claros. |
| Oración | Panel principal más pastoral, lenguaje más cercano y sección "Orando juntos". |
| Admin CMS | Cabecera más clara, accesos rápidos visibles y textos corregidos para reducir errores operativos. |
| Módulos secundarios | Correcciones de microcopy en eventos, mapa, juegos, discipulado y perfil. |

## Restricciones respetadas

- No se agregaron módulos nuevos.
- No se tocó Auth/RLS.
- No se tocó Biblia corpus.
- No se tocó Gemini ni secretos.
- No se reintrodujo "Construir la Red".
- "Seguridad" no volvió al menú visible.

## Pendientes recomendados

- Validar visualmente en teléfono físico.
- Repetir QA conectado a Supabase cuando el DNS remoto responda.
- Revisar con usuarios jóvenes si el tono "campamento urbano cristiano" se siente natural en su contexto.
