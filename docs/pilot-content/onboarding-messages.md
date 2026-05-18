# Onboarding y mensajes de bienvenida

Fecha: 2026-05-18

## Objetivo

Que el primer uso de la app sea guiado y no se sienta como una pantalla tecnica con modulos aislados.

## Ajustes realizados

Archivo actualizado:

- `src/pages/AppHome.tsx`

Cambios:

- Se agrego una indicacion de primer uso en el encabezado privado.
- Se agrego una card "Primeros pasos" con tres acciones concretas:
  - completar perfil;
  - orar por alguien o crear peticion;
  - participar en Foros con la Palabra.
- Se mejoraron empty states de oracion y foros para invitar a iniciar actividad real.

## Criterios

- No se agregaron modulos nuevos.
- No se inventaron metricas.
- Todos los accesos llevan a rutas reales.
- El lenguaje evita tono tecnico y conserva enfoque cristiano/comunitario.

## Pendientes

- En piloto, medir si los jovenes entienden los primeros pasos sin explicacion externa.
- Evaluar un onboarding mas interactivo solo si el feedback lo justifica.
