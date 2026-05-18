# Checklist pre-piloto real

Usar antes de invitar usuarios reales al piloto cerrado.

| Item | Estado | Observacion |
| --- | --- | --- |
| Deploy generado | Pendiente | Publicar staging/produccion |
| URL publica/staging disponible | Pendiente | Agregar en Supabase Site URL |
| Variables `VITE_*` configuradas | Pendiente | Solo variables frontend |
| SPA fallback configurado | Pendiente | Todas las rutas sirven `index.html` |
| Login admin probado | Pendiente | Usuario admin existente |
| Login usuario normal probado | Pendiente | Usar usuario piloto o QA |
| Registro probado | Pendiente | Confirmar flujo de email |
| Recuperacion de contrasena probada | Pendiente | Revisar redirect URL |
| PWA instalada en Android | Pendiente | Chrome Android |
| PWA instalada en desktop | Pendiente | Edge/Chrome Desktop |
| Oracion probada | Pendiente | Crear peticion y apoyo |
| Foros probados | Pendiente | Post, comentario, reaccion |
| Devocional probado | Pendiente | Leer, marcar y guardar |
| Juegos probados | Pendiente | Versiculo Rapido o Trivia |
| Mapa probado | Pendiente | Ver grupos y sugerir comunidad |
| Reportes probados | Pendiente | Crear reporte de prueba |
| Admin probado | Pendiente | Revisar reportes y KPIs |
| QA Auth OK | OK local | `QA_AUTH_OK` |
| QA RLS OK | OK local | `QA_RLS_OK` |
| Feedback listo | OK | Ver `docs/pilot/formulario-feedback-piloto.md` |
| Matriz de monitoreo lista | OK | Ver `docs/pilot/matriz-monitoreo-piloto.md` |

## Criterio de salida

No iniciar el piloto hasta tener:

- URL publica/staging funcionando;
- Supabase Site URL y Redirect URLs actualizadas;
- login admin probado en el deploy;
- PWA probada al menos en un Android y un navegador desktop;
- canal de soporte definido.
