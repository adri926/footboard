@AGENTS.md

# Footboard — Instructions projet

App Next.js de gestion de club football + terrain tactique interactif.

## Lancer le projet
```bash
npm run dev  # → http://localhost:3001
```

## Stack
- Next.js + TypeScript + Tailwind CSS 4
- Clerk Auth (connexion obligatoire dès l'accueil)
- Supabase PostgreSQL — projet ID `cyetldpjuwdihmwjnejf`
  - Utiliser `SUPABASE_SERVICE_ROLE_KEY` côté serveur (bypasse RLS)
  - RLS désactivée — sécurité via Clerk + filtres `owner_id`
- Resend (emails, 3000/mois gratuits)
- Framer Motion (animations terrain)

## Identité visuelle (Moodboard v2)
- Noir Chaud `var(--bg)` (#17160f) + Vert Sauge `var(--sauge)` (#7A9A82)
- Titres : Barlow Condensed 900 — Labels : Space Mono 700 — Body : Barlow 300-500
- Terrain : lignes `rgba(122,154,130,0.55)`
- CSS vars dans `globals.css` : `--bg`, `--bg-card`, `--sauge`, `--sauge-dim`, `--sauge-border`
- **Ne jamais hardcoder** les couleurs de fond — toujours utiliser `var(--bg)`, `var(--bg-card)`, etc.

## Compte de test
- Club : AS Poincaré (Paris, Régional 2)
- Clerk user_id : `user_3E6KpNoP7KUQPMLk8mAlmeHJYq8`
- Email : adrisim926@gmail.com

## Supabase
Pour chaque fichier SQL de migration généré,
indiquer explicitement à quel moment l'exécuter
avec le message :
"⚠️ ACTION SUPABASE REQUISE : va sur
supabase.com → SQL Editor → colle ce fichier
→ clique Run. Reviens me dire quand c'est fait."
Ne pas passer à l'étape suivante sans confirmation.

## Prochaines étapes
1. Responsive mobile (terrain en portrait)
2. Partage de tactiques via lien public
3. Déploiement Vercel
