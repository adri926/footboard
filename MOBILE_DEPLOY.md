# Footboard — Déploiement mobile (App Store + Google Play)

## Prérequis à installer

### 1. Xcode (iOS)
- Mac App Store → chercher "Xcode" → installer (~10 Go)
- Après installation : `! xcode-select --install`

### 2. Java (Android keystore)
- `! brew install openjdk`
- `! echo 'export PATH="/opt/homebrew/opt/openjdk/bin:$PATH"' >> ~/.zshrc`
- Redémarre ton shell

### 3. Comptes à créer
| Plateforme | URL | Coût |
|---|---|---|
| Apple Developer | https://developer.apple.com/programs/ | 99€/an |
| Google Play Console | https://play.google.com/console/signup | 25€ une fois |

---

## Étape 1 — Générer le keystore Android

```bash
! bash scripts/generate-android-keystore.sh
```

Ce script :
- Crée `android/footboard-release.keystore`
- Met à jour `public/.well-known/assetlinks.json` avec le bon SHA256
- **Sauvegarde le fichier .keystore** — sans lui, impossible de mettre à jour l'app

---

## Étape 2 — Ajouter les plateformes Capacitor

```bash
! npx cap add ios
! npx cap add android
! npx cap sync
```

---

## Étape 3 — iOS (App Store)

```bash
! npx cap open ios
```

Dans Xcode :
1. Sélectionne le projet **App** dans le navigator
2. **Signing & Capabilities** → connecte ton compte Apple Developer
3. **Bundle Identifier** : `fr.footboard.app`
4. **Product → Archive** pour créer le build
5. **Distribute App → App Store Connect**

Dans App Store Connect (appstoreconnect.apple.com) :
- Crée une nouvelle app "Footboard"
- Ajoute les screenshots (iPhone 6.7", iPad)
- Catégorie : Sports
- Soumet pour review (~1-3 jours)

---

## Étape 4 — Android (Google Play)

```bash
! npx cap open android
```

Dans Android Studio :
1. **Build → Generate Signed Bundle/APK**
2. Sélectionne **Android App Bundle (.aab)**
3. Keystore : `android/footboard-release.keystore`
4. Alias : `footboard`
5. Build en **Release**

Dans Google Play Console (play.google.com/console) :
- Crée une nouvelle app "Footboard"
- Production → Créer une nouvelle version
- Upload le fichier `.aab` généré
- Catégorie : Sports
- Soumet pour review (~3-7 jours)

---

## Étape 5 — Déployer la mise à jour assetlinks.json

Après avoir généré le keystore, déploie :

```bash
! vercel --prod
```

Ça met en ligne le fichier `/.well-known/assetlinks.json` qui permet à Android de vérifier que l'app est bien liée au domaine.

---

## Mise à jour de l'app après changements

Étant donné que l'app pointe vers `https://footboard-chi.vercel.app`, chaque `vercel --prod` met à jour l'app automatiquement sur toutes les plateformes — sans nouvelle soumission aux stores.

Une nouvelle soumission aux stores est nécessaire uniquement si tu modifies la configuration native (icônes, permissions, splash screen).

---

## Icônes et splash screen

Les icônes sont générées automatiquement depuis `public/icon-512.png`.

Pour générer toutes les tailles iOS/Android :
```bash
! npx capacitor-assets generate
```
