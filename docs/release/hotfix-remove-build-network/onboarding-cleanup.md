# Limpieza de onboarding sin Construir

## Dictamen

ONBOARDING LIMPIO SIN CONSTRUIR.

## Alcance revisado

| Archivo | Estado | Decisión |
| --- | --- | --- |
| `src/pages/AppHome.tsx` | Sin card ni CTA hacia Construir la Red | Mantener checklist enfocado en acciones reales del piloto |
| `src/features/onboarding/onboardingService.ts` | Sin pasos de Construir | Mantener pasos: perfil, Biblia, oración, foros, juegos y comunidad |
| `src/pages/QuickGuidePage.tsx` | Sin sección Construir la Red | Redirigir sugerencias comunitarias hacia Comunidad / Mapa |
| `docs/onboarding-activation/*` | Sin referencias activas al módulo | Mantener como documentación vigente de onboarding |
| `docs/release/pilot-v1.3.0/pilot-v1.3.0.md` | Referencia histórica de release anterior | No editar historial; queda reemplazado por pilot-v1.3.1 |

## Checklist vigente

- Completar perfil.
- Leer primer versículo.
- Guardar un versículo.
- Pedir o apoyar una oración.
- Publicar o comentar en Foros.
- Jugar primer juego.
- Unirse a una comunidad.

## Resultado

El onboarding no contiene enlaces muertos ni pasos que dependan de `/app/construir`.
