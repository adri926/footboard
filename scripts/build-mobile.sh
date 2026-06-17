#!/bin/bash
# Lance les plateformes mobiles dans leur IDE respectif
set -e

echo "→ Sync Capacitor..."
npx cap sync

echo ""
echo "Quelle plateforme ouvrir ?"
echo "  1) iOS  → ouvre Xcode"
echo "  2) Android → ouvre Android Studio"
echo "  3) Les deux"
read -p "Choix (1/2/3): " CHOICE

case $CHOICE in
  1)
    echo "→ Ouverture iOS dans Xcode..."
    npx cap open ios
    ;;
  2)
    echo "→ Ouverture Android dans Android Studio..."
    npx cap open android
    ;;
  3)
    npx cap open ios &
    npx cap open android
    ;;
  *)
    echo "Choix invalide"
    exit 1
    ;;
esac

echo ""
echo "✓ IDE ouvert. Suis les instructions dans MOBILE_DEPLOY.md"
