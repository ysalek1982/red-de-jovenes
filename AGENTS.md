# Instrucciones para futuros trabajos de Codex

- Mantener el español como idioma principal de toda la interfaz.
- Mantener la experiencia principal como landing/app cristiana tipo red social/PWA.
- Priorizar paridad visual con el prototipo Lovable antes que páginas internas.
- Mantener la navegación principal con anclas: Misión, Funciones, Testimonios y Comunidad.
- No reintroducir portal institucional, dashboard prioritario, programas municipales u oportunidades laborales en la navegación principal.
- Mantener TypeScript estricto y evitar `any` salvo necesidad justificada.
- Ejecutar `npm run build` y `npm run lint` antes de finalizar cambios.
- No introducir backend, autenticación real ni persistencia sin aprobación explícita.
- La integración Supabase usa solo publishable key en frontend; nunca usar service role ni contraseña de base de datos en `src/`.
- Mantener `.env.local`, `.env.*.local`, `.auth/` y `supabase/.temp/` fuera de Git.
- Mantener componentes pequeños, reutilizables y alineados con la estructura actual.
- Usar `src/data/landingData.ts` para el contenido principal de la landing.
- Conservar React Router, Tailwind CSS y Lucide React como base del frontend.
