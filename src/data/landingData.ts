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
  'Respaldado por iglesias',
]

export const landingMetrics: LandingMetric[] = [
  { value: '12.4K', label: 'Jóvenes' },
  { value: '320', label: 'Iglesias' },
  { value: '47', label: 'Países' },
  { value: '1.2M', label: 'Oraciones' },
]

export const landingFeatures: LandingFeature[] = [
  {
    title: 'Sala de oración global',
    text: 'Ora con otros jóvenes 24/7. Comparte peticiones, celebra respuestas.',
    icon: 'prayer',
  },
  {
    title: 'Foros con la Palabra',
    text: 'Cada debate empieza con versículos. Discusiones sanas, profundas y reales.',
    icon: 'bible',
  },
  {
    title: 'Juegos de fe',
    text: 'Versículo Rápido, Batallas de Fe y más. Aprende jugando con tus amigos.',
    icon: 'games',
  },
  {
    title: 'Mapa mundial',
    text: 'Conecta con iglesias y grupos juveniles en 47 países. La luz se expande.',
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
  'Notificaciones de oración en vivo',
  'Modo lectura sin internet',
  'Mapa mundial de la juventud cristiana',
]

export const landingTestimonials: LandingTestimonial[] = [
  {
    quote:
      'Encontré una comunidad real. La Sala de Oración me sostuvo en la peor semana de mi vida.',
    name: 'Lucía R.',
    detail: '19 años · Buenos Aires',
    initial: 'L',
  },
  {
    quote:
      'Los foros con versículos son fuego. Ya no debato vacío, debato con la Palabra en la mano.',
    name: 'Mateo A.',
    detail: '22 años · Bogotá',
    initial: 'M',
  },
  {
    quote:
      'El devocional diario me cambió las mañanas. Ahora despierto con propósito y no con TikTok.',
    name: 'Sara P.',
    detail: '17 años · Ciudad de México',
    initial: 'S',
  },
]
