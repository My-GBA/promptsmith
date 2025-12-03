# 🧠 PromptSmith

Générateur de prompts optimisés pour IA de code (Claude, Cursor, GPT) avec authentification 2FA.

## 🚀 Déploiement Vercel - Guide complet

### ✨ Fonctionnalités
- 🎯 Génération de prompts guidée
- 💡 Générateur d'idées AI  
- 📜 Historique et favoris
- 🌐 Multilingue (FR/EN)
- 🔐 Auth 2FA (Google Authenticator)
- 📢 Système de publicités

## 📋 GUIDE DE DÉPLOIEMENT ÉTAPE PAR ÉTAPE

### 1️⃣ Préparer le projet

```bash
# Vérifier que tout compile
npm run build

# Si pas encore de Git
git init
git add .
git commit -m "Ready for deployment"
```

### 2️⃣ Push sur GitHub

1. Va sur [github.com](https://github.com) et crée un nouveau repository "promptsmith"
2. Dans ton terminal :

```bash
git remote add origin https://github.com/TON-USERNAME/promptsmith.git
git branch -M main
git push -u origin main
```

### 3️⃣ Déployer sur Vercel

1. **Va sur** [vercel.com](https://vercel.com)
2. **Connecte-toi** avec ton compte GitHub
3. **Clique** "Add New..." → "Project"
4. **Import** ton repository "promptsmith"
5. **Laisse** tous les paramètres par défaut (Vercel détecte Next.js automatiquement)
6. **Clique** "Deploy"
7. **Attends** 2-3 minutes ⏳
8. **C'est en ligne!** 🎉

### 4️⃣ Ton site est déployé!

Vercel te donne une URL automatique : `promptsmith-xxx.vercel.app`

**Chaque fois que tu push sur GitHub, Vercel redéploie automatiquement!**

## 🔧 Configuration locale

```bash
npm install
npm run dev
# http://localhost:3000
```

## 🔐 Configuration Admin

1. Settings → "administrateur" (en bas)
2. Configure mot de passe + scan QR code
3. Accède à la gestion des publicités

## 🛠️ Stack technique

- Next.js 14.2.33
- React 18.2 + TypeScript
- Tailwind CSS 3.4
- Zustand (state)
- TOTP/Google Authenticator

---

Fait avec ❤️
