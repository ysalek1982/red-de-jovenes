# Reporte final de onboarding y activacion

Fecha: 2026-05-21

URL staging: https://red-de-jovenes.vercel.app/

## 1. Dictamen

ONBOARDING LISTO PARA PILOTO.

La app mantiene la funcionalidad de `pilot-v1.2.0` y agrega una primera experiencia mas clara para jovenes nuevos, sin tocar Auth/RLS, Biblia corpus, Gemini ni secretos.

## 2. Mejoras de primera experiencia

- Checklist real de bienvenida en `/app`.
- Primeros pasos por modulo.
- Perfil con porcentaje de completitud.
- Guia rapida privada en `/app/guia`.
- Microcopy mas claro y pastoral.
- Metricas reales de activacion en Admin.

## 3. Checklist

El checklist se calcula con datos reales:

- perfil completo;
- lectura biblica registrada;
- versiculo guardado;
- oracion creada o apoyada;
- post o comentario;
- juego completado;
- comunidad unida.

Se puede colapsar y la preferencia queda en `localStorage` por usuario.

## 4. Perfil

El perfil muestra:

- porcentaje de completitud;
- campos faltantes;
- CTA para completar datos;
- progreso sin bloquear el uso de la app.

## 5. Guia rapida

Nueva ruta privada:

- `/app/guia`

Incluye pasos breves para Biblia, oracion, foros, juegos, comunidad, perfil, reportes e instalacion PWA.

## 6. Metricas de activacion

Admin muestra hitos reales:

- perfiles completos;
- usuarios con primer versiculo guardado;
- usuarios con primera oracion;
- usuarios con primera publicacion/comentario;
- usuarios con primer juego;
- usuarios unidos a comunidad;
- usuarios que enviaron feedback real.

## 7. QA local

Resultado: QA_LOCAL_ONBOARDING_OK.

Validaciones ejecutadas:

- `npm run lint`
- `npm run build`
- `npm run smoke:build`
- `npm run qa:functional`
- `npm run qa:auth`
- `npm run qa:rls`
- `npm run qa:admin`
- `npm run qa:bible-corpus`
- `npm run qa:journeys`
- `npm run qa:community`
- `npm run qa:forums`
- `npm run qa:prayer`
- `npm run qa:games`
- `npm run qa:map`
- `npm run qa:pilot-feedback`
- `npm run qa:pilot-incidents`
- `npm run qa:mobile-scroll`

## 8. QA staging

Resultado: QA_STAGING_ONBOARDING_OK.

Deployment validado:

- `red-de-jovenes-ffrslvle8-ysaleks-projects.vercel.app`
- Alias: `https://red-de-jovenes.vercel.app`
- Estado: READY

Validaciones ejecutadas:

- `npm run qa:functional`
- `npm run qa:admin`
- `npm run qa:bible-corpus`
- `npm run qa:journeys`
- `npm run qa:mobile-scroll`

## 9. Pendientes humanos

- PENDING_HUMAN_ONBOARDING_DEVICE_TEST: revisar checklist y guia en telefono fisico.
- PENDING_HUMAN_NEW_USER_REVIEW: observar a un usuario nuevo real usando la app sin explicacion externa.
- PENDING_HUMAN_PWA_INSTALL: instalar la PWA en dispositivo real.
- PENDING_HUMAN_RECOVERY_EMAIL: recovery desde inbox real.

## 10. Recomendacion

Congelar `pilot-v1.3.0` como release de piloto con onboarding y activacion, y usarlo para iniciar pruebas con jovenes nuevos durante 7 dias de monitoreo.
