# Red de Jóvenes

Landing/app cristiana moderna tipo red social/PWA, reconstruida a partir del prototipo publicado en Lovable.

La experiencia principal presenta una red para jóvenes en Cristo con comunidad, oración, foros con la Palabra, juegos de fe, devocional diario, mapa mundial y una app instalable.

## Stack usado

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React

## Instalación

```bash
npm install
```

## Ejecución local

```bash
npm run dev
```

La aplicación queda disponible normalmente en `http://localhost:5173`.

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## Rutas principales

- `/`
- `/entrar`
- `/crear-cuenta`
- `/demo`

La página principal usa anclas internas:

- `#mision`
- `#funciones`
- `#testimonios`
- `#comunidad`

## Estructura principal

```text
src/
  components/
    layout/       Header, footer y layout global.
    ui/           Componentes base reutilizables.
  data/
    landingData.ts Contenido de la landing cristiana/PWA.
    mockData.ts    Datos heredados no enlazados en la experiencia principal.
  pages/
    Home.tsx
    PlaceholderPage.tsx
  routes/
    AppRoutes.tsx
```

## Próximas fases sugeridas

- Crear flujos reales de registro e ingreso.
- Implementar demo navegable de sala de oración, foros, devocional y mapa.
- Añadir manifest PWA, service worker y modo instalable real.
- Definir backend solo con aprobación previa.
- Agregar pruebas visuales y de navegación.
