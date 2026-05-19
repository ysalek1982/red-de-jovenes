# Navegacion ampliada segun prototipo

## Decision

La navegacion movil conserva un bottom nav tipo app y agrega mas modulos mediante "Mas", sin volver a mostrar Seguridad como modulo principal.

## Bottom nav movil

- Inicio: `/app`
- Biblia: `/app/biblia`
- Orar: `/app/oracion`
- Foros: `/app/foros`
- Juegos: `/app/juegos`
- Mas: abre menu secundario

## Menu Mas

- Devocional: `/app/devocional`
- Comunidad: `/app/mapa`
- Eventos: `/app/eventos`
- Discipulado: `/app/discipulado`
- Mensajes: `/app/mensajes`
- Perfil: `/app/perfil`
- Construir: `/app/construir`
- Administracion: `/app/admin`, solo si el usuario tiene rol admin
- Cerrar sesion

## Seguridad

La ruta `/app/seguridad` queda secundaria/oculta para conservar normas y soporte si se accede manualmente. Los reportes siguen disponibles de forma contextual en oraciones, foros, comentarios y administracion.

## Resultado

La app queda mas cercana al prototipo Lovable sin saturar la barra inferior ni convertir la experiencia en portal institucional.
