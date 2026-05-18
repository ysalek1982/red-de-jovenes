# Bootstrap seguro de administrador

Fecha: 2026-05-17

## Administrador inicial

El usuario administrador principal del sistema sera:

```text
ysalek@gmail.com
```

## Preparacion local

Copia el archivo de ejemplo:

```bash
cp .env.admin.local.example .env.admin.local
```

Completa solo en `.env.admin.local`:

```bash
SUPABASE_SERVICE_ROLE_KEY=valor_local_privado
# ADMIN_PASSWORD debe completarse solo con un valor local privado
```

Puedes ajustar los datos de perfil si hace falta:

```bash
ADMIN_FULL_NAME=Yassir Salek
ADMIN_USERNAME=ysalek
ADMIN_CITY=Santa Cruz de la Sierra
ADMIN_COUNTRY=Bolivia
ADMIN_CHURCH_NAME=
```

## Crear o asegurar el admin

Ejecuta:

```bash
npm run admin:create
```

El script:

- Crea el usuario en Supabase Auth si no existe.
- Confirma el email del usuario.
- Actualiza metadata segura del usuario si ya existe.
- Asegura el registro en `profiles`.
- Inserta el rol `admin` en `public.user_roles`.
- Finaliza con `ADMIN_USER_READY` cuando el bootstrap queda listo.

## Cambiar contrasena

Despues de crear el usuario, la contrasena puede cambiarse desde Supabase Auth o mediante un flujo de recuperacion de contrasena cuando este disponible en la app.

## Seguridad

- No versionar `.env.admin.local`.
- No escribir contrasenas reales en README, docs, migraciones, codigo fuente ni commits.
- No usar la llave privada de backend en frontend.
- El script local es el unico punto de uso previsto para la llave privada de backend durante el bootstrap.
