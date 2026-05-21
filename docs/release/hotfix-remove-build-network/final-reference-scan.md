# Escaneo final de referencias a Construir

## Dictamen

SIN REFERENCIAS ACTIVAS DEL MODULO CONSTRUIR.

## Comando

```powershell
rg -n "construir|Construir|BuildNetwork|buildNetwork|qa:build-network" src scripts package.json docs
```

## Referencias activas

| Ubicación | Clasificación | Decisión |
| --- | --- | --- |
| `src/routes/AppRoutes.tsx` con `path="construir"` | Compatibilidad controlada | Se conserva solo para redirigir `/app/construir` a `/app`; no carga página ni módulo |
| `src/components/sections/CTASection.tsx` | Texto genérico de landing | No refiere al módulo; usa "construir futuro con propósito" como frase común |

## Referencias removidas

- Menú "Más" y navegación desktop.
- Card de Home.
- Guía rápida.
- Página `BuildNetworkPage`.
- Servicio `buildNetworkService`.
- Script `qa:build-network`.
- Ruta esperada en `qa:functional`.

## Referencias históricas

Permanecen menciones en documentación de releases y fases anteriores, por trazabilidad:

- `docs/prototype-completion/*`
- `docs/pilot-launch/*`
- `docs/pilot-monitoring/*`
- `docs/optimization/*`
- `docs/ui-polish/*`
- `docs/release/pilot-v1.0.0.md`
- `docs/release/pilot-v1.1.0/*`
- `docs/release/pilot-v1.2.0/*`
- `docs/release/pilot-v1.3.0/*`

Estas referencias describen el estado histórico previo y quedan supersedidas por `pilot-v1.3.1`.

## Resultado

No quedan imports, chunks, scripts activos, enlaces visibles ni QA activo del módulo Construir la Red.
