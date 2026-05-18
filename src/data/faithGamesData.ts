export type FaithGameKey = 'versiculo-rapido' | 'trivia-biblica'

export interface FaithGameQuestion {
  id: string
  category: string
  prompt: string
  options: string[]
  correctAnswer: string
  explanation: string
  reference?: string
}

export interface FaithGameDefinition {
  key: FaithGameKey
  title: string
  description: string
  badge: string
  questions: FaithGameQuestion[]
}

export const faithGames: FaithGameDefinition[] = [
  {
    key: 'versiculo-rapido',
    title: 'Versículo Rápido',
    description:
      'Completa versículos conocidos y fortalece tu memoria bíblica en pocos minutos.',
    badge: 'Memoria bíblica',
    questions: [
      {
        id: 'vr-1',
        category: 'Promesas',
        prompt: '“Todo lo puedo en Cristo que me ______.”',
        options: ['fortalece', 'escucha', 'llama', 'protege'],
        correctAnswer: 'fortalece',
        explanation: 'La fortaleza del creyente viene de Cristo.',
        reference: 'Filipenses 4:13',
      },
      {
        id: 'vr-2',
        category: 'Confianza',
        prompt: '“Confía en el Señor de todo tu ______.”',
        options: ['camino', 'corazón', 'pensamiento', 'futuro'],
        correctAnswer: 'corazón',
        explanation: 'La confianza bíblica involucra el corazón completo.',
        reference: 'Proverbios 3:5',
      },
      {
        id: 'vr-3',
        category: 'Identidad',
        prompt: '“Vosotros sois la ______ del mundo.”',
        options: ['voz', 'luz', 'sal', 'esperanza'],
        correctAnswer: 'luz',
        explanation: 'Jesús llama a sus discípulos a reflejar su luz.',
        reference: 'Mateo 5:14',
      },
      {
        id: 'vr-4',
        category: 'Paz',
        prompt: '“Mi paz os dejo, mi paz os ______.”',
        options: ['anuncio', 'entrego', 'doy', 'prometo'],
        correctAnswer: 'doy',
        explanation: 'Cristo ofrece una paz distinta a la del mundo.',
        reference: 'Juan 14:27',
      },
    ],
  },
  {
    key: 'trivia-biblica',
    title: 'Trivia Bíblica',
    description:
      'Responde preguntas de los Evangelios, el Antiguo Testamento y la vida de fe.',
    badge: 'Evangelios · AT · Fe',
    questions: [
      {
        id: 'tb-1',
        category: 'Evangelios',
        prompt: '¿Quién caminó sobre el agua hacia Jesús?',
        options: ['Juan', 'Pedro', 'Andrés', 'Tomás'],
        correctAnswer: 'Pedro',
        explanation: 'Pedro salió de la barca cuando Jesús lo llamó.',
        reference: 'Mateo 14:28-29',
      },
      {
        id: 'tb-2',
        category: 'Antiguo Testamento',
        prompt: '¿Quién fue llamado por Dios desde una zarza ardiente?',
        options: ['Moisés', 'Josué', 'Samuel', 'Elías'],
        correctAnswer: 'Moisés',
        explanation: 'Dios llamó a Moisés para liberar a su pueblo.',
        reference: 'Éxodo 3:4',
      },
      {
        id: 'tb-3',
        category: 'Fe y vida',
        prompt: 'Según Santiago, la fe sin obras está...',
        options: ['viva', 'incompleta', 'muerta', 'en proceso'],
        correctAnswer: 'muerta',
        explanation: 'La fe verdadera produce fruto visible.',
        reference: 'Santiago 2:17',
      },
      {
        id: 'tb-4',
        category: 'Evangelios',
        prompt: '¿Cuál es el gran mandamiento según Jesús?',
        options: [
          'Servir en silencio',
          'Amar a Dios y al prójimo',
          'Ayunar cada semana',
          'Viajar a Jerusalén',
        ],
        correctAnswer: 'Amar a Dios y al prójimo',
        explanation: 'Jesús resume la ley en amor a Dios y al prójimo.',
        reference: 'Mateo 22:37-39',
      },
    ],
  },
]

export const upcomingFaithGames = [
  {
    title: 'Batallas de Fe',
    description:
      'Duelos 1 vs 1 con preguntas, citas bíblicas y desafíos de aplicación.',
    status: 'Próximamente',
  },
  {
    title: 'Adivina la Historia',
    description:
      'Reconoce pasajes por pistas, personajes y decisiones clave.',
    status: 'Próximamente',
  },
]
