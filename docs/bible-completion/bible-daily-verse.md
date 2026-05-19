# Versiculo diario avanzado

Objeto nuevo: `get_daily_bible_verse`.

## Funcionamiento

1. Si hay versiculo programado para la fecha, se usa ese.
2. Si no hay programado, se usa fallback aleatorio.
3. Si hay suficientes versiculos, evita repetir los ultimos 7 dias.
4. Devuelve `devotional_hint` cuando existe.

## UI

- Home usa versiculo diario.
- Biblia muestra versiculo diario.
- Admin Biblia puede programar fecha, referencia y hint devocional.

## Estado actual

Hay versiculo diario para 2026-05-19: `Filipenses 4:13`.
