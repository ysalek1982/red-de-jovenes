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
    title: 'Versiculo Rapido',
    description:
      'Completa versiculos conocidos y fortalece tu memoria biblica en pocos minutos.',
    badge: 'Memoria biblica',
    questions: [
      {
        id: 'vr-1',
        category: 'Promesas',
        prompt: 'Todo lo puedo en Cristo que me ______.',
        options: ['fortalece', 'escucha', 'llama', 'protege'],
        correctAnswer: 'fortalece',
        explanation: 'La fortaleza del creyente viene de Cristo, no del orgullo personal.',
        reference: 'Filipenses 4:13',
      },
      {
        id: 'vr-2',
        category: 'Confianza',
        prompt: 'Confia en el Senor de todo tu ______.',
        options: ['camino', 'corazon', 'pensamiento', 'futuro'],
        correctAnswer: 'corazon',
        explanation: 'La confianza biblica compromete el centro de la vida.',
        reference: 'Proverbios 3:5',
      },
      {
        id: 'vr-3',
        category: 'Identidad',
        prompt: 'Vosotros sois la ______ del mundo.',
        options: ['voz', 'luz', 'sal', 'esperanza'],
        correctAnswer: 'luz',
        explanation: 'Jesus llama a sus discipulos a reflejar su luz.',
        reference: 'Mateo 5:14',
      },
      {
        id: 'vr-4',
        category: 'Paz',
        prompt: 'Mi paz os dejo, mi paz os ______.',
        options: ['anuncio', 'entrego', 'doy', 'prometo'],
        correctAnswer: 'doy',
        explanation: 'Cristo ofrece una paz distinta a la del mundo.',
        reference: 'Juan 14:27',
      },
      {
        id: 'vr-5',
        category: 'Amor',
        prompt: 'En esto conoceran todos que sois mis discipulos: si tuviereis ______ los unos con los otros.',
        options: ['paciencia', 'amor', 'valor', 'memoria'],
        correctAnswer: 'amor',
        explanation: 'El amor visible es una marca de la comunidad de Jesus.',
        reference: 'Juan 13:35',
      },
      {
        id: 'vr-6',
        category: 'Oracion',
        prompt: 'Orad sin ______.',
        options: ['cesar', 'miedo', 'dudar', 'pausa'],
        correctAnswer: 'cesar',
        explanation: 'La oracion constante forma una vida conectada con Dios.',
        reference: '1 Tesalonicenses 5:17',
      },
      {
        id: 'vr-7',
        category: 'Palabra',
        prompt: 'Lampara es a mis pies tu ______.',
        options: ['voz', 'palabra', 'camino', 'promesa'],
        correctAnswer: 'palabra',
        explanation: 'La Palabra guia pasos concretos, no solo ideas.',
        reference: 'Salmo 119:105',
      },
      {
        id: 'vr-8',
        category: 'Servicio',
        prompt: 'El que quiera hacerse grande entre vosotros sera vuestro ______.',
        options: ['guia', 'siervo', 'maestro', 'lider'],
        correctAnswer: 'siervo',
        explanation: 'El liderazgo de Jesus se expresa sirviendo.',
        reference: 'Marcos 10:43',
      },
      {
        id: 'vr-9',
        category: 'Fe',
        prompt: 'La fe es la certeza de lo que se ______.',
        options: ['espera', 'mira', 'entiende', 'recuerda'],
        correctAnswer: 'espera',
        explanation: 'La fe mira con confianza lo que Dios promete.',
        reference: 'Hebreos 11:1',
      },
      {
        id: 'vr-10',
        category: 'Gracia',
        prompt: 'Por gracia sois salvos por medio de la ______.',
        options: ['ley', 'fe', 'obra', 'memoria'],
        correctAnswer: 'fe',
        explanation: 'La salvacion es regalo de Dios recibido por fe.',
        reference: 'Efesios 2:8',
      },
      {
        id: 'vr-11',
        category: 'Unidad',
        prompt: 'Donde estan dos o tres congregados en mi nombre, alli estoy yo en ______ de ellos.',
        options: ['medio', 'favor', 'memoria', 'camino'],
        correctAnswer: 'medio',
        explanation: 'Cristo esta presente cuando su pueblo se reune en su nombre.',
        reference: 'Mateo 18:20',
      },
      {
        id: 'vr-12',
        category: 'Santidad',
        prompt: 'Sed santos, porque yo soy ______.',
        options: ['bueno', 'justo', 'santo', 'fiel'],
        correctAnswer: 'santo',
        explanation: 'La vida con Dios transforma tambien nuestras decisiones diarias.',
        reference: '1 Pedro 1:16',
      },
      {
        id: 'vr-13',
        category: 'Sabiduria',
        prompt: 'Si alguno tiene falta de sabiduria, pidala a ______.',
        options: ['Dios', 'otros', 'la vida', 'la suerte'],
        correctAnswer: 'Dios',
        explanation: 'La sabiduria se busca con humildad delante de Dios.',
        reference: 'Santiago 1:5',
      },
      {
        id: 'vr-14',
        category: 'Descanso',
        prompt: 'Venid a mi todos los que estais trabajados y cargados, y yo os hare ______.',
        options: ['fuertes', 'descansar', 'ganar', 'correr'],
        correctAnswer: 'descansar',
        explanation: 'Jesus invita a llevar las cargas a el.',
        reference: 'Mateo 11:28',
      },
      {
        id: 'vr-15',
        category: 'Esperanza',
        prompt: 'El gozo del Senor es vuestra ______.',
        options: ['fuerza', 'meta', 'respuesta', 'casa'],
        correctAnswer: 'fuerza',
        explanation: 'El gozo en Dios sostiene aun cuando el animo cambia.',
        reference: 'Nehemias 8:10',
      },
    ],
  },
  {
    key: 'trivia-biblica',
    title: 'Trivia Biblica',
    description:
      'Responde preguntas de los Evangelios, el Antiguo Testamento y la vida de fe.',
    badge: 'Evangelios · AT · Fe',
    questions: [
      {
        id: 'tb-1',
        category: 'Evangelios',
        prompt: 'Quien camino sobre el agua hacia Jesus?',
        options: ['Juan', 'Pedro', 'Andres', 'Tomas'],
        correctAnswer: 'Pedro',
        explanation: 'Pedro salio de la barca cuando Jesus lo llamo.',
        reference: 'Mateo 14:28-29',
      },
      {
        id: 'tb-2',
        category: 'Antiguo Testamento',
        prompt: 'Quien fue llamado por Dios desde una zarza ardiente?',
        options: ['Moises', 'Josue', 'Samuel', 'Elias'],
        correctAnswer: 'Moises',
        explanation: 'Dios llamo a Moises para liberar a su pueblo.',
        reference: 'Exodo 3:4',
      },
      {
        id: 'tb-3',
        category: 'Fe y vida',
        prompt: 'Segun Santiago, la fe sin obras esta...',
        options: ['viva', 'incompleta', 'muerta', 'en proceso'],
        correctAnswer: 'muerta',
        explanation: 'La fe verdadera produce fruto visible.',
        reference: 'Santiago 2:17',
      },
      {
        id: 'tb-4',
        category: 'Evangelios',
        prompt: 'Cual es el gran mandamiento segun Jesus?',
        options: [
          'Servir en silencio',
          'Amar a Dios y al projimo',
          'Ayunar cada semana',
          'Viajar a Jerusalen',
        ],
        correctAnswer: 'Amar a Dios y al projimo',
        explanation: 'Jesus resume la ley en amor a Dios y al projimo.',
        reference: 'Mateo 22:37-39',
      },
      {
        id: 'tb-5',
        category: 'Evangelios',
        prompt: 'Que hizo Jesus antes de alimentar a la multitud?',
        options: ['Se escondio', 'Dio gracias', 'Pidio dinero', 'Cambio de ciudad'],
        correctAnswer: 'Dio gracias',
        explanation: 'Jesus tomo los panes, dio gracias y los compartio.',
        reference: 'Juan 6:11',
      },
      {
        id: 'tb-6',
        category: 'Antiguo Testamento',
        prompt: 'Quien interpreto suenos en Egipto y llego a gobernar?',
        options: ['Daniel', 'Jose', 'Nehemias', 'Gedeon'],
        correctAnswer: 'Jose',
        explanation: 'Jose fue usado por Dios para preservar vida en tiempo de hambre.',
        reference: 'Genesis 41',
      },
      {
        id: 'tb-7',
        category: 'Fe y vida',
        prompt: 'Que fruto del Espiritu se relaciona con tratar bien a otros?',
        options: ['Vanidad', 'Benignidad', 'Orgullo', 'Impulso'],
        correctAnswer: 'Benignidad',
        explanation: 'El fruto del Espiritu transforma el caracter y las relaciones.',
        reference: 'Galatas 5:22',
      },
      {
        id: 'tb-8',
        category: 'Evangelios',
        prompt: 'A quien llamo Jesus desde un arbol sicomoro?',
        options: ['Zaqueo', 'Nicodemo', 'Bartimeo', 'Felipe'],
        correctAnswer: 'Zaqueo',
        explanation: 'Jesus vio a Zaqueo y entro en su casa.',
        reference: 'Lucas 19:5',
      },
      {
        id: 'tb-9',
        category: 'Antiguo Testamento',
        prompt: 'Quien dijo: Habla, porque tu siervo oye?',
        options: ['Samuel', 'David', 'Elias', 'Jonas'],
        correctAnswer: 'Samuel',
        explanation: 'Samuel aprendio a reconocer la voz de Dios desde joven.',
        reference: '1 Samuel 3:10',
      },
      {
        id: 'tb-10',
        category: 'Fe y vida',
        prompt: 'Que actitud recomienda Filipenses ante la ansiedad?',
        options: ['Ignorar todo', 'Orar con gratitud', 'Aislarse', 'Competir'],
        correctAnswer: 'Orar con gratitud',
        explanation: 'La oracion con gratitud vuelve el corazon a Dios.',
        reference: 'Filipenses 4:6',
      },
      {
        id: 'tb-11',
        category: 'Evangelios',
        prompt: 'Que discipulo nego a Jesus tres veces?',
        options: ['Pedro', 'Juan', 'Mateo', 'Santiago'],
        correctAnswer: 'Pedro',
        explanation: 'Pedro fallo, pero Jesus tambien lo restauro.',
        reference: 'Lucas 22',
      },
      {
        id: 'tb-12',
        category: 'Antiguo Testamento',
        prompt: 'Quien enfrento a Goliat confiando en Dios?',
        options: ['Saul', 'David', 'Salomon', 'Ezequias'],
        correctAnswer: 'David',
        explanation: 'David no confio en apariencia ni armadura, sino en Dios.',
        reference: '1 Samuel 17',
      },
      {
        id: 'tb-13',
        category: 'Fe y vida',
        prompt: 'Segun Jesus, donde esta tu tesoro, alli estara tambien tu...',
        options: ['agenda', 'corazon', 'grupo', 'recuerdo'],
        correctAnswer: 'corazon',
        explanation: 'Lo que valoramos termina orientando nuestras decisiones.',
        reference: 'Mateo 6:21',
      },
      {
        id: 'tb-14',
        category: 'Evangelios',
        prompt: 'Quien preparo el camino anunciando a Jesus en el desierto?',
        options: ['Juan el Bautista', 'Pablo', 'Lucas', 'Timoteo'],
        correctAnswer: 'Juan el Bautista',
        explanation: 'Juan llamo al arrepentimiento y senalo a Jesus.',
        reference: 'Mateo 3',
      },
      {
        id: 'tb-15',
        category: 'Antiguo Testamento',
        prompt: 'Que profeta fue enviado a Ninive?',
        options: ['Jonas', 'Isaias', 'Jeremias', 'Amos'],
        correctAnswer: 'Jonas',
        explanation: 'Jonas aprendio sobre obediencia y misericordia de Dios.',
        reference: 'Jonas 1-4',
      },
    ],
  },
]

export const upcomingFaithGames = [
  {
    title: 'Batallas de Fe',
    description:
      'Duelos 1 vs 1 con preguntas, citas biblicas y desafios de aplicacion.',
    status: 'Proximamente',
  },
  {
    title: 'Adivina la Historia',
    description:
      'Reconoce pasajes por pistas, personajes y decisiones clave.',
    status: 'Proximamente',
  },
]
