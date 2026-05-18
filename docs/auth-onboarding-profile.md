# Auth, onboarding y perfil

Fecha: 2026-05-18

## Cambios funcionales

- Registro ampliado con:
  - nombre completo
  - usuario
  - correo
  - contraseña
  - ciudad
  - país
  - iglesia/comunidad
  - rango de edad
  - aceptación de normas de comunidad
- Login conserva estética premium y agrega enlace a recuperación.
- Nueva ruta `/recuperar` para enviar email de recuperación con Supabase Auth.
- Perfil privado permite editar:
  - nombre completo
  - usuario
  - avatar URL
  - ciudad
  - país
  - iglesia/comunidad
  - rango de edad
  - bio
- Se valida formato de username sin espacios y con longitud/formato seguro.
- Se consulta disponibilidad de username antes de guardar perfil.

## Migración aplicada

Nueva migración:

```text
20260518010000_enhance_profiles_onboarding.sql
```

Cambios de esquema:

- `profiles.age_range`
- `profiles.community_guidelines_accepted_at`
- constraints de formato para `username` y `age_range`
- trigger `handle_new_user` actualizado para copiar metadata de onboarding

Comandos ejecutados:

```bash
npx supabase db push --dry-run
npx supabase db push
npx supabase gen types typescript --project-id ntlzlfbztryasbmjnynq --schema public > src/types/supabase.generated.ts
```

## Seguridad

- No se usan secretos en frontend.
- No se agregó service role.
- Las credenciales siguen en archivos locales ignorados.
- El perfil mantiene RLS de actualización propia.

## QA

- `npm run lint`: OK.
- `npm run build`: OK.
- `npm run qa:auth`: pendiente si faltan usuarios QA A/B.

## Pendientes

- Probar flujo de recuperación contra emails reales de QA confirmados.
- Agregar flujo completo de actualización de contraseña cuando Supabase redirija
  con token de recuperación.
