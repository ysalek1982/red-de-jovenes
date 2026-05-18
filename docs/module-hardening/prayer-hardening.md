# Endurecimiento de sala de oracion

## Ruta revisada

- `/app/oracion`

## Hallazgos

| Punto | Estado antes | Accion |
| --- | --- | --- |
| Crear peticion | Funcional | Cubierto por QA especifico |
| Listar peticiones | Funcional con Supabase | Cubierto por QA y UI |
| Filtros | Funcionales en frontend | Documentado |
| Marcar respondida | Solo propia por servicio/RLS | Cubierto por QA especifico |
| Estoy orando | Funcional con `prayer_supports` | Cubierto por QA especifico |
| Duplicados | Controlado por unique constraint | Cubierto por QA especifico |
| Metricas | Mostraba numeros estaticos como si fueran reales | Corregido |
| Reportar peticion | Funcional con `content_reports` | Documentado |

## Correcciones realizadas

- Se reemplazaron numeros estaticos por conteos reales derivados de peticiones visibles.
- Se cambio el indicador de “47 paises” por cantidad real de peticiones publicas.
- La oracion sugerida ya no afirma una cantidad ficticia de jovenes.
- Se agrego `npm run qa:prayer`.

## QA especifico

Comando:

```bash
npm run qa:prayer
```

Cubre:

- crear peticion propia;
- crear apoyo de oracion;
- impedir apoyo duplicado;
- impedir que usuario B marque como respondida una peticion de usuario A;
- permitir que usuario A marque su propia peticion como respondida;
- validar contador de apoyos;
- limpiar peticion QA.

## Estado

**Funcional para piloto.**
