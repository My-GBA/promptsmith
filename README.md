<div align="center">

# 🧠 PromptSmith

### *Générateur de prompts intelligent pour IA de code*

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)](LICENSE)

**PromptSmith** est une application web moderne qui t'aide à générer des prompts de haute qualité pour les IA de code comme Claude, Cursor, et ChatGPT.

[Démo Live](#) • [Installation](#-installation) • [Documentation](#-fonctionnalités)

</div>

---

## 📖 Table des matières

- [✨ Fonctionnalités](#-fonctionnalités)
- [🎥 Aperçu](#-aperçu)
- [🚀 Installation](#-installation)
- [🔧 Configuration](#-configuration)
- [📱 Utilisation](#-utilisation)
- [🛠️ Technologies](#️-technologies)
- [🌐 Déploiement](#-déploiement)
- [📂 Structure du projet](#-structure-du-projet)
- [🔐 Sécurité](#-sécurité)
- [📄 Licence](#-licence)

---

## ✨ Fonctionnalités

### 🎯 **Génération de prompts guidée**
- Assistant intelligent en 5 étapes
- Templates personnalisables
- Génération automatique de prompts optimisés
- Export en Markdown, JSON ou texte brut

### 💡 **Générateur d'idées AI**
- Génère des idées de projets créatives
- Basé sur tes préférences et compétences
- Intégration OpenAI pour des suggestions intelligentes

### 📜 **Historique et Favoris**
- Sauvegarde automatique de tous tes prompts
- Système de favoris pour retrouver rapidement
- Recherche et filtres avancés

### 🌐 **Multilingue**
- Interface en **Français** et **Anglais**
- Changement de langue en temps réel
- Traductions complètes

### 📱 **Design moderne**
- Interface 100% responsive (mobile, tablette, desktop)
- Animations fluides avec Framer Motion
- Thème sombre élégant
- Glassmorphism et effets néon

---

## 🎥 Aperçu

```
┌─────────────────────────────────────────────────────┐
│  🧠 PromptSmith                        FR/EN  ⚙️   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ✨ Générateur de prompts pour IA de code          │
│                                                     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐            │
│  │ Étape 1 │  │ Étape 2 │  │ Étape 3 │  ...       │
│  │  Type   │→ │ Contexte│→ │ Objectif│            │
│  └─────────┘  └─────────┘  └─────────┘            │
│                                                     │
│  💡 Générer une idée de projet                      │
│  �� Voir l'historique                               │
│  ⭐ Mes favoris                                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Installation

### Prérequis

- **Node.js** 18.0 ou supérieur
- **npm** ou **yarn**
- Un compte GitHub (pour le déploiement)

### Étape 1 : Cloner le projet

```bash
git clone https://github.com/VOTRE-USERNAME/promptsmith.git
cd promptsmith
```

### Étape 2 : Installer les dépendances

```bash
npm install
```

### Étape 3 : Lancer en développement

```bash
npm run dev
```

### Étape 4 : Ouvrir dans le navigateur

Ouvre **http://localhost:3000** dans ton navigateur préféré.

---

## 🔧 Configuration

### Variables d'environnement (optionnel)

Crée un fichier `.env.local` à la racine du projet :

```env
# Clé API OpenAI (pour le générateur d'idées)
OPENAI_API_KEY=sk-votre-clé-ici
```

> **Note :** La clé OpenAI n'est nécessaire que pour le générateur d'idées. Le reste de l'application fonctionne sans.

---

## 📱 Utilisation

### Générer un prompt

1. **Page d'accueil** → Clique sur "Commencer"
2. **Choisis le type** de projet (API, Frontend, Backend...)
3. **Décris le contexte** de ton projet
4. **Définis l'objectif** précis
5. **Génère** le prompt optimisé
6. **Copie** ou **exporte** le résultat

---

## 🛠️ Technologies

### Frontend

| Technologie | Version | Description |
|-------------|---------|-------------|
| **Next.js** | 14.2.33 | Framework React avec App Router |
| **React** | 18.2 | Bibliothèque UI |
| **TypeScript** | 5.0+ | Typage statique |
| **Tailwind CSS** | 3.4 | Framework CSS utilitaire |
| **Framer Motion** | 10.12 | Animations fluides |

### State & Storage

| Technologie | Description |
|-------------|-------------|
| **Zustand** | Gestion d'état globale |
| **localStorage** | Persistance des données |

### API

| Service | Utilisation |
|---------|-------------|
| **OpenAI API** | Génération d'idées intelligentes |

---

## 🌐 Déploiement

### Déploiement sur Vercel (Recommandé)

Vercel est la plateforme idéale pour Next.js (créée par les mêmes développeurs).

#### Étape 1 : Push sur GitHub

```bash
# Initialise Git (si pas déjà fait)
git init
git add .
git commit -m "Initial commit"

# Crée un repo sur github.com puis :
git remote add origin https://github.com/TON-USERNAME/promptsmith.git
git branch -M main
git push -u origin main
```

#### Étape 2 : Déployer sur Vercel

1. Va sur **[vercel.com](https://vercel.com)**
2. **Connecte-toi** avec GitHub
3. Clique **"New Project"**
4. **Importe** ton repository `promptsmith`
5. Clique **"Deploy"** (aucune configuration nécessaire!)
6. Attends 2-3 minutes ⏳

#### Étape 3 : C'est en ligne! 🎉

Ton site est accessible sur : **`https://promptsmith-xxx.vercel.app`**

> **Bonus :** Chaque fois que tu push sur GitHub, Vercel redéploie automatiquement!

### Ajouter un domaine personnalisé (optionnel)

1. Dans Vercel, va dans **Settings** → **Domains**
2. Ajoute ton domaine (ex: `monsite.com`)
3. Configure les DNS selon les instructions
4. Ton site sera accessible sur ton domaine!

---

## 📂 Structure du projet

```
promptsmith/
│
├── 📁 app/                      # Pages et routes Next.js
│   ├── page.tsx                 # Page d'accueil
│   ├── layout.tsx               # Layout principal
│   ├── settings/                # Page paramètres
│   ├── history/                 # Page historique
│   └── generate/                # API génération prompts
│
├── 📁 components/               # Composants React réutilisables
│   ├── ConversationFull.tsx     # Assistant de génération
│   ├── Settings.tsx             # Paramètres utilisateur
│   ├── IdeaGenerator.tsx        # Générateur d'idées
│   └── ...
│
├── 📁 lib/                      # Logique et utilitaires
│   ├── store.tsx                # State global (Zustand)
│   ├── translations.ts          # Traductions FR/EN
│   └── types/                   # Types TypeScript
│
├── 📁 styles/                   # Styles globaux
│   └── globals.css              # CSS Tailwind + custom
│
├── 📁 public/                   # Assets statiques
│
├── 📄 package.json              # Dépendances npm
├── 📄 tsconfig.json             # Config TypeScript
├── 📄 tailwind.config.cjs       # Config Tailwind
├── 📄 vercel.json               # Config Vercel
└── 📄 README.md                 # Ce fichier
```

---

## 🔐 Sécurité

### Stockage des données

- **localStorage** : Stockage côté client uniquement
- **Aucune base de données externe** : Toutes les données restent sur ton navigateur
- **Pas de tracking** : Respect de la vie privée

### Bonnes pratiques

- ✅ Utilise des mots de passe forts
- ✅ Ne partage jamais tes clés API
- ✅ Garde tes données sensibles en local

---

## 📄 Licence

**Projet privé - Tous droits réservés**

Ce projet est à usage personnel uniquement.

---

<div align="center">

### 💬 Questions ou problèmes ?

Si tu rencontres un bug ou as une question, n'hésite pas à ouvrir une **Issue** sur GitHub.

---

**Créé avec ❤️ pour faciliter la génération de prompts IA**

*PromptSmith v1.0*

</div>
