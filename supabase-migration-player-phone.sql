-- Coller ce SQL dans Supabase > SQL Editor > New Query > Run

-- Numéro de téléphone du joueur (pour contact rapide SMS depuis la fiche joueur)
alter table players add column if not exists phone text;
