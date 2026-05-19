alter table public.game_scores
drop constraint if exists game_scores_game_key_check;

alter table public.game_scores
add constraint game_scores_game_key_check
check (
  game_key in (
    'versiculo-rapido',
    'trivia-biblica',
    'adivina-historia',
    'memory-match',
    'desafio-fe'
  )
);
