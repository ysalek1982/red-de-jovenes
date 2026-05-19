# Panel admin de Inteligencia Artificial

## Ubicacion

`/app/admin`, seccion "Inteligencia Artificial".

## Funciones

- Ver estado Gemini enmascarado.
- Guardar o rotar API key.
- Definir modelo.
- Probar conexion.
- Desactivar proveedor.
- Generar contenido asistido para revision humana.
- Ver cola de acciones pendientes.

## Seguridad

- La key se escribe en un input password y se envia a Edge Function.
- No se guarda en localStorage.
- No se muestra completa.
- No viaja por query params.
- El frontend nunca llama Gemini directamente.
- Las acciones sensibles quedan en `ai_action_queue`.

## Aviso pastoral

La UI muestra: "La IA asiste, no reemplaza el criterio pastoral."
