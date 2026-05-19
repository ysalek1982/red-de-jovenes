# Integracion IA biblica

## Acciones IA disponibles

- Explicar versiculo.
- Crear reflexion breve.
- Crear pregunta para grupo juvenil.
- Crear oracion corta basada en el versiculo.
- Sugerir publicacion para foro.

## Reglas

- Nunca se llama Gemini desde React.
- La key Gemini no usa `VITE_*`.
- Las llamadas pasan por Supabase Edge Function `ai-generate`.
- Si Gemini no esta configurado, se muestra estado claro y la solicitud queda para revision.
- Toda salida visible se presenta como sugerencia revisable.
- El usuario confirma antes de compartir o publicar.
- Acciones sensibles mantienen aprobacion humana.

## Estado actual

QA confirma que las acciones estan permitidas y responden correctamente en modo `AI_PROVIDER_NOT_CONFIGURED`. La prueba real de Gemini depende de que el admin configure una key en el panel.
