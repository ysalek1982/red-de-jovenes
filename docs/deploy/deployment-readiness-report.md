# Reporte de preparacion de despliegue

Fecha: 2026-05-18  
Sistema: Red de Jovenes  
Proyecto Supabase: `ntlzlfbztryasbmjnynq`

## 1. Dictamen

**LISTO PARA DESPLIEGUE STAGING.**

El proyecto esta preparado para publicar una version staging usable por usuarios piloto reales. El build genera `dist`, el smoke test de produccion pasa, Auth/RLS siguen validados y no se detectaron secretos en frontend ni en el build.

## 2. Variables requeridas

Configurar en el hosting frontend:

```text
VITE_SUPABASE_URL=https://ntlzlfbztryasbmjnynq.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_lzWu99dOnbt0eJVBgQ1fsw_jOy6bTC-
```

No configurar en hosting frontend:

- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`
- passwords de base de datos;
- variables `QA_USER_*`;
- `.env.local`;
- `.env.admin.local`;
- `.env.qa.local`.

## 3. Checklist hosting

| Item | Estado |
| --- | --- |
| Build command `npm run build` | OK |
| Output directory `dist` | OK |
| SPA fallback a `index.html` documentado | OK |
| Variables `VITE_*` documentadas | OK |
| Reglas de seguridad documentadas | OK |
| PWA `start_url` `/` | OK |
| `/landing` y `/demo` publicas | OK |

## 4. Checklist Supabase

| Item | Estado |
| --- | --- |
| Project URL documentada | OK |
| Auth habilitado | OK por QA |
| Site URL / Redirect URLs | Pendiente al conocer URL staging |
| Tablas y RLS documentadas | OK |
| Admin `ysalek@gmail.com` documentado | OK |
| Usuarios QA A/B validados | OK |
| Service role fuera del frontend | OK |
| Migraciones local/remoto alineadas | OK |

Migraciones alineadas hasta:

```text
20260518080000_add_notification_preferences
```

## 5. Resultado build

Comando:

```bash
npm run build
```

Resultado: OK.

La carpeta `dist` se genera correctamente. El bundle principal se mantiene por debajo del umbral de warning de Vite.

## 6. Resultado smoke:build

Comando:

```bash
npm run smoke:build
```

Resultado:

```json
{
  "status": "SMOKE_BUILD_OK",
  "files": 51,
  "assets": 46
}
```

Validado:

- `index.html`;
- `manifest.webmanifest`;
- `sw.js`;
- `offline.html`;
- assets;
- ausencia de `service_role`, `sb_secret_`, connection strings privadas, passwords locales y archivos `.env` en `dist`.

## 7. Resultado lint

Comando:

```bash
npm run lint
```

Resultado: OK.

## 8. Resultado QA Auth

Comando:

```bash
npm run qa:auth
```

Resultado: `QA_AUTH_OK`.

Usuarios QA A/B pueden iniciar sesion, obtener sesion, leer perfil propio, leer devocionales, posts y peticiones.

## 9. Resultado QA RLS

Comando:

```bash
npm run qa:rls
```

Resultado: `QA_RLS_OK`.

Validado:

- escritura propia permitida;
- lectura permitida segun politicas;
- escritura sobre datos ajenos denegada;
- usuario no admin no puede manipular roles ni escritura admin.

## 10. Estado PWA

Estado: OK base instalable.

Confirmado:

- `manifest.webmanifest` incluido en build;
- `sw.js` incluido en build;
- `offline.html` incluido en build;
- `start_url`: `/`;
- `scope`: `/`;
- `display`: `standalone`;
- fallback offline documentado.

Pendiente operativo: prueba real en Chrome Android y Edge/Chrome Desktop despues de publicar staging.

## 11. Riesgos

- Supabase Site URL y Redirect URLs deben actualizarse cuando exista URL staging.
- El hosting elegido debe configurar correctamente fallback SPA.
- La PWA debe probarse en dispositivos reales despues del deploy.
- El piloto requiere canal de soporte y moderacion activo.

## 12. Pendientes

1. Elegir plataforma de hosting.
2. Configurar variables `VITE_*`.
3. Configurar SPA fallback.
4. Publicar staging.
5. Actualizar Supabase Site URL y Redirect URLs.
6. Probar admin y usuario normal en URL staging.
7. Ejecutar checklist pre-piloto.

## 13. Siguiente accion recomendada

Desplegar en **Vercel** como staging inicial por su soporte simple para Vite, previews y variables de entorno. Luego configurar Supabase Auth con la URL generada y ejecutar el checklist pre-piloto real.
