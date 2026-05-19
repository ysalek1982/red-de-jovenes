# Playbook de incidentes del piloto

## Objetivo

Responder con rapidez, cuidado pastoral y trazabilidad ante problemas durante el piloto cerrado de Red de Jovenes.

## Severidades

| Severidad | Uso | Tiempo de respuesta sugerido |
|---|---|---:|
| critical | Riesgo de seguridad, autolesion, abuso, key expuesta, app caida para todos. | Inmediato |
| high | Login roto, RLS sospechoso, moderacion urgente, contenido sensible. | Mismo dia |
| medium | Bug funcional, PWA falla, recovery no llega, IA falla sin exponer datos. | 24 horas |
| low | Texto confuso, mejora UX, detalle visual. | Durante el ciclo semanal |

## Escenarios

### Caida de app

1. Confirmar URL staging.
2. Revisar Vercel Ready.
3. Revisar ultimo commit y despliegue.
4. Registrar incidente `critical`.
5. Avisar al admin general y pausar pruebas.

### Error de login

1. Confirmar correo y estado de confirmacion.
2. Probar usuario QA.
3. Revisar Supabase Auth.
4. Registrar incidente `high` si afecta a mas de un usuario.

### Abuso, acoso o contenido sensible

1. No discutir publicamente.
2. Registrar incidente `critical` o `high`.
3. Revisar reporte desde Admin.
4. Tomar accion pastoral y documentar resolucion.

### Respuesta IA inadecuada

1. Desactivar IA si el riesgo es alto.
2. Guardar evidencia sin exponer datos sensibles.
3. Revisar logs y plantilla pastoral.
4. Registrar incidente y ajustar prompt antes de reactivar.

### Key expuesta

1. Desactivar IA.
2. Rotar key desde Google AI Studio.
3. Rotar key en Admin.
4. Revisar repositorio y logs.
5. Registrar incidente `critical`.

### Falla PWA

1. Verificar navegador y dispositivo.
2. Probar manifest, service worker y offline.
3. Registrar modelo/dispositivo en incidente.
4. Documentar si requiere prueba humana adicional.

### Recovery real falla

1. Verificar Site URL y Redirect URLs en Supabase.
2. Probar correo real.
3. Revisar spam.
4. Registrar incidente si no llega o redirige mal.

### Problema de datos

1. No ejecutar comandos destructivos.
2. Confirmar si es UI, RLS o dato faltante.
3. Registrar incidente.
4. Corregir con migracion incremental si aplica.
