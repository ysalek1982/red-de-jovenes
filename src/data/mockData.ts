export type ProgramCategory =
  | 'Liderazgo juvenil'
  | 'Voluntariado'
  | 'Formación digital'
  | 'Cultura y arte'
  | 'Emprendimiento'
  | 'Participación ciudadana'

export type EventStatus = 'Próximo' | 'En curso' | 'Finalizado'

export type OpportunityType =
  | 'Becas'
  | 'Cursos'
  | 'Convocatorias'
  | 'Voluntariados'
  | 'Pasantías'
  | 'Empleabilidad juvenil'

export type YouthStatus = 'Activo' | 'Nuevo' | 'En seguimiento'

export interface Statistic {
  label: string
  value: string
  description: string
}

export interface Program {
  id: string
  title: string
  category: ProgramCategory
  summary: string
  description: string
  participants: number
  duration: string
  modality: string
  image: string
}

export interface Event {
  id: string
  title: string
  category: ProgramCategory
  status: EventStatus
  date: string
  time: string
  location: string
  description: string
  spots: number
  image: string
}

export interface Opportunity {
  id: string
  title: string
  type: OpportunityType
  organization: string
  deadline: string
  location: string
  summary: string
  requirements: string
  tags: string[]
}

export interface Testimonial {
  id: string
  name: string
  age: number
  city: string
  role: string
  quote: string
}

export interface YouthRecord {
  id: string
  name: string
  age: number
  city: string
  program: ProgramCategory
  status: YouthStatus
  lastActivity: string
}

export interface DashboardEvent {
  id: string
  title: string
  status: EventStatus
  registered: number
  capacity: number
}

export const heroImage =
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=85'

export const stats: Statistic[] = [
  {
    label: 'Jóvenes registrados',
    value: '12.480',
    description: 'participan en comunidades, programas y actividades.',
  },
  {
    label: 'Actividades realizadas',
    value: '860',
    description: 'encuentros, talleres, mentorías y jornadas de servicio.',
  },
  {
    label: 'Organizaciones aliadas',
    value: '128',
    description: 'iglesias, fundaciones, colegios y colectivos juveniles.',
  },
  {
    label: 'Programas activos',
    value: '18',
    description: 'rutas de formación con enfoque práctico y comunitario.',
  },
]

export const programs: Program[] = [
  {
    id: 'lideres-con-proposito',
    title: 'Líderes con propósito',
    category: 'Liderazgo juvenil',
    summary: 'Formación para coordinar equipos, servir mejor y activar proyectos locales.',
    description:
      'Ruta de liderazgo con mentorías, habilidades de comunicación, gestión de equipos y diseño de iniciativas para la comunidad.',
    participants: 420,
    duration: '10 semanas',
    modality: 'Híbrido',
    image:
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'voluntariado-en-accion',
    title: 'Voluntariado en acción',
    category: 'Voluntariado',
    summary: 'Brigadas juveniles para servicio social, acompañamiento y respuesta comunitaria.',
    description:
      'Programa de servicio con retos mensuales, coordinación territorial y medición de impacto social.',
    participants: 650,
    duration: 'Permanente',
    modality: 'Presencial',
    image:
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'habilidades-digitales',
    title: 'Habilidades digitales',
    category: 'Formación digital',
    summary: 'Cursos prácticos de herramientas digitales, productividad y comunicación.',
    description:
      'Aprendizaje por proyectos para fortalecer habilidades tecnológicas útiles en estudio, trabajo y emprendimiento.',
    participants: 380,
    duration: '8 semanas',
    modality: 'Virtual',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'arte-que-conecta',
    title: 'Arte que conecta',
    category: 'Cultura y arte',
    summary: 'Laboratorios de música, comunicación visual, teatro y expresión comunitaria.',
    description:
      'Espacios creativos para que los jóvenes cuenten historias, preparen muestras y creen campañas con impacto.',
    participants: 240,
    duration: '6 semanas',
    modality: 'Presencial',
    image:
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'emprende-joven',
    title: 'Emprende joven',
    category: 'Emprendimiento',
    summary: 'Acompañamiento para validar ideas, modelar proyectos y presentar propuestas.',
    description:
      'Bootcamp de innovación con asesorías, finanzas básicas, prototipado y presentación ante aliados.',
    participants: 210,
    duration: '12 semanas',
    modality: 'Híbrido',
    image:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'voz-ciudadana',
    title: 'Voz ciudadana',
    category: 'Participación ciudadana',
    summary: 'Formación para incidencia, diálogo público y proyectos de bien común.',
    description:
      'Ruta para comprender derechos, deberes, ciudadanía activa y participación responsable en espacios locales.',
    participants: 300,
    duration: '9 semanas',
    modality: 'Híbrido',
    image:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80',
  },
]

export const events: Event[] = [
  {
    id: 'encuentro-red-2026',
    title: 'Encuentro Red de Jóvenes 2026',
    category: 'Liderazgo juvenil',
    status: 'Próximo',
    date: '12 de junio de 2026',
    time: '18:30',
    location: 'Auditorio Central',
    description:
      'Noche de visión, testimonios, música y conexión para nuevos voluntarios y líderes juveniles.',
    spots: 180,
    image:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'taller-habilidades-digitales',
    title: 'Taller de herramientas digitales',
    category: 'Formación digital',
    status: 'Próximo',
    date: '25 de junio de 2026',
    time: '19:00',
    location: 'Sala virtual',
    description:
      'Sesión práctica para organizar proyectos juveniles con herramientas colaborativas.',
    spots: 90,
    image:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'brigada-servicio',
    title: 'Brigada de servicio comunitario',
    category: 'Voluntariado',
    status: 'En curso',
    date: 'Mayo de 2026',
    time: 'Sábados 09:00',
    location: 'Distritos aliados',
    description:
      'Acciones por zonas con acompañamiento a familias, limpieza de espacios y apoyo logístico.',
    spots: 120,
    image:
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'foro-ciudadania',
    title: 'Foro juvenil de participación',
    category: 'Participación ciudadana',
    status: 'Finalizado',
    date: '18 de abril de 2026',
    time: '17:00',
    location: 'Centro Cultural',
    description:
      'Panel de jóvenes líderes sobre ciudadanía, diálogo y proyectos colaborativos.',
    spots: 160,
    image:
      'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=900&q=80',
  },
]

export const opportunities: Opportunity[] = [
  {
    id: 'beca-liderazgo-comunitario',
    title: 'Beca de liderazgo comunitario',
    type: 'Becas',
    organization: 'Fundación Aliada',
    deadline: '30 de junio de 2026',
    location: 'Bolivia',
    summary:
      'Apoyo parcial para jóvenes que lideran proyectos sociales y desean fortalecer su formación.',
    requirements: 'Tener entre 16 y 28 años, proyecto activo y carta de motivación.',
    tags: ['liderazgo', 'impacto social', 'mentoría'],
  },
  {
    id: 'curso-comunicacion-digital',
    title: 'Curso de comunicación digital',
    type: 'Cursos',
    organization: 'Academia Red',
    deadline: '15 de junio de 2026',
    location: 'Virtual',
    summary:
      'Entrenamiento corto para crear contenido responsable, campañas y piezas audiovisuales.',
    requirements: 'Disponibilidad de 4 horas semanales y conexión a internet.',
    tags: ['comunicación', 'redes sociales', 'diseño'],
  },
  {
    id: 'convocatoria-proyectos-barriales',
    title: 'Convocatoria para proyectos barriales',
    type: 'Convocatorias',
    organization: 'Red de Jóvenes',
    deadline: '5 de julio de 2026',
    location: 'Santa Cruz',
    summary:
      'Financiamiento semilla y acompañamiento para iniciativas de servicio local.',
    requirements: 'Equipo mínimo de 3 jóvenes y plan de acción de 90 días.',
    tags: ['proyectos', 'territorio', 'servicio'],
  },
  {
    id: 'voluntariado-mentorias',
    title: 'Voluntariado de mentorías escolares',
    type: 'Voluntariados',
    organization: 'Centro Comunitario Luz',
    deadline: '20 de junio de 2026',
    location: 'Presencial',
    summary:
      'Acompañamiento académico y emocional para adolescentes en etapa escolar.',
    requirements: 'Compromiso semanal, entrevista y capacitación inicial.',
    tags: ['mentorías', 'educación', 'voluntariado'],
  },
  {
    id: 'pasantia-operaciones-sociales',
    title: 'Pasantía en operaciones sociales',
    type: 'Pasantías',
    organization: 'Impacto Joven',
    deadline: '28 de junio de 2026',
    location: 'Híbrido',
    summary:
      'Apoyo en planificación, seguimiento de actividades y comunicación con aliados.',
    requirements: 'Estudiantes o egresados jóvenes con interés en gestión social.',
    tags: ['gestión', 'aliados', 'aprendizaje'],
  },
  {
    id: 'bolsa-empleo-joven',
    title: 'Bolsa de empleabilidad juvenil',
    type: 'Empleabilidad juvenil',
    organization: 'Empresas aliadas',
    deadline: 'Abierta todo el año',
    location: 'Bolivia',
    summary:
      'Registro para recibir vacantes, talleres de CV y simulacros de entrevista.',
    requirements: 'Perfil actualizado y disponibilidad para orientación laboral.',
    tags: ['empleo', 'cv', 'entrevistas'],
  },
]

export const testimonials: Testimonial[] = [
  {
    id: 'lucia-rojas',
    name: 'Lucía Rojas',
    age: 19,
    city: 'Santa Cruz',
    role: 'Voluntaria',
    quote:
      'Encontré una comunidad que no solo habla de propósito, también lo vive sirviendo a otros.',
  },
  {
    id: 'mateo-arias',
    name: 'Mateo Arias',
    age: 22,
    city: 'Cochabamba',
    role: 'Mentor joven',
    quote:
      'La Red me ayudó a ordenar mis ideas, liderar mejor y conectar con jóvenes de otras ciudades.',
  },
  {
    id: 'sofia-paz',
    name: 'Sofía Paz',
    age: 18,
    city: 'La Paz',
    role: 'Participante',
    quote:
      'Entré por un curso digital y terminé sumándome a un equipo que hoy impulsa proyectos reales.',
  },
]

export const youthRecords: YouthRecord[] = [
  {
    id: 'RJ-1024',
    name: 'Andrea Méndez',
    age: 20,
    city: 'Santa Cruz',
    program: 'Liderazgo juvenil',
    status: 'Activo',
    lastActivity: 'Encuentro Red de Jóvenes 2026',
  },
  {
    id: 'RJ-1025',
    name: 'Daniel Vargas',
    age: 17,
    city: 'La Paz',
    program: 'Formación digital',
    status: 'Nuevo',
    lastActivity: 'Registro inicial',
  },
  {
    id: 'RJ-1026',
    name: 'Camila Arce',
    age: 23,
    city: 'Cochabamba',
    program: 'Voluntariado',
    status: 'Activo',
    lastActivity: 'Brigada de servicio comunitario',
  },
  {
    id: 'RJ-1027',
    name: 'Samuel Quiroga',
    age: 21,
    city: 'Tarija',
    program: 'Emprendimiento',
    status: 'En seguimiento',
    lastActivity: 'Mentoría de proyecto',
  },
]

export const dashboardEvents: DashboardEvent[] = [
  {
    id: 'EV-001',
    title: 'Encuentro Red de Jóvenes 2026',
    status: 'Próximo',
    registered: 126,
    capacity: 180,
  },
  {
    id: 'EV-002',
    title: 'Taller de herramientas digitales',
    status: 'Próximo',
    registered: 72,
    capacity: 90,
  },
  {
    id: 'EV-003',
    title: 'Brigada de servicio comunitario',
    status: 'En curso',
    registered: 98,
    capacity: 120,
  },
]
