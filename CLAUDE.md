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
- Noir Chaud `#181812` + Vert Sauge `#7A9A82`
- Titres : Barlow Condensed 900 — Labels : Space Mono 700 — Body : Barlow 300-500
- Terrain : lignes `rgba(122,154,130,0.55)`
- CSS vars dans `globals.css` : `--sauge`, `--sauge-dim`, `--bg`, `--bg-card`

## Compte de test
- Club : AS Poincaré (Paris, Régional 2)
- Clerk user_id : `user_3E6KpNoP7KUQPMLk8mAlmeHJYq8`
- Email : adrisim926@gmail.com

## Prochaines étapes
1. Harmoniser les pages `/club/*` avec le moodboard
2. Intégrer AppelLayer avec l'engine (appels auto par situation)
3. Responsive mobile (terrain en portrait)
4. Partage de tactiques via lien public
5. Déploiement Vercel
