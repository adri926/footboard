#!/bin/bash
# Lit .env.local et pousse chaque variable vers Vercel production
set -e

ENV_FILE=".env.local"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ .env.local introuvable"
  exit 1
fi

echo "→ Ajout des variables d'environnement sur Vercel (production)..."
echo ""

while IFS= read -r line || [ -n "$line" ]; do
  # Ignorer lignes vides et commentaires
  [[ -z "$line" || "$line" =~ ^# ]] && continue

  KEY="${line%%=*}"
  VALUE="${line#*=}"

  printf '%s' "$VALUE" | vercel env add "$KEY" production --force 2>&1 | grep -v "^$" | tail -1
  echo "  ✓ $KEY"

done < "$ENV_FILE"

echo ""
echo "✓ Toutes les variables sont sur Vercel."
echo "→ Lance maintenant : vercel --prod"
