insert into public.devotionals (
  title,
  verse_reference,
  verse_text,
  reflection,
  prayer,
  devotional_date,
  is_active
)
values
  (
    'Comienza con confianza',
    'Proverbios 3:5',
    'Parafrasis: confia en el Senor con todo tu corazon.',
    'Antes de abrir mensajes, pendientes o redes, entrega tu dia a Cristo. La confianza no significa tener todo resuelto; significa caminar con la certeza de que Dios guia mejor que el temor.',
    'Jesus, ordena mis pensamientos y ayudame a confiar en ti antes que en mis propias fuerzas.',
    '2026-05-18',
    true
  ),
  (
    'Luz donde estas',
    'Mateo 5:14',
    'Parafrasis: ustedes son luz para el mundo.',
    'Tu fe no esta escondida para decorar una biografia. Esta llamada a iluminar conversaciones, decisiones y amistades con humildad, verdad y amor.',
    'Senor, hazme una luz sencilla y firme en los lugares donde me muevo hoy.',
    '2026-05-19',
    true
  ),
  (
    'Fuerza para seguir',
    'Filipenses 4:13',
    'Parafrasis: en Cristo recibo fuerza para avanzar.',
    'La fortaleza cristiana no es aparentar que nada duele. Es recibir gracia para dar el siguiente paso, pedir ayuda y permanecer cerca de Jesus.',
    'Cristo, fortalece mi animo y ensename a avanzar contigo.',
    '2026-05-20',
    true
  ),
  (
    'Paz en medio del ruido',
    'Juan 14:27',
    'Parafrasis: Jesus deja una paz distinta a la del mundo.',
    'Hay ruido afuera y tambien dentro. La paz de Cristo no niega la realidad; la atraviesa con una presencia que sostiene, calma y vuelve a centrar el corazon.',
    'Jesus, trae tu paz a mis decisiones, conversaciones y emociones.',
    '2026-05-21',
    true
  ),
  (
    'Amar de verdad',
    'Juan 13:35',
    'Parafrasis: el amor mostrara que somos discipulos de Jesus.',
    'Una comunidad cristiana se reconoce por como cuida, no por como compite. Hoy puedes amar escuchando mejor, respondiendo con gracia y sirviendo sin buscar aplausos.',
    'Senor, que mi forma de tratar a otros hable de tu amor.',
    '2026-05-22',
    true
  ),
  (
    'Una fe que da fruto',
    'Santiago 2:17',
    'Parafrasis: la fe viva se expresa en acciones.',
    'La fe no se queda en una frase bonita. Se vuelve paciencia, generosidad, perdon, servicio y valentia para hacer lo correcto aun cuando nadie mira.',
    'Dios, que mi fe se vea en decisiones concretas de amor y obediencia.',
    '2026-05-23',
    true
  ),
  (
    'Juntos en oracion',
    'Mateo 18:20',
    'Parafrasis: donde dos o tres se reunen en su nombre, Cristo esta presente.',
    'No fuiste creado para vivir la fe en soledad. Cuando oras con otros jovenes, recuerdas que Cristo tambien forma familia, apoyo y mision compartida.',
    'Jesus, conectame con personas que me acerquen a ti y a tu proposito.',
    '2026-05-24',
    true
  )
on conflict (devotional_date) do update
set
  title = excluded.title,
  verse_reference = excluded.verse_reference,
  verse_text = excluded.verse_text,
  reflection = excluded.reflection,
  prayer = excluded.prayer,
  is_active = excluded.is_active;
