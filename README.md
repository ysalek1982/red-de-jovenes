# Red de Jóvenes

Proyecto web institucional para la Red de Jóvenes: una plataforma frontend para presentar programas, eventos, oportunidades, historias juveniles y un dashboard inicial preparado para futuras integraciones.

La primera versión reconstruye la experiencia visual y de navegación inspirada en el prototipo publicado en Lovable, pero con una base real, modular y mantenible en React.

## Stack usado

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React
- Componentes UI reutilizables con estilo tipo shadcn/ui

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

## Estructura del proyecto

```text
src/
  components/
    cards/        Tarjetas reutilizables para programas, eventos, oportunidades y testimonios.
    layout/       Header, footer, layout general y encabezados de página.
    sections/     Secciones principales de la página de inicio.
    ui/           Componentes base reutilizables.
  data/
    mockData.ts   Datos simulados tipados.
  lib/
    utils.ts      Utilidades compartidas.
  pages/          Páginas navegables de la aplicación.
  routes/
    AppRoutes.tsx Configuración de rutas.
  App.tsx
  main.tsx
```

## Páginas disponibles

- Inicio
- Sobre la Red
- Eventos
- Programas
- Oportunidades
- Contacto
- Dashboard
- Página 404

## Próximas fases sugeridas

- Integrar autenticación y roles administrativos.
- Conectar formularios, inscripciones y registros a un backend aprobado.
- Agregar gestión real de programas, eventos y oportunidades.
- Implementar persistencia de participantes y seguimiento de actividades.
- Añadir pruebas automatizadas de componentes y flujos críticos.
- Preparar despliegue continuo y configuración de ambientes.
