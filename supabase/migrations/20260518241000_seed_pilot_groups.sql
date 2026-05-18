insert into public.groups (
  name,
  city,
  country,
  church_name,
  contact_url,
  meeting_info,
  description,
  is_active
)
select
  seed.name,
  seed.city,
  seed.country,
  seed.church_name,
  seed.contact_url,
  seed.meeting_info,
  seed.description,
  true
from (
  values
    (
      'Red Jovenes Santa Cruz - piloto',
      'Santa Cruz de la Sierra',
      'Bolivia',
      'Comunidad base editable',
      null,
      'Contenido inicial para piloto. Confirmar dia, hora y lugar antes de publicar a usuarios externos.',
      'Grupo base para validar el mapa mundial con jovenes de Santa Cruz. No representa contacto oficial hasta curaduria humana.'
    ),
    (
      'Red Jovenes La Paz - piloto',
      'La Paz',
      'Bolivia',
      'Comunidad base editable',
      null,
      'Contenido inicial para piloto. Confirmar lideres y reuniones antes de difusion amplia.',
      'Grupo base para probar busqueda por pais, ciudad e iglesia en Bolivia.'
    ),
    (
      'Red Jovenes Cochabamba - piloto',
      'Cochabamba',
      'Bolivia',
      'Comunidad base editable',
      null,
      'Contenido inicial para piloto. Pendiente de validacion pastoral local.',
      'Comunidad semilla para que el directorio no inicie vacio durante pruebas.'
    ),
    (
      'Jovenes Luz Buenos Aires - piloto',
      'Buenos Aires',
      'Argentina',
      'Comunidad base editable',
      null,
      'Contenido inicial global. Verificar datos reales antes de produccion.',
      'Referencia internacional editable para validar el concepto de red global.'
    ),
    (
      'Foro Juvenil Bogota - piloto',
      'Bogota',
      'Colombia',
      'Comunidad base editable',
      null,
      'Contenido inicial global. Confirmar comunidad antes de abrir convocatoria.',
      'Nodo base para probar filtros internacionales y sugerencias aprobadas.'
    ),
    (
      'Generacion Fe Ciudad de Mexico - piloto',
      'Ciudad de Mexico',
      'Mexico',
      'Comunidad base editable',
      null,
      'Contenido inicial global. Sin contacto publico hasta curaduria humana.',
      'Comunidad semilla para mantener el enfoque mundial del prototipo.'
    )
) as seed(name, city, country, church_name, contact_url, meeting_info, description)
where not exists (
  select 1
  from public.groups existing
  where lower(existing.name) = lower(seed.name)
    and lower(coalesce(existing.country, '')) = lower(seed.country)
    and lower(coalesce(existing.city, '')) = lower(seed.city)
);
