drop policy if exists "Admins gestionan settings IA" on public.ai_provider_settings;

-- El cliente no debe leer ni escribir encrypted_api_key directamente.
-- La administracion del proveedor IA queda limitada a Edge Functions con service role.
