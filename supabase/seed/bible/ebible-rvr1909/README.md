# eBible RVR1909 / spaRV1909

Fuente autorizada para importar Reina-Valera 1909 completa a Supabase.

- Fuente: https://ebible.org/bible/details.php?id=spaRV1909
- Formatos: https://ebible.org/bible/details.php?all=1&id=spaRV1909
- Descarga usada: https://ebible.org/Scriptures/spaRV1909_vpl.zip
- Licencia indicada por eBible: public domain / Dominio Publico
- Formato seleccionado: VPL ZIP (incluye TXT, SQL y XML VPL)

Reglas:

- No editar el corpus fuente manualmente.
- Convertir con `npm run admin:convert-ebible-rvr1909`.
- Importar solo despues de `--dry-run` exitoso.
- No guardar secretos en esta carpeta.
