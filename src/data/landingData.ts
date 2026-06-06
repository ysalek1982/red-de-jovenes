export type FeatureIcon =
  | 'prayer'
  | 'bible'
  | 'games'
  | 'map'
  | 'devotional'
  | 'safe'

export interface LandingMetric {
  value: string
  label: string
}

export interface LandingFeature {
  title: string
  text: string
  icon: FeatureIcon
}

export interface LandingTestimonial {
  quote: string
  name: string
  detail: string
  initial: string
}

export const heroBenefits = [
  'Espacio seguro',
  'Basado en la Palabra',
  'Para iglesias y grupos',
]

export const landingMetrics: LandingMetric[] = [
  { value: 'Biblia', label: 'RVR1909 completa' },
  { value: 'PWA', label: 'Instalable en móvil' },
  { value: 'Red', label: 'Comunidad moderada' },
  { value: 'Piloto', label: 'Cerrado y monitoreado' },
]

export const landingFeatures: LandingFeature[] = [
  {
    title: 'Sala de oración comunitaria',
    text: 'Ora con otros jóvenes. Comparte peticiones, acompaña y celebra respuestas.',
    icon: 'prayer',
  },
  {
    title: 'Foros con la Palabra',
    text: 'Comparte reflexiones, preguntas y testimonios con conversaciones sanas.',
    icon: 'bible',
  },
  {
    title: 'Juegos de fe',
    text: 'Versículo Rápido, Batallas de Fe y más. Aprende jugando con tus amigos.',
    icon: 'games',
  },
  {
    title: 'Mapa mundial',
    text: 'Encuentra comunidades, únete a grupos activos o sugiere una comunidad cercana.',
    icon: 'map',
  },
  {
    title: 'Devocional diario',
    text: 'Un versículo, una reflexión, un paso. Construye tu hábito espiritual.',
    icon: 'devotional',
  },
  {
    title: 'Espacio seguro',
    text: 'Moderación con sabiduría. Aquí cada joven es valorado y protegido.',
    icon: 'safe',
  },
]

export const pwaItems = [
  'Devocional diario al despertar',
  'Notificaciones internas de comunidad',
  'Acceso rápido desde la pantalla de inicio',
  'Mapa mundial de la juventud cristiana',
]

export const landingTestimonials: LandingTestimonial[] = [
  {
    quote:
      'Un joven nuevo necesita entender rápido qué hacer: crear perfil, leer Biblia, pedir oración y encontrar comunidad.',
    name: 'Primeros pasos',
    detail: 'Primeros pasos en la Red',
    initial: 'P',
  },
  {
    quote:
      'Un líder necesita ver actividad, acompañar conversaciones sanas y responder reportes sin perderse entre pantallas.',
    name: 'Acompañamiento',
    detail: 'Acompañamiento y comunidad',
    initial: 'A',
  },
  {
    quote:
      'Un participante necesita volver durante la semana: jugar, compartir, guardar versículos y enviar feedback claro.',
    name: 'Uso semanal',
    detail: 'Uso diario y feedback',
    initial: 'U',
  },
]
