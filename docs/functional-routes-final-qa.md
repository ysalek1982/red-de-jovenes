# QA final de rutas funcionales

## Objetivo

Validar rutas públicas, rutas privadas y flujos principales como Release
Candidate.

## Comandos

```bash
npm run qa:routes
npm run lint
npm run build
```

## Resultado automatizado

- `npm run qa:routes`: `QA_FUNCTIONAL_ROUTES_OK`.
- Base local: `http://127.0.0.1:8080`.

## Rutas HTTP validadas

Todas devolvieron estado `200` desde el servidor local:

- `/`
- `/landing`
- `/demo`
- `/entrar`
- `/crear-cuenta`
- `/recuperar`
- `/app`
- `/app/oracion`
- `/app/foros`
- `/app/devocional`
- `/app/juegos`
- `/app/mapa`
- `/app/seguridad`
- `/app/perfil`
- `/app/admin`

## Flujos funcionales validados por script

- Perfil: actualización OK.
- Oración: crear petición OK.
- Oración: “Estoy orando” OK.
- Foros: crear post OK.
- Foros: crear comentario OK.
- Foros: reacción “Amén” OK.
- Devocional: marcar leído OK.
- Devocional: guardar favorito OK.
- Mapa: leer grupos OK.
- Mapa: sugerir comunidad OK.
- Seguridad: crear reporte OK.
- Preferencias: guardar notificaciones OK.
- Usuario no admin: `has_role('admin')` falso.
- Admin: login y rol admin OK.

## Validación en navegador

- `/` sin sesión redirige a `/entrar`.
- Login con usuario QA no admin llega a `/app`.
- Usuario QA no admin en `/app/admin`: muestra “No autorizado”.
- Login admin llega a `/app/admin`.
- Admin en `/app/admin`: muestra “Panel de administración”.

## Limpieza

El script elimina posts y peticiones temporales creadas durante QA. Las
sugerencias/reportes QA quedan como evidencia moderable en admin.

## Validaciones

- `npm run lint`: OK.
- `npm run build`: OK, con warning no bloqueante de chunk grande.
