create policy "Cada usuario puede eliminar sus puntajes"
on public.game_scores
for delete
to authenticated
using (auth.uid() = user_id);
