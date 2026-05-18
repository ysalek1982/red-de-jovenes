# QA Supabase

Fecha: 2026-05-17

## Proyecto

- Project ref: `ntlzlfbztryasbmjnynq`
- Project URL: `https://ntlzlfbztryasbmjnynq.supabase.co`

## CLI

- Comando: `npx supabase --version`
- Resultado: `2.98.2`

## Login y enlace

- Comando: `npx supabase projects list`
- Resultado: exitoso. El proyecto `ntlzlfbztryasbmjnynq` aparece como vinculado.
- Comando: `npx supabase link --project-ref ntlzlfbztryasbmjnynq`
- Resultado: `Finished supabase link.`

## Migraciones remotas

- Comando: `npx supabase db push --dry-run`
- Resultado: `Remote database is up to date.`
- Observacion: el dry run no detecto migraciones pendientes.

- Comando: `npx supabase db push`
- Resultado: `Remote database is up to date.`
- Observacion: la migracion ya estaba aplicada en remoto, probablemente por aplicacion manual previa.

- Comando: `npx supabase migration list`
- Resultado: la migracion local y remota estan alineadas.

```text
Local          | Remote         | Time (UTC)
20260517214049 | 20260517214049 | 2026-05-17 21:40:49
```

## Tipos remotos

- Comando: `npx supabase gen types typescript --project-id ntlzlfbztryasbmjnynq --schema public`
- Resultado: tipos generados correctamente en `src/types/supabase.generated.ts`.
- `src/types/database.ts` ahora reexporta `Database` y tipos principales desde los tipos generados.

## Auth

Se ejecuto una prueba real contra Supabase remoto usando la publishable key desde `.env.local`.

- Registro con dominio `example.com`: rechazado por Supabase con `email_address_invalid`.
- Registro con dominio `gmail.com`: exitoso, usuario creado.
- Login posterior: bloqueado por configuracion de confirmacion de email.
- Error recibido: `Email not confirmed`.

Estado: el registro remoto funciona, pero el flujo completo de login, `/app` y RLS queda pendiente hasta confirmar el usuario QA o desactivar temporalmente la confirmacion de email para pruebas.

## Trigger `profiles`

- Estado: no validado desde frontend autenticado.
- Motivo: el usuario QA creado no puede iniciar sesion hasta confirmar email.
- Nota: la migracion remota esta aplicada y el trigger existe en el esquema remoto segun los tipos generados y la lista de migraciones.

## RLS

Pendiente de validacion completa desde sesion autenticada por bloqueo de confirmacion de email.

Validaciones aun pendientes:

- Usuario autenticado puede leer devocionales.
- Usuario autenticado puede leer posts.
- Usuario autenticado puede crear post propio.
- Usuario autenticado puede crear peticion propia.
- Usuario no puede modificar datos de otro usuario.

## Seguridad

- No se escribieron contrasenas reales.
- No se escribieron connection strings privadas.
- No se uso service role key.
- `.env.local` permanece ignorado por Git.
- `supabase/.temp/` permanece ignorado por Git.
- Las contrasenas de ejemplo permanecen como placeholders.

## Errores encontrados y correcciones

- El bloqueo anterior de login CLI quedo resuelto despues de la accion manual del usuario.
- La base remota ya estaba al dia; no se aplicaron cambios adicionales con `db push`.
- Los tipos remotos fueron generados y conectados a `src/types/database.ts`.
- Queda pendiente confirmar o configurar el usuario QA para validar login, `/app` y RLS desde frontend autenticado.
