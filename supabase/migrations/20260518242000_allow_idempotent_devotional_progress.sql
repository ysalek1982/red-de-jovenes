create policy "Cada usuario puede actualizar sus lecturas"
on public.devotional_reads
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Cada usuario puede actualizar sus favoritos"
on public.devotional_favorites
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
