# Prueba real de proveedor Gemini

## Flujo admin

1. Entrar como administrador.
2. Abrir `/app/admin`.
3. Ir a “Inteligencia Artificial”.
4. Pegar la Gemini API key solo en el campo seguro del panel.
5. Elegir modelo, por ejemplo `gemini-2.0-flash`.
6. Guardar / rotar.
7. Probar conexion.

## Seguridad

- La key nunca se muestra completa.
- La key no se guarda en `localStorage`.
- La key no viaja como query param.
- React no llama Gemini directamente.
- La prueba se ejecuta desde `admin-ai-settings`.

## Estados QA

- `QA_AI_REAL_PROVIDER_SKIPPED`: no hay key real configurada.
- `QA_AI_REAL_PROVIDER_OK`: Gemini respondio desde Edge Function.

## Script

```powershell
npm run qa:ai-real
```
