#!/bin/bash
# Génère le keystore Android et met à jour assetlinks.json automatiquement
set -e

KEYSTORE_PATH="android/footboard-release.keystore"
ALIAS="footboard"
ASSETLINKS="public/.well-known/assetlinks.json"

echo "→ Génération du keystore Android..."
keytool -genkey -v \
  -keystore "$KEYSTORE_PATH" \
  -alias "$ALIAS" \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -dname "CN=Footboard, OU=Mobile, O=Footboard, L=Paris, S=IDF, C=FR"

echo ""
echo "→ Extraction du SHA-256..."
SHA256=$(keytool -list -v \
  -keystore "$KEYSTORE_PATH" \
  -alias "$ALIAS" \
  2>/dev/null | grep "SHA256:" | awk '{print $2}')

echo "  SHA256 = $SHA256"

echo "→ Mise à jour de $ASSETLINKS..."
# Replace placeholder with actual SHA256
sed -i '' "s/REMPLACER_PAR_LE_SHA256_DU_KEYSTORE/$SHA256/" "$ASSETLINKS"

echo ""
echo "✓ Keystore généré : $KEYSTORE_PATH"
echo "✓ assetlinks.json mis à jour"
echo ""
echo "⚠️  IMPORTANT : sauvegarde le fichier $KEYSTORE_PATH et son mot de passe."
echo "   Sans lui, tu ne pourras jamais mettre à jour l'app sur le Google Play Store."
echo ""
echo "→ Prochaine étape : npx cap add android && npx cap sync"
