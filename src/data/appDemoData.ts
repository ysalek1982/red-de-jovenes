export interface StoryPreview {
  initial: string
  name: string
  detail: string
}

export interface DemoPost {
  initial: string
  author: string
  username: string
  type: string
  body: string
  stats: string
  verse?: string
}

export interface ForumCategory {
  title: string
  threads: string
}

export interface ForumTopic {
  category: string
  title: string
  verses: string[]
  author: string
  replies: number
  prayers: number
  isTrending?: boolean
}

export interface GameCard {
  title: string
  description: string
  meta: string
  status: string
}

export interface LeaderboardEntry {
  rank: number
  initial: string
  name: string
  group: string
  points: string
}

export interface ConnectedGroup {
  initial: string
  name: string
  city: string
  country: string
  members: string
}

export interface SafePrinciple {
  title: string
  text: string
}

export const appStories: StoryPreview[] = [
  { initial: 'L', name: 'Lucia', detail: 'Orando' },
  { initial: 'M', name: 'Mateo', detail: 'Foro' },
  { initial: 'S', name: 'Sara', detail: 'Devocional' },
  { initial: 'J', name: 'Juan', detail: 'Juego' },
  { initial: 'A', name: 'Ana', detail: 'Mapa' },
  { initial: 'I', name: 'Iglesia C.', detail: 'Comunidad' },
]

export const demoFeedPosts: DemoPost[] = [
  {
    initial: 'L',
    author: 'Lucia Romero',
    username: '@lucia.fe',
    type: 'Testimonio',
    body: 'Hoy Dios me recordo que su tiempo es perfecto. Llevaba meses orando por algo y hoy entendi el porque de la espera.',
    stats: '124 oraciones · 18 respuestas',
    verse: 'Eclesiastes 3:11',
  },
  {
    initial: 'G',
    author: 'Grupo Joven Renacer',
    username: '@renacer',
    type: 'Evento',
    body: 'Esta noche estudiamos Romanos 8. Veni, trae un amigo y ganas grandes de aprender.',
    stats: '312 interesados · 47 compartidos',
    verse: 'Romanos 8:1',
  },
  {
    initial: 'M',
    author: 'Mateo Alvarez',
    username: '@mati',
    type: 'Oracion',
    body: 'Peticion de oracion: mi abuela esta internada. Confio en Cristo. Gracias por orar conmigo.',
    stats: '489 oraciones · 92 mensajes',
    verse: 'Filipenses 4:6-7',
  },
]

export const forumCategories: ForumCategory[] = [
  { title: 'Vida diaria', threads: '312 hilos' },
  { title: 'Fe y cultura', threads: '187 hilos' },
  { title: 'Preguntas biblicas', threads: '421 hilos' },
  { title: 'Testimonios', threads: '256 hilos' },
  { title: 'Misiones', threads: '94 hilos' },
  { title: 'Relaciones', threads: '178 hilos' },
]

export const forumTopics: ForumTopic[] = [
  {
    category: 'Preguntas biblicas',
    title: 'Como entender el Antiguo Testamento desde la cruz?',
    verses: ['Lucas 24:27', 'Hebreos 10:1'],
    author: 'Mateo A.',
    replies: 47,
    prayers: 132,
    isTrending: true,
  },
  {
    category: 'Vida diaria',
    title: 'Estudiar la carrera vs. ir a misiones: como discernir?',
    verses: ['Proverbios 3:5-6', 'Romanos 12:2'],
    author: 'Sara P.',
    replies: 28,
    prayers: 96,
  },
  {
    category: 'Relaciones',
    title: 'Noviazgo con proposito: lo que aprendi en 2 anos',
    verses: ['1 Corintios 13:4-7', 'Eclesiastes 3:1'],
    author: 'Lucia R.',
    replies: 89,
    prayers: 412,
    isTrending: true,
  },
  {
    category: 'Testimonios',
    title: 'Dios me saco de la ansiedad: esto fue lo que paso',
    verses: ['Filipenses 4:6-7'],
    author: 'Diego M.',
    replies: 64,
    prayers: 280,
  },
]

export const gameCards: GameCard[] = [
  {
    title: 'Versiculo Rapido',
    description: 'Quiz de memoria biblica para responder antes que tus amigos.',
    meta: '2-8 jugadores · 5 min',
    status: 'Demo visual',
  },
  {
    title: 'Batallas de Fe',
    description: 'Duelos 1 vs 1 con preguntas, citas y desafios de aplicacion.',
    meta: '2 jugadores · 7 min',
    status: 'Proximamente',
  },
  {
    title: 'Trivia Biblica',
    description: 'Rondas por temas: evangelios, salmos, profetas y cartas.',
    meta: '1+ jugadores · 10 min',
    status: 'Proximamente',
  },
  {
    title: 'Adivina la Historia',
    description: 'Reconoce pasajes por pistas, personajes y decisiones clave.',
    meta: '1-4 jugadores · 6 min',
    status: 'Proximamente',
  },
]

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, initial: 'L', name: 'Lucia R.', group: 'Renacer', points: '12,480' },
  { rank: 2, initial: 'M', name: 'Mateo A.', group: 'Esperanza', points: '11,200' },
  { rank: 3, initial: 'C', name: 'Camila P.', group: 'Vida Nueva', points: '9,870' },
  { rank: 4, initial: 'D', name: 'Diego M.', group: 'Renacer', points: '8,650' },
  { rank: 5, initial: 'T', name: 'Tu red', group: 'Local', points: '7,320' },
]

export const connectedGroups: ConnectedGroup[] = [
  {
    initial: 'I',
    name: 'Iglesia Renacer',
    city: 'Buenos Aires',
    country: 'AR',
    members: '312',
  },
  {
    initial: 'V',
    name: 'Vida Nueva',
    city: 'Madrid',
    country: 'ES',
    members: '487',
  },
  {
    initial: 'E',
    name: 'Esperanza Joven',
    city: 'Ciudad de Mexico',
    country: 'MX',
    members: '621',
  },
  {
    initial: 'L',
    name: 'Light House',
    city: 'Miami',
    country: 'USA',
    members: '244',
  },
  {
    initial: 'R',
    name: 'Restauracion Youth',
    city: 'Sao Paulo',
    country: 'BR',
    members: '532',
  },
  {
    initial: 'H',
    name: 'Hope Youth',
    city: 'London',
    country: 'UK',
    members: '189',
  },
]

export const safePrinciples: SafePrinciple[] = [
  {
    title: 'Moderacion con sabiduria',
    text: 'Conversaciones cuidadas, sin ataques y con foco en edificar.',
  },
  {
    title: 'Jovenes protegidos',
    text: 'Reportes visibles, reglas simples y acompanamiento pastoral.',
  },
  {
    title: 'Palabra al centro',
    text: 'Los debates se orientan con versiculos y respeto por la fe.',
  },
]
