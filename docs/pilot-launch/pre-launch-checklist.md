# Checklist pre lanzamiento

## Supabase

- [ ] Site URL apunta a `https://red-de-jovenes.vercel.app`.
- [ ] Redirect URLs incluyen login, registro, recovery y rutas app.
- [ ] Email recovery probado con correo real.
- [x] RLS activo.
- [x] Edge Functions desplegadas.
- [x] `AI_CONFIG_MASTER_KEY` configurada como secret.
- [ ] Gemini key real configurada o documentada como pendiente.
- [x] No hay `service_role` en frontend.

## Vercel

- [x] Production Ready.
- [x] Alias principal: `https://red-de-jovenes.vercel.app`.
- [x] Variables publicas Supabase configuradas.
- [x] Sin variables secretas de admin/QA/Gemini en frontend.
- [x] PWA manifest responde.

## Admin

- [x] Admin principal verificado.
- [x] Panel IA visible.
- [x] Panel Biblia visible.
- [x] Reportes visibles.
- [x] Comunidades y sugerencias visibles.
- [x] Eventos administrables.
- [x] Prompts IA visibles.
- [x] Limites IA visibles.

## Biblia

- [x] Versiculos base OK.
- [x] Versiculo aleatorio OK.
- [x] Importador listo con licencia obligatoria.
- [ ] Biblia completa pendiente hasta licencia clara.

## IA

Si hay key real:

- [ ] Probar conexion.
- [ ] Explicar versiculo.
- [ ] Generar borrador devocional.
- [ ] Probar limites.

Si no hay key:

- [x] `QA_AI_REAL_PROVIDER_SKIPPED` aceptado.
