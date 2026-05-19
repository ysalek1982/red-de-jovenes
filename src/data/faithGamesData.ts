export type FaithGameKey =
  | 'versiculo-rapido'
  | 'trivia-biblica'
  | 'adivina-historia'
  | 'memory-match'
  | 'desafio-fe'

export type FaithGameMode = 'quiz' | 'memory'

export interface FaithGameQuestion {
  id: string
  category: string
  prompt: string
  options: string[]
  correctAnswer: string
  explanation: string
  reference?: string
}

export interface FaithMemoryPair {
  id: string
  left: string
  right: string
  explanation: string
  reference?: string
}

export interface FaithGameDefinition {
  key: FaithGameKey
  title: string
  description: string
  badge: string
  mode: FaithGameMode
  questions: FaithGameQuestion[]
  pairs?: FaithMemoryPair[]
}

export const faithGames: FaithGameDefinition[] = [
  {
    key: 'versiculo-rapido',
    title: 'Versiculo Rapido',
    description:
      'Completa versiculos conocidos y fortalece tu memoria biblica en pocos minutos.',
    badge: 'Memoria biblica',
    mode: 'quiz',
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
        prompt:
          'En esto conoceran todos que sois mis discipulos: si tuviereis ______ los unos con los otros.',
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
        prompt:
          'Donde estan dos o tres congregados en mi nombre, alli estoy yo en ______ de ellos.',
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
        prompt:
          'Venid a mi todos los que estais trabajados y cargados, y yo os hare ______.',
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
    badge: 'Evangelios - AT - Fe',
    mode: 'quiz',
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
  {
    key: 'adivina-historia',
    title: 'Adivina la Historia',
    description:
      'Lee pistas, reconoce relatos biblicos y descubre como Dios obro en cada historia.',
    badge: 'Historias biblicas',
    mode: 'quiz',
    questions: [
      {
        id: 'ah-1',
        category: 'Valentia',
        prompt:
          'Un joven pastor rechazo la armadura del rey y enfrento a un gigante confiando en Dios.',
        options: ['David y Goliat', 'Daniel en Babilonia', 'Josue en Jerico', 'Jose en Egipto'],
        correctAnswer: 'David y Goliat',
        explanation: 'David recordo que la batalla pertenecia al Senor.',
        reference: '1 Samuel 17',
      },
      {
        id: 'ah-2',
        category: 'Obediencia',
        prompt:
          'Un profeta huyo de su llamado, paso por el mar y aprendio sobre misericordia.',
        options: ['Jonas y Ninive', 'Elias en el Carmelo', 'Moises en Egipto', 'Samuel en Silo'],
        correctAnswer: 'Jonas y Ninive',
        explanation: 'Dios mostro paciencia con Jonas y compasion por Ninive.',
        reference: 'Jonas 1-4',
      },
      {
        id: 'ah-3',
        category: 'Fe',
        prompt:
          'Tres amigos fueron lanzados al fuego por no adorar una estatua, pero Dios estuvo con ellos.',
        options: ['Sadrac, Mesac y Abed-nego', 'Pedro, Juan y Santiago', 'Cain, Abel y Set', 'Pablo y Silas'],
        correctAnswer: 'Sadrac, Mesac y Abed-nego',
        explanation: 'La fidelidad a Dios vale mas que la presion del ambiente.',
        reference: 'Daniel 3',
      },
      {
        id: 'ah-4',
        category: 'Restauracion',
        prompt:
          'Un hombre pequeno subio a un arbol para ver a Jesus y termino transformando su casa.',
        options: ['Zaqueo', 'Nicodemo', 'Bartimeo', 'Mateo'],
        correctAnswer: 'Zaqueo',
        explanation: 'El encuentro con Jesus produjo arrepentimiento y generosidad.',
        reference: 'Lucas 19:1-10',
      },
      {
        id: 'ah-5',
        category: 'Provision',
        prompt:
          'Una multitud comio despues de que Jesus dio gracias por cinco panes y dos peces.',
        options: ['Alimentacion de los cinco mil', 'Bodas de Cana', 'La pesca milagrosa', 'La ultima cena'],
        correctAnswer: 'Alimentacion de los cinco mil',
        explanation: 'Jesus recibio poco, dio gracias y lo multiplico para muchos.',
        reference: 'Juan 6:1-14',
      },
      {
        id: 'ah-6',
        category: 'Perdon',
        prompt:
          'Un hijo gasto todo, volvio a casa y fue recibido con abrazo y fiesta.',
        options: ['El hijo prodigo', 'El buen samaritano', 'El sembrador', 'La oveja perdida'],
        correctAnswer: 'El hijo prodigo',
        explanation: 'La gracia del Padre restaura al que vuelve con humildad.',
        reference: 'Lucas 15:11-32',
      },
      {
        id: 'ah-7',
        category: 'Llamado',
        prompt:
          'Un nino escucho su nombre de noche y aprendio a responder: Habla, que tu siervo oye.',
        options: ['Samuel', 'Timoteo', 'Jeremias', 'Juan Marcos'],
        correctAnswer: 'Samuel',
        explanation: 'Dios tambien llama y forma a los jovenes.',
        reference: '1 Samuel 3',
      },
      {
        id: 'ah-8',
        category: 'Mision',
        prompt:
          'Dos mujeres caminaron juntas, y una dijo: tu pueblo sera mi pueblo y tu Dios mi Dios.',
        options: ['Rut y Noemi', 'Maria y Marta', 'Ester y Mardoqueo', 'Ana y Penina'],
        correctAnswer: 'Rut y Noemi',
        explanation: 'Rut respondio con lealtad, fe y amor practico.',
        reference: 'Rut 1:16',
      },
    ],
  },
  {
    key: 'memory-match',
    title: 'Memory Match',
    description:
      'Une conceptos, valores y referencias biblicas. Cada par correcto fortalece memoria y aplicacion.',
    badge: 'Memoria visual',
    mode: 'memory',
    questions: [],
    pairs: [
      {
        id: 'mm-1',
        left: 'Amor',
        right: '1 Corintios 13',
        explanation: 'El amor paciente y bondadoso edifica relaciones sanas.',
      },
      {
        id: 'mm-2',
        left: 'Luz del mundo',
        right: 'Mateo 5:14',
        explanation: 'Jesus llama a sus discipulos a reflejar su luz.',
      },
      {
        id: 'mm-3',
        left: 'Oracion constante',
        right: '1 Tesalonicenses 5:17',
        explanation: 'La vida de fe se sostiene conversando con Dios.',
      },
      {
        id: 'mm-4',
        left: 'Confianza',
        right: 'Proverbios 3:5',
        explanation: 'Confiar en Dios ordena el corazon y las decisiones.',
      },
      {
        id: 'mm-5',
        left: 'Servicio',
        right: 'Marcos 10:43',
        explanation: 'El liderazgo de Jesus se expresa sirviendo.',
      },
      {
        id: 'mm-6',
        left: 'Fe',
        right: 'Hebreos 11:1',
        explanation: 'La fe mira con confianza las promesas de Dios.',
      },
    ],
  },
  {
    key: 'desafio-fe',
    title: 'Desafio de Fe',
    description:
      'Modo individual con decisiones rapidas para aplicar la Palabra en situaciones reales.',
    badge: 'Aplicacion diaria',
    mode: 'quiz',
    questions: [
      {
        id: 'df-1',
        category: 'Amistad',
        prompt: 'Un amigo te cuenta algo dificil. Que respuesta refleja mejor el cuidado cristiano?',
        options: ['Escuchar y orar con respeto', 'Publicarlo para que todos oren', 'Cambiar de tema', 'Juzgarlo rapido'],
        correctAnswer: 'Escuchar y orar con respeto',
        explanation: 'Cuidar a alguien empieza por escuchar, proteger y acompanar.',
        reference: 'Romanos 12:15',
      },
      {
        id: 'df-2',
        category: 'Redes',
        prompt: 'Ves una publicacion hiriente en la comunidad. Que haces?',
        options: ['Reportar con respeto', 'Responder con insultos', 'Compartirla como burla', 'Ignorar si hay dano'],
        correctAnswer: 'Reportar con respeto',
        explanation: 'Reportar puede ser una forma de cuidar a la comunidad.',
        reference: 'Efesios 4:29',
      },
      {
        id: 'df-3',
        category: 'Estudios',
        prompt: 'Estas bajo presion por un examen y sientes ansiedad. Que paso ayuda a vivir la fe?',
        options: ['Orar, prepararte y pedir apoyo', 'No estudiar porque Dios provee', 'Aislarte de todos', 'Copiar respuestas'],
        correctAnswer: 'Orar, prepararte y pedir apoyo',
        explanation: 'La confianza en Dios no elimina la responsabilidad; la ordena.',
        reference: 'Filipenses 4:6',
      },
      {
        id: 'df-4',
        category: 'Identidad',
        prompt: 'Tu grupo se burla de tu fe. Que actitud refleja mejor a Cristo?',
        options: ['Responder con mansedumbre y firmeza', 'Negar lo que crees', 'Atacar a todos', 'Buscar venganza'],
        correctAnswer: 'Responder con mansedumbre y firmeza',
        explanation: 'La verdad puede decirse con gracia y valentia.',
        reference: '1 Pedro 3:15',
      },
      {
        id: 'df-5',
        category: 'Servicio',
        prompt: 'Alguien nuevo llega al grupo juvenil. Que accion abre comunidad?',
        options: ['Saludarlo e incluirlo', 'Esperar que se acerque solo', 'Evaluar si encaja', 'Ignorarlo por timidez'],
        correctAnswer: 'Saludarlo e incluirlo',
        explanation: 'La hospitalidad hace visible el amor de Jesus.',
        reference: 'Hebreos 13:2',
      },
      {
        id: 'df-6',
        category: 'Perdon',
        prompt: 'Te ofenden en un comentario. Que primer paso es mas sano?',
        options: ['Pausar, orar y responder sin herir', 'Devolver el golpe', 'Crear chisme', 'Guardar rencor'],
        correctAnswer: 'Pausar, orar y responder sin herir',
        explanation: 'El dominio propio evita que una herida se vuelva cadena.',
        reference: 'Proverbios 15:1',
      },
      {
        id: 'df-7',
        category: 'Devocional',
        prompt: 'Quieres formar habito espiritual. Que practica es mas realista?',
        options: ['Un paso diario pequeno y constante', 'Esperar sentir ganas siempre', 'Leer solo cuando hay crisis', 'Compararte con otros'],
        correctAnswer: 'Un paso diario pequeno y constante',
        explanation: 'Los habitos se construyen con fidelidad sencilla.',
        reference: 'Salmo 1:2',
      },
      {
        id: 'df-8',
        category: 'Comunidad',
        prompt: 'Alguien comparte una duda honesta sobre la Biblia. Como respondes?',
        options: ['Con respeto, versiculos y humildad', 'Ridiculizando la pregunta', 'Cerrando el debate', 'Presumiendo conocimiento'],
        correctAnswer: 'Con respeto, versiculos y humildad',
        explanation: 'La Palabra se comparte para edificar, no para ganar discusiones.',
        reference: 'Colosenses 4:6',
      },
    ],
  },
]
