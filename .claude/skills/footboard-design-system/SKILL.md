---
name: footboard-design-system
description: Design system visuel de Footboard (Next.js 16 + Tailwind CSS 4) — palette sombre chaude, typographie Barlow/Space Mono, espacements, rayons, navigation, layout et animations Framer Motion, dans un esprit premium et mat (référence Aesop / Arc / Figma). Utilise ce skill à chaque fois que tu crées, modifies ou améliores un composant, une page, la navigation, le layout ou le style visuel de l'app Footboard — même si l'utilisateur ne dit pas explicitement "design system" mais demande par exemple de "rendre ça plus propre", "améliorer le style", "construire la sidebar", "ajouter une page/un composant", ou de rendre l'interface plus fluide.
---

# Footboard Design System

## Philosophie

Footboard s'adresse à des coachs et clubs amateurs/semi-pros. L'objectif visuel est un rendu **premium, mat et sobre** — proche d'Aesop, Arc ou Figma — à l'opposé des codes gaming ou crypto (néons, dégradés saturés, ombres épaisses). Chaque décision de style ci-dessous sert ce même objectif : que l'interface paraisse posée, professionnelle et fluide, jamais criarde.

Applique ces tokens par défaut plutôt que d'improviser des classes Tailwind génériques (`bg-gray-900`, `shadow-lg`, `bg-blue-500`...). S'il manque un cas précis, extrapole dans l'esprit de cette palette plutôt que de sortir du système.

## Couleurs

| Rôle | Valeur | Usage |
|---|---|---|
| `bg` | `#181812` | Fond de page (canvas) |
| `bg-elevated` | `#1f1f1a` | Cards, panels, sidebar |
| `bg-overlay` | `#232320` | Modals, dropdowns, popovers |
| `border` | `#2c2c26` | Séparateurs, contours par défaut |
| `border-strong` | `#3a3a32` | Contours au hover/focus |
| `text-primary` | `#F2F1EA` | Titres, texte principal (blanc cassé chaud, jamais `#FFF` pur) |
| `text-secondary` | `#B8B6A9` | Texte de support |
| `text-tertiary` | `#7A7968` | Placeholders, texte désactivé |
| `accent` | `#7A9A82` | CTA, liens, états actifs (sauge) |
| `accent-hover` | `#8FAE96` | Hover sur éléments accentués |
| `accent-active` | `#6B8873` | Pressed/active |
| `accent-muted` | `#7A9A82` à 12% | Fonds de badges, item de nav actif |
| `success` | `#6FA57A` | Confirmations |
| `warning` | `#C9A227` | Alertes non-bloquantes (ex: cotisation en retard) |
| `error` | `#B5564B` | Erreurs, actions destructrices |

Règle : jamais de noir ou blanc purs, toujours ces teintes chaudes désaturées. Les couleurs sémantiques (success/warning/error) restent dans la même famille de saturation que l'accent — pas de rouge/vert/jaune vifs.

Tokens prêts à l'emploi : `assets/theme.css` (bloc `@theme` Tailwind v4, à importer dans `globals.css`).

## Typographie

Trois polices, chacune avec un rôle fixe :

- **Barlow Condensed** — titres et labels de navigation (`uppercase`, `tracking-wide` pour les labels courts)
- **Barlow** — texte courant, paragraphes, UI (boutons, formulaires)
- **Space Mono** — chiffres/statistiques, badges, métadonnées techniques (dates, IDs) — renforce le côté "outil pro"

Échelle indicative (classes Tailwind) :

- H1 : `font-display text-4xl md:text-5xl font-semibold tracking-tight text-text-primary`
- H2 : `font-display text-2xl md:text-3xl font-semibold text-text-primary`
- H3 : `font-display text-xl font-medium text-text-primary`
- Corps : `font-sans text-base leading-relaxed text-text-secondary`
- Label/caption : `font-mono text-xs uppercase tracking-wider text-text-tertiary`
- Chiffre clé (dashboard) : `font-mono text-2xl font-medium text-text-primary`

## Espacement & rayons

- Grille de base 4px. Incréments courants : `4 8 12 16 24 32 48 64`.
- Container de page : `max-w-7xl mx-auto px-6 md:px-8 lg:px-12`, rythme vertical entre sections `gap-8`.
- Rayons — plus le rayon est grand, plus l'élément est "englobant" :
  - `radius-sm` (6px) : petits éléments (checkbox, chip)
  - `radius-md` (8px) : boutons, inputs
  - `radius-lg` (12px) : cards
  - `radius-xl` (16px) : panels larges, modals
  - `rounded-full` réservé aux avatars et badges/pills — jamais aux boutons standards

## Élévation : bordures plutôt qu'ombres

Le côté "mat" vient d'un principe simple : **la profondeur se lit par un liseré de bordure et un léger changement de fond, pas par des `box-shadow`**. Une ombre épaisse redonne immédiatement un feel gaming/skeuomorphique qu'on veut éviter.

- Card au repos : `bg-bg-elevated border border-border rounded-lg`
- Card interactive au hover : transition vers `border-border-strong`, `transition-colors duration-base`
- Exception : éléments flottants (dropdown, modal, tooltip) au-dessus d'un backdrop — une ombre très douce (`shadow-sm`, faible opacité noire) est acceptable car ils sortent du flux normal

## Navigation & layout

**Sidebar** (desktop, coach/club dashboard) :
- `w-64 bg-bg-elevated border-r border-border`, fixe à gauche
- Item de nav : `rounded-md px-3 py-2 font-sans text-sm text-text-secondary`
- Hover : `bg-bg-overlay text-text-primary`
- Actif : `bg-accent-muted text-accent`, avec une barre verticale `border-l-2 border-accent` côté gauche plutôt qu'un fond plein
- Icônes : `lucide-react`, 18px, `stroke-width-1.5` — pas d'icônes remplies/bold, cohérent avec le côté épuré

**Header** :
- `h-16 border-b border-border sticky top-0`
- Sur scroll : fond semi-transparent + flou (`bg-bg/80 backdrop-blur`) plutôt qu'un fond opaque brutal
- Breadcrumb en `font-mono text-xs uppercase tracking-wider text-text-tertiary`

**Responsive** :
- Breakpoints Tailwind standards (mobile-first : `sm md lg xl`)
- Sous `md` (768px), la sidebar devient un drawer qui slide depuis la gauche, déclenché par un bouton hamburger dans le header — utile car les coachs consultent souvent l'app au bord du terrain sur mobile/tablette

## Motion (Framer Motion)

Le ressenti recherché ("propre et fluide") vient d'un mouvement **doux et sans rebond** — pas de `spring` bondissant, qui lirait comme ludique. Un seul easing "premium" partout :

```
ease: cubic-bezier(0.22, 1, 0.36, 1)
```

Durées : `fast` 150ms (hover, focus, press), `base` 220ms (transitions UI standards), `slow` 350ms (entrée de page/modal).

Patterns :
- **Transition de page** : fade + `translateY(8px → 0)`, durée `slow`
- **Modal/dialog** : backdrop fade `fast`, panel `scale(0.97 → 1)` + fade `base` ; sortie plus rapide (`fast`) que l'entrée
- **Drawer mobile (sidebar)** : slide depuis le bord, durée `base`
- **Listes/grilles au chargement** (lignes de tableau, cards dashboard) : stagger enfants de 30-40ms, chacun en fade + `translateY(4px → 0)` — donne l'impression de fluidité sans ralentir la perception
- **Boutons** : pas de scale au hover (ça saute), juste un changement de couleur/bordure ; au press, léger `scale(0.98)` sur `fast`

Pense à respecter `prefers-reduced-motion` (désactiver les translate/scale, garder juste les fades) — bonne pratique d'accessibilité peu coûteuse.

## Anti-patterns à éviter

- Néons, glows, dégradés en fond principal, badges multicolores saturés (feel crypto/gaming)
- `box-shadow` lourds ou skeuomorphisme
- Easing à rebond (`spring` bondissant) sur les entrées d'éléments
- Plus de deux intensités d'accent dans une même vue
- Noir ou blanc purs — toujours les teintes chaudes du système

## Ressources

- `assets/theme.css` — tokens prêts à l'emploi en `@theme` Tailwind CSS 4. À importer dans `app/globals.css` avec `@import "./theme.css";` avant les autres styles, puis utiliser les classes générées (`bg-bg`, `text-accent`, `rounded-lg`, etc.) directement dans les composants.
