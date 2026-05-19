# Checklist post-release piloto v1.0.0

Fecha: 2026-05-19

## Objetivo

Checklist operativo para ejecutar despues del congelamiento `pilot-v1.0.0`, antes y durante los primeros dias del piloto cerrado.

## Prueba PWA fisica

| Prueba | Estado | Responsable | Observacion |
| --- | --- | --- | --- |
| Abrir staging en Chrome Android | PENDIENTE | Lider tecnico | Verificar login y navegacion |
| Instalar como app en Android | PENDIENTE | Lider tecnico | Confirmar icono y modo standalone |
| Abrir desde icono instalado | PENDIENTE | Lider tecnico | Confirmar redireccion segun sesion |
| Navegar Biblia, juegos, foros, oracion y mapa | PENDIENTE | Lider tecnico | Revisar bottom nav y botones tactiles |
| Probar offline fallback | PENDIENTE | Lider tecnico | Confirmar pantalla offline |
| Instalar en Chrome/Edge Desktop | PENDIENTE | Lider tecnico | Confirmar PWA desktop |

## Recovery real

| Prueba | Estado | Responsable | Observacion |
| --- | --- | --- | --- |
| Solicitar recuperacion con correo real | PENDIENTE | Admin |
| Recibir email | PENDIENTE | Admin |
| Abrir link | PENDIENTE | Admin |
| Cambiar contrasena | PENDIENTE | Admin |
| Entrar con contrasena nueva | PENDIENTE | Admin |

## Revision de Biblia

| Prueba | Estado | Responsable | Observacion |
| --- | --- | --- | --- |
| Abrir `/app/biblia` | PENDIENTE | Lider pastoral |
| Leer Genesis 1 | PENDIENTE | Lider pastoral |
| Leer Salmos 23 | PENDIENTE | Lider pastoral |
| Leer Juan 3 | PENDIENTE | Lider pastoral |
| Leer Apocalipsis 22 | PENDIENTE | Lider pastoral |
| Buscar `amor`, `fe`, `Juan 3:16` | PENDIENTE | Lider pastoral |
| Revisar planes de lectura | PENDIENTE | Lider pastoral |

## Gemini si se activa

No activar Gemini sin instruccion manual del admin.

| Prueba | Estado | Responsable | Observacion |
| --- | --- | --- | --- |
| Cargar key solo en Admin IA | PENDIENTE | Admin |
| Probar conexion | PENDIENTE | Admin |
| Explicar versiculo | PENDIENTE | Admin |
| Generar borrador devocional | PENDIENTE | Admin |
| Revisar logs IA | PENDIENTE | Admin |
| Verificar limites diarios | PENDIENTE | Admin |
| Desactivar IA si hay respuesta inadecuada | PENDIENTE | Admin |

## Monitoreo diario

| Actividad | Frecuencia | Responsable |
| --- | --- | --- |
| Revisar feedback nuevo | Diario | Admin/lider moderador |
| Revisar incidentes abiertos | Diario | Admin/lider moderador |
| Revisar reportes pendientes | Diario | Admin/lider moderador |
| Revisar actividad de comunidad | Diario | Admin |
| Revisar uso IA si se activa | Diario | Admin |
| Registrar bugs o decisiones | Diario | Lider tecnico |

## Reunion de cierre dia 7

| Punto | Estado |
| --- | --- |
| Revisar KPIs del piloto | PENDIENTE |
| Revisar feedback de jovenes | PENDIENTE |
| Revisar incidentes | PENDIENTE |
| Revisar uso de Biblia | PENDIENTE |
| Revisar comunidad/mapa | PENDIENTE |
| Decidir continuar piloto, pasar a beta o corregir antes de beta | PENDIENTE |

## Criterio de salida

El piloto puede continuar si:

1. No hay bugs criticos abiertos.
2. Auth y RLS siguen OK.
3. Moderacion responde reportes.
4. Feedback de jovenes es revisado.
5. No hay exposicion de secretos.
6. La Biblia funciona sin errores bloqueantes.
7. La experiencia movil no bloquea tareas principales.
