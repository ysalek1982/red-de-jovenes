# Manual operativo Biblia e IA

## Configurar Gemini

1. Entrar como admin.
2. Abrir `/app/admin`.
3. Ir a “Inteligencia Artificial”.
4. Pegar la key solo en el panel.
5. Definir modelo.
6. Guardar / rotar.
7. Probar conexion.

Nunca pegar la key en chats, documentos, GitHub, Vercel frontend ni variables `VITE_*`.

## Desactivar Gemini

Usar “Desactivar” en el panel admin si:

- hay consumo inesperado;
- una respuesta es inadecuada;
- se sospecha exposicion de key;
- se necesita pausa pastoral.

## Usar IA

- Generar sugerencias.
- Revisar.
- Editar.
- Publicar manualmente solo cuando corresponda.

La IA no publica devocionales, discipulado, moderacion o reportes sin revision humana.

## Biblia

- El versiculo aleatorio usa Supabase.
- La lectura por capitulo funciona con el texto cargado.
- La Biblia completa requiere fuente/licencia documentada.
- La importacion se hace por script con `--dry-run` y `--confirm-license`.

## Costos

- Revisar “Uso y limites”.
- Mantener limites diarios bajos durante piloto.
- Desactivar IA si hay consumo irregular.

## Incidentes

| Incidente | Accion |
|---|---|
| Key expuesta | Desactivar Gemini, rotar key, revisar logs. |
| Respuesta inadecuada | No publicar, registrar hallazgo, ajustar prompt. |
| Usuario en crisis | Contactar lider adulto/profesional/servicios locales. |
| Reporte grave | Escalar a administrador/lider responsable. |
