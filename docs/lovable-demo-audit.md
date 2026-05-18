# Auditoría de paridad demo Lovable

Fecha: 2026-05-17

## Resumen ejecutivo

Se auditó el prototipo público de Lovable y la implementación local de Red de
Jóvenes con foco en el demo/app interna. La landing local ya mantenía paridad de
contenido, pero el demo local era un placeholder y la app privada aún no exponía
dos funciones centrales anunciadas por el prototipo: Juegos de fe y Mapa mundial.

Se corrigió la experiencia para que el producto local se lea como una red social
cristiana/PWA: navegación interna propia, demo público navegable, foros con la
Palabra, sala de oración global, devocional más completo, juegos de fe, mapa
mundial y espacio seguro.

## Rutas revisadas del prototipo Lovable

Referencia: `https://red-de-jovenes.lovable.app`

| Acción o ruta | Destino observado | Contenido relevante |
| --- | --- | --- |
| `Unirme ahora` | `/login` | Pantalla de acceso/creación de cuenta con estética cristiana. |
| `Crear cuenta` | `/login` | Mismo flujo visual de onboarding. |
| `Entrar` | `/login` | Mismo flujo visual de onboarding. |
| `Ver demo` | `/app` | Demo interno público tipo app social. |
| `Probar ahora` | `/app` | Demo interno público tipo app social. |
| `/app` | `/app` | Feed, historias, devocional, búsqueda, sugerencias y navegación interna. |
| `/app/orar` | `/app/orar` | Sala de oración con mensajes en vivo, oración del día y peticiones. |
| `/app/foros` | `/app/foros` | Categorías, tendencias y debates anclados en la Palabra. |
| `/app/juegos` | `/app/juegos` | Juegos de fe y leaderboard global. |
| `/app/comunidad` | `/app/comunidad` | Comunidad global con iglesias y grupos conectados. |
| `/app/devocional` | `/app/devocional` | Devocional de hoy, reflexión guiada, estado del corazón y diario espiritual. |

## Rutas revisadas localmente

| Ruta local | Estado |
| --- | --- |
| `/` | OK. Landing pública mantiene textos y secciones del prototipo. |
| `/demo` | Corregida. Ahora es demo público navegable sin backend. |
| `/entrar` | OK. Login real Supabase con estética del producto. |
| `/crear-cuenta` | OK. Registro real Supabase con metadata. |
| `/app` | Corregida. Inicio privado más cercano al demo social/PWA. |
| `/app/oracion` | Corregida. Sala global con estado en vivo y oración del día. |
| `/app/orar` | Alias a `/app/oracion` para acercarse a Lovable. |
| `/app/comunidad` | Corregida. Ahora se presenta como Foros con la Palabra. |
| `/app/foros` | Alias funcional a `/app/comunidad`. |
| `/app/devocional` | Corregida. Agrega reflexión guiada y estado del corazón. |
| `/app/juegos` | Nueva. Demo visual de Juegos de fe. |
| `/app/mapa` | Nueva. Mapa mundial simulado y grupos conectados. |
| `/app/admin` | OK. Sigue protegido por rol y fuera del foco principal. |

## Tabla de paridad funcional

| Elemento del prototipo | Existe localmente | Ruta local | Estado | Diferencia visual/funcional | Acción realizada |
| --- | --- | --- | --- | --- | --- |
| Sala de oración global | Sí | `/app/oracion`, `/app/orar` | Corregido | Antes era funcional pero menos parecido al demo en vivo. | Se agregaron métricas en vivo, oración respirada y oración del día. |
| Foros con la Palabra | Sí | `/app/comunidad`, `/app/foros` | Corregido | Antes decía Comunidad y parecía feed genérico. | Se cambió lenguaje, categorías y temas tendencia con versículos. |
| Juegos de fe | Sí | `/app/juegos` | Nuevo | No existía. | Se creó pantalla demo con Versículo Rápido, Batallas de Fe, Trivia Bíblica y leaderboard. |
| Mapa mundial | Sí | `/app/mapa` | Nuevo | No existía como app interna. | Se creó mapa visual simulado con países, grupos e iglesias. |
| Devocional diario | Sí | `/app/devocional` | Corregido | Faltaban elementos emocionales del demo. | Se agregaron reflexión guiada y estado del corazón. |
| Espacio seguro | Sí | `/app`, `/demo`, `/app/mapa` | Corregido | Solo estaba en landing. | Se agregó como módulo visible dentro de la app. |
| Demo público | Sí | `/demo` | Corregido | Antes era placeholder. | Se creó una experiencia mock navegable sin login. |
| PWA instalable | Sí | `manifest`, `sw.js`, `offline.html` | OK | Base correcta, sin store ni backend offline completo. | Se mantiene manifest, service worker y fallback offline. |
| Admin | Sí | `/app/admin` | OK | No forma parte del prototipo principal. | Se mantiene protegido y no se priorizó visualmente. |

## Tabla de paridad visual

| Área | Estado local | Observación |
| --- | --- | --- |
| Fondo oscuro/espiritual | OK | Gradientes `slate/indigo`, luz ámbar y verde se mantienen. |
| Glassmorphism | OK | Cards translúcidas con bordes `white/10` y sombras suaves. |
| Navegación app | Corregida | La app privada ahora usa header interno y navegación inferior mobile-first. |
| Hero/landing | OK | Conserva “Conectando jóvenes en Cristo.” y las métricas del prototipo. |
| Demo interno | Corregido | `/demo` ahora muestra formato de app, feed, devocional, oración, juegos y mapa. |
| Responsive | OK técnico | Rutas responden y evitan overflow por navegación horizontal móvil. |
| Iconografía | OK | Lucide React usado para oración, Palabra, juegos, mapa, seguridad y búsqueda. |
| Lenguaje | Corregido | Se reemplazó “Comunidad” genérico por “Foros con la Palabra” donde corresponde. |

## Faltantes encontrados

- `/demo` era una página placeholder débil.
- No existía `/app/juegos`.
- No existía `/app/mapa`.
- La navegación privada no reflejaba todas las funciones centrales del prototipo.
- La app privada aún usaba el header/footer público de landing.
- El módulo de comunidad no comunicaba claramente “Foros con la Palabra”.
- El devocional era funcional pero menos parecido al demo emocional de Lovable.
- El espacio seguro no aparecía dentro de la experiencia interna.

## Correcciones realizadas

- Se creó `src/pages/DemoPage.tsx` como demo público navegable.
- Se creó `src/pages/FaithGamesPage.tsx`.
- Se creó `src/pages/WorldMapPage.tsx`.
- Se creó `src/data/appDemoData.ts` para datos mock de demo, juegos, mapa, foros y espacio seguro.
- Se agregó header interno de app en `AppShell`.
- Se ocultó header/footer públicos en rutas `/app`.
- Se amplió navegación privada: Inicio, Oración, Foros, Devocional, Juegos, Mapa, Perfil y Administración solo si aplica.
- Se agregaron alias `/app/orar` y `/app/foros`.
- Se ajustó `/app/comunidad` para presentarse como Foros con la Palabra.
- Se enriqueció `/app/oracion` con elementos del demo Lovable.
- Se enriqueció `/app/devocional` con reflexión guiada y estado del corazón.
- Se actualizó `/app` con historias, accesos rápidos, juegos, mapa y espacio seguro.

## PWA

Estado:

- `public/manifest.webmanifest`: presente.
- `display: standalone`: presente.
- `start_url: /`: presente.
- `scope: /`: presente.
- `theme_color`: presente.
- `public/sw.js`: presente.
- `public/offline.html`: presente.
- Ícono temporal: `public/favicon.svg`.

Pendiente antes de producción:

- Reemplazar íconos temporales por set completo propio y licenciado.
- Validar instalación en dispositivos reales iOS/Android.
- Definir estrategia offline de datos para devocionales si se requiere.

## QA ejecutado

Validaciones técnicas:

- `npm run lint`: OK.
- `npm run build`: OK.
- Rutas locales HTTP revisadas: `/`, `/demo`, `/entrar`, `/crear-cuenta`, `/app`, `/app/oracion`, `/app/comunidad`, `/app/foros`, `/app/devocional`, `/app/juegos`, `/app/mapa`, `/app/admin`: todas responden `200` en el dev server.
- `npm run qa:auth`: `BLOCKED_MISSING_QA_ENV`.
- `npm run qa:rls`: `BLOCKED_MISSING_QA_ENV`.

Validación visual:

- Se auditó la estructura y contenido del prototipo con la referencia pública.
- El navegador automatizado local no expuso un panel activo para capturas en esta sesión, por lo que no se adjuntan screenshots.
- Se dejó descripción visual y validación de rutas/contenido. Revisión humana recomendada: abrir `/demo`, `/app`, `/app/juegos` y `/app/mapa` en móvil y desktop.

## Seguridad

- No se agregaron secretos.
- No se usó service role en `src/`.
- `.env.admin.local` sigue ignorado por Git.
- `.env.qa.local`/variables QA no están versionadas.
- No se agregaron contraseñas ni connection strings privadas a documentación.

## Resultado final

La implementación local queda más cercana al demo original de Lovable:

- Landing pública conserva paridad.
- `/demo` ya muestra una experiencia de app real sin login.
- La app privada expone las funciones centrales anunciadas por la landing.
- Juegos de fe y mapa mundial ya existen como pantallas premium preparadas para evolución funcional.
- La navegación interna refleja el producto cristiano/PWA y no un portal institucional.
